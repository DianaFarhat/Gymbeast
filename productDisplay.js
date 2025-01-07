async function fetchProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

function getTemplate(product) {
  // Determine template based on discount availability
  const templateId = product.discount > 0 ? '#discounted-product-template' : '#product-template';
  const template = document.querySelector(templateId);
  if (!template) throw new Error(`Template ${templateId} not found`);
  return template.content.cloneNode(true);
}


function createProductCard(product) {
  
  const { productId, productName, description, brand, price, discount, imageURLs } = product;
  const imageUrl = Object.values(imageURLs)[0] || 'placeholder.jpg'; // Fallback image
  const discountedPrice = (price * (1 - discount)).toFixed(2);

  const template = getTemplate(product);

  // Populate template
  template.querySelector('.card-img-top').src = imageUrl;
  template.querySelector('.card-img-top').alt = productName; // Accessibility
  template.querySelector('.card-img-top').loading = 'lazy'; // Lazy loading
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

  // Add the productId as a hidden data attribute on the card element
  const card = template.querySelector('.product-card'); 
  card.dataset.productId = productId;
  
  return template;
}


function addProductCardEventListeners() {
  const cards = document.querySelectorAll('.product-card');  // Select all cards
  
  if (cards.length === 0) {
      console.log('No product cards found.');
      return;
  }

  cards.forEach(card => {
      card.addEventListener('click', function () {
          const productId = card.dataset.productId;  // Get productId from dataset
          
          if (!productId) {
              console.log('No productId found on card.');
              return;
          }

          console.log('Clicked productId:', productId);  // Debug: Verify correct productId
          
          // Save productId to localStorage
          localStorage.setItem('currentProductId', productId);

          window.location.href = 'sproduct.html';
          
      });
  });
}




async function displayProducts() {
  const products = await fetchProducts();
  const productContainer = document.querySelector('#product1 .row');

  if (products.length === 0) {
    productContainer.innerHTML = '<p>No products available</p>';
    return;
  }

  products.forEach(product => {
    try {
      const productCard = createProductCard(product);
      productContainer.appendChild(productCard);

    } catch (error) {
      console.error('Error creating product card:', error);
    }

    // After adding the cards, add event listeners
    addProductCardEventListeners();

  });
}




document.addEventListener('DOMContentLoaded', ()=> {
  displayProducts(); 
})

