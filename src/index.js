import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoList from './myredux/testComp/todolist';
const jsx = (
	<div>
		<TodoList />
	</div>
);

ReactDOM.render(jsx, document.getElementById('root'));

