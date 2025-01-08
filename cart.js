// Function to fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Updated to return an empty array instead of an object with products and bundles
    }
}

// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

/*
async function addToCart(productId, color, size) {
    // Retrieve the current cart or initialize an empty one
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingItem = cart.find(item => 
        item.id === productId && item.color === color && item.size === size
    );

    if (existingItem) {
        // Increment quantity if product exists
        existingItem.quantity += 1;
    } else {
        // Add new product to the cart
        cart.push({ id: productId, color, size, quantity: 1 });
    }

    // Update local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show confirmation and redirect to cart
    alert('Product added to cart!');
}
*/

async function addToCart(productId, color, size) {
    try {
        // Retrieve the current cart or initialize an empty one
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        console.log('Current Cart:', cart); // Debugging: Check the initial cart contents

        // Check if the product already exists in the cart
        const existingItem = cart.find(item => 
            item.id === productId && item.color === color && item.size === size
        );

        if (existingItem) {
            // Increment quantity if product exists
            existingItem.quantity += 1;
            console.log('Updated Item:', existingItem); // Debugging
        } else {
            // Add new product to the cart
            const newItem = { id: productId, color, size, quantity: 1 };
            cart.push(newItem);
            console.log('Added New Item:', newItem); // Debugging
        }

        // Update local storage
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Updated Cart:', cart); // Debugging: Check the updated cart contents

        // Show confirmation
        alert('Product added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error); // Debugging: Log any errors
    }
}



// Function to remove a product from the cart
async function removeFromCart(productId, color, size) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.id === productId && item.color === color && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    await displayCart();
}




// Function to update the quantity of a product in the cart
async function updateQuantity(productId, color, size, newQuantity, bundleId = null) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(item => item.id === productId && item.color === color && item.size === size && item.bundleId === bundleId);
    
    if (item) {
        item.quantity = parseInt(newQuantity);
        if (item.quantity <= 0) {
            await removeFromCart(productId, color, size, bundleId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            await displayCart();
        }
    }
}

// Function to display the cart contents
async function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    if (!cartItems) return; // Exit if not on the cart page

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productsData = await fetchProducts();

    cartItems.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';

        for (const item of cart) {
            const product = productsData.products.find(p => p.productId === item.id);
            if (product) {
                let price = product.price * (1 - product.discount);
                let bundleName = '';

                if (item.bundleId) {
                    const bundle = productsData.bundles.find(b => b.id === item.bundleId);
                    if (bundle) {
                        price = product.price * (1 - bundle.discount);
                        bundleName = ` (${bundle.name})`;
                    }
                }

                const itemTotal = price * item.quantity;
                subtotal += itemTotal;

                const imageURL = product.imageURLs[item.color] || Object.values(product.imageURLs)[0];

                cartItems.innerHTML += `
                    <div class="row mb-3">
                        <div class="col-md-2">
                            <img src="${imageURL}" alt="${product.productName}" class="product-img">
                        </div>
                        <div class="col-md-6">
                            <h5 class="card-title">${product.productName}${bundleName}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">Color: ${item.color}, Size: ${item.size}</p>
                            <div class="d-flex align-items-center">
                                <input type="number" class="form-control me-3" style="width: 60px;" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', '${item.color}', '${item.size}', this.value, '${item.bundleId}')">
                                <a href="#" class="text-decoration-none" onclick="removeFromCart('${item.id}', '${item.color}', '${item.size}', '${item.bundleId}')">Remove</a>
                            </div>
                        </div>
                        <div class="col-md-4 text-end">
                            <h5>$${itemTotal.toFixed(2)}</h5>
                            ${item.bundleId ? '' : `<p class="text-muted"><s>$${(product.price * item.quantity).toFixed(2)}</s></p>`}
                        </div>
                    </div>
                    <hr>
                `;
            }
        }
    }

    // Update order summary
    const shipping = subtotal > 150 ? 0 : 4;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Function to handle checkout (placeholder)
function checkout() {
    alert('Checkout functionality not implemented in this demo.');
}

// Function to display products on the products page
async function displayProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return; // Exit if not on the products page

    const productsData = await fetchProducts();

    productList.innerHTML = '';
    productsData.products.forEach(product => {
        const price = product.price * (1 - product.discount);
        const colors = Object.keys(product.stock);
        const sizes = Object.keys(product.stock[colors[0]]);

        const productElement = document.createElement('div');
        productElement.className = 'col-md-4 mb-4';
        productElement.innerHTML = `
            <div class="card">
                <a href="#" onclick="viewProduct('${product.productId}'); return false;">
                    <img src="${Object.values(product.imageURLs)[0]}" class="card-img-top" alt="${product.productName}">
                </a>
                <div class="card-body">
                    <h5 class="card-title"><a href="#" onclick="viewProduct('${product.productId}'); return false;" class="text-decoration-none text-dark">${product.productName}</a></h5>
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

// Function to view a single product
function viewProduct(productId) {
    localStorage.setItem('currentProductId', productId);
    window.location.href = 'dynamic-sproduct.html';
}

// Call displayProducts when the products page loads
if (document.getElementById('product-list')) {
    displayProducts();
}

// Call displayCart when the cart page loads
if (document.getElementById('cart-items')) {
    displayCart();
}
