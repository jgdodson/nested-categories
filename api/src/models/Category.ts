import { Collection, MongoClient, ObjectId } from 'mongodb';

class CategoryModel {
  private readonly mongo: MongoClient;

  private readonly collection: Collection;

  constructor(mongo: MongoClient) {
    this.mongo = mongo;
    this.collection = mongo.db('heady').collection('category');
  }

  /**
   * Create a category with optional parent category
   */
  async create(name: string, parentId: ObjectId) {
    // Insert new category
    const writeResult = await this.collection.insertOne({
      name,
      children: [],
    });

    // Check that a document was inserted
    if (writeResult.insertedCount === 0) {
      // Error
      throw new Error('Failed to create category');
    }

    // The newly inserted Category object
    const newCategory = writeResult.ops[0];

    // Update the parent category if specified
    if (parentId) {
      await this.collection.updateOne(
        { _id: parentId },
        {
          $addToSet: {
            children: newCategory._id,
          },
        },
      );
    }

    return newCategory;
  }

  /**
   * Get all categories, with child category mapping
   */
  async getAll(): Promise<any> {
    const categories = await this.collection.find().toArray();

    return categories;
  }
}

export default CategoryModel;
