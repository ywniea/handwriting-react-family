import axios from 'axios'


// param = {name: 'Tom', age: 18} 
// param is optional
export function get(url, param) {
	// axios return promise
	return axios.get(url, param)
		.then(res => {
			console.log(res)
		})
		.catch(err => {
			console.log(err)
		})
}


export function post(url, data) {
	return axios({
		method: 'post',
		url,
		data
	}).then(res => {
		console.log(res)
	}).catch(err => {
		console.log(err)
	})
}