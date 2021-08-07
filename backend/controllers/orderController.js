import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc create new order
//  @route POST /api/orders
// @access Private
const createOrder = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		netAmount,
		shippingAmount,
		taxAmount,
		totalAmount,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error('No order items');
	} else {
		const order = new Order({
			orderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			netAmount,
			shippingAmount,
			taxAmount,
			totalAmount,
		});
		try {
			const savedOrder = await order.save();
			res.status(201).json(savedOrder);
		} catch (error) {
			res.status(500);
			throw new Error('Unable to save order');
		}
	}
});

// @desc GET an order
//  @route GET /api/orders/:id
// @access Private
const getOrder = asyncHandler(async (req, res) => {
	const orderId = req.params.id;

	const order = await Order.findById(orderId).populate('user', 'name email');

	if (order) {
		res.json(order);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});

// @desc GET all orders of a logged in user
//  @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });

	res.json(orders);
});

// @desc Update order to paid
//  @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
	const orderId = req.params.id;

	const order = await Order.findById(orderId);

	if (order) {
		order.isPaid = true;
		order.paidOn = Date.now();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address,
		};

		const updatedOrder = order.save();

		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});

// @desc Update order to delivered
//  @route PUT /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const orderId = req.params.id;

	const order = await Order.findById(orderId);

	if (order) {
		order.isDelivered = true;
		order.deliveredOn = Date.now();

		const updatedOrder = order.save();

		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});

// ADMIN ROUTES

// @desc GET all orders
//  @route GET /api/orders
// @access Private
// @privilige ADMIN
const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({})
		.select('-orderItems')
		.populate('user', 'id name');

	res.json(orders);
});

export {
	createOrder,
	getOrder,
	updateOrderToPaid,
	updateOrderToDelivered,
	getMyOrders,
	getAllOrders,
};
