import express from 'express';

import { protect, adminAuth } from '../middleware/authMiddleware.js';

import {
	getAllProducts,
	getSingleProduct,
	createProduct,
	deleteProduct,
	editProduct,
} from '../controllers/productController.js';

// ROOT route = /api/products

const router = express.Router();

// all products route
router.route('/').get(getAllProducts).post(protect, adminAuth, createProduct);

// single product route
router
	.route('/:id')
	.get(getSingleProduct)
	.put(protect, adminAuth, editProduct)
	.delete(protect, adminAuth, deleteProduct);

export default router;
