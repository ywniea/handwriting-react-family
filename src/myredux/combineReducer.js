// combineReducer return function like this (state, action) => newState

const combineReducer = (reducers) => (state = {}, action) => {
	let newState = {};
	let reducerKeys = Object.keys(reducers);
	let changed = false;
	reducerKeys.forEach(key => {
		let newStateForKey = reducers[key](state[key], action);
		newState[key] = newStateForKey;
		if (newStateForKey !== state[key]) {
			changed = true;
		}
	});

	if (changed) {
		return newState;
	} else {
		return state;
	}
}

export default combineReducer;