import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './myreact/testComp/index';

// import ReduxTodoList from './myredux/testComp/todolist';
import ReactReduxTodoList from './myreact-redux/testComp/CompWithProvider';
import RouteTest from './myreact-router/testComp/routePage';
// import ErrorBoundary from './mycomponent/errorBoundary';
// import LifeCycle from './mycomponent/lifecycle';
// import Uploader from './mycomponent/uploader';
import LifeCycleEarly from './mycomponent/lifecycle-early'
// import MyTest from './mycomponent/setStateTest';

const jsx = (
	<div>
		{/* <Uploader /> */}
		{/* <ReduxTodoList /> */}
		<ReactReduxTodoList />
		<RouteTest />
		{/* <ErrorBoundary> */}
		{/* <LifeCycle msg='Please click lifecycle' /> */}
		{/* </ErrorBoundary> */}
		{/* <MyTest /> */}
		<LifeCycleEarly />
	</div>
);


ReactDOM.render(jsx, document.getElementById('root'));

