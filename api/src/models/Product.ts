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

  /**
   * Update a product
   *
   * @param productId
   * @param updates
   */
  async update(productId: ObjectId, updates: { price?: number; description?: string }) {
    const collection = (await this.mongo).db('heady').collection('product');

    const updatedResult = await collection.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $set: updates,
      },
      {
        returnOriginal: false,
      },
    );

    return updatedResult.value;
  }

  /**
   * Get all products in a category
   */
  async getAll(category: ObjectId) {
    const collection = (await this.mongo).db('heady').collection('product');

    const products = await collection
      .find({
        categories: category,
      })
      .toArray();

    return products;
  }
}

export default ProductModel;
