import { ObjectId } from 'mongodb';

class ProductModel {
  mongo;

  constructor(mongo) {
    this.mongo = mongo;
  }

  /**
   * Create a product
   */
  async create(name: string, price: number, description: string, categories: Array<ObjectId>) {
    const collection = (await this.mongo).db('heady').collection('product');

    // Insert new category
    const writeResult = await collection.insertOne({
      name,
      price,
      description,
      categories,
    });

    // Check that a document was inserted
    if (writeResult.insertedCount === 0) {
      // Error
      throw new Error('Failed to create product');
    }

    // The newly inserted Category object
    const newProduct = writeResult.ops[0];

    return newProduct;
  }

  async update() {}

  /**
   * Get all products in a category
   */
  async getAllInCategory(category) {}
}

export default ProductModel;
