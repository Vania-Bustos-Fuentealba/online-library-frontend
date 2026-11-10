function Nosotros() {
  return (
    <>
      {/* PRESENTACIÓN */}
      <section className="user-section">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="user-section-title">Nosotros</h1>
            <p className="user-section-description">
              Conoce Online Library y nuestra propuesta para disfrutar
              de la lectura de manera simple y accesible.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <article className="user-info-card h-100">
                <div className="user-info-card-body">
                  <h2>¿Quiénes somos?</h2>
                  <p>
                    Online Library es una biblioteca online creada
                    para facilitar el acceso a libros y contenidos
                    relacionados con la lectura.
                  </p>
                  <p>
                    Nuestra plataforma busca entregar una experiencia
                    sencilla para que los usuarios puedan conocer,
                    buscar y descubrir diferentes libros.
                  </p>
                </div>
              </article>
            </div>

            <div className="col-12 col-md-6">
              <article className="user-info-card h-100">
                <div className="user-info-card-body">
                  <h2>Nuestra misión</h2>
                  <p>
                    Acercar la lectura a las personas mediante una
                    plataforma digital fácil de utilizar, donde
                    puedan descubrir nuevos contenidos y acceder
                    a información sobre diferentes libros.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* VISIÓN */}
      <section className="user-section">
        <div className="container">
          <div className="user-info-card">
            <div className="user-info-card-body text-center">
              <h2>Nuestra visión</h2>
              <p>
                Buscamos convertir Online Library en un espacio digital
                que fomente el interés por la lectura y permita a los
                usuarios encontrar contenido de forma cómoda,
                ordenada y accesible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ OFRECEMOS */}
      <section className="user-section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="user-section-title">¿Qué ofrecemos?</h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <article className="user-feature-card h-100">
                <h3>Catálogo de libros</h3>
                <p>
                  Explora diferentes libros disponibles dentro
                  de nuestra plataforma.
                </p>
              </article>
            </div>

            <div className="col-12 col-md-4">
              <article className="user-feature-card h-100">
                <h3>Contenido</h3>
                <p>
                  Encuentra información y artículos relacionados
                  con libros y lectura en nuestro blog.
                </p>
              </article>
            </div>

            <div className="col-12 col-md-4">
              <article className="user-feature-card h-100">
                <h3>Experiencia simple</h3>
                <p>
                  Una interfaz pensada para que navegar por la
                  plataforma sea fácil y agradable.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Nosotros