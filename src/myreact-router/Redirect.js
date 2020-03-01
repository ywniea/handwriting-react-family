import { Component } from 'react';
import RouteContext from './RouterContext';
import { createLocation, locationsAreEqual } from 'history';
import generatePath from './utils/generatePath';

export default class Redirect extends Component {
	static contextType = RouteContext;

	componentDidUpdate(prevProps) {
		const method = this.getMethod();
		const location = this.getLocation();
		const prevLocation = createLocation(prevProps.to);

		// 比较两个location是否相同
		const locationEqual = locationsAreEqual(
			prevLocation,
			{ ...location, key: prevLocation.key }
		);

		if (!locationEqual) {
			method(location);
		}
	}

	componentDidMount() {
		const method = this.getMethod();
		const location = this.getLocation();
		method(location);
	}

	getMethod = () => {
		// 根据push来确定跳转的方法
		const { push } = this.props;
		const { history } = this.context;
		if (push === true) {
			return history.push;
		} else {
			return history.replace;
		}
	}

	getLocation = () => {
		const { computedMatch, to } = this.props;
		// 如果并没有由Switch传进来一个computedMatch，那么直接拿to去产生一个location对象
		// 也就是说 Redirect的外层函数如果不是Switch
		// 或者说没有传一个computedMatch，无论怎样都会默认匹配，然后跳转
		return createLocation(
			computedMatch
				? typeof to === 'string'
					? generatePath(to, computedMatch.params)
					: {
						...to,
						pathname: generatePath(to.pathname, computedMatch.params)
					}
				: to
		);
	}

	render() {
		return null;
	}
}
