## react-redux

react-redux主要实现了下面两个：

- provider
provider的作用是利用React.createContext将store作为上下文传递给子组件，供子组件消费。

- connect
connect是一个高阶组件工厂，返回一个高阶组件(HOC)，这个高阶组件将接受到的组件进行包装，让它消费provider提供的store。
connect可以接受两个参数`mapStateToProps`和`mapDispatchToProps`。
`mapStateToProps`负责订阅state中的值，将他映射到props中。
`mapDispatchToProps`负责用dispatch包装注册好的action，也映射到组件的props中。

### mapStateToProps

mapStateToProps可以是两种形式：
- mapStateToProps可以为null，那么就不订阅任何state中的数据。
- mapStateToProps也可以是一个函数，见下面函数签名。

```js
mapStateToProps?: (state, ownProps?) => Object
```

### mapDispatchToProps

mapDispatchToProps有三种形式：
- null 则默认传一个dispatch到组件的props中。
- object 传一个actionCreator的object，会调用redux的`bindActionCreator`，将每一个actionCreator返回的action都dispatch出去。
- 函数 自己手动写需要dispatch的action

```js
mapDispatchToProps?: Object | (dispatch, ownProps?) => Object
```
