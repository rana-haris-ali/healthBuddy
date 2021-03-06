import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import FormContainer from '../../components/FormContainer';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import NavigationSteps from '../../components/NavigationSteps';
import {
	getShippingAddress,
	updateShippingAddress,
} from '../../actions/pharmacy/cartActions';

const ShippingScreen = ({ history }) => {
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [country, setCountry] = useState('');

	const [message, setMessage] = useState('');

	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);
	const { loading, error, shippingAddress } = cart;

	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		if (!userInfo) {
			// redirect to login if not logged in
			history.push('/login?redirect=shipping');
		} else {
			if (shippingAddress === null) {
				// if shippingAddress is empty then fetch get request
				dispatch(getShippingAddress());
			} else {
				const shippingAddressFromStorage = JSON.parse(
					localStorage.getItem('shippingAddress')
				);
				setAddress(shippingAddressFromStorage.address);
				setCity(shippingAddressFromStorage.city);
				setPostalCode(shippingAddressFromStorage.postalCode);
				setCountry(shippingAddressFromStorage.country);
			}
		}
	}, [userInfo, history, dispatch, shippingAddress]);

	const submitHandler = (e) => {
		e.preventDefault();

		if (address === '' || city === '' || postalCode === '' || country === '') {
			setMessage('Please Enter All Details');
		} else {
			dispatch(updateShippingAddress({ address, city, postalCode, country }));
			history.push('/payment');
		}
	};
	return (
		<FormContainer>
			<NavigationSteps
				steps={[
					{ name: 'Login', link: '/login' },
					{ name: 'Shipping', link: '/shipping' },
					{ name: 'Payment', link: '/payment' },
					{ name: 'Place Order', link: '/placeorder' },
				]}
				disabledSteps={['Payment', 'Place Order']}
				currentStep='Shipping'
			/>
			<h1 className='text-center'>Shipping Address</h1>

			{error && <Message variant='danger'>{error}</Message>}
			{message && <Message variant='warning'>{message}</Message>}
			{loading ? (
				<Loader />
			) : (
				<Form onSubmit={submitHandler}>
					<Form.Group>
						<Form.Label>Address</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter Address'
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>City</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter City'
							value={city}
							onChange={(e) => setCity(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>Postal Code</Form.Label>
						<Form.Control
							type='number'
							placeholder='Enter Postal Code'
							value={postalCode}
							onChange={(e) => setPostalCode(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>Country</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter Country'
							value={country}
							onChange={(e) => setCountry(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Button type='submit'>Save & Continue</Button>
				</Form>
			)}
		</FormContainer>
	);
};

export default ShippingScreen;
