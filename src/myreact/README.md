## react

实现了下面API：
- React.createElement
- React.Component
- ReactDOM.render
<!-- - React.createContext -->

### React.createElement

JSX是一个Javascript的语法扩展。我们在react中使用JSX时，每个 JSX 元素都是调用 React.createElement()来生成 virtual-node。
后面简称vnode。

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
		vtype: vtype,
		type: type,
		props: props,
		refs: refs,
		key: key,
		ref: ref,
		uid: 2  
	}
```

### ReactDOM.render

```js
ReactDOM.render(vnode, container, callback)
```

将React.createElement产生的vnode转换成真正的DOM元素，通过并将这个DOM元素作为传入的container的child。

### updateQueue和updater


### React.Component

- 几个生命周期钩子的调用时机
- setState
- diff算法

#### 几个生命周期钩子的调用时机

#### setState批量合并和callback函数

#### diff算法

### 事件系统

### React.createContext

```js
let myContext = React.createContext(defaultValue);
```
