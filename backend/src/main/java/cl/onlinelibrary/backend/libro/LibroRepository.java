package cl.onlinelibrary.backend.libro;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LibroRepository extends JpaRepository<Libro, Long> {

    List<Libro> findByCategoria(String categoria);

    boolean existsByCodigo(String codigo);
}