import React, { Component } from 'react'

export default class ControlButton extends Component {
	render() {
		const { showAll, showFinished, showUnfinished } = this.props;
		return (
			<div>
				<button onClick={showAll} >Show All</button>
				<button onClick={showFinished}>Show Finished</button>
				<button onClick={showUnfinished}>Show unFinished</button>
			</div>
		)
	}
}
