import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import Dashboard from './pages/Dashboard/Dashboard';

var fourOhFour = () => <h1>404</h1>;

render((
	<Router history={browserHistory}>
		<Route path="/" component={Dashboard} />
		<Route path="*" component={fourOhFour} />
	</Router>
), document.getElementById('root'));
