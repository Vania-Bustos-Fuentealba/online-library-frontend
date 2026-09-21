/* =========================================
   VALIDACIONES USUARIO
   ========================================= */



const regiones = {
    "Arica y Parinacota": [
        "Arica",
        "Camarones",
        "Putre",
        "General Lagos"
    ],

    "Tarapacá": [
        "Iquique",
        "Alto Hospicio",
        "Pozo Almonte",
        "Camiña",
        "Colchane",
        "Huara",
        "Pica"
    ],

    "Antofagasta": [
        "Antofagasta",
        "Mejillones",
        "Sierra Gorda",
        "Taltal",
        "Calama",
        "Ollagüe",
        "San Pedro de Atacama",
        "María Elena"
    ],

    "Atacama": [
        "Copiapó",
        "Caldera",
        "Tierra Amarilla",
        "Chañaral",
        "Diego de Almagro",
        "Vallenar",
        "Alto del Carmen",
        "Freirina",
        "Huasco"
    ],

    "Coquimbo": [
        "La Serena",
        "Coquimbo",
        "Andacollo",
        "La Higuera",
        "Paihuano",
        "Vicuña",
        "Illapel",
        "Canela",
        "Los Vilos",
        "Salamanca",
        "Ovalle",
        "Combarbalá",
        "Monte Patria",
        "Punitaqui",
        "Río Hurtado"
    ],

    "Valparaíso": [
        "Valparaíso",
        "Casablanca",
        "Concón",
        "Juan Fernández",
        "Puchuncaví",
        "Quintero",
        "Viña del Mar",
        "Isla de Pascua",
        "Los Andes",
        "Calle Larga",
        "Rinconada",
        "San Esteban",
        "La Ligua",
        "Cabildo",
        "Papudo",
        "Petorca",
        "Zapallar",
        "Quillota",
        "Calera",
        "Hijuelas",
        "La Cruz",
        "Nogales",
        "San Antonio",
        "Algarrobo",
        "Cartagena",
        "El Quisco",
        "El Tabo",
        "Santo Domingo",
        "San Felipe",
        "Catemu",
        "Llaillay",
        "Panquehue",
        "Putaendo",
        "Santa María"
    ],

    "Metropolitana de Santiago": [
        "Santiago",
        "Cerrillos",
        "Cerro Navia",
        "Conchalí",
        "El Bosque",
        "Estación Central",
        "Huechuraba",
        "Independencia",
        "La Cisterna",
        "La Florida",
        "La Granja",
        "La Pintana",
        "La Reina",
        "Las Condes",
        "Lo Barnechea",
        "Lo Espejo",
        "Lo Prado",
        "Macul",
        "Maipú",
        "Ñuñoa",
        "Pedro Aguirre Cerda",
        "Peñalolén",
        "Providencia",
        "Pudahuel",
        "Quilicura",
        "Quinta Normal",
        "Recoleta",
        "Renca",
        "San Joaquín",
        "San Miguel",
        "San Ramón",
        "Vitacura",
        "Puente Alto",
        "Pirque",
        "San José de Maipo",
        "Colina",
        "Lampa",
        "Tiltil",
        "Buin",
        "Calera de Tango",
        "Paine",
        "San Bernardo",
        "Alhué",
        "Curacaví",
        "María Pinto",
        "Melipilla",
        "San Pedro",
        "El Monte",
        "Isla de Maipo",
        "Padre Hurtado",
        "Peñaflor",
        "Talagante"
    ],

    "O'Higgins": [
        "Rancagua",
        "Codegua",
        "Coinco",
        "Coltauco",
        "Doñihue",
        "Graneros",
        "Las Cabras",
        "Machalí",
        "Malloa",
        "Mostazal",
        "Olivar",
        "Peumo",
        "Pichidegua",
        "Quinta de Tilcoco",
        "Rengo",
        "Requínoa",
        "San Vicente",
        "La Estrella",
        "Litueche",
        "Marchigüe",
        "Navidad",
        "Paredones",
        "Pichilemu",
        "Chépica",
        "Chimbarongo",
        "Lolol",
        "Nancagua",
        "Palmilla",
        "Peralillo",
        "Placilla",
        "Pumanque",
        "San Fernando",
        "Santa Cruz"
    ],

    "Maule": [
        "Talca",
        "Constitución",
        "Curepto",
        "Empedrado",
        "Maule",
        "Pelarco",
        "Pencahue",
        "Río Claro",
        "San Clemente",
        "San Rafael",
        "Cauquenes",
        "Chanco",
        "Pelluhue",
        "Curicó",
        "Hualañé",
        "Licantén",
        "Molina",
        "Rauco",
        "Romeral",
        "Sagrada Familia",
        "Teno",
        "Vichuquén",
        "Linares",
        "Colbún",
        "Longaví",
        "Parral",
        "Retiro",
        "San Javier",
        "Villa Alegre",
        "Yerbas Buenas"
    ],

    "Ñuble": [
        "Chillán",
        "Bulnes",
        "Chillán Viejo",
        "El Carmen",
        "Pemuco",
        "Pinto",
        "Quillón",
        "San Ignacio",
        "Yungay",
        "Cobquecura",
        "Coelemu",
        "Ninhue",
        "Portezuelo",
        "Quirihue",
        "Ránquil",
        "Treguaco",
        "San Carlos",
        "Coihueco",
        "Ñiquén",
        "San Fabián",
        "San Nicolás"
    ],

    "Biobío": [
        "Concepción",
        "Coronel",
        "Chiguayante",
        "Florida",
        "Hualqui",
        "Lota",
        "Penco",
        "San Pedro de la Paz",
        "Santa Juana",
        "Talcahuano",
        "Tomé",
        "Hualpén",
        "Lebu",
        "Arauco",
        "Cañete",
        "Contulmo",
        "Curanilahue",
        "Los Álamos",
        "Tirúa",
        "Los Ángeles",
        "Antuco",
        "Cabrero",
        "Laja",
        "Mulchén",
        "Nacimiento",
        "Negrete",
        "Quilaco",
        "Quilleco",
        "San Rosendo",
        "Santa Bárbara",
        "Tucapel",
        "Yumbel",
        "Alto Biobío"
    ],

    "La Araucanía": [
        "Temuco",
        "Carahue",
        "Cholchol",
        "Cunco",
        "Curarrehue",
        "Freire",
        "Galvarino",
        "Gorbea",
        "Lautaro",
        "Loncoche",
        "Melipeuco",
        "Nueva Imperial",
        "Padre Las Casas",
        "Perquenco",
        "Pitrufquén",
        "Pucón",
        "Saavedra",
        "Teodoro Schmidt",
        "Toltén",
        "Vilcún",
        "Villarrica",
        "Angol",
        "Collipulli",
        "Curacautín",
        "Ercilla",
        "Lonquimay",
        "Los Sauces",
        "Lumaco",
        "Purén",
        "Renaico",
        "Traiguén",
        "Victoria"
    ],

    "Los Ríos": [
        "Valdivia",
        "Corral",
        "Lanco",
        "Los Lagos",
        "Máfil",
        "Mariquina",
        "Paillaco",
        "Panguipulli",
        "La Unión",
        "Futrono",
        "Lago Ranco",
        "Río Bueno"
    ],

    "Los Lagos": [
        "Puerto Montt",
        "Calbuco",
        "Cochamó",
        "Fresia",
        "Frutillar",
        "Los Muermos",
        "Llanquihue",
        "Maullín",
        "Puerto Varas",
        "Castro",
        "Ancud",
        "Chonchi",
        "Curaco de Vélez",
        "Dalcahue",
        "Puqueldón",
        "Queilén",
        "Quellón",
        "Quemchi",
        "Quinchao",
        "Osorno",
        "Puerto Octay",
        "Purranque",
        "Puyehue",
        "Río Negro",
        "San Juan de la Costa",
        "San Pablo",
        "Chaitén",
        "Futaleufú",
        "Hualaihué",
        "Palena"
    ],

    "Aysén": [
        "Coyhaique",
        "Lago Verde",
        "Aysén",
        "Cisnes",
        "Guaitecas",
        "Cochrane",
        "O'Higgins",
        "Tortel",
        "Chile Chico",
        "Río Ibáñez"
    ],

    "Magallanes y de la Antártica Chilena": [
        "Punta Arenas",
        "Laguna Blanca",
        "Río Verde",
        "San Gregorio",
        "Porvenir",
        "Primavera",
        "Timaukel",
        "Puerto Natales",
        "Torres del Paine"
    ]
};


/* =========================================
   ELEMENTOS DEL FORMULARIO
   ========================================= */

const registerForm = document.getElementById("registerForm");

const registerRun = document.getElementById("registerRun");
const registerName = document.getElementById("registerName");
const registerLastName = document.getElementById("registerLastName");
const registerEmail = document.getElementById("registerEmail");
const registerBirthDate = document.getElementById("registerBirthDate");
const registerRegion = document.getElementById("registerRegion");
const registerCommune = document.getElementById("registerCommune");
const registerAddress = document.getElementById("registerAddress");
const registerPassword = document.getElementById("registerPassword");
const registerPasswordConfirm = document.getElementById("registerPasswordConfirm");

/* =========================================
   ELEMENTOS DEL LOGIN
   ========================================= */

const loginForm = document.getElementById("loginForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

/* =========================================
   CARGAR REGIONES
   ========================================= */

if (registerRegion) {

    Object.keys(regiones).forEach(function (region) {

        const option = document.createElement("option");

        option.value = region;
        option.textContent = region;

        registerRegion.appendChild(option);

    });

}


/* =========================================
   CAMBIAR COMUNAS SEGÚN REGIÓN
   ========================================= */

if (registerRegion) {

    registerRegion.addEventListener("change", function () {

        const regionSeleccionada = registerRegion.value;

        registerCommune.innerHTML = "";

        if (regionSeleccionada === "") {

            const option = document.createElement("option");

            option.value = "";
            option.textContent = "Selecciona primero una región";

            registerCommune.appendChild(option);

            registerCommune.disabled = true;

            return;
        }


        const optionInicial = document.createElement("option");

        optionInicial.value = "";
        optionInicial.textContent = "Selecciona una comuna";

        registerCommune.appendChild(optionInicial);


        regiones[regionSeleccionada].forEach(function (comuna) {

            const option = document.createElement("option");

            option.value = comuna;
            option.textContent = comuna;

            registerCommune.appendChild(option);

        });


        registerCommune.disabled = false;

    });

}


/* =========================================
   VALIDAR RUN
   ========================================= */

function validarRun(run) {

    run = run.toUpperCase().replace(/\s/g, "");

    if (!/^\d{7,8}[0-9K]$/.test(run)) {
        return false;
    }

    const cuerpo = run.slice(0, -1);
    const digitoVerificador = run.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {

        suma += parseInt(cuerpo[i]) * multiplicador;

        multiplicador++;

        if (multiplicador > 7) {
            multiplicador = 2;
        }

    }

    const resto = 11 - (suma % 11);

    let resultado;

    if (resto === 11) {
        resultado = "0";
    } else if (resto === 10) {
        resultado = "K";
    } else {
        resultado = resto.toString();
    }

    return resultado === digitoVerificador;

}


/* =========================================
   VALIDAR CORREO
   ========================================= */

function validarEmail(email) {

    const emailLimpio = email.trim().toLowerCase();

    const formatoEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(emailLimpio)) {
        return false;
    }

    return (
        emailLimpio.endsWith("@duoc.cl") ||
        emailLimpio.endsWith("@profesor.duoc.cl") ||
        emailLimpio.endsWith("@gmail.com")
    );

}


/* =========================================
   FUNCIONES DE ESTADO VISUAL
   ========================================= */

function marcarValido(elemento) {

    elemento.classList.remove("is-invalid");
    elemento.classList.add("is-valid");

}


function marcarInvalido(elemento) {

    elemento.classList.remove("is-valid");
    elemento.classList.add("is-invalid");

}


function limpiarEstado(elemento) {

    elemento.classList.remove("is-valid");
    elemento.classList.remove("is-invalid");

}

/* =========================================
   VALIDACIONES DEL LOGIN
   ========================================= */

function validarLoginEmail() {

    const email = loginEmail.value.trim();

    if (
        email === "" ||
        email.length > 100 ||
        !validarEmail(email)
    ) {

        marcarInvalido(loginEmail);

        return false;
    }

    marcarValido(loginEmail);

    return true;
}


function validarLoginPassword() {

    const password = loginPassword.value;

    if (
        password === "" ||
        password.length < 4 ||
        password.length > 10
    ) {

        marcarInvalido(loginPassword);

        return false;
    }

    marcarValido(loginPassword);

    return true;
}
/* =========================================
   VALIDACIONES INDIVIDUALES
   ========================================= */

function validarCampoRun() {

    const run = registerRun.value.trim();

    if (run === "" || !validarRun(run)) {

        marcarInvalido(registerRun);

        return false;
    }

    marcarValido(registerRun);

    return true;

}


function validarCampoNombre() {

    const nombre = registerName.value.trim();

    if (nombre === "") {

        marcarInvalido(registerName);

        return false;
    }

    marcarValido(registerName);

    return true;

}


function validarCampoApellidos() {

    const apellidos = registerLastName.value.trim();

    if (apellidos === "") {

        marcarInvalido(registerLastName);

        return false;
    }

    marcarValido(registerLastName);

    return true;

}


function validarCampoEmail() {

    const email = registerEmail.value.trim();

    if (email === "" || email.length > 100 || !validarEmail(email)) {

        marcarInvalido(registerEmail);

        return false;
    }

    marcarValido(registerEmail);

    return true;

}


function validarCampoFecha() {

    const fecha = registerBirthDate.value;

    /*
     * La fecha de nacimiento es opcional.
     * Si está vacía, se considera válida.
     */

    if (fecha === "") {

        limpiarEstado(registerBirthDate);

        return true;
    }

    marcarValido(registerBirthDate);

    return true;

}


function validarCampoRegion() {

    if (registerRegion.value === "") {

        marcarInvalido(registerRegion);

        return false;
    }

    marcarValido(registerRegion);

    return true;

}


function validarCampoComuna() {

    if (registerCommune.value === "") {

        marcarInvalido(registerCommune);

        return false;
    }

    marcarValido(registerCommune);

    return true;

}


function validarCampoDireccion() {

    const direccion = registerAddress.value.trim();

    if (direccion === "") {

        marcarInvalido(registerAddress);

        return false;
    }

    marcarValido(registerAddress);

    return true;

}


function validarCampoPassword() {

    const password = registerPassword.value;

    if (
        password === "" ||
        password.length < 4 ||
        password.length > 10
    ) {

        marcarInvalido(registerPassword);

        return false;
    }

    marcarValido(registerPassword);

    return true;

}


function validarCampoPasswordConfirm() {

    const password = registerPassword.value;
    const passwordConfirm = registerPasswordConfirm.value;

    if (
        passwordConfirm === "" ||
        password !== passwordConfirm
    ) {

        marcarInvalido(registerPasswordConfirm);

        return false;
    }

    marcarValido(registerPasswordConfirm);

    return true;

}


/* =========================================
   VALIDACIÓN EN TIEMPO REAL
   ========================================= */

if (registerRun) {
    registerRun.addEventListener("input", validarCampoRun);
}

if (registerName) {
    registerName.addEventListener("input", validarCampoNombre);
}

if (registerLastName) {
    registerLastName.addEventListener("input", validarCampoApellidos);
}

if (registerEmail) {
    registerEmail.addEventListener("input", validarCampoEmail);
}

if (registerBirthDate) {
    registerBirthDate.addEventListener("change", validarCampoFecha);
}

if (registerRegion) {
    registerRegion.addEventListener("change", validarCampoRegion);
}

if (registerCommune) {
    registerCommune.addEventListener("change", validarCampoComuna);
}

if (registerAddress) {
    registerAddress.addEventListener("input", validarCampoDireccion);
}

if (registerPassword) {
    registerPassword.addEventListener("input", function () {

        validarCampoPassword();

        if (registerPasswordConfirm.value !== "") {
            validarCampoPasswordConfirm();
        }

    });
}

if (registerPasswordConfirm) {
    registerPasswordConfirm.addEventListener(
        "input",
        validarCampoPasswordConfirm
    );
}

if (loginEmail) {
    loginEmail.addEventListener("input", validarLoginEmail);
}

if (loginPassword) {
    loginPassword.addEventListener("input", validarLoginPassword);
}

/* =========================================
   VALIDACIONES CONTACTO
   ========================================= */

const contactForm = document.getElementById("contactForm");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactMessage = document.getElementById("contactMessage");


if (contactForm) {

    contactName.addEventListener("input", function () {

        const nombre = contactName.value.trim();

        if (nombre.length >= 2 && nombre.length <= 100) {
            marcarValido(contactName);
        } else {
            marcarInvalido(contactName);
        }

    });


    contactEmail.addEventListener("input", function () {

        const email = contactEmail.value.trim();

        if (
            email.length > 0 &&
            email.length <= 100 &&
            validarEmail(email)
        ) {
            marcarValido(contactEmail);
        } else {
            marcarInvalido(contactEmail);
        }

    });


    contactMessage.addEventListener("input", function () {

        const comentario = contactMessage.value.trim();

        if (
            comentario.length >= 10 &&
            comentario.length <= 500
        ) {
            marcarValido(contactMessage);
        } else {
            marcarInvalido(contactMessage);
        }

    });


    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let formularioValido = true;


        // Validar nombre
        const nombre = contactName.value.trim();

        if (nombre.length < 2 || nombre.length > 100) {
            marcarInvalido(contactName);
            formularioValido = false;
        } else {
            marcarValido(contactName);
        }


        // Validar correo
        const email = contactEmail.value.trim();

        if (
            email.length === 0 ||
            email.length > 100 ||
            !validarEmail(email)
        ) {
            marcarInvalido(contactEmail);
            formularioValido = false;
        } else {
            marcarValido(contactEmail);
        }


        // Validar comentario
        const comentario = contactMessage.value.trim();

        if (
            comentario.length < 10 ||
            comentario.length > 500
        ) {
            marcarInvalido(contactMessage);
            formularioValido = false;
        } else {
            marcarValido(contactMessage);
        }


        if (formularioValido) {

            alert("Mensaje enviado correctamente.");

            contactForm.reset();

            limpiarEstado(contactName);
            limpiarEstado(contactEmail);
            limpiarEstado(contactMessage);
        }

    });

}

/* =========================================
   ENVÍO DEL FORMULARIO DE REGISTRO
   ========================================= */

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const runValido = validarCampoRun();
        const nombreValido = validarCampoNombre();
        const apellidosValidos = validarCampoApellidos();
        const emailValido = validarCampoEmail();
        const fechaValida = validarCampoFecha();
        const regionValida = validarCampoRegion();
        const comunaValida = validarCampoComuna();
        const direccionValida = validarCampoDireccion();
        const passwordValida = validarCampoPassword();
        const passwordConfirmValida = validarCampoPasswordConfirm();


        const formularioValido =
            runValido &&
            nombreValido &&
            apellidosValidos &&
            emailValido &&
            fechaValida &&
            regionValida &&
            comunaValida &&
            direccionValida &&
            passwordValida &&
            passwordConfirmValida;


        if (!formularioValido) {

            return;
        }


        alert("Registro validado correctamente.");

    });

}


/* =========================================
   ENVÍO DEL LOGIN
   ========================================= */

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const emailValido = validarLoginEmail();
        const passwordValida = validarLoginPassword();


        const formularioValido =
            emailValido &&
            passwordValida;


        if (!formularioValido) {

            return;
        }


        alert("Inicio de sesión validado correctamente.");

    });

}