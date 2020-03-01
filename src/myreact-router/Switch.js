import React, { Component } from 'react';
import RouterContext from './RouterContext';
import { matchPath } from './utils/match';

export default class Switch extends Component {
	render() {
		return (
			<RouterContext.Consumer>
				{
					context => {
						// Switch 可以接受一个location属性，来代替外面传过来的context.location
						const location = this.props.location || context.location;
						let element, match;
						React.Children.forEach(this.props.children, child => {
							if (!match && React.isValidElement(child)) {
								element = child;
								// Redirect or Route
								const path = child.props.from || child.props.path;
								match = matchPath(location.pathname, { ...child.props, path });
							}
						});
						return match
							? React.cloneElement(element, { location, computedMatch: match })
							: null;
					}
				}
			</RouterContext.Consumer>
		)
	}
}
