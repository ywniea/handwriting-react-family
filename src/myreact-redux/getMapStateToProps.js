export default function getStateToProps(mapStateToProps) {
	if (mapStateToProps === null || mapStateToProps === undefined) {
		return () => ({});
	}
	if (typeof mapStateToProps === 'function') {
		return mapStateToProps;
	}
}