// middleware signature is
// ({ dispatch, getState }) => next => action => { }

const dictionary = {
	E: {
		color: '#2196F3',
		text: 'CHANGED:',
	},
	N: {
		color: '#4CAF50',
		text: 'ADDED:',
	},
	D: {
		color: '#F44336',
		text: 'DELETED:',
	},
	A: {
		color: '#2196F3',
		text: 'ARRAY:',
	},
};

// logger负责将接受到action打印出来
const logger = ({ dispatch, getState }) => next => action => {
	console.log('%c In logger:', `color: ${dictionary.N.color}; font-weight: bold;`);
	let str;
	if (typeof action === 'function') {
		str = action.toString();
	} else {
		str = JSON.stringify(action);
	}
	console.log(`%c ${str}`, `color: ${dictionary.A.color}`);
	return next(action);
}

export default logger;