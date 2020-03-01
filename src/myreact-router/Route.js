import React, { Component } from 'react';
import RouterContext from './RouterContext';
import { matchPath } from './utils/match';

export default class Route extends Component {
	render() {
		return (
			<RouterContext.Consumer>
				{context => {
					// location 首选Switch从this.props.location传过来的，如果没有则从context中拿
					const location = this.props.location || context.location;
					// computedMatch如果有的话，是从Switch中传过来的
					const { component, render, children, computedMatch } = this.props;
					const match = computedMatch
						? computedMatch // 首选来自 switch的
						: this.props.path
							? matchPath(location.pathname, this.props) // 其次就自己计算match
							: context.match; // 最后就是来自context，可能来自BrowserRouter或者是上层Router之类的Provider

					const props = { ...context, location, match };
					let ret;

					// children, component, render三选一，或者返回null
					ret = props.match
						? children
							? typeof children === 'function'
								? children(props)
								: children
							: component
								? React.createElement(component, props)
								: render
									? render(props)
									: null
						: typeof children === 'function'
							? children(props)
							: null;

					// Route会作为Provider提供自己计算出来的match和location
					return (
						<RouterContext.Provider value={props}>
							{ret}
						</RouterContext.Provider>
					);
				}}
			</RouterContext.Consumer>
		);
	}
}
