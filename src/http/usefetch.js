import moment from 'moment';


export function dateSerializer(date) {
	return moment(date).format('YYYY-MM-DD');
}

export function dateTimeSerializer(date) {
	return moment(date).format('YYYY-MM-DDTHH:mm:ss');
}

export async function postForm(url, params, method = 'post') {
	const response = await fetch(url,
		{
			method,
			headers: {
				Accept: 'application/json',
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: JSON.stringify(params),
			credentials: 'include',
			mode: 'cors'
		});
	return response;
}

export async function postJSON(url, params) {
	const response = await fetch(url,
		{
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify(params),
			credentials: 'include',
			mode: 'cors'
		});
	return response;
}

export async function postFile(uploadUrl, formData) {
	const { file, ...param } = formData;
	const postData = new FormData();
	postData.append('file', (file) ? file[0] : null);
	const url = `${uploadUrl}?${getFormUrlencodedParams(param)}`;
	const response = await fetch(url,
		{
			method: 'POST',
			credentials: 'include',
			mode: 'cors',
			body: postData,
		});
	return response;
}

export async function postFiles(uploadUrl, formData, files) {
	const postData = new FormData();
	files.forEach(file => {
		postData.append('files', (file) ? file[0] : null);
	});
	// postData.append('file', (file) ? file[0] : null);
	const url = `${uploadUrl}?${getFormUrlencodedParams(formData)}`;
	const response = await fetch(url,
		{
			method: 'POST',
			credentials: 'include',
			mode: 'cors',
			body: postData,
		});
	return response;
}

export function getFormUrlencodedParams(params = {}, dateFields = [], dateTimeFields = []) {
	const paramStr = Object.keys(params).reduce((arr, key) => {
		if (key === '__id__' || key === '__state__' || key === '__errorMsg') {
			return arr;
		}
		const strKey = encodeURIComponent(key);
		let val = params[key];
		if (dateFields.indexOf(key) !== -1 && val instanceof Date) {
			val = dateSerializer(val);
		} else if (dateTimeFields.indexOf(key) !== -1 && val instanceof Date) {
			val = dateTimeSerializer(val);
		}
		if (val === null || typeof (val) === 'undefined') {
			val = '';
		}
		val = encodeURIComponent(val);
		return arr.concat(`${strKey}=${val}`);
	}, []).join('&');
	return paramStr;
}
