/**
 * 虚拟dom
 */
import * as _ from './util'
import {
	VELEMENT,
	VSTATELESS,
	VCOMPONENT,
	HTML_KEY,
} from './constant'

let refs = null
// 创建vnode
export function createVnode(vtype, type, props, key, ref) {
	// 创建vnode
	let vnode = {
		vtype: vtype,
		type: type,
		props: props,
		refs: refs,
		key: key,
		ref: ref,
	}
	if (vtype === VSTATELESS || vtype === VCOMPONENT) {
		vnode.uid = _.getUid()
	}
	return vnode
}
// 初始化vnode
export function initVnode(vnode, parentContext) {
	// 初始化 不同的vtype 执行不同的函数
	let { vtype } = vnode
	let node = null
	if (!vtype) { // init text
		node = document.createTextNode(vnode)
	} else if (vtype === VELEMENT) { // init element
		node = initVelem(vnode, parentContext)
	} else if (vtype === VCOMPONENT) { // init stateful component
		node = initVcomponent(vnode, parentContext)
	} else if (vtype === VSTATELESS) { // init stateless component
		node = initVstateless(vnode, parentContext)
	}
	return node
}

function updateVnode(vnode, newVnode, node, parentContext) {
	let { vtype } = vnode

	// class组件
	if (vtype === VCOMPONENT) {
		return updateVcomponent(vnode, newVnode, node, parentContext)
	}

	// 函数组件
	if (vtype === VSTATELESS) {
		return updateVstateless(vnode, newVnode, node, parentContext)
	}

	// ignore VCOMMENT and other vtypes
	if (vtype !== VELEMENT) {
		return node
	}

	let oldHtml = vnode.props[HTML_KEY] && vnode.props[HTML_KEY].__html
	if (oldHtml != null) {
		// 用户设置innerHTML更新
		updateVelem(vnode, newVnode, node, parentContext)
		initVchildren(newVnode, node, parentContext)
	} else {
		// 普通更新
		updateVChildren(vnode, newVnode, node, parentContext)
		updateVelem(vnode, newVnode, node, parentContext)
	}
	return node
}

function updateVChildren(vnode, newVnode, node, parentContext) {
	// 更新children，产出三个patch数组
	let patches = {
		removes: [],
		updates: [],
		creates: [],
	}
	diffVchildren(patches, vnode, newVnode, node, parentContext)
	_.flatEach(patches.removes, applyDestroy)
	_.flatEach(patches.updates, applyUpdate)
	_.flatEach(patches.creates, applyCreate)
}

function applyUpdate(data) {
	if (!data) {
		return
	}
	let vnode = data.vnode
	let newNode = data.node

	// update
	if (!data.shouldIgnore) {
		if (!vnode.vtype) {
			newNode.replaceData(0, newNode.length, data.newVnode)
		} else if (vnode.vtype === VELEMENT) {
			updateVelem(vnode, data.newVnode, newNode, data.parentContext)
		} else if (vnode.vtype === VSTATELESS) {
			newNode = updateVstateless(vnode, data.newVnode, newNode, data.parentContext)
		} else if (vnode.vtype === VCOMPONENT) {
			newNode = updateVcomponent(vnode, data.newVnode, newNode, data.parentContext)
		}
	}

	// re-order
	let currentNode = newNode.parentNode.childNodes[data.index]
	if (currentNode !== newNode) {
		newNode.parentNode.insertBefore(newNode, currentNode)
	}
	return newNode
}


function applyDestroy(data) {
	destroyVnode(data.vnode, data.node)
	data.node.parentNode.removeChild(data.node)
}

function applyCreate(data) {
	let node = initVnode(data.vnode, data.parentContext)
	data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index])
}

// 销毁
export function destroyVnode(vnode, node) {
	let { vtype } = vnode
	if (vtype === VELEMENT) { // destroy element
		destroyVelem(vnode, node)
	} else if (vtype === VCOMPONENT) { // destroy state component
		destroyVcomponent(vnode, node)
	} else if (vtype === VSTATELESS) { // destroy stateless component
		destroyVstateless(vnode, node)
	}
}
// 初始化div这种vnode
function initVelem(velem, parentContext) {
	let { type, props } = velem
	let node = document.createElement(type)

	// 初始化childrend

	initVchildren(velem, node, parentContext)

	let isCustomComponent = type.indexOf('-') >= 0 || props.is != null
	_.setProps(node, props, isCustomComponent)

	if (velem.ref != null) {
		pendingRefs.push(velem)
		pendingRefs.push(node)
	}

	return node
}
// 遍历children 循环调用initVnode
function initVchildren(velem, node, parentContext) {
	let vchildren = node.vchildren = getFlattenChildren(velem)
	for (let i = 0, len = vchildren.length; i < len; i++) {
		node.appendChild(initVnode(vchildren[i], parentContext))
	}
}

function getFlattenChildren(vnode) {
	let { children } = vnode.props
	let vchildren = []
	if (_.isArr(children)) {
		_.flatEach(children, collectChild, vchildren)
	} else {
		collectChild(children, vchildren)
	}
	return vchildren
}

function collectChild(child, children) {
	if (child != null && typeof child !== 'boolean') {
		children[children.length] = child
	}
}
// 对比children
function diffVchildren(patches, vnode, newVnode, node, parentContext) {
	if (!node.vchildren) return // react-lite hasn't seen this DOM node before

	let { childNodes, vchildren } = node
	let newVchildren = node.vchildren = getFlattenChildren(newVnode)
	let vchildrenLen = vchildren.length
	let newVchildrenLen = newVchildren.length

	if (vchildrenLen === 0) {
		if (newVchildrenLen > 0) {
			// 老children是空的，新children不为空，直接create 新children
			for (let i = 0; i < newVchildrenLen; i++) {
				patches.creates.push({
					vnode: newVchildren[i],
					parentNode: node,
					parentContext: parentContext,
					index: i,
				})
			}
		}
		return
	} else if (newVchildrenLen === 0) {
		// 老children不为空，新children为空，直接remove 老的children
		for (let i = 0; i < vchildrenLen; i++) {
			patches.removes.push({
				vnode: vchildren[i],
				node: childNodes[i],
			})
		}
		return
	}


	let updates = Array(newVchildrenLen)
	let removes = null
	let creates = null

	// 如果新老vnode就是同一个
	// （但是他的children和property不一定相同，后续会递归去比较child的child是否相同）
	// 则按照新vnode数组中的顺序更新updates数组

	// 递归的方法：
	//   1. velement 直接调用 diffVchildren
	// 	 2. vstateless 在 updateVstateless 中调用 compareTwoVnodes
	// 	 3. vcomponent 在 updateVcomponent 中调用 updater.emitUpdate -> component.forceUpdate -> compareTwoVnodes

	/**
	 * 举个例子：
	 * 
	 * vchildren = [a, b, c, d]
	 * newVchildren = [A, C, E, F, B];
	 */

	for (let i = 0; i < vchildrenLen; i++) {
		let vnode = vchildren[i]
		for (let j = 0; j < newVchildrenLen; j++) {
			if (updates[j]) {
				continue
			}
			let newVnode = newVchildren[j]
			if (vnode === newVnode) {
				updates[j] = {
					shouldIgnore: shouldIgnoreUpdate(node),
					vnode: vnode,
					newVnode: newVnode,
					node: childNodes[i],
					parentContext: parentContext,
					index: j,
				}
				vchildren[i] = null
				break
			}
		}
	}

	/**
	 * 上面的for循环运行完之后：
	 * updates = [
	 * 	{vnode: a, newNode: A, index: 0},
	 * 	{vnode: c, newNode: C, index: 1}, 
	 *  empty, empty,
	 *  {vnode: b, newNode: B, index: 4}
	 * ]
	 * 
	 * vchildren = [null, null, c, d]
	 * newVchildren = [A, C, E, F, B];
	 */

	// 新老vnode不是同一个，但他们的key refs type都相同，也添加到updates中
	// 仍然在老vchildren中剩下的vnode，因为它在新vchildren中找不到，则添加到removes中
	for (let i = 0; i < vchildrenLen; i++) {
		let vnode = vchildren[i]
		if (vnode === null) {
			continue
		}
		let shouldRemove = true
		for (let j = 0; j < newVchildrenLen; j++) {
			if (updates[j]) {
				continue
			}
			let newVnode = newVchildren[j]
			if (
				newVnode.type === vnode.type &&
				newVnode.key === vnode.key &&
				newVnode.refs === vnode.refs
			) {
				updates[j] = {
					vnode: vnode,
					newVnode: newVnode,
					node: childNodes[i],
					parentContext: parentContext,
					index: j,
				}
				shouldRemove = false
				break
			}
		}
		if (shouldRemove) {
			if (!removes) {
				removes = []
			}
			removes.push({
				vnode: vnode,
				node: childNodes[i]
			})
		}
	}

	/**
	 * removes=[{vnode: c}, {vnode: d}]
	 */


	// 这时updates中已经存好了新老vnode的update的映射，如果updates中还有空的位置
	// 则说明updates中空的位置（2，3）对应的 newVchildren 的（2，3）位置的元素在老vchildren中不曾出现过
	// 就是E,F  这俩是新的，放到creates中
	for (let i = 0; i < newVchildrenLen; i++) {
		let item = updates[i]
		if (!item) {
			if (!creates) {
				creates = []
			}
			creates.push({
				vnode: newVchildren[i],
				parentNode: node,
				parentContext: parentContext,
				index: i,
			})
		} else if (item.vnode.vtype === VELEMENT) {
			// 如果是普通的html元素，手动递归调用 diffVchildren 比较新老vnode的子元素
			diffVchildren(patches, item.vnode, item.newVnode, item.node, item.parentContext)
		}
	}
	/**
	 * creates = [{vnode: E, index: 2}, {vnode: F, index: 3}]
	 */

	if (removes) {
		patches.removes.push(removes)
	}
	if (creates) {
		patches.creates.push(creates)
	}
	patches.updates.push(updates)
}

function updateVelem(velem, newVelem, node) {
	let isCustomComponent = velem.type.indexOf('-') >= 0 || velem.props.is != null
	_.patchProps(node, velem.props, newVelem.props, isCustomComponent)
	if (velem.ref !== newVelem.ref) {
		detachRef(velem.refs, velem.ref, node)
		attachRef(newVelem.refs, newVelem.ref, node)
	}
	return node
}

function destroyVelem(velem, node) {
	let { vchildren, childNodes } = node
	if (vchildren) {
		for (let i = 0, len = vchildren.length; i < len; i++) {
			destroyVnode(vchildren[i], childNodes[i])
		}
	}
	detachRef(velem.refs, velem.ref, node)
	node.eventStore = node.vchildren = null
}

function initVstateless(vstateless, parentContext) {
	let vnode = renderVstateless(vstateless, parentContext)
	let node = initVnode(vnode, parentContext)
	node.cache = node.cache || {}
	node.cache[vstateless.uid] = vnode
	return node
}

function updateVstateless(vstateless, newVstateless, node, parentContext) {
	let uid = vstateless.uid
	let vnode = node.cache[uid]
	delete node.cache[uid]
	let newVnode = renderVstateless(newVstateless, parentContext)
	let newNode = compareTwoVnodes(vnode, newVnode, node, parentContext)
	newNode.cache = newNode.cache || {}
	newNode.cache[newVstateless.uid] = newVnode
	if (newNode !== node) {
		syncCache(newNode.cache, node.cache, newNode)
	}
	return newNode
}

function destroyVstateless(vstateless, node) {
	let uid = vstateless.uid
	let vnode = node.cache[uid]
	delete node.cache[uid]
	destroyVnode(vnode, node)
}

function renderVstateless(vstateless, parentContext) {
	// 函数组件
	let { type: factory, props } = vstateless
	let componentContext = getContextByTypes(parentContext, factory.contextTypes)
	let vnode = factory(props, componentContext)
	if (vnode && vnode.render) {
		vnode = vnode.render()
	}
	if (!vnode || !vnode.vtype) {
		throw new Error(`@${factory.name}#render:You may have returned undefined, an array or some other invalid object`)
	}
	return vnode
}

function initVcomponent(vcomponent, parentContext) {
	// 初始化
	let { type: Component, props, uid } = vcomponent
	let componentContext = getContextByTypes(parentContext, Component.contextTypes)
	// 初始化组件class
	let component = new Component(props, componentContext)
	// 获取updater和cache
	let { $updater: updater, $cache: cache } = component
	cache.parentContext = parentContext
	// 设置pending
	updater.isPending = true
	component.props = component.props || props
	component.context = component.context || componentContext
	// 生命周期
	if (component.componentWillMount) {
		component.componentWillMount()
		component.state = updater.getState()
	}
	let vnode = renderComponent(component)
	let node = initVnode(vnode, getChildContext(component, parentContext))
	node.cache = node.cache || {}
	node.cache[uid] = component
	cache.vnode = vnode
	cache.node = node
	cache.isMounted = true
	pendingComponents.push(component)

	if (vcomponent.ref != null) {
		pendingRefs.push(vcomponent)
		pendingRefs.push(component)
	}

	return node
}

function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
	// 更新组件
	let uid = vcomponent.uid
	let component = node.cache[uid]
	let { $updater: updater, $cache: cache } = component
	let { type: Component, props: nextProps } = newVcomponent
	let componentContext = getContextByTypes(parentContext, Component.contextTypes)
	delete node.cache[uid]
	node.cache[newVcomponent.uid] = component
	cache.parentContext = parentContext
	if (component.componentWillReceiveProps) {
		let needToggleIsPending = !updater.isPending
		if (needToggleIsPending) updater.isPending = true
		component.componentWillReceiveProps(nextProps, componentContext)
		if (needToggleIsPending) updater.isPending = false
	}

	if (vcomponent.ref !== newVcomponent.ref) {
		detachRef(vcomponent.refs, vcomponent.ref, component)
		attachRef(newVcomponent.refs, newVcomponent.ref, component)
	}

	updater.emitUpdate(nextProps, componentContext)

	return cache.node
}

function destroyVcomponent(vcomponent, node) {
	let uid = vcomponent.uid
	let component = node.cache[uid]
	let cache = component.$cache
	delete node.cache[uid]
	detachRef(vcomponent.refs, vcomponent.ref, component)
	component.setState = component.forceUpdate = _.noop
	if (component.componentWillUnmount) {
		component.componentWillUnmount()
	}
	destroyVnode(cache.vnode, node)
	delete component.setState
	cache.isMounted = false
	cache.node = cache.parentContext = cache.vnode = component.refs = component.context = null
}

function getContextByTypes(curContext, contextTypes) {
	let context = {}
	if (!contextTypes || !curContext) {
		return context
	}
	for (let key in contextTypes) {
		if (contextTypes.hasOwnProperty(key)) {
			context[key] = curContext[key]
		}
	}
	return context
}

export function renderComponent(component, parentContext) {
	refs = component.refs
	let vnode = component.render()
	if (!vnode || !vnode.vtype) {
		throw new Error(`@${component.constructor.name}#render:You may have returned undefined, an array or some other invalid object`)
	}
	refs = null
	return vnode
}

export function getChildContext(component, parentContext) {
	if (component.getChildContext) {
		let curContext = component.getChildContext()
		if (curContext) {
			parentContext = { ...parentContext, ...curContext }
		}
	}
	return parentContext
}


let pendingComponents = []
function clearPendingComponents() {
	let len = pendingComponents.length
	if (!len) {
		return
	}
	let components = pendingComponents
	pendingComponents = []
	let i = -1
	while (len--) {
		let component = components[++i]
		let updater = component.$updater
		if (component.componentDidMount) {
			component.componentDidMount()
		}
		updater.isPending = false
		updater.emitUpdate()
	}
}

let pendingRefs = []
function clearPendingRefs() {
	let len = pendingRefs.length
	if (!len) {
		return
	}
	let list = pendingRefs
	pendingRefs = []
	for (let i = 0; i < len; i += 2) {
		let vnode = list[i]
		let refValue = list[i + 1]
		attachRef(vnode.refs, vnode.ref, refValue)
	}
}

export function clearPending() {
	clearPendingRefs()
	clearPendingComponents()
}

export function compareTwoVnodes(vnode, newVnode, node, parentContext) {
	let newNode = node
	if (newVnode == null) {
		// remove
		destroyVnode(vnode, node)
		node.parentNode.removeChild(node)
	} else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {
		// replace
		destroyVnode(vnode, node)
		newNode = initVnode(newVnode, parentContext)
		node.parentNode.replaceChild(newNode, node)
	} else if (vnode !== newVnode || parentContext) {
		// same type and same key -> update
		newNode = updateVnode(vnode, newVnode, node, parentContext)
	}
	return newNode
}

function getDOMNode() {
	return this
}

function attachRef(refs, refKey, refValue) {
	if (refKey == null || !refValue) {
		return
	}
	if (refValue.nodeName && !refValue.getDOMNode) {
		// support react v0.13 style: this.refs.myInput.getDOMNode()
		refValue.getDOMNode = getDOMNode
	}
	if (_.isFn(refKey)) {
		refKey(refValue)
	} else if (refs) {
		refs[refKey] = refValue
	}
}

function detachRef(refs, refKey, refValue) {
	if (refKey == null) {
		return
	}
	if (_.isFn(refKey)) {
		refKey(null)
	} else if (refs && refs[refKey] === refValue) {
		delete refs[refKey]
	}
}

export function syncCache(cache, oldCache, node) {
	for (let key in oldCache) {
		if (!oldCache.hasOwnProperty(key)) {
			continue
		}
		let value = oldCache[key]
		cache[key] = value

		// is component, update component.$cache.node
		if (value.forceUpdate) {
			value.$cache.node = node
		}
	}
}

// 返回false 就会更新
// 返回true 就不更新
function shouldIgnoreUpdate(node) {
	let {
		vchildren,
		children
	} = node

	if (vchildren) {
		for (let i = 0; i < vchildren.length; i++) {
			let vchild = vchildren[i]
			if (vchild.vtype === VCOMPONENT || vchild.vtype === VSTATELESS) {
				if (vchild.type.contextTypes) {
					return false
				}
			}
		}
	}

	if (children) {
		for (let i = 0; i < children.length; i++) {
			if (!shouldIgnoreUpdate(children[i])) {
				return false
			}
		}
	}

	return true
}
