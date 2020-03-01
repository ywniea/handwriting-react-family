### react

- React.Component
- React.createElement

#### React.Component

- 几个生命周期钩子
- setState

#### React.createElement

JSX是一个Javascript的语法扩展。我们在react中使用JSX时，每个 JSX 元素都是调用 React.createElement()来生成真正的DOM元素。

```js
React.createElement(
  type,
  [props],
  [...children]
)
```