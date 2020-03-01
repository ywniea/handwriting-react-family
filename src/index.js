import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// import ReduxTodoList from './myredux/testComp/todolist';
// import ReactReduxTodoList from './myreact-redux/testComp/CompWithProvider';
import RouteTest from './myreact-router/testComp/routePage';

const jsx = (
	<div>
		{/* <ReduxTodoList /> */}
		{/* <ReactReduxTodoList /> */}
		<RouteTest />
	</div>
);

ReactDOM.render(jsx, document.getElementById('root'));

