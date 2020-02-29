// funcs 是一个函数的数组，数组中每个函数的签名都是
// (next) => (action) => {}
// 在applyMiddleware的时候，args 是[dispatch]

// compose 返回一个用middleware增强的dispatch
// 假设传递的funcs=[h, j, k], args= [dispatch]
// 最后返回的结果是 h(j(k(...args)))
// 返回的这个函数的签名是 (action) => {}，与原生的dispatch相同
const compose = (...funcs) => (...args) => {
	if (funcs.length === 0) {
		return args[0];
	}
	let last = funcs[funcs.length - 1];
	let rest = funcs.slice(0, -1);
	return rest.reduceRight((composed, cur) => cur(composed), last(...args));
}

export default compose;
