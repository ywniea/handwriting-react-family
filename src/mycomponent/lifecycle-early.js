import React, { Component } from 'react'

class LifeCycleEarly extends Component {
	static propTypes = {};
	static defaultProps = {};

	// initialize
	constructor(prop) {
		super(prop);
		this.state = {
			name: 'Tom'
		}
		console.log('%c constructor', 'color: #2196F3; font-weight: bold;')
	}
	componentWillMount() {
		console.log('%c componentWillMount', 'color: #2196F3; font-weight: bold;')
	}
	componentDidMount() {
		console.log('%c componentDidMount', 'color: #2196F3; font-weight: bold;')
	}

	// update
	componentWillReceiveProps() {
		console.log('%c componentWillReceiveProps', 'color: #2196F3; font-weight: bold;')
	}
	shouldComponentUpdate() {
		console.log('%c shouldComponentUpdate', 'color: #2196F3; font-weight: bold;')
		return true;
	}
	componentWillUpdate() {
		console.log('%c componentWillUpdate', 'color: #2196F3; font-weight: bold;')
	}
	componentDidUpdate() {
		console.log('%c componentDidUpdate', 'color: #2196F3; font-weight: bold;')
	}

	handleClick = () => {
		this.setState({ name: 'Linda' })
	}

	// unmount
	componentWillUnmount() {
		console.log('componentWillUnmount')
	}

	render() {
		console.log('%c render', 'color: #2196F3; font-weight: bold;')
		return (
			<div>
				LifeCycleEarly
				Name is {this.state.name}.
				<button onClick={this.handleClick}>click to change new a state</button>
			</div>
		)
	}
}


export default class Parent extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			title: 'Title'
		}
	}
	handleClick = () => {
		this.setState({ title: 'New Title: ' + Math.random() })
	}

	render() {
		return (
			<div>
				<LifeCycleEarly title={this.state.title} />
				<button onClick={this.handleClick}>click me to send new props</button>
			</div>
		);
	}
}

