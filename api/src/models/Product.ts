import { Collection, MongoClient, ObjectId } from 'mongodb';

class ProductModel {
  // MongoClient object used by this model
  private readonly mongo: MongoClient;

  // Collection object used by this model
  private readonly collection: Collection;

  constructor(mongo: MongoClient) {
    this.mongo = mongo;
    this.collection = mongo.db('heady').collection('product');
  }

  /**
   * Create a product
   *
   * @param name
   * @param price
   * @param description
   * @param categories
   */
  async create(name: string, price: number, description: string, categories: Array<ObjectId>) {
    // Insert new category
    const writeResult = await this.collection.insertOne({
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
    const updateResult = await this.collection.findOneAndUpdate(
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

    return updateResult.value;
  }

  /**
   * Get all products in a category
   *
   * @param category
   */
  async getAll(category: ObjectId) {
    const products = await this.collection
      .find({
        categories: category,
      })
      .toArray();

    return products;
  }
}

export default ProductModel;
