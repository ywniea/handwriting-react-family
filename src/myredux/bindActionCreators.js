// bindActionCreators return (param) => dispatch(actionCreator(param))
// actionCreators can take some params, then return action

export default function bindActionCreators(actionCreators, dispatch) {
	let dispatchActionFuncs = {};
	Object.keys(actionCreators).forEach(key => {
		dispatchActionFuncs[key] = (param) => dispatch(actionCreators[key](param));
	});
	return dispatchActionFuncs;
}