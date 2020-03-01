import React from 'react';
import Route from '../Route';
import Link from '../Link';


export function Main() {
	return (
		<div>
			Main Page
		</div>
	)
}

export function Login() {
	return (
		<div>
			Login Page
		</div>
	)
}

export function Settings() {
	return (
		<div>
			Settings Page
		</div>
	)
}

export function ProductList() {
	return (
		<div>
			ProductList Page
			<Link to="/product/books" >books</Link>
			<Route path='/product/books' component={Books} />
		</div>
	)
}

export function Books() {
	return (
		<div>
			Books Page
		</div>
	)
}
