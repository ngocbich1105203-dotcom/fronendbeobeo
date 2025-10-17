// ========== HEADER & FOOTER ==========
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartLink = document.querySelector('header nav a[href="cart.html"]');
    if (cartLink) {
        const count = cartItems.reduce((total, i) => total + i.quantity, 0);
        cartLink.textContent = `Giỏ hàng (${count})`;
    }
}

function renderHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <div class="logo"><h1>BeoBeo Store</h1></div>
        <nav>
            <a href="index.html">Trang chủ</a>
            <a href="product.html">Sản phẩm</a>
            <a href="#">Giới Thiệu</a>
            <a href="cart.html">Giỏ hàng (0)</a>
        </nav>
    `;
    document.body.prepend(header);
    updateCartCount();
}

function renderFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-column">
                <h4>Về chúng tôi</h4>
                <p>Cửa hàng điện tử chuyên cung cấp các sản phẩm công nghệ chất lượng cao.</p>
            </div>
            <div class="footer-column">
                <h4>Liên hệ</h4>
                <p>Email: contact@store.com</p>
                <p>Hotline: 0909 999 999</p>
            </div>
            <div class="footer-column">
                <h4>Hỗ trợ</h4>
                <p>Chính sách bảo hành</p>
                <p>Chính sách đổi trả</p>
                <p>Câu hỏi thường gặp</p>
            </div>
            <div class="footer-column">
                <h4>Kết nối</h4>
                <div class="social-icons">
                    <a href="#">Facebook</a>
                    <a href="#">Instagram</a>
                    <a href="#">Zalo</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 BeoBeo Store. All rights reserved.</p>
        </div>
    `;
    document.body.appendChild(footer);
}

renderHeader();
renderFooter();

// ========== PRODUCT CLASS ==========
class Product {
    constructor(id, name, price, image, category, hot, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
        this.hot = hot;
        this.description = description;
    }

    render() {
        return `
            <div class="product-box">
                <img src="${this.image}" alt="${this.name}">
                <a href="detail.html?id=${this.id}"><h3>${this.name}</h3></a>
                <p>Giá: ${this.price.toLocaleString()} đ</p>
                <button class="add-to-cart main-btn" data-id="${this.id}">Thêm vào giỏ</button>
            </div>
        `;
    }

    renderDetail() {
        return `
            <div class="product-detail-container">
                <div class="product-detail-image">
                    <img src="${this.image}" alt="${this.name}">
                </div>
                <div class="product-detail-info">
                    <h2>${this.name}</h2>
                    <p class="product-detail-price">Giá: <b>${this.price.toLocaleString()} đ</b></p>
                    <p class="product-detail-category">Danh mục: ${this.category}</p>
                    <p class="product-detail-desc">${this.description}</p>
                    <div class="product-detail-qty">
                        <button id="decreaseQty" class="qty-btn">-</button>
                        <input type="number" id="quantityInput" min="1" value="1">
                        <button id="increaseQty" class="qty-btn">+</button>
                    </div>
                    <button class="add-to-cart main-btn" data-id="${this.id}" style="margin-top:18px;">Thêm vào giỏ hàng</button>
                </div>
            </div>
        `;
    }
}

// ========== CART CLASS ==========
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        this.save();
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    }

    updateQuantity(id, qty) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.quantity = Math.max(1, qty);
            this.save();
        }
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        updateCartCount();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}

const cart = new Cart();

// ========== HIỂN THỊ SẢN PHẨM ==========
function renderProductList(array, container) {
    container.innerHTML = `<div class="product-grid">${array.map(item => {
        const product = new Product(
            item.id, item.name, item.price, item.image, item.category, item.hot, item.description
        );
        return product.render();
    }).join('')}</div>`;
}

// ========== TRANG CHỦ ==========
document.addEventListener("DOMContentLoaded", function () {
    const productHot = document.getElementById('product-hot');
    const productLaptop = document.getElementById('product-laptop');
    const productDienThoai = document.getElementById('product-dienthoai');

    if (productHot) {
        fetch('https://my-json-server.typicode.com/ngocbich1105203-dotcom/backendjson/products')
            .then(res => res.json())
            .then(data => {
                renderProductList(data.filter(p => p.hot), productHot);
                renderProductList(data.filter(p => p.category === "laptop"), productLaptop);
                renderProductList(data.filter(p => p.category === "điện thoại"), productDienThoai);
            });
    }
});

// ========== TÌM KIẾM & SẮP XẾP ==========
document.addEventListener("DOMContentLoaded", function () {
    const productAll = document.getElementById('all-product');
    const searchInput = document.getElementById('search-input');
    const sortPrice = document.getElementById('sort-price');
    let allProductsData = [];

    if (productAll) {
        fetch('https://my-json-server.typicode.com/ngocbich1105203-dotcom/backendjson/products')
            .then(response => response.json())
            .then(data => {
                allProductsData = data;
                renderProductList(data, productAll);
            });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase();
                const filteredProducts = allProductsData.filter(
                    p => p.name.toLowerCase().includes(keyword));
                renderProductList(filteredProducts, productAll);
            });
        }

        if (sortPrice) {
            sortPrice.addEventListener('change', (e) => {
                let sortedData = [...allProductsData];
                if (e.target.value === "asc") {
                    sortedData.sort((a, b) => a.price - b.price);
                } else if (e.target.value === 'desc') {
                    sortedData.sort((a, b) => b.price - a.price);
                }
                renderProductList(sortedData, productAll);
            });
        }
    }
});

// ========== CHI TIẾT SẢN PHẨM ==========
document.addEventListener("DOMContentLoaded", function () {
    const productDetailDiv = document.getElementById('product-detail');
    if (productDetailDiv) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        fetch(`https://my-json-server.typicode.com/ngocbich1105203-dotcom/backendjson/products/${id}`)
            .then(response => response.json())
            .then(item => {
                const product = new Product(
                    item.id,
                    item.name,
                    item.price,
                    item.image,
                    item.category,
                    item.hot,
                    item.description
                );
                productDetailDiv.innerHTML = product.renderDetail();

                // Xử lý nút tăng/giảm số lượng
                const decreaseBtn = document.getElementById('decreaseQty');
                const increaseBtn = document.getElementById('increaseQty');
                const quantityInput = document.getElementById('quantityInput');
                if (decreaseBtn && increaseBtn && quantityInput) {
                    decreaseBtn.onclick = function() {
                        let qty = parseInt(quantityInput.value, 10);
                        if(qty > 1) quantityInput.value = qty - 1;
                    };
                    increaseBtn.onclick = function() {
                        let qty = parseInt(quantityInput.value, 10);
                        quantityInput.value = qty + 1;
                    };
                }

                // Thêm vào giỏ với số lượng đã chọn
                const addCartBtn = document.querySelector('.add-to-cart');
                if(addCartBtn) {
                    addCartBtn.onclick = function() {
                        const quantity = parseInt(quantityInput.value, 10);
                        cart.addItem(product, quantity);
                        updateCartCount();
                        alert('Đã thêm vào giỏ hàng!');
                    }
                }
            });
    }
});

// ========== GIỎ HÀNG: THÊM SẢN PHẨM ==========
document.addEventListener('click', function (e) {
    // Đảm bảo chỉ thêm khi ngoài trang chi tiết
    if (e.target.classList.contains('add-to-cart') && !document.getElementById('product-detail')) {
        const productId = Number(e.target.getAttribute('data-id'));
        fetch(`https://my-json-server.typicode.com/ngocbich1105203-dotcom/backendjson/products/${productId}`)
            .then(response => response.json())
            .then(item => {
                const product = new Product(
                    item.id,
                    item.name,
                    item.price,
                    item.image,
                    item.category,
                    item.hot,
                    item.description
                );
                cart.addItem(product, 1);
                updateCartCount();
                alert('Đã thêm vào giỏ hàng!');
            });
    }
});

// ========== GIỎ HÀNG: HIỂN THỊ, TĂNG, GIẢM, XOÁ ==========
document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        renderCartTable();

        cartContainer.addEventListener('click', function (e) {
            let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            // Nút giảm số lượng
            if (e.target.classList.contains('decrease-qty')) {
                const id = Number(e.target.getAttribute('data-id'));
                const item = cartItems.find(i => i.id === id);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                    renderCartTable();
                }
            }
            // Nút tăng số lượng
            if (e.target.classList.contains('increase-qty')) {
                const id = Number(e.target.getAttribute('data-id'));
                const item = cartItems.find(i => i.id === id);
                if (item) {
                    item.quantity++;
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                    renderCartTable();
                }
            }
            // Nút xoá sản phẩm
            if (e.target.classList.contains('remove-item')) {
                const id = Number(e.target.getAttribute('data-id'));
                cartItems = cartItems.filter(i => i.id !== id);
                localStorage.setItem('cart', JSON.stringify(cartItems));
                renderCartTable();
            }
        });

        function renderCartTable() {
            let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            let html = `
                <table class="cart-table">
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th>Hành động</th>
                    </tr>
            `;
            cartItems.forEach(item => {
                html += `
                    <tr>
                        <td><img src="${item.image}" alt="${item.name}" class="cart-img"></td>
                        <td>${item.name}</td>
                        <td>${item.price.toLocaleString()} đ</td>
                        <td>
                            <button class="decrease-qty cart-btn" data-id="${item.id}">-</button>
                            <span class="cart-qty">${item.quantity}</span>
                            <button class="increase-qty cart-btn" data-id="${item.id}">+</button>
                        </td>
                        <td>${(item.price * item.quantity).toLocaleString()} đ</td>
                        <td>
                            <button class="remove-item cart-btn remove-btn" data-id="${item.id}">Xoá</button>
                        </td>
                    </tr>
                `;
            });
            html += `</table>`;
            if(cartItems.length === 0) html += `<p class="cart-empty">Giỏ hàng trống.</p>`;
            else html += `<p class="cart-total"><b>Tổng tiền: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} đ</b></p>`;
            cartContainer.innerHTML = html;
        }
    }
});