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
			<Link to="/product/pens" >pens</Link>
			<Link to="/product/erasers" >erasers</Link>

			<Route path='/product/books' component={Books} />
			<Route path='/product/pens' component={Pens} />
			<Route path='/product/erasers' component={Erasers} />

		</div>
	)
}

export function Books() {
	return (
		<div>
			There are many Books!
		</div>
	)
}
export function Pens() {
	return (
		<div>
			There are many Pens!
		</div>
	)
}
export function Erasers() {
	return (
		<div>
			There are many Erasers!
		</div>
	)
}
