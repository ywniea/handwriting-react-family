import React, { Component } from 'react'
import ReactDOM from 'react-dom';

// string ref
class Comp extends Component {
	render() {
		return (
			<div> textInComponent </div>
		);
	}
}
class StringRef extends Component {
	componentDidMount() {
		// myComp 是 Comp 的一个实例，因此需要用 findDOMNode 转换为相应的 DOM 
		const myComp = this.refs.myComp;
		const comp = ReactDOM.findDOMNode(myComp);
		console.log('string refs: ', comp)
	}
	render() {
		return (
			<div>
				<Comp ref="myComp" />
			</div>);
	}
}

// React.forwardRef 和 React.createRef();
const FancyButton = React.forwardRef((props, ref) => (
	<button ref={ref} className="FancyButton" id="mybutton">
		{props.children}
	</button>
));

export default class MyRefs extends Component {
	constructor(props) {
		super(props);
		// 你可以直接获取 DOM button 的 ref：
		this.aButtonRef = React.createRef();
	}
	componentDidMount() {
		console.log('React.createRef: ', this.aButtonRef)
	}
	callbackRef = (ref) => {
		this.cbRef = ref;
		console.log('callbackRef: ', this.cbRef)
	}

	render() {
		return (
			<div>
				<FancyButton ref={this.aButtonRef}>Click me!</FancyButton>;
				<button ref={this.callbackRef}>callback ref</button>
				<StringRef />
			</div>
		)
	}
}


