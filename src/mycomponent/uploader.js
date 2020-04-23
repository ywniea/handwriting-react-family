import React, { Component } from 'react'
import { post, get } from '../http/useaxios'
import { postFile } from '../http/usefetch';

const SIZE = 1024;

export default class Uploader extends Component {

	constructor(props) {
		super(props);
		this.state = {
			file: ''
		}
	}
	handleChange = (e) => {
		const [file] = e.target.files;
		console.log(file)
		this.setState({ file })
	}

	createFileChunk = (file, size = SIZE) => {
		const chunks = [];
		let cur = 0;
		while (cur < file.size) {
			chunks.push({
				file: file.slice(cur, cur + size)
			});
			cur += size;
		}
		return chunks;

	}
	handleUpload2 = () => {
		const { file } = this.state;
		// post('http://localhost:9000/api/upload', file).then(res => {
		// 	console.log(res)
		// })
		const chunks = this.createFileChunk(file);
		chunks.forEach(async (chunk, index) => {
			console.log(chunk, JSON.stringify(chunk), JSON.stringify(chunk).length)
			const fd = new FormData();
			fd.append('filename', file.name);
			fd.append('data', chunk);
			fd.append('index', index);
			fd.append('size', chunks.length);
			await post('http://localhost:9000/api/upload', fd).then(res => {
				console.log(res)
			})
		})
	}
	handleUpload = () => {
		const { file } = this.state;
		post('http://localhost:9000/api/upload', file).then(res => {
			console.log(res)
		})
	}

	sendRequest = () => {
		const params = { id: '11111111111', name: 'aaaaaaaaaaaaaaaaaa' }
		post('http://localhost:9000/api/info', params).then(res => {
			console.log(res)
		})
	}

	getSomething = () => {
		get('http://localhost:9000/api/getname', { id: 2 }).then(res => {
			console.log(res)
		})
	}

	dropFile = (e) => {
		e.preventDefault(); //取消浏览器器默认拖 拽效果
		var fileList = e.dataTransfer.files; //获取拖拽中的⽂文件对 象
		var len = fileList.length;//⽤用来获取⽂文 件的⻓长度(其实是获得⽂文件数量量)
		const [file] = e.target.files;
		if (!file) return;
		console.log(file)
		this.setState({ file })
	}
	pasteFile = (e) => {
		e.preventDefault(); //取消浏览器器默认拖 拽效果
		var data = (e.clipboardData)
		console.log(data)
	}

	render() {
		return (
			<div>
				<div  >
					<input type="file" onChange={this.handleChange} />
				</div>
				<button onClick={this.handleUpload}>upload</button>
				<br />
				<button onClick={this.sendRequest} >send request</button>
				<br />
				<button onClick={this.getSomething} >get something</button>
			</div>
		)
	}
}

