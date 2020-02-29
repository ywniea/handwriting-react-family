// createStore return a store includes:
// getState()
// dispatch(action)
// subscribe(listener)
// replaceReducer(nextReducer)


// const mystore = createStore(
// 	combineReducers({ num: numReducer }),
// 	// initialState,
// 	applyMiddleware(logger, thunk)
// );

export const ActionTypes = {
	'INIT': '@@redux/INIT'
};

export default function createStore(reducer, initialState, enhancer) {
	if (typeof initialState === 'function' && enhancer === undefined) {
		enhancer = initialState;
		initialState = undefined;
	}

	if (enhancer) {
		return enhancer(createStore)(reducer, initialState);
	}

	let state = initialState;
	let listenerList = [];

	function getState() {
		return state;
	}
	function dispatch(action) {
		state = reducer(state, action);
		listenerList.forEach(listener => listener());
	}

	function subscribe(listener) {
		if (typeof listener === 'function') {
			listenerList.push(listener);

			// return a unsubscribe function
			return function () {
				let index = listenerList.findIndex(listener);
				listenerList.splice(index, 1);
			}
		}
	}

	function replaceReducer(newReducer) {
		if (typeof newReducer === 'function') {
			reducer = newReducer;
			dispatch({ type: ActionTypes.INIT });
		}
	}

	// initialize state
	dispatch({ type: ActionTypes.INIT });

	return {
		getState,
		dispatch,
		subscribe,
		replaceReducer
	};
}