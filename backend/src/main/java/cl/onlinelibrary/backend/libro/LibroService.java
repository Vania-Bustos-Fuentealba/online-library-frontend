package cl.onlinelibrary.backend.libro;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LibroService {

    private final LibroRepository repositorio;

    public LibroService(LibroRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Libro> listar(String categoria) {
        if (categoria == null || categoria.isBlank()) {
            return repositorio.findAll();
        }
        return repositorio.findByCategoria(categoria);
    }

    public Libro obtener(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No existe un libro con id " + id));
    }

    public Libro crear(Libro libro) {
        if (repositorio.existsByCodigo(libro.getCodigo())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe un libro con el código " + libro.getCodigo());
        }
        libro.setId(null);
        return repositorio.save(libro);
    }

    public Libro actualizar(Long id, Libro datos) {
        Libro existente = obtener(id);

        boolean cambioCodigo = !existente.getCodigo().equals(datos.getCodigo());
        if (cambioCodigo && repositorio.existsByCodigo(datos.getCodigo())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe un libro con el código " + datos.getCodigo());
        }

        existente.setCodigo(datos.getCodigo());
        existente.setNombre(datos.getNombre());
        existente.setAutor(datos.getAutor());
        existente.setDescripcion(datos.getDescripcion());
        existente.setCategoria(datos.getCategoria());
        existente.setPrecio(datos.getPrecio());
        existente.setStock(datos.getStock());
        existente.setStockCritico(datos.getStockCritico());
        existente.setImagen(datos.getImagen());

        return repositorio.save(existente);
    }

    public void eliminar(Long id) {
        repositorio.delete(obtener(id));
    }
}