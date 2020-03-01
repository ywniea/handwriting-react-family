import React, { Component } from 'react';
import BrowserRouter from '../BrowserRouter';
import Route from '../Route';
import Switch from '../Switch';
import Redirect from '../Redirect';
import Link from '../Link';
import { Main, ProductList, Login, Settings } from './pages';

export default class RouteTest extends Component {
	render() {
		return (
			<BrowserRouter>
				<Link to="/" >main</Link>
				<Link to="/product" >product</Link>
				<Link to='/login' >login</Link>
				<Link to='/settings' >settings</Link>
				<Switch>
					<Route exact path='/' component={Main} />
					<Route path='/product' component={ProductList} />
					<Route path='/login' component={Login} />
					<Route path='/settings' component={Settings} />
					<Redirect to='/login' />
				</Switch>
			</BrowserRouter>
		);
	}
}

