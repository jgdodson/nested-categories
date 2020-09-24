import { MongoClient, ObjectId } from 'mongodb';

class CategoryModel {
  private readonly mongo: Promise<MongoClient>;

  constructor(mongo) {
    this.mongo = mongo;
  }

  /**
   * Create a category with optional parent category
   */
  async create(name: string, parentId: ObjectId) {
    const collection = (await this.mongo).db('heady').collection('category');

    // Insert new category
    const writeResult = await collection.insertOne({
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
      await collection.updateOne(
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
    const collection = (await this.mongo).db('heady').collection('category');

    const records = await collection.find().toArray();

    return records;
  }
}

export default CategoryModel;
