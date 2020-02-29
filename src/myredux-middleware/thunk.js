// middleware signature is
// ({ dispatch, getState }) => next => action => { }

// thunk 可以处理action为函数的情况，会传递dispatch和getState给这个函数
// 当这个函数处理异步问题时，也就可以支持异步了

const thunk = ({ dispatch, getState }) => next => action => {
	if (typeof action === 'function') {
		return action(dispatch, getState);
	}
	return next(action);
}

export default thunk;

