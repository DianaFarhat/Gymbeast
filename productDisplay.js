// products.js

async function fetchProducts() {
    try {
      const response = await fetch('products.json');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
  
  function createProductCard(product) {
    const { productName, description, brand, price, discount, imageURLs } = product;
    const imageUrl = Object.values(imageURLs)[0];
    const discountedPrice = (price * (1 - discount)).toFixed(2);
  
    const templateId = discount > 0 ? '#discounted-product-template' : '#product-template';
    const template = document.querySelector(templateId).content.cloneNode(true);
  
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
  
    return template;
  }
  
  async function displayProducts() {
    const products = await fetchProducts();
    const productContainer = document.querySelector('#product1 .row');
  
    products.forEach(product => {
      const productCard = createProductCard(product);
      productContainer.appendChild(productCard);
    });
  }
  
  document.addEventListener('DOMContentLoaded', displayProducts);
  