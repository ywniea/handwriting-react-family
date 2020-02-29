// middleware signature is
// ({ dispatch, getState }) => next => action => { }

// enhancer = applyMiddleware(logger, thunk)
// 因此enhancer的函数签名是
// (createStore) => (reducer, initialState, enhancer) => {}

// applyMiddleware接受一系列middleware，返回一个enhancer，
// 在createStore的时候如果发现传了一个enhancer，
// 就用enhancer重新创建一个增强了dispatch的store返回

import compose from './compose';

const applyMiddleware = (...middlewares) =>
	(createStore) => (reducer, initialState, enhancer) => {
		let store = createStore(reducer, initialState, enhancer);
		let { getState, dispatch } = store;

		// middlewareAIP中的dispatch会发生变化，此时是createStore返回回来的原生dispatch
		const middlewareAIP = {
			getState,
			dispatch: (action) => dispatch(action)
		}

		// 接下来要用middleware来增强dispatch
		let middlewareList = middlewares.map(middleware => middleware(middlewareAIP));
		// middlewareList 是[(next) => (action) => {}]
		dispatch = compose(...middlewareList)(dispatch);

		// 此时，dispatch已经被增强过了，
		// 同时middlewareAIP中的dispatch函数调用的那个dispatch也是增强过的！


		// 用增强过的dispatch来代替store中的dispatch
		return {
			...store,
			dispatch
		}
	}

export default applyMiddleware;
