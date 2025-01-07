async function displayProductDetails(productId) {    
    console.log("Id passed: "+ productId);

    if (!productId) {
        document.getElementById('product-details').innerHTML = '<h1>Product not found</h1>';
        return;
    }

    const productsData = await fetchProducts();
    const product = productsData.products.find(p => p.productId === productId);

    if (!product) {
        document.getElementById('product-details').innerHTML = '<h1>Product not found</h1>';
        return;
    }

    const price = product.price * (1 - product.discount);
    const colors = Object.keys(product.stock);
    const sizes = Object.keys(product.stock[colors[0]]);

    let bundleHtml = '';
    const productBundles = productsData.bundles.filter(bundle => bundle.productIds.includes(productId));
    if (productBundles.length > 0) {
        bundleHtml = `
            <div class="mt-4">
                <h4>Available Bundles</h4>
                ${productBundles.map(bundle => `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="bundle" id="bundle-${bundle.id}" value="${bundle.id}">
                        <label class="form-check-label" for="bundle-${bundle.id}">
                            ${bundle.name} - $${(product.price * (1 - bundle.discount)).toFixed(2)}
                            <small class="text-muted">(Save ${(bundle.discount * 100).toFixed(0)}%)</small>
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
    }

    const productDetailsHtml = `
        <div class="row">
            <div class="col-md-6">
                <img src="${Object.values(product.imageURLs)[0]}" alt="${product.productName}" class="product-image" id="main-product-image">
                <div class="mt-3">
                    ${colors.map(color => `
                        <span class="color-swatch" style="background-color: ${color};" onclick="changeImage('${product.imageURLs[color]}', this)"></span>
                    `).join('')}
                </div>
            </div>
            <div class="col-md-6">
                <h1>${product.productName}</h1>
                <p class="text-muted">${product.description}</p>
                <h2>
                    $${price.toFixed(2)}
                    ${product.discount > 0 ? `<small><s class="text-muted">$${product.price.toFixed(2)}</s></small>` : ''}
                </h2>
                <p>Brand: ${product.brand}</p>
                <p>Collection: ${product.collections}</p>
                <p>Category: ${product.category} > ${product.subCategory}</p>
                <p>Type: ${product.type.join(', ')}</p>
                <p>Fit: ${product.fit}</p>
                <p>Gender: ${product.gender.join(', ')}</p>
                <form id="add-to-cart-form">
                    <div class="mb-3">
                        <label for="color" class="form-label">Color:</label>
                        <select id="color" class="form-select" required>
                            ${colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="size" class="form-label">Size:</label>
                        <select id="size" class="form-select" required>
                            ${sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                    </div>
                    ${bundleHtml}
                    <button type="submit" class="btn btn-primary mt-3">Add to Cart</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('product-details').innerHTML = productDetailsHtml;

    document.getElementById('add-to-cart-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const color = document.getElementById('color').value;
        const size = document.getElementById('size').value;
        const selectedBundle = document.querySelector('input[name="bundle"]:checked');
        const bundleId = selectedBundle ? selectedBundle.value : null;
        addToCart(productId, color, size, bundleId);
    });

    displayReviews(productId);
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

