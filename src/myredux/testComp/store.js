import crateStore from '../crateStore';
import applyMiddleware from '../applyMiddleware';
import logger from '../../myredux-middleware/logger';
import thunk from '../../myredux-middleware/thunk';
import { todoList, input } from './reducers';
import combineReducer from '../combineReducer';


const store = crateStore(
	combineReducer({ todoList, input }),
	// initState,
	applyMiddleware(logger, thunk)
);

export default store;

