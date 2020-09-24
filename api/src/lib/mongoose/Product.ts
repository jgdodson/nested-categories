import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
  },
  categories: {
    type: [mongoose.Types.ObjectId],
    required: true,
  },
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
