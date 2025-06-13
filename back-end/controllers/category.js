import {Category} from '../models/category.js';
import { ApiResponse, asyncHandler } from '../utils/helper.js';


const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).select('-__v -createdAt -updatedAt');
  if (!categories || categories.length === 0) {
    return res.status(404).json(new ApiResponse(404, false, 'No categories found'));
  }
  res.status(200).json(new ApiResponse(200, true, 'Categories fetched successfully', categories));
});

export {
    getAllCategories
}