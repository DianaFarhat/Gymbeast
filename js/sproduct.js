
async function displayProductDetails() {

    // Extract the productId from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    console.log("ProductId from URL: ", productId);

    if (!productId) {
        document.getElementById('product-details').innerHTML = '<h1>Product not found</h1>';
        return;
    }

    // Fetch product data
    const productsResponse = await fetch('../json/products.json');
    const productsData = await productsResponse.json();
    const product = productsData.find(p => p.productId === productId);

    if (!product) {
        document.getElementById('product-details').innerHTML = '<h1>Product not found</h1>';
        return;
    }

    const price = product.price * (1 - product.discount);
    const colors = Object.keys(product.stock);
    const sizes = Object.keys(product.stock[colors[0]]);

    // Inject values into HTML template
    const mainImage = document.getElementById('main-product-image');
    const imageUrl = Object.values(product.imageURLs)[0]; // Get first image URL
    console.log("Image URL:", imageUrl); // Debugging log
    mainImage.src = imageUrl; // Set the image source
    mainImage.alt = product.productName; // Set alt text

    document.getElementById('product-name').innerText = product.productName;
    document.getElementById('product-description').innerText = product.description;
    document.getElementById('product-price').innerText = `$${price.toFixed(2)}`;
    document.getElementById('product-brand').innerText = product.brand;
    document.getElementById('product-category').innerText = `${product.category} > ${product.subCategory}`;
    document.getElementById('product-type').innerText = product.type.join(', ');
    document.getElementById('product-fit').innerText = product.fit;
    document.getElementById('product-gender').innerText = product.gender.join(', ');

    // Populate Color Select
    const colorSelect = document.getElementById('color');
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
    });

    // Populate Size Select
    const sizeSelect = document.getElementById('size');
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });

    // Fetch bundles data
    const bundlesResponse = await fetch('../json/bundles.json');
    const bundlesData = await bundlesResponse.json();

    // Check if the product is part of any bundle
    const productBundles = bundlesData.filter(bundle => bundle.productIds.includes(productId));

    if (productBundles.length > 0) {
        const bundleContainer = document.getElementById('bundle-container');
        bundleContainer.style.display = 'block';  // Show the bundle container

        productBundles.forEach(bundle => {
            const bundleItem = document.createElement('div');
            bundleItem.classList.add('form-check');
            bundleItem.innerHTML = `
                <input class="form-check-input" type="radio" name="bundle" id="bundle-${bundle.id}" value="${bundle.id}">
                <label class="form-check-label" for="bundle-${bundle.id}">
                    ${bundle.name} - $${(product.price * (1 - bundle.discount)).toFixed(2)}
                    <small class="text-muted">(Save ${(bundle.discount * 100).toFixed(0)}%)</small>
                </label>
            `;
            bundleContainer.appendChild(bundleItem);
        });
    } else {
        console.log('No bundles available for this product');
    }

    // Form submission handler 
    document.getElementById('add-to-cart-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const color = document.getElementById('color').value;
        const size = document.getElementById('size').value;
        addToCart(productId, color, size);
        
    });


    displayReviews(productId); // Assuming this function is defined elsewhere
}


function changeImage(imageUrl, element) {
    document.getElementById('main-product-image').src = imageUrl;
    document.querySelectorAll('.color-swatch').forEach(swatch => swatch.classList.remove('active'));
    element.classList.add('active');
}

function displayReviews(productId) {
    const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
    const reviewsContainer = document.getElementById('reviews');
    reviewsContainer.innerHTML = '';

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <h5>${review.name}</h5>
            <div class="star-rating">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </div>
            <p>${review.comment}</p>
        `;
        reviewsContainer.appendChild(reviewElement);
    });

    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
    }
}

document.getElementById('review-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const productId = localStorage.getItem('currentProductId');
    const name = document.getElementById('review-name').value;
    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value;

    const review = { name, rating, comment };
    const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
    reviews.push(review);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

    displayReviews(productId);
    e.target.reset();
});

document.addEventListener('DOMContentLoaded', function () {
    displayProductDetails();
});

