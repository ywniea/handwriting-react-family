import React, { Component } from 'react'

export default class ReactEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false
		}
	}
	componentDidMount() {
		document.body.addEventListener('click', this.handleHide, false)
	}
	handleShow = () => {
		this.setState({ active: true });
	}
	handleHide = () => {
		this.setState({ active: false });
	}

	render() {
		return (
			<div>
				<button onClick={this.handleShow}>show pic</button>
				<div
					id='image'
					style={{ display: this.state.active ? 'block' : 'none' }} >
					<section style={{
						width: '50px',
						height: '50px',
						background: 'green'
					}} >Assume this is pic</section>
				</div>
			</div>

		)
	}
}
