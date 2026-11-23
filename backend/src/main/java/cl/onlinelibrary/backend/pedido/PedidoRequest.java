package cl.onlinelibrary.backend.pedido;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PedidoRequest(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
        String cliente,

        @NotBlank(message = "El correo es obligatorio")
        @Size(max = 100, message = "El correo no puede superar los 100 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9._%+-]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$",
                flags = Pattern.Flag.CASE_INSENSITIVE,
                message = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com")
        String correo,

        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 300, message = "La dirección no puede superar los 300 caracteres")
        String direccion,

        @NotBlank(message = "La comuna es obligatoria")
        @Size(max = 100, message = "La comuna no puede superar los 100 caracteres")
        String comuna,

        @NotBlank(message = "El método de pago es obligatorio")
        @Pattern(regexp = "webpay|transferencia",
                message = "El método de pago debe ser webpay o transferencia")
        String metodoPago,

        @Size(max = 20, message = "El cupón no puede superar los 20 caracteres")
        String cupon,

        @NotEmpty(message = "El pedido debe tener al menos un libro")
        @Valid
        List<ItemSolicitado> items) {

    public record ItemSolicitado(

            @NotNull(message = "El id del libro es obligatorio")
            Long libroId,

            @NotNull(message = "La cantidad es obligatoria")
            @Min(value = 1, message = "La cantidad debe ser al menos 1")
            Integer cantidad) {
    }
}