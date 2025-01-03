

// Function to fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Function to add a product to the cart
async function addToCart(productId, color, size) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const existingItem = cart.find(item => item.id === productId && item.color === color && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, color, size, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
    await displayCart();
}

// Function to remove a product from the cart
async function removeFromCart(productId, color, size) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => !(item.id === productId && item.color === color && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    await displayCart();
}

// Function to update the quantity of a product in the cart
async function updateQuantity(productId, color, size, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(item => item.id === productId && item.color === color && item.size === size);
    
    if (item) {
        item.quantity = parseInt(newQuantity);
        if (item.quantity <= 0) {
            await removeFromCart(productId, color, size);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            await displayCart();
        }
    }
}

// Function to display the cart contents
async function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart'));
    const products = await fetchProducts();

    cartItems.innerHTML = '';
    let subtotal = 0;

    for (const item of cart) {
        const product = products.find(p => p.productId === item.id);
        if (product) {
            const price = product.price * (1 - product.discount);
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;

            const imageURL = product.imageURLs[item.color] || Object.values(product.imageURLs)[0];

            cartItems.innerHTML += `
                <div class="row mb-3">
                    <div class="col-md-2">
                        <img src="${imageURL}" alt="${product.productName}" class="product-img">
                    </div>
                    <div class="col-md-6">
                        <h5 class="card-title">${product.productName}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">Color: ${item.color}, Size: ${item.size}</p>
                        <div class="d-flex align-items-center">
                            <input type="number" class="form-control me-3" style="width: 60px;" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', '${item.color}', '${item.size}', this.value)">
                            <a href="#" class="text-decoration-none" onclick="removeFromCart('${item.id}', '${item.color}', '${item.size}')">Remove</a>
                        </div>
                    </div>
                    <div class="col-md-4 text-end">
                        <h5>$${itemTotal.toFixed(2)}</h5>
                        <p class="text-muted"><s>$${(product.price * item.quantity).toFixed(2)}</s></p>
                    </div>
                </div>
                <hr>
            `;
        }
    }

    // Update order summary
    const shipping = 5;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Function to handle checkout (placeholder)
function checkout() {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!loggedInEmail) {
        alert("Please log in or create an account to proceed to checkout. Your cart will be saved.");
        window.location.href = '../signin.html';
        return;
    }

    if (cart.length > 0) {
        fetchProducts().then(products => {
            const userCart = cart.map(item => {
                const product = products.find(p => p.productId === item.id);
                if (product) {
                    const price = product.price * (1 - product.discount);
                    return {
                        name: product.productName,
                        quantity: item.quantity,
                        price: product.price,
                        discountedPrice: price,
                        description: product.description,
                        image: product.imageURLs[item.color],
                        id: item.id,
                        color: item.color,
                        size: item.size
                    };
                }
                return null;
            }).filter(item => item !== null);

            const totalPriceBeforeDiscount = userCart.reduce(
                (acc, item) => acc + item.price * item.quantity, 0
            );
            const totalDiscountAmount = userCart.reduce(
                (acc, item) => acc + ((item.price - item.discountedPrice) * item.quantity), 0
            );
            const totalPriceAfterDiscount = userCart.reduce(
                (acc, item) => acc + item.discountedPrice * item.quantity, 0
            );
            const deliveryTaxes = totalPriceAfterDiscount * 0.10;
            const totalPriceIncludingTaxes = totalPriceAfterDiscount + deliveryTaxes;

            const orderSummary = {
                items: userCart,
                totalItems: userCart.reduce((acc, item) => acc + item.quantity, 0),
                totalPriceBeforeDiscount,
                totalDiscountAmount,
                totalPriceAfterDiscount,
                deliveryTaxes,
                totalPriceIncludingTaxes
            };

            localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
            alert("Proceeding to checkout...");
            window.location.href = "../checkout.html";
        }).catch(error => {
            console.error("Error fetching products:", error);
            alert("An error occurred while processing your checkout. Please try again later.");
        });
    } else {
        alert("Your cart is empty. Please add a product to your cart.");
    }
}

// Function to display products on the products page
async function displayProducts() {
    const productList = document.getElementById('product-list');
    const products = await fetchProducts();

    productList.innerHTML = '';
    products.forEach(product => {
        const price = product.price * (1 - product.discount);
        const colors = Object.keys(product.stock);
        const sizes = Object.keys(product.stock[colors[0]]);

        const productElement = document.createElement('div');
        productElement.className = 'col-md-4 mb-4';
        productElement.innerHTML = `
            <div class="card">
                <img src="${Object.values(product.imageURLs)[0]}" class="card-img-top" alt="${product.productName}">
                <div class="card-body">
                    <h5 class="card-title">${product.productName}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">
                        <strong>$${price.toFixed(2)}</strong>
                        ${product.discount > 0 ? `<s class="text-muted">$${product.price.toFixed(2)}</s>` : ''}
                    </p>
                    <div class="mb-2">
                        <label for="color-${product.productId}" class="form-label">Color:</label>
                        <select id="color-${product.productId}" class="form-select">
                            ${colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-2">
                        <label for="size-${product.productId}" class="form-label">Size:</label>
                        <select id="size-${product.productId}" class="form-select">
                            ${sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="addToCart('${product.productId}', document.getElementById('color-${product.productId}').value, document.getElementById('size-${product.productId}').value)">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(productElement);
    });
}

// Call displayProducts when the products page loads
if (document.getElementById('product-list')) {
    displayProducts();
}

// Call displayCart when the cart page loads
if (document.getElementById('cart-items')) {
    displayCart();
}