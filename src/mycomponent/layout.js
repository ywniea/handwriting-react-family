import React, { Component, useEffect } from 'react'
import BrowserRouter from '../myreact-router/BrowserRouter';
import Route from '../myreact-router/Route';
import Switch from '../myreact-router/Switch';
import Link from '../myreact-router/Link';

// import ReduxTodoList from './myredux/testComp/todolist';
import ReactReduxTodoList from '../myreact-redux/testComp/CompWithProvider';
import RouteTest from '../myreact-router/testComp/routePage';
// import ErrorBoundary from './errorBoundary';
// import LifeCycle from './lifecycle';
// import Uploader from './uploader';
import LifeCycleEarly from './lifecycle-early'
import SetStateTest from './setStateTest';
// import Parent from './mountOrder';
// import HookExample from './useHooks';
import HookContainer from '../hooks/useEffect'
import myReact from '../myreact/testComp/index';



function ContainerForReact() {
	useEffect(() => {
		const { jsx, render } = myReact;
		render(jsx, document.getElementById('my-root'));
	});

	return (
		<div id="my-root" />
	)
}


export default class Layout extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="container">
					<nav className="nav">
						<Link to="/" >main</Link>
						<Link to="/react" >handwriting react</Link>
						<Link to="/todolist" >todo list for react redux</Link>
						<Link to="/routedom" >react route dom</Link>
						<Link to="/reacthooks" >react hooks</Link>
						<Link to="/lifecycle" >react early lifecycle</Link>
						<Link to="/setState" >react setState</Link>
					</nav>
					<main className="main">
						<Switch>
							<Route exact path='/' component={() => <h2>welcome!</h2>} />
							<Route exact path='/react' component={ContainerForReact} />
							<Route exact path='/todolist' component={ReactReduxTodoList} />
							<Route exact path='/routedom' component={RouteTest} />
							<Route exact path='/reacthooks' component={HookContainer} />
							<Route exact path='/lifecycle' component={LifeCycleEarly} />
							<Route exact path='/setState' component={SetStateTest} />
						</Switch>
					</main>
				</div>
			</BrowserRouter>
		)
	}
}
