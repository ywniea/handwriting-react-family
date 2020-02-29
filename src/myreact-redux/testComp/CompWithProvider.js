import React, { Component } from 'react'
import store from '../../myredux/testComp/store';
import Provider from '../Provider';
import TodoList from './todolist';

export default class CompWithProvider extends Component {
	render() {
		return (
			<Provider store={store}>
				<TodoList />
			</Provider>
		)
	}
}
