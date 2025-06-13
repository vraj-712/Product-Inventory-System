import { Product } from "../models/product.js";
import { ApiResponse, asyncHandler } from "../utils/helper.js";


const createProduct = asyncHandler(async (req, res) => {

    const {name, description, quantity, category, price} = req.body;
    try {

        if(!name || !description || !quantity || !category || !price) {
            return res.status(400).json(new ApiResponse(400, false, "All fields are required"));
        }

        const isProductExists = await Product.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });

        if (isProductExists) {
            return res.status(400).json(new ApiResponse(400, false, "Product already exists"));
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            quantity,
            categories: category.map(cat => cat.value),
            price
        });
        return res.status(201).json(new ApiResponse(201, true, "Product created successfully", product));
        
    } catch (error) {
        throw new Error(error.message);
    }
})

const getProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = Math.abs(page - 1) * limit;
    const categories = req.query['categories[]'] || []
    try {
        const query = {
            $or: [
                { name: { $regex: new RegExp(search, 'i') } },
            ]
        };

        if (categories.length > 0) {
            query.categories = { $in: categories };
        }

        const products = await Product.find(query)
            .skip(skip)
            .limit(Number(limit))
            .populate("categories", "name")
            .sort({ createdAt: -1 });

        const totalProducts = await Product.countDocuments(query);

        return res.status(200).json(new ApiResponse(200, true, "Products fetched successfully", {
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: Number(page)
        }));
    } catch (error) {
        throw new Error(error.message);
    }

})

const deleteProduct  = asyncHandler(async (req, res) => {
    const id = req.params.id
    if(!id) {
        return res.status(400).json(new ApiResponse(400, false, "Please Provide Product Id."))
    }
    try {
        const isProductExists = await Product.findById({_id: id});
        if(!isProductExists){
            return res.status(400).json(new ApiResponse(400, false, "Product Not Found."))
        }

        await Product.deleteOne({_id: id})

        return res.status(200).json(new ApiResponse(200, true, "Product Deleted Successfully."))

    } catch (error) {
        throw new Error(error.message);
    }

    
})

export {
    createProduct,
    getProducts,
    deleteProduct
}