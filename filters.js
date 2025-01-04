function toggleFilters(){

}

// Fetch data from products.json
async function fetchProducts() {
    const response = await fetch('products.json');
    return response.json();
}

// State-of-the-art search bar with dynamic suggestions
const searchInput = document.getElementById('search-bar');
const suggestionsContainer = document.getElementById('suggestions');
let products = [];

// Fetch products on load
fetchProducts().then(data => products = data);

// Debounce function to limit rapid calls
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Highlight matching text
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

// Display suggestions
function displaySuggestions(matches) {
    suggestionsContainer.innerHTML = '';
    matches.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${highlightMatch(product.productName, searchInput.value)} - ${product.price}$`;
        li.addEventListener('click', () => {
            searchInput.value = product.productName;
            suggestionsContainer.innerHTML = '';
            // Navigate to product details (example link)
            window.location.href = `/product/${product.productId}`;
        });
        suggestionsContainer.appendChild(li);
    });
}

// Search and filter products
function searchProducts(query) {
    if (!query) {
        suggestionsContainer.innerHTML = '';
        return;
    }

    const matches = products.filter(product => {
        return product.productName.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.subCategory.toLowerCase().includes(query.toLowerCase()) ||
            product.type.some(type => type.toLowerCase().includes(query.toLowerCase()));
    });

    displaySuggestions(matches.slice(0, 10)); // Limit suggestions to 10
}

// Attach event listener with debounce
searchInput.addEventListener('input', debounce(() => {
    searchProducts(searchInput.value);
}, 300));
