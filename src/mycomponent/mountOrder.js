import React, { Component } from 'react'

export default class Parent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 0
		}
	}
	componentWillUpdate() {
		console.log('%c Parent componentWillUpdate', 'color: #2196F3; font-weight: bold;')
	}
	componentDidUpdate() {
		console.log('%c Parent componentDidUpdate', 'color: #2196F3; font-weight: bold;')
	}
	handleClick = () => {
		this.setState({
			num: 10
		})
	}
	render() {
		console.log('parent render')
		return (
			<div>
				<button onClick={this.handleClick} >click to update</button>
				parent
				<Child num={this.state.num} />
			</div>
		)
	}
}

class Child extends Component {
	componentWillUpdate() {
		console.log('%c Child componentWillUpdate', 'color: #2196F3; font-weight: bold;')
	}
	componentDidUpdate() {
		console.log('%c Child componentDidUpdate', 'color: #2196F3; font-weight: bold;')
	}
	render() {
		console.log('child render')

		return (
			<div>
				child: {this.props.num}
			</div>
		)
	}
}