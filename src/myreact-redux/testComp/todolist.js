import React, { Component } from 'react'
import List from '../../myredux/testComp/list';
import Input from '../../myredux/testComp/input';
import { inputActions, todoListActions } from '../../myredux/testComp/reducers';
import ControlButton from '../../myredux/testComp/controlButton';
import connect from '../connect';

// @connect((state) => {
// 	return {
// 		input: state.input,
// 		list: state.todoList
// 	}
// },
// 	(dispatch) => {
// 		return {
// 			listAdd: (input) => dispatch({ type: todoListActions.ADD, payload: input }),
// 			listToggleDelete: (id) => dispatch({ type: todoListActions.TOGGLEDELETE, payload: id }),
// 			listShowAll: () => dispatch({ type: todoListActions.SHOWALL }),
// 			listShowFinished: () => dispatch({ type: todoListActions.SHOWFINISHED }),
// 			listShowUnfinished: () => dispatch({ type: todoListActions.SHOWUNFINISHED }),
// 			inputUpdate: (input) => dispatch({ type: inputActions.UPDATE, payload: input }),
// 			dispatch
// 		}
// 	}
// )
class TodoList extends Component {
	onKeyDown = (e) => {
		const { input, listAdd, inputUpdate } = this.props;
		if (e.keyCode === 13) {
			// 按下enter键
			e.preventDefault();
			if (input) {
				listAdd(input);
				inputUpdate('');
			}
		}
	}
	onAdd = () => {
		const { input, listAdd, inputUpdate } = this.props;
		console.log(input)
		if (input) {
			listAdd(input);
			inputUpdate('');
		}
	}

	onAsyncAdd = () => {
		const { dispatch, input, listAdd, inputUpdate } = this.props;
		if (input) {
			const timerAdd = () => {
				setTimeout(() => {
					listAdd(input);
					inputUpdate('');
				}, 1500);
			}
			dispatch(timerAdd);
		}
	}

	onChange = (e) => {
		e.preventDefault();
		const { inputUpdate } = this.props;
		inputUpdate(e.target.value);
	}
	onToggleDelete = (id) => {
		const { listToggleDelete } = this.props;
		listToggleDelete(id);
	}
	render() {
		// get state from props
		const { input, list } = this.props;
		// get dispatch from props
		const { listShowAll, listShowFinished, listShowUnfinished } = this.props;

		return (
			<div>
				<h3>Handwriting react-redux</h3>
				Todo list
				<Input
					input={input}
					onKeyDown={this.onKeyDown}
					onChange={this.onChange}
					onAdd={this.onAdd}
					onAsyncAdd={this.onAsyncAdd} />
				<ControlButton
					showAll={listShowAll}
					showFinished={listShowFinished}
					showUnfinished={listShowUnfinished}
				/>
				<List list={list}
					onToggleDelete={this.onToggleDelete} />
			</div>
		)
	}
}

export default connect((state) => {
	return {
		input: state.input,
		list: state.todoList
	}
},
	(dispatch) => {
		return {
			listAdd: (input) => dispatch({ type: todoListActions.ADD, payload: input }),
			listToggleDelete: (id) => dispatch({ type: todoListActions.TOGGLEDELETE, payload: id }),
			listShowAll: () => dispatch({ type: todoListActions.SHOWALL }),
			listShowFinished: () => dispatch({ type: todoListActions.SHOWFINISHED }),
			listShowUnfinished: () => dispatch({ type: todoListActions.SHOWUNFINISHED }),
			inputUpdate: (input) => dispatch({ type: inputActions.UPDATE, payload: input }),
			dispatch
		}
	})(TodoList);