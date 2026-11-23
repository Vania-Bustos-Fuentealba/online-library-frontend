package cl.onlinelibrary.backend.libro;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/libros")
@Tag(name = "Libros", description = "Catálogo de libros de la tienda")
public class LibroController {

    private final LibroService servicio;

    public LibroController(LibroService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Lista los libros; opcionalmente filtra por categoría")
    public List<Libro> listar(@RequestParam(required = false) String categoria) {
        return servicio.listar(categoria);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtiene un libro por su id")
    public Libro obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @PostMapping
    @Operation(summary = "Crea un libro nuevo")
    public ResponseEntity<Libro> crear(@Valid @RequestBody Libro libro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(libro));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualiza los datos de un libro")
    public Libro actualizar(@PathVariable Long id, @Valid @RequestBody Libro libro) {
        return servicio.actualizar(id, libro);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina un libro")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}