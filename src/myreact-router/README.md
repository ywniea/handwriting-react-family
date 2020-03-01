### react-router-dom

`react-router-dom`的想法很简单，就是一切皆组件。
通过ReactContext来传递了路由相关的一些属性。主要包括下面三个值：

```js
{
	history,
	location,
	match
}

// 其中location对象形如：
location={
	pathname: "/list",
	search: "",
	hash: "",
	state: {
		// some data
	},
	key: "123ereee"
}

```

#### BrowserRouter

BrowserRouter在最外层，是`history` `location`对象的`Provider`。

#### Switch

关于Switch在这个简易版react-router中实现了四点：

- switch 只能接受Route或者Redirect作为children
- 并且只渲染匹配到的第一个子元素，如果一个都不匹配那就返回null，虽然Route的children属性匹配不匹配都渲染，但是加上switch以后，如果前面的子元素有匹配的，children也不会渲染出来。
- 如果像这样给定switch一个location对象，那么switch内部的route会根据这个location来匹配。
```jsx
<Switch location={{ pathname: '/login' }} >
```
而不会去管外层传进来的location和当前浏览器中的地址是什么。

- Switch通过自己的计算选中一个子元素进行渲染，会传一个`computedMatch`给子元素。在Route或者Redirect中可以去查看这个`computedMatch`。

#### Route

Route 可以渲染的属性有三个：`render` `component` `children`。

在这三个属性中children优先级最高，并且`children`会无视 `match` 的结果，不管是否match都会渲染出来。
起中三者的优先级排序是：
```
children > component > render
```
源码中是这样写的。我去掉了__DEV__之类的判断，看起来更清晰:

```js
const props = { ...context, location, match };

// ...some code

props.match
? children
	? typeof children === "function"
		? children(props)
		: children
	: component
		? React.createElement(component, props)
		: render
			? render(props)
			: null
: typeof children === "function"
	? children(props)
	: null
```

可以看出Route的执行结果一般是三选一：
- 首先看是否match
- 如果match，再看children是否存在，如果children存在就直接渲染children
- 如果match的情况下children不存在，就先看component是否存在，如果component存在就渲染component
- 如果match，children不存在，component也不存在，才去看render是否存在，如果存在就渲染render
- 如果match，children，component和render都不存在，则返回null，什么都不渲染
- 如果不match，并且children为function，则渲染children，否则返回null，什么都不渲染
- 可以看出如果不match，并且children不是一个function，就算我们传了children，也不会渲染children

##### Route的render接口实现路由守卫

路由守卫：在跳转到页面A之前，需要进行条件判断，如果满足条件，则跳转到A，否则，就跳转到其他设定好的页面B。

```js
import React from 'react'; 
import {Redirect,Route} from 'react-router-dom';
const LoginRouteGuard = ({ component: Component, isLogin, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isLogin ?
            (
                <Component {...props} />
            )
             : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);
export default LoginRouteGuard;
```
使用时可以这样：
```js
<BrowserRouter>
	<Route path="/" component={Main} />
	<Route path="/login" component={Login} />
	<LoginRouteGuard path="/productlist" component={Productlist} ></LoginRouteGuard>
	<LoginRouteGuard path="/setting" component={Setting} ></LoginRouteGuard>
	<LoginRouteGuard path="/management" component={Management} ></LoginRouteGuard>
</BrowserRouter>
```
在LoginRouteGuard内部会使用Route的render接口进行条件判断，看是否需要对component进行渲染。不满足条件就会跳转到login界面。
login组件可以从`props.location.state`中获取from属性，在login之后再跳转回原来想要访问的页面。

#### Redirect

Redirect中需要说明的属性：
- computedMatch 如果有的话是从switch那边传过来的。可以不再去计算是否match
- to相当于Route的path，在自己计算match的时候可以用到
- to可以是个string，也可以是个object
- `push===true`那么就使用history.push  否则就使用history.replace

redirect做的操作只是在匹配的情况下使用history.push或者history.replace导航到to的那个页面。这个操作甚至都不需要render一个html元素，只需要生命周期在componentDidMount时执行method(location)。

#### Link

Link和Redirect异曲同工，只不过Link要简单许多，而且Link需要我们手动触发，而Redirect在符合条件的情况下会在componentDidMount生命周期中自动跳转一次。

#### 其他

代码中还有关于计算match和generatePath等一些方法放在了utils文件夹中，用到了`path-to-regexp`这个库。其中的实现直接拷自源码。
