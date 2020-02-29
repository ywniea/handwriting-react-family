
export const todoListActions = {
	ADD: 'ADD',
	TOGGLEDELETE: 'TOGGLEDELETE',
	SHOWALL: 'SHOWALL',
	SHOWUNFINISHED: 'SHOWUNFINISHED',
	SHOWFINISHED: 'SHOWFINISHED'
}

const initTodoList = [];
let id = 0;
export function todoList(state = initTodoList, action) {
	let newState;
	switch (action.type) {
		case todoListActions.ADD:
			return [...state, { id: id++, todo: action.payload, isDeleted: false, show: true }];
		case todoListActions.TOGGLEDELETE:
			newState = state.map(item =>
				item.id === action.payload
					? { ...item, isDeleted: !item.isDeleted }
					: item);
			return [...newState];
		case todoListActions.SHOWALL:
			newState = state.map(item => ({ ...item, show: true }));
			return newState;
		case todoListActions.SHOWFINISHED:
			newState = state.map(item => ({ ...item, show: item.isDeleted ? true : false }));
			return newState;
		case todoListActions.SHOWUNFINISHED:
			newState = state.map(item => ({ ...item, show: item.isDeleted ? false : true }));
			return newState;
		default:
			return state;
	}
}


export const inputActions = {
	UPDATE: 'UPDATE',
}
const initInput = '';
export function input(state = initInput, action) {
	switch (action.type) {
		case inputActions.UPDATE:
			return action.payload;
		default:
			return state;
	}
}
