import bindActionCreators from "../myredux/bindActionCreators";

export default function getMapDispatchToProps(mapDispatchToProps) {
	if (mapDispatchToProps === undefined || mapDispatchToProps === null) {
		return (dispatch) => ({ dispatch });
	}
	if (typeof mapDispatchToProps === 'object') {
		return (dispatch) => bindActionCreators(mapDispatchToProps, dispatch);
	}
	if (typeof mapDispatchToProps === 'function') {
		return mapDispatchToProps;
	}
}
