// Function to fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('../json/products.json');
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
async function updateQuantity(productId, color, size, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(item => item.id === productId && item.color === color && item.size === size && item.bundleId === bundleId);
    
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


async function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const template = document.getElementById('cart-item-template'); // Template for items

    if (!cartItemsContainer || !template) return; // Exit if template not found

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productsData = await fetchProducts(); // Fetching the new product data

    cartItemsContainer.innerHTML = ''; // Clear container
    let subtotal = 0;

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';

        cart.forEach(item => {
            // Find the product in the fetched data by matching productId
            const product = productsData.find(p => p.productId === item.id);
            if (product) {
                let price = product.price * (1 - product.discount);
                const itemTotal = price * item.quantity;
                subtotal += itemTotal;

                // Clone template
                const clone = template.content.cloneNode(true);

                // Populate template
                clone.querySelector('.cart-product-img').src =
                    product.imageURLs[item.color] || Object.values(product.imageURLs)[0];
                clone.querySelector('.cart-product-img').alt = product.productName;
                clone.querySelector('.card-title').textContent = product.productName;
                clone.querySelector('.description').textContent = product.description;
                clone.querySelector('.details').textContent = `Color: ${item.color}, Size: ${item.size}`;
                clone.querySelector('.quantity').value = item.quantity;

                clone.querySelector('.quantity').addEventListener('change', (e) => {
                    updateQuantity(item.id, item.color, item.size, e.target.value);
                });

                clone.querySelector('.remove-btn').addEventListener('click', () => {
                    removeFromCart(item.id, item.color, item.size);
                });

                clone.querySelector('.price').textContent = `$${itemTotal.toFixed(2)}`;
                clone.querySelector('.discount-price').innerHTML = `<s>$${(product.price * item.quantity).toFixed(2)}</s>`;

                // Append to container
                cartItemsContainer.appendChild(clone);
            }
        });
    }

    // Update order summary
    const shipping = subtotal > 150 ? 0 : 4;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
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
