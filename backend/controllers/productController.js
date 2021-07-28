import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc Fetch all products
//  @route GET /api/products
// @access Public
const getAllProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({});

	res.json(products);
});

// @desc Fetch single products
//  @route GET /api/products/:id
// @access Public
const getSingleProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// ADMIN ROUTES

// @desc CREATE single product
//  @route POST /api/products
// @access Private
// @privilige ADMIN

const createProduct = asyncHandler(async (req, res) => {
	try {
		const createdProduct = await Product.create({
			...req.body,
			user: req.user._id,
		});
		res.status(201).json(createdProduct);
	} catch (error) {
		res.status(500);
		throw new Error('Product could not be created. Try again later');
	}
});

// @desc EDIT single product
//  @route PUT /api/products/:id
// @access Private
// @privilige ADMIN

const editProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		try {
			product.name = req.body.name || product.name;
			product.image = req.body.image || product.image;
			product.brand = req.body.brand || product.brand;
			product.category = req.body.category || product.category;
			product.description = req.body.description || product.description;
			product.price = req.body.price || product.price;
			product.countInStock = req.body.countInStock || product.countInStock;

			const updatedProduct = await product.save();
			res.status(200).json(updatedProduct);
		} catch (error) {
			res.status(500);
			throw new Error(
				'An error occured while updating the product. Please try again later'
			);
		}
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc DELETE single product
//  @route DELETE /api/products/:id
// @access Private
// @privilige ADMIN

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		if (String(product.user._id) === String(req.user._id)) {
			product.remove();
			res.status(200);
			res.json({ message: 'Product has been deleted successfully' });
		} else {
			res.status(403);
			throw new Error(
				"User don't have privilige of deleting this product. Either the user is not an admin or the product was not created by this admin user."
			);
		}
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

export {
	getAllProducts,
	getSingleProduct,
	createProduct,
	editProduct,
	deleteProduct,
};
