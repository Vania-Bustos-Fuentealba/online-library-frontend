package cl.onlinelibrary.backend.pedido;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedidos", description = "Checkout: creación y consulta de pedidos")
public class PedidoController {

    private final PedidoService servicio;

    public PedidoController(PedidoService servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    @Operation(summary = "Crea un pedido: valida stock, aplica cupón, calcula envío y descuenta stock")
    public ResponseEntity<PedidoResponse> crear(@Valid @RequestBody PedidoRequest pedido) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(pedido));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtiene un pedido por su id")
    public PedidoResponse obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @GetMapping
    @Operation(summary = "Lista todos los pedidos, del más reciente al más antiguo")
    public List<PedidoResponse> listar() {
        return servicio.listar();
    }
}