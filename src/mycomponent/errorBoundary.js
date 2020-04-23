import React, { Component } from 'react'

export default class ErrorBoundary extends Component {

	constructor(props) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null,
		}
	}

	// static getDerivedStateFromError(error, b, c) {
	// 	console.log('getDerivedStateFromError', error, b, c)
	// 	return { hasError: true, error };
	// }

	componentDidCatch(error, errorInfo) {
		// console.log('componentDidCatch', error, errorInfo)
		this.setState({
			error,
			errorInfo
		})
	}

	render() {
		if (this.state.errorInfo) {
			return (
				<div>
					<h2>Something went wrong.</h2>
					<details style={{ whiteSpace: 'pre-wrap' }} >
						{this.state.error}
						<br />
						{this.state.errorInfo}
					</details>
				</div>
			)
		}
		return this.props.children;
	}
}
