import React, { Component } from 'react'

export default class List extends Component {
	render() {
		const { list, onToggleDelete } = this.props;
		const newList = list.filter(item => item.show);
		return (
			<div>
				{newList.map(item => {
					return (
						<li
							className={item.isDeleted ? 'delete' : ''}
							key={item.id}
							onClick={onToggleDelete.bind(this, item.id)}>
							{item.todo}
						</li>);
				})}
			</div>
		)
	}
}
