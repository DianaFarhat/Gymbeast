/*
let products = [];

// Function to fetch and load products from the JSON file at app startup
async function loadProducts() {
    try {
        const response = await fetch('products.json');  
        const data = await response.json();
        products = data;  // Store the products in the global variable
        console.log('Products loaded:', products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function createProductCard(product) {
    const { productId, productName, description, brand, price, discount, imageURLs } = product;
    const imageUrl = Object.values(imageURLs)[0];
    const discountedPrice = (price * (1 - discount)).toFixed(2);
    // Select the appropriate template based on discount
    const templateId = discount > 0 ? '#discounted-product-template' : '#product-template';
    const template = document.querySelector(templateId).content.cloneNode(true);
    // Set values in the template
    template.querySelector('.card-img-top').src = imageUrl;
    template.querySelector('.product-name').textContent = productName;
    template.querySelector('.product-description').textContent = description;
    template.querySelector('.product-brand').textContent = brand;
    if (discount > 0) {
        template.querySelector('.discounted-price').textContent = `$${discountedPrice}`;
        template.querySelector('.og-price').textContent = `$${price}`;
        template.querySelector('.product-discount').textContent = `${Math.round(discount * 100)}% off`;
    } else {
        template.querySelector('.product-price').textContent = `$${price}`;
    }
    // Store the product ID in a hidden attribute
    template.querySelector('.product-card').setAttribute('data-id', productId);
    return template;
}


// Function to display products using the preloaded array
function displayProducts(productsToDisplay = products) {
    const productContainer = document.querySelector('#product1 .row');
    productContainer.innerHTML = ''; // Clear existing products before rendering

    productsToDisplay.forEach(product => {
        const productCard = createProductCard(product);
        productContainer.appendChild(productCard);
    });

    // Add event listeners for each product card
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-id');
            handleProductClick(productId); // Handle the click event
        });
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts(); 
    displayProducts();   
});









// Function to handle product click
function handleProductClick(productId) {
    console.log('Product clicked with ID:', productId);
    // Add your logic to display product details or navigate
}

// Sorting function
function sortItems() {
    const sortOption = document.getElementById('sort-options').value;

    let sortedProducts = [...products]; // Create a copy to avoid modifying the original array

    if (sortOption === 'newest') {
        sortedProducts.sort((a, b) => b.releaseDate - a.releaseDate); // Sort by release date (newest first)
    } else if (sortOption === 'price-high-low') {
        sortedProducts.sort((a, b) => b.price - a.price); // Price: High to Low
    } else if (sortOption === 'price-low-high') {
        sortedProducts.sort((a, b) => a.price - b.price); // Price: Low to High
    }

    displayProducts(sortedProducts); // Redisplay sorted products
}
*/