package cl.onlinelibrary.backend.pedido;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false, length = 100)
    private String cliente;

    @Column(nullable = false, length = 100)
    private String correo;

    @Column(nullable = false, length = 300)
    private String direccion;

    @Column(nullable = false, length = 100)
    private String comuna;

    @Column(nullable = false, length = 20)
    private String metodoPago;

    @Column(length = 20)
    private String cupon;

    @Column(nullable = false)
    private int subtotal;

    @Column(nullable = false)
    private int descuento;

    @Column(nullable = false)
    private int envio;

    @Column(nullable = false)
    private int total;

    // Un pedido tiene muchos ítems; al guardar el pedido se guardan también sus ítems
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> items = new ArrayList<>();

    public void agregarItem(PedidoItem item) {
        items.add(item);
        item.setPedido(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public String getCupon() { return cupon; }
    public void setCupon(String cupon) { this.cupon = cupon; }

    public int getSubtotal() { return subtotal; }
    public void setSubtotal(int subtotal) { this.subtotal = subtotal; }

    public int getDescuento() { return descuento; }
    public void setDescuento(int descuento) { this.descuento = descuento; }

    public int getEnvio() { return envio; }
    public void setEnvio(int envio) { this.envio = envio; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public List<PedidoItem> getItems() { return items; }
    public void setItems(List<PedidoItem> items) { this.items = items; }
}