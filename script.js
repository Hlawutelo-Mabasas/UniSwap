document.addEventListener("DOMContentLoaded", () => {

    const initLocalStorage = () => {
        if (!localStorage.getItem("uniswap_products")) {
            const defaultProducts = [
                {
                    id: "p1",
                    name: "Engineering Mathematics Textbook",
                    price: 350,
                    code: "MAT301",
                    image: "https://picsum.photos/400?random=1"
                },
                {
                    id: "p2",
                    name: "Lab Coat (Size L)",
                    price: 180,
                    code: "SCI102",
                    image: "https://picsum.photos/400?random=2"
                },
                {
                    id: "p3",
                    name: "Scientific Calculator FX-991ZA",
                    price: 420,
                    code: "CASIO991",
                    image: "https://picsum.photos/400?random=3"
                }
            ];

            localStorage.setItem("uniswap_products", JSON.stringify(defaultProducts));
        }

        if (!localStorage.getItem("uniswap_cart")) {
            localStorage.setItem("uniswap_cart", JSON.stringify([]));
        }

        if (!localStorage.getItem("uniswap_orders")) {
            localStorage.setItem("uniswap_orders", JSON.stringify([]));
        }
    };

    initLocalStorage();

    const getProducts = () =>
        JSON.parse(localStorage.getItem("uniswap_products"));

    const saveProducts = (data) =>
        localStorage.setItem("uniswap_products", JSON.stringify(data));

    const getCart = () =>
        JSON.parse(localStorage.getItem("uniswap_cart"));

    const saveCart = (data) =>
        localStorage.setItem("uniswap_cart", JSON.stringify(data));

    const getOrders = () =>
        JSON.parse(localStorage.getItem("uniswap_orders"));

    const saveOrders = (data) =>
        localStorage.setItem("uniswap_orders", JSON.stringify(data));

    const path = window.location.pathname;

    const isHome =
        path.includes("index.html") || path.endsWith("/");

    const isLogin =
        path.includes("login.html");

    const isRegister =
        path.includes("register.html");

    const isDashboard =
        path.includes("dashboard.html");

    const isCheckout =
        path.includes("checkout.html");

    if (isHome || document.getElementById("about-btn")) {

        const aboutBtn =
            document.getElementById("about-btn");

        const aboutModal =
            document.getElementById("about-modal");

        const closeBtn =
            document.querySelector(".close-btn");

        if (aboutBtn && aboutModal) {

            aboutBtn.addEventListener("click", () => {
                aboutModal.style.display = "flex";
            });
        }

        if (closeBtn && aboutModal) {

            closeBtn.addEventListener("click", () => {
                aboutModal.style.display = "none";
            });

            window.addEventListener("click", (e) => {

                if (e.target === aboutModal) {
                    aboutModal.style.display = "none";
                }
            });
        }
    }

    if (isLogin || isRegister) {

        const togglePassword =
            document.getElementById("toggle-password");

        const passwordInput =
            document.getElementById("password");

        if (togglePassword && passwordInput) {

            togglePassword.addEventListener("click", () => {

                const isPassword =
                    passwordInput.getAttribute("type") === "password";

                passwordInput.setAttribute(
                    "type",
                    isPassword ? "text" : "password"
                );
            });
        }

        const toggleConfirm =
            document.getElementById("toggle-confirm");

        const confirmPasswordInput =
            document.getElementById("confirm-password");

        if (toggleConfirm && confirmPasswordInput) {

            toggleConfirm.addEventListener("click", () => {

                const isPassword =
                    confirmPasswordInput.getAttribute("type") === "password";

                confirmPasswordInput.setAttribute(
                    "type",
                    isPassword ? "text" : "password"
                );
            });
        }

        const loginForm =
            document.getElementById("log-in");

        if (loginForm) {

            loginForm.addEventListener("submit", (e) => {

                e.preventDefault();

                const user =
                    document.getElementById("firstnames").value.trim();

                if (user) {

                    localStorage.setItem(
                        "uniswap_logged_user",
                        user
                    );

                    window.location.href = "dashboard.html";
                }
            });
        }

        const regForm =
            document.getElementById("reg-form");

        if (regForm) {

            regForm.addEventListener("submit", (e) => {

                e.preventDefault();

                const pwd =
                    document.getElementById("password").value;

                const cpwd =
                    document.getElementById("confirm-password").value;

                if (pwd !== cpwd) {

                    alert("Passwords do not match!");
                    return;
                }

                alert("Account created successfully!");
                window.location.href = "login.html";
            });
        }
    }

    if (isDashboard) {

        const navBrowse =
            document.getElementById("nav-browse");

        const navSell =
            document.getElementById("nav-sell");

        const viewBrowse =
            document.getElementById("view-browse");

        const viewSell =
            document.getElementById("view-sell");

        const cartCount =
            document.getElementById("cart-count");

        const marketplaceGrid =
            document.getElementById("marketplace-grid");

        const searchInput =
            document.getElementById("search-input");

        if (
            navBrowse &&
            navSell &&
            viewBrowse &&
            viewSell
        ) {

            navBrowse.addEventListener("click", () => {

                navBrowse.classList.add("active");
                navSell.classList.remove("active");

                viewBrowse.classList.add("active");
                viewSell.classList.remove("active");

                renderMarketplace();
            });

            navSell.addEventListener("click", () => {

                navSell.classList.add("active");
                navBrowse.classList.remove("active");

                viewSell.classList.add("active");
                viewBrowse.classList.remove("active");

                renderSellerDashboard();
            });
        }

        const updateCartBadge = () => {

            if (cartCount) {

                const currentCart = getCart();
                cartCount.textContent = currentCart.length;
            }
        };

        const renderMarketplace = (filterKeyword = "") => {

            if (!marketplaceGrid) return;

            marketplaceGrid.innerHTML = "";

            const products = getProducts();

            const keyword =
                filterKeyword.toLowerCase().trim();

            const filtered = products.filter((p) =>
                p.name.toLowerCase().includes(keyword) ||
                p.code.toLowerCase().includes(keyword)
            );

            if (filtered.length === 0) {

                marketplaceGrid.innerHTML =
                    `<p>No matching products found on campus.</p>`;

                return;
            }

            filtered.forEach((product) => {

                const card = document.createElement("div");

                card.className = "product-card";

                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">

                    <div class="product-info">
                        <h3>${product.name}</h3>

                        <p class="code-label">
                            Code: ${product.code}
                        </p>

                        <p class="price-label">
                            R ${product.price}.00
                        </p>

                        <button
                            class="btn-cart add-to-cart-btn"
                            data-id="${product.id}"
                        >
                            Add to Cart
                        </button>
                    </div>
                `;

                marketplaceGrid.appendChild(card);
            });

            document
                .querySelectorAll(".add-to-cart-btn")
                .forEach((btn) => {

                    btn.addEventListener("click", (e) => {

                        const id =
                            e.target.getAttribute("data-id");

                        const targetProduct =
                            products.find((p) => p.id === id);

                        if (targetProduct) {

                            const cart = getCart();

                            cart.push(targetProduct);

                            saveCart(cart);

                            updateCartBadge();

                            alert(
                                `${targetProduct.name} added to your cart!`
                            );
                        }
                    });
                });
        };

        if (searchInput) {

            searchInput.addEventListener("input", (e) => {
                renderMarketplace(e.target.value);
            });
        }

        const uploadForm =
            document.getElementById("upload-form");

        const myListingsContainer =
            document.getElementById("my-listings-container");

        const incomingOrdersContainer =
            document.getElementById("incoming-orders-container");

        const renderSellerDashboard = () => {

            if (myListingsContainer) {

                myListingsContainer.innerHTML = "";

                const products = getProducts();

                if (products.length === 0) {

                    myListingsContainer.innerHTML =
                        `<p>No items active.</p>`;
                }

                else {

                    products.forEach((p) => {

                        const row =
                            document.createElement("div");

                        row.className = "seller-item-row";

                        row.innerHTML = `
                            <span>
                                <strong>${p.name}</strong>
                                (${p.code}) - R ${p.price}
                            </span>

                            <button
                                class="btn-delete remove-listing-btn"
                                data-id="${p.id}"
                            >
                                Remove
                            </button>
                        `;

                        myListingsContainer.appendChild(row);
                    });

                    document
                        .querySelectorAll(".remove-listing-btn")
                        .forEach((btn) => {

                            btn.addEventListener("click", (e) => {

                                const id =
                                    e.target.getAttribute("data-id");

                                const updated =
                                    getProducts().filter(
                                        (p) => p.id !== id
                                    );

                                saveProducts(updated);

                                renderSellerDashboard();
                                renderMarketplace();
                            });
                        });
                }
            }

            if (incomingOrdersContainer) {

                incomingOrdersContainer.innerHTML = "";

                const orders = getOrders();

                if (orders.length === 0) {

                    incomingOrdersContainer.innerHTML =
                        `<p>No incoming delivery transactions requested.</p>`;
                }

                else {

                    orders.forEach((order, index) => {

                        const block =
                            document.createElement("div");

                        block.className = "order-item-row";

                        block.innerHTML = `
                            <div class="order-details">
                                <strong>Buyer:</strong>
                                ${order.buyer}<br>

                                <strong>Mobile:</strong>
                                ${order.phone}<br>

                                <strong>Location:</strong>
                                ${order.address}<br>

                                <strong>
                                    Total Due:
                                    R ${order.total}.00
                                </strong>
                            </div>

                            <div class="order-actions">
                                <button
                                    class="btn-complete complete-order-btn"
                                    data-index="${index}"
                                >
                                    Fulfill Request
                                </button>
                            </div>
                        `;

                        incomingOrdersContainer.appendChild(block);
                    });

                    document
                        .querySelectorAll(".complete-order-btn")
                        .forEach((btn) => {

                            btn.addEventListener("click", (e) => {

                                const idx =
                                    parseInt(
                                        e.target.getAttribute("data-index")
                                    );

                                const orders = getOrders();

                                orders.splice(idx, 1);

                                saveOrders(orders);

                                alert(
                                    "Delivery Request Fulfilled Successfully!"
                                );

                                renderSellerDashboard();
                            });
                        });
                }
            }
        };

        if (uploadForm) {

            uploadForm.addEventListener("submit", (e) => {

                e.preventDefault();

                const name =
                    document.getElementById("prod-name").value.trim();

                const price =
                    parseFloat(
                        document.getElementById("prod-price").value.trim()
                    );

                const code =
                    document.getElementById("prod-code").value.trim();

                const fileInput =
                    document.getElementById("prod-image");

                const proceedWithProductCreation = (imgUrl) => {

                    const currentProducts = getProducts();

                    const newProd = {
                        id: "p_" + Date.now(),
                        name: name,
                        price: isNaN(price) ? 0 : price,
                        code: code,
                        image: imgUrl
                    };

                    currentProducts.push(newProd);

                    saveProducts(currentProducts);

                    uploadForm.reset();

                    alert("Product listing active on campus!");

                    renderSellerDashboard();
                    renderMarketplace();
                };

                if (fileInput.files && fileInput.files[0]) {

                    const reader = new FileReader();

                    reader.onload = (event) => {
                        proceedWithProductCreation(
                            event.target.result
                        );
                    };

                    reader.readAsDataURL(fileInput.files[0]);
                }

                else {

                    proceedWithProductCreation(
                        "https://picsum.photos/400"
                    );
                }
            });
        }

        renderMarketplace();
        renderSellerDashboard();
        updateCartBadge();
    }

    if (isCheckout) {

        const checkoutSummary =
            document.getElementById("checkout-summary");

        const checkoutForm =
            document.getElementById("checkout-form");

        const renderCheckoutSummary = () => {

            if (!checkoutSummary) return;

            const cart = getCart();

            if (cart.length === 0) {

                checkoutSummary.innerHTML =
                    `<p>Your cart is empty.</p>`;

                if (checkoutForm) {
                    checkoutForm.style.display = "none";
                }

                return;
            }

            let total = 0;

            let itemsHtml = "";

            cart.forEach((item, index) => {

                total += item.price;

                itemsHtml += `
                    <div class="checkout-item-line">
                        <span>${item.name}</span>

                        <div>
                            R ${item.price}

                            <button
                                class="cart-remove-item"
                                data-index="${index}"
                                style="
                                    margin-left:10px;
                                    background:none;
                                    border:none;
                                    color:red;
                                    cursor:pointer;
                                "
                            >
                                ×
                            </button>
                        </div>
                    </div>
                `;
            });

            itemsHtml += `
                <div class="checkout-total-line">
                    <span>Total</span>
                    <span>R ${total}.00</span>
                </div>
            `;

            checkoutSummary.innerHTML = itemsHtml;

            document
                .querySelectorAll(".cart-remove-item")
                .forEach((btn) => {

                    btn.addEventListener("click", (e) => {

                        const idx =
                            parseInt(
                                e.target.getAttribute("data-index")
                            );

                        const currentCart = getCart();

                        currentCart.splice(idx, 1);

                        saveCart(currentCart);

                        renderCheckoutSummary();
                    });
                });
        };

        if (checkoutForm) {

            checkoutForm.addEventListener("submit", (e) => {

                e.preventDefault();

                const cart = getCart();

                if (cart.length === 0) return;

                const name =
                    document.getElementById("buyer-name").value.trim();

                const phone =
                    document.getElementById("buyer-phone").value.trim();

                const address =
                    document.getElementById("buyer-address").value.trim();

                const total =
                    cart.reduce((acc, curr) => acc + curr.price, 0);

                const orders = getOrders();

                orders.push({
                    buyer: name,
                    phone: phone,
                    address: address,
                    total: total,
                    items: cart
                });

                saveOrders(orders);

                saveCart([]);

                alert(
                    "Order confirmed! The seller will receive your request."
                );

                window.location.href = "dashboard.html";
            });
        }

        renderCheckoutSummary();
    }
});