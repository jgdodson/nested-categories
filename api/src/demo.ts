import fetch from 'node-fetch';

// Create categories

// Get categories

// Create products in categories

// Get products

// Edit a product

// Show updated product

const apiURL = 'http://localhost:4000';

async function jsonRequest(url, method = 'get', body = null) {
  const requestOptions: any = {
    method,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
    requestOptions.headers = { 'Content-Type': 'application/json' };
  }

  return fetch(url, requestOptions).then((res) => res.json());
}

async function main() {
  const clothingCategory = await jsonRequest(`${apiURL}/category`, 'post', {
    name: 'Clothing',
  });

  const shirtCategory = await jsonRequest(`${apiURL}/category`, 'post', {
    name: 'Shirts',
    parentId: clothingCategory._id,
  });

  const summerCategory = await jsonRequest(`${apiURL}/category`, 'post', {
    name: 'Summer Specials',
  });

  const categories = await jsonRequest(`${apiURL}/category`);

  console.log('Categories...');
  console.log(categories);
  console.log('\n');

  const nikeShirt = await jsonRequest(`${apiURL}/product`, 'post', {
    name: 'Medium Nike Crew Trainer',
    price: 24.99,
    description: 'A shirt for all occasions',
    categories: [shirtCategory._id, summerCategory._id],
  });

  const leviJeans = await jsonRequest(`${apiURL}/product`, 'post', {
    name: 'Levi 505 Black',
    price: 54.99,
    description: 'Some nice jeans',
    categories: [clothingCategory._id],
  });

  const products = await jsonRequest(`${apiURL}/product`);

  console.log('Products...');
  console.log(products);
  console.log('\n');

  const updatedLeviJeans = await jsonRequest(`${apiURL}/product/${leviJeans._id}`, 'patch', {
    price: 64.99,
    description: 'Some really nice jeans',
  });

  const updatedProducts = await jsonRequest(`${apiURL}/product`);

  console.log('Updated Products...');
  console.log(updatedProducts);
}

main();
