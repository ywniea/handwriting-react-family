import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './myreact/testComp/index';

// import ReduxTodoList from './myredux/testComp/todolist';
import ReactReduxTodoList from './myreact-redux/testComp/CompWithProvider';
import RouteTest from './myreact-router/testComp/routePage';
// import ErrorBoundary from './mycomponent/errorBoundary';
// import LifeCycle from './mycomponent/lifecycle'

const jsx = (
	<div>
		{/* <ReduxTodoList /> */}
		<ReactReduxTodoList />
		<RouteTest />
		{/* <ErrorBoundary> */}
		{/* <LifeCycle msg='Please click lifecycle' /> */}
		{/* </ErrorBoundary> */}
	</div>
);


ReactDOM.render(jsx, document.getElementById('root'));

