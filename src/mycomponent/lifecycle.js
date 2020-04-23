import React, { Component } from 'react';
import Axios from 'axios';

export default class LifeCycle extends Component {
	constructor(props) {
		super(props);
		console.log('constructor')
		this.state = {
			num: 0
		}
	}

	static getDerivedStateFromProps(props, state) {
		console.log('getDerivedStateFromProps', props, state)

		// Axios.get('http://localhost:4000/name')
		// 	.then((res) => {
		// 		console.log('get name: ', res)
		// 	})

		return { num: 100 };
		// return null;
	}

	shouldComponentUpdate() {
		console.log('shouldComponentUpdate')
		return true;
	}

	componentDidUpdate() {
		console.log('componentDidUpdate')
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		console.log('getSnapshotBeforeUpdate', prevProps, prevState)

		// return null;
		return { num: 200 }
	}

	handleClick = () => {
		console.log('button click!')
		this.setState({
			num: this.state.num + 1
		});
	}

	error = () => {
		throw new Error('Error: hello world!')
	}

	componentDidMount() {
		const div = document.getElementById('div');
		const section = document.getElementById('sect');
		const button = document.getElementById('btn');

		// div.addEventListener('click', (event) => { console.log('div', event.currentTarget, event.target) }, false);
		// section.addEventListener('click', (event) => { console.log('section', event.currentTarget, event.target) }, false);
		// button.addEventListener('click', (event) => { console.log('button', event.currentTarget, event.target) }, false);
	}

	render() {
		if (this.state.num === 5) {
			// Simulate a JS error
			throw new Error('I crashed!');
		}

		console.log('render')

		return (
			<div id='div'>
				<section id='sect' >
					<button id='btn' >test</button>
				</section>
				life cycle: {this.state.num}
				<button onClick={this.handleClick} >click me!</button>
				<button onClick={this.error} >Error!</button>
			</div>
		);
	}
}
