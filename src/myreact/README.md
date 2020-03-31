# React

这是一个简单版本的React，涉及到更新队列updateQueue, 更新器Updater，事件系统，Component的初始化、更新以及diff算法。

![React The Big Picture](./images/ReactTheBigPicture.jpg)

## React.createElement

JSX是一个Javascript的语法扩展。我们在react中使用JSX时，每个 JSX 元素都是调用 React.createElement()来生成 virtual-node。
后面简称vnode。

一般不会手动调用React.createElement，react会在解析JSX时自动帮我们调用这个函数。

```js
React.createElement(
  type,
  [props],
  [...children]
)
```

生成的vnode的结构是:

```js
let vnode = {
	vtype: vtype, // 用来区分原生html元素、class组件、function组件
	type: type, // 具体的html元素类型或class或function
	props: props,
	refs: refs,
	key: key,
	ref: ref,
	uid: 2  
}
```

可以看出来vnode只是一个js对象，props中存放了父组件传进来的数据和children。之后在更新页面的时候对vnode进行diff操作就是比较新老vnode的数据是否一致。

## ReactDOM.render

```js
ReactDOM.render(vnode, container, callback)
```
将React.createElement产生的vnode转换成真正的DOM元素，作为child添加到container上。

![ReactDOM.render](./images/ReactDOM.render-init.jpg)

## component.forceUpdate

diff算法: compareTwoVnodes

![component.forceUpdate](./images/component.forceUpdate.jpg)

## setState批量合并和callback函数

setState 有多种函数签名。setState对state的更新有可能是批量进行的。

```js
// setState(object)
this.setState({num: 2});

// setState(object, callback)
this.setState({num: 3}, ()=> {console.log(this.state.num)});

// setState(() => {return stateObj})
this.setState((state, props)=>{return {num: state.num + 5}});

// setState([stateObj])
this.setState([{counter: 1}]);

```

setState会将传入的nextState和callback函数放到等到更新的队列中。

```js
setState(nextState, callback) {
	this.$updater.addCallback(callback); // 加入到 pendingCallbacks 队列中
	this.$updater.addState(nextState);  // 加入到 pendingStates 队列中
}
```

pendingStates 中存放的是传入到setState的第一个参数，pendingStates是等带更新的state的队列。

```js
if (pendingStates.length > 0) {
	state = { ...state };
	pendingStates.forEach(nextState => {
		let isReplace = _.isArr(nextState);
		if (isReplace) {
			nextState = nextState[0];
		}
		if (_.isFn(nextState)) {
			// 这里说明如果传进来nextState是个函数，那么可以在批量更新过程中拿到当前最新的state的值
			nextState = nextState(instance, state, props);
		}
		if (isReplace) {
			state = { ...nextState };
		} else {
			state = { ...state, ...nextState };
		}
	});
	// 清空pendingStates
	pendingStates = [];
}
```

在state批量更新之后，pendingCallbacks 队列中的callback函数才会被依次执行。

## 事件系统

React 中的事件系统并不是直接对元素添加当前注册的listener。而是将当前注册的listener放到 eventStore 中。

```js
// 例如 eventType = 'onClick'
function addEvent(element, eventType, listener){
	
	const eventStore = element.eventStore || (element.eventStore = {});
	eventStore[eventType] = listener;

	// ...

  // 将 dispatchEvent 注册到 document 上面，冒泡阶段触发
	document.addEventListener(eventType.substr(2), dispatchEvent, false);
}

```

由于document是最外面的一层对象，还是在冒泡阶段触发，所有只会执行一个dispatchEvent，不会有其他的副作用。
dispatchEvent是这样的：

```js
function dispatchEvent(event){
	let { target, type } = event;

	// 事件执行期间不会进行组件update操作
	updateQueue.isPending = true;

	// 模仿事件冒泡 从target 一直到最外层，依次检测有没有添加相应的事件
	while (target) {
		let { eventStore } = target;
		let listener = eventStore && eventStore[eventType];
		if (!listener) {
			target = target.parentNode;
			continue;
		}

		listener.call(target, syntheticEvent);
		target = target.parentNode;
	}

	// 打开开关，期间有pending等待update的组件可以更新啦 
	updateQueue.isPending = false;
	updateQueue.batchUpdate();
}

```
假设是这个例子:

```jsx
<div onClick={() => {console.log('div')}}>
	<section onClick={() => {console.log('section')}}>
		<button onClick={() => {console.log('button')}}> click me! </button>
	</section>
</div>
```

点击button之后，由于事件是注册到 document 上面的，最初`event.currentTarget`是 document 对象，`event.target`是被点击的button。

那么从button开始，依次去eventStore里面找有没有对应的onClick函数，如果有就执行。
结果就是依次显示

```
button
section
div
```

## React.createContext

// TODO

```js
let myContext = React.createContext(defaultValue);
```

## 其他

关于vnode到真实dom元素的转换细节。
通过createElement生成最初的vNode数据结构是这样的：

```js
let vnode = {
	vtype: vtype, // 用来区分原生html元素、class组件、function组件
	type: type, // 具体的html元素类型或class或function
	props: props, // 包括children、style、onClick等等在内的各种属性 
	refs: refs,
	key: key,
	ref: ref,
	uid: 2  
}
```
我们根据其vtype来分情况生成真实的dom元素。
### 当vtype是一个class类型时，例如`class Message{}`
vcomponent就是上面说的vnode

|vcomponent| component = new Message(props)| vnode = component.render() | 真正的dom元素 node=initVnode(vnode) |
| --- | --- | --- | --- |
| vtype=VCOMPONENT | `component.$cache: ` `$cache.vnode=vnode` `$cache.node=node` |  |`node.cache: ` `cache[uid]=component`  |
| type= class Message | $updater |  |  |
| props | props=vcomponent.props |  |
| uid |  |  |  |
| key |  |  |  |
| ref |  |  |  |

props中的style、onClick等等不会真的起作用，他们会被当做从父组件传进来的props。

### 当vtype是一个function类型时，例如`function Title(){}`
vstateless就是上面的vnode

| vstateless | vnode = Title(props) | 真实的dom元素 node=initVnode(vnode) |
| --- | --- | --- |
| vtype=VSTATELESS |  | `node.cache[uid]=vnode` |
| type=function Title |  |  |
| props |  |  |
| uid |  |  |  |
| key |  |  |  |
| ref |  |  |  |

props中的style、onClick等等不会真的起作用，他们会被当做从父组件传进来的props。

### 当vtype是一个html元素时，例如`div`
velement就是上面的vnode

| velement | 真实的dom元素 node=document.createElement('div') | 
| --- | --- |
| vtype=VELEMENT |  |
| type=div |  |  
| props | 此时props中的style、onClick等才会起作用 |  
| uid |  |  
| key |  |   
| ref |  | 

