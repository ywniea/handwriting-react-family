import React, { Component } from 'react';
import BrowserRouter from '../BrowserRouter';
import Route from '../Route';
import Switch from '../Switch';
import Redirect from '../Redirect';
import Link from '../Link';
import { Main, ProductList, Login, Settings } from './pages';


function LoginGuard({ isLogin, component: Comp, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) => {
				return isLogin
					? (<Comp {...props} />)
					: (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />);
			}} />
	);
}

export default class RouteTest extends Component {
	render() {
		return (
			<div style={{ border: '1px solid #e5f5ff' }} >
				<h3>HandWriting react-router</h3>
				<BrowserRouter>
					<Link to="/" >main</Link>
					<Link to="/product" >product</Link>
					<Link to='/login' >login</Link>
					<Link to='/settings' >settings</Link>
					<Switch>
						<Route exact path='/' component={Main} />
						<Route path='/product' component={ProductList} />
						<Route path='/login' component={Login} />
						<LoginGuard path='/settings' component={Settings} isLogin />
						<Redirect to='/login' />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

