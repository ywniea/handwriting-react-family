import React, { Component } from 'react'

export default class MyTest extends Component {
	constructor(props) {
		super(props);
		this.state = { val: 0 };
	}
	componentDidMount() {
		this.setState({ val: this.state.val + 1 });
		console.log(this.state.val);    // 第 1 次 log

		this.setState({ val: this.state.val + 1 });
		console.log(this.state.val);    // 第 2 次 log

		setTimeout(() => {
			this.setState({ val: this.state.val + 1 });
			console.log(this.state.val);  // 第 3 次 log

			this.setState({ val: this.state.val + 1 });
			console.log(this.state.val);  // 第 4 次 log
		}, 0);
	}
	tosetState = () => {
		// setState异步更新
		this.setState({ name: 'xiaoming' }, () => {
			console.log('in setState callback', this.state)
		})
		console.log(this.state)
	}

	render() {
		return (
			<div>
				{JSON.stringify(this.state, null, 2)}
				<br />
				<button onClick={this.tosetState}>click to setstate</button>
			</div>
		)
	}
}
