import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import './myreact/testComp/index';

import Layout from './mycomponent/layout';

const jsx = (
	<div className="main-page">
		<header>
			<h2>Simple case for practice</h2>
		</header>
		<Layout />
	</div>
);


ReactDOM.render(jsx, document.getElementById('root'));

