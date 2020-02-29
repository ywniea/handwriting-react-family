import React, { Component } from 'react'
import List from './list';
import Input from './input';
import store from './store';
import { inputActions, todoListActions } from './reducers';
import ControlButton from './controlButton';

export default class TodoList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input: store.getState().input,
			list: store.getState().todoList,
		}
		console.log(store.getState())
	}
	componentDidMount() {
		this.unsubscribeInput = store.subscribe(this.getInput);
		this.unsubscribeList = store.subscribe(this.getList);
	}
	componentWillUnmount() {
		if (typeof this.unsubscribeInput === 'function') {
			this.unsubscribeInput();
		}
		if (typeof this.unsubscribeList === 'function') {
			this.unsubscribeList();
		}
	}
	getInput = () => {
		this.setState({ input: store.getState().input });
	}
	getList = () => {
		this.setState({ list: store.getState().todoList });
	}

	onKeyDown = (e) => {
		const { dispatch } = store;
		const { input } = this.state;
		if (e.keyCode === 13) {
			// 按下enter键
			e.preventDefault();
			dispatch({ type: todoListActions.ADD, payload: input });
			dispatch({ type: inputActions.UPDATE, payload: '' });
		}
	}
	onAdd = () => {
		const { dispatch } = store;
		const { input } = this.state;
		console.log(input)
		if (input) {
			dispatch({ type: todoListActions.ADD, payload: input });
			dispatch({ type: inputActions.UPDATE, payload: '' });
		}
	}
	onChange = (e) => {
		e.preventDefault();
		const { dispatch } = store;
		dispatch({ type: inputActions.UPDATE, payload: e.target.value });
	}
	onToggleDelete = (id) => {
		const { dispatch } = store;
		dispatch({ type: todoListActions.TOGGLEDELETE, payload: id });
	}
	showAll = () => {
		const { dispatch } = store;
		dispatch({ type: todoListActions.SHOWALL });
	}

	showFinished = () => {
		const { dispatch } = store;
		dispatch({ type: todoListActions.SHOWFINISHED });
	}
	showUnfinished = () => {
		const { dispatch } = store;
		dispatch({ type: todoListActions.SHOWUNFINISHED });
	}
	render() {
		const { input, list } = this.state;
		return (
			<div>
				<h3>Handwriting redux - my todolist</h3>
				<Input
					input={input}
					onKeyDown={this.onKeyDown}
					onChange={this.onChange}
					onAdd={this.onAdd} />
				<ControlButton
					showAll={this.showAll}
					showFinished={this.showFinished}
					showUnfinished={this.showUnfinished}
				/>
				<List list={list}
					onToggleDelete={this.onToggleDelete} />
			</div>
		)
	}
}
