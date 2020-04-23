import React from '..';
import { render } from '../ReactDOM';

class Message extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			msgs: []
		}
	}

	handleButtonClick = () => {
		console.log('handle button click')
		const { msgs } = this.state;
		msgs.push(`This is message ${msgs.length}`);
		this.setState({ msgs: [...msgs] });
		console.log(this.state.msgs);
	}

	render() {
		const { msgs } = this.state;
		const { message } = this.props;
		return (
			<div style={{ color: 'orange' }} onClick={() => { console.log('div') }} >
				<Title num={this.state.msgs.length} />
				message is {message}
				<button onClick={this.handleButtonClick} >
					Add message
				</button>
				{msgs.map(item => (<h3>{item}</h3>))}
			</div >);
	}
}

class Title extends React.Component {
	render() {
		return (
			<section style={{ color: 'lightblue' }} >
				<h1> message number is: {this.props.num}</h1>
			</section >
		);
	}
}

function FuncComp(props) {
	return (
		<h3>{props.title}</h3>
	);
}


const jsx = (
	<section>
		<FuncComp title='Handwriting react' />
		<p style={{ color: 'green' }} pp='123qq' >a child</p>
		<Message style={{ color: 'red' }} message='Something from parent' />
	</section>
);

const div = document.createElement('div');
div.setAttribute('id', 'for-react');
div.setAttribute('style', 'border: 1px solid #ffffe5');

let container = document.getElementById('my-root')
container.appendChild(div);

render(jsx, document.getElementById('for-react'));

