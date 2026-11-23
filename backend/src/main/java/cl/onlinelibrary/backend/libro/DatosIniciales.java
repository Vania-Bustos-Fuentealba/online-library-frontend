package cl.onlinelibrary.backend.libro;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatosIniciales implements CommandLineRunner {

    private final LibroRepository repositorio;

    public DatosIniciales(LibroRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public void run(String... args) {
        if (repositorio.count() > 0) {
            return;
        }

        repositorio.saveAll(List.of(
                crear("LIB001", "Alas de sangre", "Rebecca Yarros",
                        "Primer libro de la saga Empíreo: Violet Sorrengail es reclutada para convertirse en jinete de dragón en el brutal Cuadrante de Basgiath.",
                        "Fantasía romántica", 19990, 10, "/img/Alas_de_sangre.webp"),
                crear("LIB002", "Crimen y castigo", "Fiódor Dostoievski",
                        "Clásico de la literatura rusa que sigue a Raskólnikov, un joven atormentado por la culpa tras cometer un asesinato.",
                        "Clásicos", 14990, 8, "/img/crimen_y_castigo.webp"),
                crear("LIB003", "El Buzón de las Impuras", "Francisca Solar",
                        "Novela histórica chilena ambientada en 1863, inspirada en el incendio de la Iglesia de la Compañía en Santiago.",
                        "Ficción histórica", 17990, 6, "/img/El_Buzon_De_Las_Impuras.webp"),
                crear("LIB004", "Mientras Yubooh Duerme", "Paulina Palacios",
                        "Novela romántica chilena, parte de una popular saga surgida originalmente como historia por entregas.",
                        "Romance", 15990, 4, "/img/Mientras_Yubooh_Duerme.webp"),
                crear("LIB005", "Una corte de rosas y espinas", "Sarah J. Maas",
                        "Primer libro de la saga ACOTAR: Feyre es arrastrada a un reino mágico tras matar a un lobo que resulta ser una criatura feérica.",
                        "Fantasía", 18990, 0, "/img/una_corte_de_rosas_y_espinas.webp")
        ));
    }

    private Libro crear(String codigo, String nombre, String autor, String descripcion,
                        String categoria, int precio, int stock, String imagen) {
        Libro libro = new Libro();
        libro.setCodigo(codigo);
        libro.setNombre(nombre);
        libro.setAutor(autor);
        libro.setDescripcion(descripcion);
        libro.setCategoria(categoria);
        libro.setPrecio(precio);
        libro.setStock(stock);
        libro.setStockCritico(5);
        libro.setImagen(imagen);
        return libro;
    }
}