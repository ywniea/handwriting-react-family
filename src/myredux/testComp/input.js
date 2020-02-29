import React, { Component } from 'react';

export default class Input extends Component {
	render() {
		const { input, onKeyDown, onChange, onAdd, onAsyncAdd } = this.props;
		return (
			<div>
				<input
					value={input}
					onKeyDown={onKeyDown}
					onChange={onChange} />
				<button onClick={onAdd}>Add</button>
				<button onClick={onAsyncAdd} >Async Add</button>
			</div>
		)
	}
}
