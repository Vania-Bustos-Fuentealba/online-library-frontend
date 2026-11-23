package cl.onlinelibrary.backend.pedido;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.onlinelibrary.backend.libro.Libro;
import cl.onlinelibrary.backend.libro.LibroRepository;

@Service
public class PedidoService {

    public static final int COSTO_ENVIO = 3990;
    public static final int MONTO_ENVIO_GRATIS = 30000;

    // Cupones disponibles y su porcentaje de descuento (mismos que usa el frontend)
    private static final Map<String, Double> CUPONES = Map.of(
            "DUOC10", 0.10,
            "LIBROS5", 0.05);

    private final PedidoRepository pedidoRepository;
    private final LibroRepository libroRepository;

    public PedidoService(PedidoRepository pedidoRepository, LibroRepository libroRepository) {
        this.pedidoRepository = pedidoRepository;
        this.libroRepository = libroRepository;
    }

    // @Transactional: si algo falla, se deshacen todos los cambios (incluido el stock)
    @Transactional
    public PedidoResponse crear(PedidoRequest datos) {
        Pedido pedido = new Pedido();
        pedido.setFecha(LocalDateTime.now());
        pedido.setCliente(datos.cliente().trim());
        pedido.setCorreo(datos.correo().trim().toLowerCase());
        pedido.setDireccion(datos.direccion().trim());
        pedido.setComuna(datos.comuna().trim());
        pedido.setMetodoPago(datos.metodoPago());

        Set<Long> yaAgregados = new HashSet<>();
        int subtotal = 0;

        for (PedidoRequest.ItemSolicitado solicitado : datos.items()) {
            if (!yaAgregados.add(solicitado.libroId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El libro con id " + solicitado.libroId() + " está repetido en el pedido");
            }

            // El precio sale SIEMPRE de la base de datos, nunca de lo que envía el cliente
            Libro libro = libroRepository.findById(solicitado.libroId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "No existe un libro con id " + solicitado.libroId()));

            int cantidad = solicitado.cantidad();

            if (libro.getStock() < cantidad) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Stock insuficiente para \"" + libro.getNombre() + "\": quedan "
                                + libro.getStock() + " unidad(es)");
            }

            libro.setStock(libro.getStock() - cantidad);

            PedidoItem item = new PedidoItem();
            item.setLibro(libro);
            item.setNombreLibro(libro.getNombre());
            item.setPrecioUnitario(libro.getPrecio());
            item.setCantidad(cantidad);
            item.setSubtotal(libro.getPrecio() * cantidad);
            pedido.agregarItem(item);

            subtotal += item.getSubtotal();
        }

        String cupon = normalizarCupon(datos.cupon());
        int descuento = calcularDescuento(subtotal, cupon);
        int envio = calcularEnvio(subtotal - descuento);

        pedido.setCupon(cupon);
        pedido.setSubtotal(subtotal);
        pedido.setDescuento(descuento);
        pedido.setEnvio(envio);
        pedido.setTotal(subtotal - descuento + envio);

        return aRespuesta(pedidoRepository.save(pedido));
    }

    @Transactional(readOnly = true)
    public PedidoResponse obtener(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No existe un pedido con id " + id));
        return aRespuesta(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar() {
        return pedidoRepository.findAllByOrderByFechaDesc().stream()
                .map(this::aRespuesta)
                .toList();
    }

    // ---------- Reglas de negocio ----------

    private String normalizarCupon(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }

        String codigo = texto.trim().toUpperCase();
        if (!CUPONES.containsKey(codigo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El cupón " + codigo + " no es válido");
        }
        return codigo;
    }

    private int calcularDescuento(int subtotal, String cupon) {
        if (cupon == null) {
            return 0;
        }
        return (int) Math.round(subtotal * CUPONES.get(cupon));
    }

    // Despacho gratis si el monto (ya con descuento) llega a $30.000
    private int calcularEnvio(int montoConDescuento) {
        if (montoConDescuento == 0 || montoConDescuento >= MONTO_ENVIO_GRATIS) {
            return 0;
        }
        return COSTO_ENVIO;
    }

    private PedidoResponse aRespuesta(Pedido pedido) {
        List<PedidoResponse.ItemVendido> items = pedido.getItems().stream()
                .map(item -> new PedidoResponse.ItemVendido(
                        item.getLibro().getId(),
                        item.getNombreLibro(),
                        item.getPrecioUnitario(),
                        item.getCantidad(),
                        item.getSubtotal()))
                .toList();

        return new PedidoResponse(
                pedido.getId(),
                pedido.getFecha(),
                pedido.getCliente(),
                pedido.getCorreo(),
                pedido.getDireccion(),
                pedido.getComuna(),
                pedido.getMetodoPago(),
                pedido.getCupon(),
                pedido.getSubtotal(),
                pedido.getDescuento(),
                pedido.getEnvio(),
                pedido.getTotal(),
                items);
    }
}