import Component from './Component';

// TODO

// ------1------
// MyClass.contextType = MyContext;
// let value = this.context;

// -----------2------------
// <MyContext.Provider value={}/>
// <MyContext.Consumer > {value => /**/ } </>

class Provider extends Component {

}

class Consumer extends Component {

}

class ReactContext {
	constructor(defaultValue) {
		this.value = defaultValue;
	}
	static Provider = new Provider(this.value);
	static Consumer = new Consumer(this.value);
}

export function createContext(defaultValue) {
	return ReactContext(defaultValue);
}