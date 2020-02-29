import React, { Component } from 'react'
import ReactContext from './ReduxContext';

export default class Provider extends Component {
	render() {
		const { children, store } = this.props;
		return (
			<ReactContext.Provider value={store}>
				{children}
			</ReactContext.Provider>
		)
	}
}
