
import React, { useState, useEffect, useReducer, useContext } from 'react';
const FRUIT_TYPE = {
	ADD: 'ADD',
	DELETE: 'DELETE',
	INIT: 'INIT'
};

const ContextFruit = React.createContext();

function fruitReducer(state = [], action) {
	switch (action.type) {
		case FRUIT_TYPE.INIT:
			return [...action.payload];
		case FRUIT_TYPE.ADD:
			return [...state, action.payload];
		case FRUIT_TYPE.DELETE:
			return [...state.filter(item => item !== action.payload)];
		default:
			return [...state];
	}
}

function AddFruit(props) {
	const [newAdd, setNewAdd] = useState('');
	return (
		<div>
			<input type="text"
				value={newAdd}
				onChange={(event) => setNewAdd(event.target.value)} />
			<button
				onClick={() => {
					props.onAddFruit({
						type: FRUIT_TYPE.ADD, payload: newAdd
					});
					setNewAdd('');
				}} >
				AddFruit
			</button>
		</div>
	);
}

function DeleteFruit() {
	const setFruits = useContext(ContextFruit);
	const [Delete, setDelete] = useState('');
	return (
		<div>
			<input type="text" value={Delete} onChange={(event) => setDelete(event.target.value)} />
			<button onClick={() => {
				setFruits({ type: FRUIT_TYPE.DELETE, payload: Delete });
				setDelete('');
			}} >
				Delete this fruit
			</button>
		</div >
	);
}


export default function HookExample() {
	const [fruit, setFruit] = useState('');
	const [fruits, setFruits] = useReducer(fruitReducer, []);

	useEffect(() => {
		// or other ajax from backend and DB
		// or do something with DOM
		setTimeout(() => {
			setFruits({ type: FRUIT_TYPE.INIT, payload: ['apple'] });
		}, 500);
	}, []);

	return (
		<ContextFruit.Provider value={setFruits} >
			<div>
				<AddFruit onAddFruit={setFruits} />

				<DeleteFruit />
				Please choose your favourite fruit: {fruit}

				<ul>
					{fruits.map((item) =>
						< li key={item} onClick={() => setFruit(item)} > {item} </li>
					)}
				</ul>
			</div >
		</ContextFruit.Provider>

	);
}



