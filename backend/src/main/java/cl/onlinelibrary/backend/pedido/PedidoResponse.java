package cl.onlinelibrary.backend.pedido;

import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        LocalDateTime fecha,
        String cliente,
        String correo,
        String direccion,
        String comuna,
        String metodoPago,
        String cupon,
        int subtotal,
        int descuento,
        int envio,
        int total,
        List<ItemVendido> items) {

    public record ItemVendido(
            Long libroId,
            String nombre,
            int precioUnitario,
            int cantidad,
            int subtotal) {
    }
}