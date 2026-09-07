const products = [
    {
        id: 1,
        code: "LIB001",
        name: "Neuromancer",
        description: "Novela de ciencia ficción escrita por William Gibson.",
        category: "Ciencia ficción",
        price: 14990,
        stock: 12,
        criticalStock: 5,
        image: "https://placehold.co/300x420?text=Neuromancer"
    },
    {
        id: 2,
        code: "LIB002",
        name: "Dune",
        description: "Novela de ciencia ficción escrita por Frank Herbert.",
        category: "Ciencia ficción",
        price: 17990,
        stock: 6,
        criticalStock: 5,
        image: "https://placehold.co/300x420?text=Dune"
    },
    {
        id: 3,
        code: "LIB003",
        name: "1984",
        description: "Novela distópica escrita por George Orwell.",
        category: "Distopía",
        price: 12990,
        stock: 3,
        criticalStock: 5,
        image: "https://placehold.co/300x420?text=1984"
    }
];

const productsTableBody = document.getElementById("productsTableBody");

if (productsTableBody) {
    products.forEach(product => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toLocaleString("es-CL")}</td>
            <td>${product.stock}</td>
            <td>
                <div class="d-flex gap-2 flex-wrap">
                    <a href="product-detail.html?id=${product.id}" class="btn btn-sm btn-outline-secondary">
                        Ver
                    </a>

                    <a href="product-form.html?id=${product.id}" class="btn btn-sm btn-outline-primary">
                        Editar
                    </a>
                </div>
            </td>
        `;

        productsTableBody.appendChild(row);
    });
}

const productCode = document.getElementById("productCode");

if (productCode) {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));

    const product = products.find(item => item.id === productId);

    if (product) {
        document.getElementById("productCode").textContent = product.code;
        document.getElementById("productName").textContent = product.name;
        document.getElementById("productCategory").textContent = product.category;
        document.getElementById("productPrice").textContent =
            `$${product.price.toLocaleString("es-CL")}`;
        document.getElementById("productStock").textContent = product.stock;
        document.getElementById("productCriticalStock").textContent =
            product.criticalStock;
        document.getElementById("productDescription").textContent =
            product.description;
        document.getElementById("productImage").src = product.image;

        document.getElementById("editProductButton").href =
            `product-form.html?id=${product.id}`;
    }
    const productForm = document.getElementById("productForm");

    if (productForm) {
        const params = new URLSearchParams(window.location.search);
        const productId = Number(params.get("id"));

        const codeInput = document.getElementById("productCodeInput");
        const nameInput = document.getElementById("productNameInput");
        const descriptionInput = document.getElementById("productDescriptionInput");
        const priceInput = document.getElementById("productPriceInput");
        const categoryInput = document.getElementById("productCategoryInput");
        const stockInput = document.getElementById("productStockInput");
        const criticalStockInput = document.getElementById("productCriticalStockInput");
        const imageInput = document.getElementById("productImageInput");

        const formTitle = document.getElementById("formTitle");
        const formSubtitle = document.getElementById("formSubtitle");
        const saveButton = document.getElementById("saveProductButton");

        const productToEdit = products.find(product => product.id === productId);

        if (productToEdit) {
            formTitle.textContent = "Editar producto";
            formSubtitle.textContent = "Modifica la información del producto seleccionado.";
            saveButton.textContent = "Guardar cambios";

            codeInput.value = productToEdit.code;
            nameInput.value = productToEdit.name;
            descriptionInput.value = productToEdit.description;
            priceInput.value = productToEdit.price;
            categoryInput.value = productToEdit.category;
            stockInput.value = productToEdit.stock;
            criticalStockInput.value = productToEdit.criticalStock;
            imageInput.value = productToEdit.image;
        }

        productForm.addEventListener("submit", event => {
            event.preventDefault();

            clearProductErrors();

            let isValid = true;

            const code = codeInput.value.trim();
            const name = nameInput.value.trim();
            const description = descriptionInput.value.trim();
            const price = Number(priceInput.value);
            const category = categoryInput.value;
            const stock = Number(stockInput.value);
            const criticalStock = criticalStockInput.value.trim();
            const image = imageInput.value.trim();

            if (code.length < 3) {
                showProductError(
                    codeInput,
                    "productCodeError",
                    "El código debe tener al menos 3 caracteres."
                );
                isValid = false;
            }

            if (name === "") {
                showProductError(
                    nameInput,
                    "productNameError",
                    "El nombre del producto es obligatorio."
                );
                isValid = false;
            }

            if (name.length > 100) {
                showProductError(
                    nameInput,
                    "productNameError",
                    "El nombre no puede superar los 100 caracteres."
                );
                isValid = false;
            }

            if (description.length > 500) {
                showProductError(
                    descriptionInput,
                    "productDescriptionError",
                    "La descripción no puede superar los 500 caracteres."
                );
                isValid = false;
            }

            if (priceInput.value.trim() === "" || price < 0) {
                showProductError(
                    priceInput,
                    "productPriceError",
                    "El precio es obligatorio y debe ser mayor o igual a 0."
                );
                isValid = false;
            }

            if (category === "") {
                showProductError(
                    categoryInput,
                    "productCategoryError",
                    "Debe seleccionar una categoría."
                );
                isValid = false;
            }

            if (
                stockInput.value.trim() === "" ||
                stock < 0 ||
                !Number.isInteger(stock)
            ) {
                showProductError(
                    stockInput,
                    "productStockError",
                    "El stock debe ser un número entero mayor o igual a 0."
                );
                isValid = false;
            }

            if (criticalStock !== "") {
                const criticalStockNumber = Number(criticalStock);

                if (
                    criticalStockNumber < 0 ||
                    !Number.isInteger(criticalStockNumber)
                ) {
                    showProductError(
                        criticalStockInput,
                        "productCriticalStockError",
                        "El stock crítico debe ser un número entero mayor o igual a 0."
                    );
                    isValid = false;
                }
            }

            if (image !== "") {
                try {
                    new URL(image);
                } catch {
                    showProductError(
                        imageInput,
                        "productImageError",
                        "Ingrese una URL de imagen válida."
                    );
                    isValid = false;
                }
            }

            if (!isValid) {
                return;
            }

            alert(
                productToEdit
                    ? "Producto actualizado correctamente."
                    : "Producto creado correctamente."
            );

            window.location.href = "products.html";
        });
    }

    function showProductError(input, errorId, message) {
        input.classList.add("is-invalid");
        document.getElementById(errorId).textContent = message;
    }

    function clearProductErrors() {
        const inputs = document.querySelectorAll(
            "#productForm .form-control, #productForm .form-select"
        );

        inputs.forEach(input => {
            input.classList.remove("is-invalid");
        });

        const errors = document.querySelectorAll(
            "#productForm .invalid-feedback"
        );

        errors.forEach(error => {
            error.textContent = "";
        });
    }
}