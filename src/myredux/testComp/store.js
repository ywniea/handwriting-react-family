import crateStore from '../crateStore';
import applyMiddleware from '../applyMiddleware';
import logger from '../../myredux-middleware/logger';
import thunk from '../../myredux-middleware/thunk';
import { todoList, input } from './reducers';
import combineReducer from '../combineReducer';
import compose from '../compose';

// use redux-devtools-extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = crateStore(
	combineReducer({ todoList, input }),
	// initState,
	composeEnhancers(applyMiddleware(logger, thunk))
);

export default store;

