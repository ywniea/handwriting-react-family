import React, { Component } from 'react';
import RouterContext from './RouterContext';

export default class Link extends Component {
	handleClick = (event, history) => {
		event.preventDefault();
		const { to } = this.props;
		history.push(to);
	}
	render() {
		return (
			<RouterContext.Consumer>
				{context => {
					const { children, to, ...rest } = this.props;
					const { history } = context;
					return (
						<div>
							<a
								{...rest}
								onClick={(event) => this.handleClick(event, history)} href={to} >
								{children}
							</a>
						</div>
					);
				}}
			</RouterContext.Consumer>
		)
	}
}
