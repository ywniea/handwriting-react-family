## redux

在写redux的过程中遇到了几个问题，感觉难点是applyMiddleware和compose。
同时要注意在createStore的时候需要先初始化一次store。

### applyMiddleware(mylog, mythunk)时，dispatch增强后是什么样？

next 有可能是其他middleware，也有可能是dispatch。

```js
const mythunk = ({dispatch, getState}) => (next) => (action) => {
	// mythunk do something with action
	if (typeof action === 'function') {
		return action(dispatch, getState);
	}

	// 最后调用dispatch，这时候next就是dispatch
	return next(action);
}

const mylog = ({dispatch, getState}) => (next) => (action) => {
	// mylog do something with action
	console.log(action);

	// 最后调用thunk，这时候next是mythunk
	return next(action);
};

```
最右边的mythunk先被取出来，给它的next赋值dispatch。那么mythunk中最后调用next，就是调用dispatch。
`const dispatchWithThunk = mythunk(dispatch)`
这个代码中的`dispatchWithThunk`就是一个增强过的dispatch，再将`dispatchWithThunk`传给mylog。
那么mylog中最后调用next，就是调用dispatchWithThunk。

我们就可以知道，applyMiddleware(mylog, mythunk)时，代码的执行顺序就是：

- mylog中的逻辑
- mylog最后调用dispatchWithThunk
- mythunk中的逻辑
- mythunk最后调用dispatch
- redux中注册的reducer

### thunk中间件里面action(dispatch, getState)中的dispatch是增强过的吗？

是的。

thunk可以接受这样的action：

```js
dispatch => {
		setTimeout(() => {
			dispatch({ type: 'add' });
		}, 1500);
}
```

这里面的dispatch就是增强过的dispatch。

最初构建middlewareAIP中的dispatch指向的是从store中取出来的原始dispatch。
后来dispatch又被重新赋值`dispatch = compose(middlewareList)(dispatch);`
在middlewareAIP中只是引用了dispatch指向的那个函数。

```js
// in applyMiddleware
let store = createStore(reducer, initialState, enhancer);
let { getState, dispatch } = store;

const middlewareAIP = {
	getState,
	// 形成闭包，引用了applyMiddleware作用域中的dispatch变量
	dispatch: (action) => dispatch(action)
}

let middlewareList = middlewares.map(middleware => middleware(middlewareAIP));
// dispatch被重新赋值，dispatch指向的函数引用发生变化
dispatch = compose(middlewareList)(dispatch);

```