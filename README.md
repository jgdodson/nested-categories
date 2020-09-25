# Nested Categories & Products

This is a small API that models Products (shirt, sneakers, television, etc.) and Categories
(Clothing, Shoes, Electronics, etc.)

- Categories may be nested (Clothings -> Shirts -> T-Shirts)
- Products may be in multiple categories
- Categories can contain multiple products

## Run the code

The dev server runs on port 4000. This will use docker-compose
to spin up the api as well as a mongo container to store the data.

```bash
cd api
npm install
npm run dev
```

## API

 `POST /category` - add a category
 
 `GET /category` - get all categories
 
 `POST /product` - add product
 
 `GET /product?category=xxx` - get all products in category
 
 `PATCH /product/:id` - update a product

## Built with
- Node.js 
- Express
- Mongo
- Docker
