/* =========================================
   DETALLE DE BLOG
   ========================================= */

const blogs = {

    1: {
        title: "La importancia de la lectura en la vida diaria",

        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",

        description: [
            "La lectura es una actividad que permite adquirir nuevos conocimientos, descubrir diferentes perspectivas y desarrollar la imaginación. A través de los libros podemos conocer historias, culturas y experiencias diferentes a las nuestras.",

            "Además de ser una forma de entretenimiento, leer puede ayudar a mejorar la comprensión de textos y ampliar el vocabulario. También permite dedicar un momento del día a la concentración y al aprendizaje.",

            "En Online Library buscamos facilitar el acceso a contenidos interesantes para que cada usuario pueda descubrir nuevos libros y encontrar temas que sean de su interés."
        ]
    },

    2: {
        title: "Cómo crear el hábito de leer todos los días",

        image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80",

        description: [
            "Crear un hábito de lectura no requiere comenzar leyendo durante varias horas. Una buena alternativa es dedicar algunos minutos al día y aumentar progresivamente el tiempo según la disponibilidad de cada persona.",

            "Elegir un libro relacionado con nuestros intereses también puede hacer que la lectura sea una experiencia más entretenida. Novelas, cuentos, tecnología, historia o aprendizaje son algunas de las alternativas que podemos explorar.",

            "Lo importante es encontrar un momento cómodo para leer y mantener la constancia. Con el tiempo, esos pequeños momentos pueden convertirse en un hábito que permita descubrir nuevos conocimientos y disfrutar de diferentes historias."
        ]
    }

};


/* =========================================
   OBTENER ID DESDE LA URL
   ========================================= */

const parametros = new URLSearchParams(window.location.search);

const id = parametros.get("id") || "1";

const blog = blogs[id];


/* =========================================
   ELEMENTOS HTML
   ========================================= */

const blogDetailImage =
    document.getElementById("blogDetailImage");

const blogDetailTitle =
    document.getElementById("blogDetailTitle");

const blogDetailDescription =
    document.getElementById("blogDetailDescription");


/* =========================================
   MOSTRAR BLOG
   ========================================= */

if (blog) {

    blogDetailImage.src = blog.image;

    blogDetailImage.alt = blog.title;

    blogDetailTitle.textContent = blog.title;

    blogDetailDescription.innerHTML = "";

    blog.description.forEach(parrafo => {

        const p = document.createElement("p");

        p.textContent = parrafo;

        blogDetailDescription.appendChild(p);

    });

    document.title = `${blog.title} | Online Library`;

}