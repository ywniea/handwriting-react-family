// react-router/packages/react-router/modules/Router.js

import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import RouterContext from './RouterContext';

export default class BrowserRouter extends Component {

	// computeRootMatch初始化match
	static computeRootMatch(pathname) {
		return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
	}
	constructor(props) {
		super(props);

		// 创建history对象
		this.history = createBrowserHistory(this.props);

		// 初始化state中的location
		this.state = {
			location: this.history.location
		}

		// 注册监听器，监听地址变化
		this.unlisten = this.history.listen(location => {
			this.setState({ location });
		})
	}

	componentWillUnmount() {
		if (typeof this.unlisten === 'function') {
			this.unlisten();
		}
	}

	render() {
		const { children } = this.props;
		return (
			<RouterContext.Provider
				children={children}
				value={{
					history: this.history,
					location: this.state.location,
					match: BrowserRouter.computeRootMatch(this.state.location.pathname)
				}}
			/>
		)
	}
}


