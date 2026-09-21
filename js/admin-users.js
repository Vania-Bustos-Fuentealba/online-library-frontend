const users = [
    {
        id: 1,
        run: "19011022K",
        name: "Juan",
        lastName: "Pérez",
        email: "juan@gmail.com",
        birthDate: "1995-05-10",
        type: "Cliente",
        region: "Metropolitana",
        commune: "Ñuñoa",
        address: "Av. Irarrázaval 1234"
    },
    {
        id: 2,
        run: "204567891",
        name: "Camila",
        lastName: "Soto",
        email: "camila@duoc.cl",
        birthDate: "2000-11-22",
        type: "Vendedor",
        region: "Metropolitana",
        commune: "Providencia",
        address: "Av. Providencia 2450"
    }
];

const regions = {
    Metropolitana: [
        "Santiago",
        "Ñuñoa",
        "Providencia",
        "Las Condes",
        "La Florida",
        "Maipú"
    ],
    Valparaíso: [
        "Valparaíso",
        "Viña del Mar",
        "Quilpué",
        "Villa Alemana"
    ],
    Biobío: [
        "Concepción",
        "Talcahuano",
        "Chiguayante",
        "San Pedro de la Paz"
    ]
};

const usersTableBody = document.getElementById("usersTableBody");

if (usersTableBody) {
    users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.run}</td>
            <td>${user.name} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.type}</td>
            <td>${user.region}</td>
            <td>
                <div class="d-flex gap-2 flex-wrap">
                    <a href="user-detail.html?id=${user.id}" class="btn btn-sm btn-outline-secondary">
                        Ver
                    </a>

                    <a href="user-form.html?id=${user.id}" class="btn btn-sm btn-outline-primary">
                        Editar
                    </a>
                </div>
            </td>
        `;

        usersTableBody.appendChild(row);
    });
}

const userRun = document.getElementById("userRun");

if (userRun) {
    const params = new URLSearchParams(window.location.search);
    const userId = Number(params.get("id"));

    const user = users.find(item => item.id === userId);

    if (user) {
        document.getElementById("userRun").textContent = user.run;
        document.getElementById("userName").textContent = user.name;
        document.getElementById("userLastName").textContent = user.lastName;
        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("userBirthDate").textContent = user.birthDate;
        document.getElementById("userType").textContent = user.type;
        document.getElementById("userRegion").textContent = user.region;
        document.getElementById("userCommune").textContent = user.commune;
        document.getElementById("userAddress").textContent = user.address;

        document.getElementById("editUserButton").href =
            `user-form.html?id=${user.id}`;
    }
}

const userForm = document.getElementById("userForm");

if (userForm) {
    const params = new URLSearchParams(window.location.search);
    const userId = Number(params.get("id"));

    const runInput = document.getElementById("userRunInput");
    const nameInput = document.getElementById("userNameInput");
    const lastNameInput = document.getElementById("userLastNameInput");
    const emailInput = document.getElementById("userEmailInput");
    const birthDateInput = document.getElementById("userBirthDateInput");
    const typeInput = document.getElementById("userTypeInput");
    const regionInput = document.getElementById("userRegionInput");
    const communeInput = document.getElementById("userCommuneInput");
    const addressInput = document.getElementById("userAddressInput");

    Object.keys(regions).forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionInput.appendChild(option);
    });

    function loadCommunes(region, selectedCommune = "") {
        communeInput.innerHTML =
            '<option value="">Seleccione una comuna</option>';

        if (!regions[region]) {
            return;
        }

        regions[region].forEach(commune => {
            const option = document.createElement("option");
            option.value = commune;
            option.textContent = commune;

            if (commune === selectedCommune) {
                option.selected = true;
            }

            communeInput.appendChild(option);
        });
    }

    regionInput.addEventListener("change", () => {
        loadCommunes(regionInput.value);
    });

    const userToEdit = users.find(user => user.id === userId);

    if (userToEdit) {
        document.getElementById("userFormTitle").textContent =
            "Editar usuario";

        document.getElementById("userFormSubtitle").textContent =
            "Modifica la información del usuario seleccionado.";

        document.getElementById("saveUserButton").textContent =
            "Guardar cambios";

        runInput.value = userToEdit.run;
        nameInput.value = userToEdit.name;
        lastNameInput.value = userToEdit.lastName;
        emailInput.value = userToEdit.email;
        birthDateInput.value = userToEdit.birthDate;
        typeInput.value = userToEdit.type;
        regionInput.value = userToEdit.region;
        addressInput.value = userToEdit.address;

        loadCommunes(userToEdit.region, userToEdit.commune);
    }

    userForm.addEventListener("submit", event => {
        event.preventDefault();

        clearUserErrors();

        let isValid = true;

        const run = runInput.value.trim().toUpperCase();
        const name = nameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const type = typeInput.value;
        const region = regionInput.value;
        const commune = communeInput.value;
        const address = addressInput.value.trim();

        if (!isValidRun(run)) {
            showUserError(
                runInput,
                "userRunError",
                "Ingrese un RUN chileno válido sin puntos ni guion."
            );
            isValid = false;
        }

        if (name === "" || name.length > 50) {
            showUserError(
                nameInput,
                "userNameError",
                "El nombre es obligatorio y no puede superar los 50 caracteres."
            );
            isValid = false;
        }

        if (lastName === "" || lastName.length > 100) {
            showUserError(
                lastNameInput,
                "userLastNameError",
                "El apellido es obligatorio y no puede superar los 100 caracteres."
            );
            isValid = false;
        }

        if (!isAllowedEmail(email)) {
            showUserError(
                emailInput,
                "userEmailError",
                "Utilice un correo @duoc.cl, @profesor.duoc.cl o @gmail.com."
            );
            isValid = false;
        }

        if (type === "") {
            showUserError(
                typeInput,
                "userTypeError",
                "Debe seleccionar un tipo de usuario."
            );
            isValid = false;
        }

        if (region === "") {
            showUserError(
                regionInput,
                "userRegionError",
                "Debe seleccionar una región."
            );
            isValid = false;
        }

        if (commune === "") {
            showUserError(
                communeInput,
                "userCommuneError",
                "Debe seleccionar una comuna."
            );
            isValid = false;
        }

        if (address === "" || address.length > 300) {
            showUserError(
                addressInput,
                "userAddressError",
                "La dirección es obligatoria y no puede superar los 300 caracteres."
            );
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        alert(
            userToEdit
                ? "Usuario actualizado correctamente."
                : "Usuario creado correctamente."
        );

        window.location.href = "users.html";
    });
}

function isAllowedEmail(email) {
    const allowedDomains = [
        "@duoc.cl",
        "@profesor.duoc.cl",
        "@gmail.com"
    ];

    return (
        email.length <= 100 &&
        allowedDomains.some(domain => email.endsWith(domain))
    );
}

function isValidRun(run) {
    const cleanRun = run.replace(/\./g, "").replace(/-/g, "");

    if (!/^[0-9]{7,8}[0-9K]$/.test(cleanRun)) {
        return false;
    }

    const body = cleanRun.slice(0, -1);
    const verifier = cleanRun.slice(-1);

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += Number(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const result = 11 - (sum % 11);

    let expectedVerifier;

    if (result === 11) {
        expectedVerifier = "0";
    } else if (result === 10) {
        expectedVerifier = "K";
    } else {
        expectedVerifier = String(result);
    }

    return verifier === expectedVerifier;
}

function showUserError(input, errorId, message) {
    input.classList.add("is-invalid");
    document.getElementById(errorId).textContent = message;
}

function clearUserErrors() {
    const inputs = document.querySelectorAll(
        "#userForm .form-control, #userForm .form-select"
    );

    inputs.forEach(input => {
        input.classList.remove("is-invalid");
    });

    const errors = document.querySelectorAll(
        "#userForm .invalid-feedback"
    );

    errors.forEach(error => {
        error.textContent = "";
    });
}