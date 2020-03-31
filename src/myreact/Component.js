import * as _ from './util';
import {
	renderComponent,
	clearPending,
	compareTwoVnodes,
	getChildContext,
	syncCache
} from './virtual-dom';


export let updateQueue = {
	updaters: [],
	isPending: false,
	add(updater) {
		this.updaters.push(updater);
	},
	batchUpdate() {
		if (this.isPending) {
			return;
		}
		this.isPending = true;
		// batch update every updater, then clear the update queue
		for (let updater of this.updaters) {
			updater.updateComponent();
		}
		this.updaters = [];
		this.isPending = false;
	}
}


class Updater {
	constructor(instance) {
		this.instance = instance;
		this.pendingStates = [];
		this.pendingCallbacks = [];
		this.isPending = false;
		this.nextProps = this.nextContext = null;
	}
	emitUpdate(nextProps, nextContext) {
		// nextProps nextContext来自父组件，父组件传进来的props发生了变化
		this.nextProps = nextProps;
		this.nextContext = nextContext;

		// 如果父组件传了props并且updateQueue没有在做更新操作，就立刻更新
		nextProps || !updateQueue.isPending
			? this.updateComponent() // 立刻更新
			: updateQueue.add(this); // 添加到updateQueue的更新队列中等待更新

	}
	updateComponent() {
		let { instance, pendingStates, nextContext, nextProps } = this;

		// 如果组件的props发生变化  或者是有需要更新的state，就对当前组件instance进行更新
		if (nextProps || pendingStates.length > 0) {
			const props = nextProps || instance.props;
			const context = nextContext || instance.context;
			this.nextContext = this.nextProps = null;

			shouldUpdate(instance, props, this.getState(), context, this.clearCallbacks);
		}

	}
	addState(nextState) {
		if (nextState) {
			this.pendingStates.push(nextState);
			if (!this.isPending) {
				this.emitUpdate()
			}
		}
	}
	getState() {
		// 合并多个state，并返回合并后的state
		/**
		 * setState可以接受的多种情况：
		 * setState({a: 1}, callback?)
		 * setState((state, props)=> ({a: state.a + 1}), callback?)
		 * setState([{b: 3}], callback?) //传一个数组则替换掉之前的state
		 */
		let { instance, pendingStates } = this;
		let { state, props } = instance;
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
			this.pendingStates = [];
		}
		return state;
	}

	clearCallbacks() {
		let { pendingCallbacks, instance } = this;
		if (pendingCallbacks.length > 0) {
			pendingCallbacks.forEach(callback => callback.call(instance));
			this.pendingCallbacks = [];
		}

	}
	addCallback(callback) {
		if (_.isFn(callback)) {
			this.pendingCallbacks.push(callback)
		}
	}
}

export default class Component {
	static isReactComponent = {};
	constructor(props, context) {
		this.$updater = new Updater(this);
		this.$cache = { isMounted: false };
		this.props = props;
		this.state = {};
		this.refs = {};
		this.context = context;
	}

	forceUpdate(callback) {
		let { $updater, $cache, state, props, context } = this;
		if (!$cache.isMounted) {
			return;
		}
		if ($updater.isPending) {
			$updater.addState(state);
			return;
		}
		let nextProps = $cache.props || props;
		let nextState = $cache.state || state;
		let nextContext = $cache.context || context;
		let parentContext = $cache.parentContext;
		let node = $cache.node;
		let vnode = $cache.vnode;

		$cache.props = $cache.state = $cache.context = null;

		$updater.isPending = true;
		if (this.componentWillUpdate) {
			this.componentWillUpdate(nextProps, nextState, nextContext);
		}
		this.state = nextState;
		this.props = nextProps;
		this.context = nextContext;

		let newVnode = renderComponent(this);
		let newNode = compareTwoVnodes(vnode, newVnode, node, getChildContext(this, parentContext));
		if (newNode !== node) {
			newNode.cache = newNode.cache || {};
			syncCache(newNode.cache, node.cache, newNode);
		}
		$cache.vnode = newVnode;
		$cache.node = newNode;
		clearPending();
		if (this.componentDidUpdate) {
			this.componentDidUpdate(props, state, context);
		}
		if (callback) {
			callback.call(this.$updater);
		}
		$updater.isPending = false;
		$updater.emitUpdate();
	}
	setState(nextState, callback) {
		this.$updater.addCallback(callback);
		this.$updater.addState(nextState);
	}
}


function shouldUpdate(component, nextProps, nextState, nextContext, callback) {
	let shouldComponentUpdate = true;
	if (component.shouldComponentUpdate) {
		shouldComponentUpdate = component.shouldComponentUpdate(nextProps, nextState, nextContext);
	}
	if (shouldComponentUpdate === false) {
		component.props = nextProps;
		component.state = nextState;
		component.context = nextContext || {};
		return;
	}
	let cache = component.$cache;
	cache.props = nextProps;
	cache.state = nextState;
	cache.context = nextContext || {};
	component.forceUpdate(callback);
}