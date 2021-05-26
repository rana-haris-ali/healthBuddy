import React, { useState } from 'react';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Message from '../../components/Message';
import Loader from '../../components/Loader';
import NavigationSteps from '../../components/NavigationSteps';

const PlaceOrderScreen = () => {
	const cart = useSelector((state) => state.cart);
	const { shippingAddress, paymentMethod, cartItems } = cart;

	// calculate prices
	cart.netAmount = cartItems.reduce(
		(acc, currItem) => acc + currItem.price * currItem.qty,
		0
	);

	cart.shippingAmount = cart.netAmount > 1000 ? 100 : 200;
	cart.taxAmount = 0.05 * cart.netAmount;

	return (
		<>
			<NavigationSteps
				steps={[
					{ name: 'Login', link: '/login' },
					{ name: 'Shipping', link: '/shipping' },
					{ name: 'Payment', link: '/payment' },
					{ name: 'Place Order', link: '/placeorder' },
				]}
				disabledSteps={[]}
			/>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{shippingAddress.address}, {shippingAddress.city},{' '}
								{shippingAddress.country}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{paymentMethod}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Items</h2>
							{cartItems.length === 0 ? (
								<Message>Your cart is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{cartItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={1}>
													<Image
														className='place-order-screen-image'
														src={item.image}
														alt={item.name}
														fluid
													></Image>
												</Col>
												<Col>
													<Link to={`/products/${item.productId}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x Rs. {item.price} = Rs.{' '}
													{item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2 className='text-center'>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Net Amount:</Col>
									<Col>Rs. {cart.netAmount}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping Amount:</Col>
									<Col>Rs. {cart.shippingAmount}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax Amount:</Col>
									<Col>Rs. {cart.taxAmount}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<strong>
									<Row>
										<Col>Total Amount:</Col>
										<Col>
											Rs.{' '}
											{cart.netAmount + cart.shippingAmount + cart.taxAmount}
										</Col>
									</Row>
								</strong>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderScreen;
