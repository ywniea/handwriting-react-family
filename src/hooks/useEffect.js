import React, { useState, useEffect } from 'react'

function EffectDemo() {
	const [num, setNum] = useState(1);
	// 1. useEffect 没有依赖项的时候 
	// 回调函数会在 组件第一次渲染之后(componentDidMount)
	// 和组件每次更新之后都会执行 (componentDidDpdate)

	// 2. 返回一个函数，这个函数会在组件卸载的时候调用 用于清除副作用 componentWillUnmount
	// 例如 在useEffect中设置了setTimeout 那么就要在返回的这个函数里面 clearTimeout

	// 3. 有依赖项的时候，如果依赖项变了，那么就会执行一次 useEffect 的回调函数 
	// 相当于 componentDidUpdate
	// 依赖项的比较相当于 shouldComponentUpdate

	useEffect(() => {
		console.log('EffectDemo component did mount');
	}, [])

	let deps = num > 2 ? 2 : num;
	useEffect(() => {
		setNum(x => x + 1)
		console.log('component did update')
		return () => {
			console.log('component will unmount')
		}
	}, [deps])
	return (
		<div>
			{num}
		</div>
	)
}

function GetTime(props) {

	// 监听 props.time 相当于 shouldComponentUpdate
	// 监听的两个属性只要有一个变了就会执行
	useEffect(() => {
		console.log(`time changed: ${props.time}`)
		console.log(`name changed: ${props.name}`)
	}, [props.time, props.name])

	console.log('gettime render..')
	return (
		<h3>{JSON.stringify(props.time)}</h3>
	)
}

export default function HookContainer() {
	const [time, setTime] = useState(new Date());
	const [name, setName] = useState('')
	return (
		<>
			<EffectDemo />
			<GetTime time={time} name={name} />
			<button onClick={() => setTime(() => new Date())}>Click to set time</button>
			<button onClick={() => setName('xiaoming' + Math.random())}>Click to set name</button>
		</>
	);
}
