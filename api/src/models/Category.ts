
class CategoryModel {

  mongo;

  constructor(mongo) {
    this.mongo = mongo;
  }

  /**
   * Create a category with optional parent category
   */
  create(name, parent) {

  }

  /**
   * Get all categories, with child category mapping
   */
  getAll() {

  }

}

export default CategoryModel;
