import React, { Component } from 'react';

export default class Input extends Component {
	render() {
		const { input, onKeyDown, onChange, onAdd } = this.props;
		return (
			<div>
				<input
					value={input}
					onKeyDown={onKeyDown}
					onChange={onChange} />
				<button onClick={onAdd}>Add</button>
			</div>
		)
	}
}
