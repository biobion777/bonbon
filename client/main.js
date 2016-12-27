import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import immutable from 'immutable'
import NProgress from 'react-nprogress'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import configureStore from './store/configureStore'

import App from './components/App'
import Error from './components/Error'
import Home from './components/Home'

import * as Criteria from './criteria/pages'
import * as Records from './records/pages'
import * as Statistics from './statistics/pages'

import './main.less'

if (__DEV__) {
    const installDevTools = require('immutable-devtools')
    installDevTools(immutable)
}

NProgress.configure({showSpinner: false})

export const store = configureStore()

let lastRoute = null
let lastRouteJS = null
const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState(state) {
        if (state.get('routing') !== lastRoute) {
            lastRoute = state.get('routing')
            lastRouteJS = lastRoute.toJS()
            return lastRouteJS
        }

        return lastRouteJS
    },
})

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route path="criteria" component={Criteria.List} />
                <Route path="criteria/add" component={Criteria.Form} />
                <Route path="criteria/edit/:id" component={Criteria.Form} />
                <Route path="records/add" component={Records.Form} />
                <Route path="records/edit/:id" component={Records.Form} />
                <Route path="records(/:page)" component={Records.List} />
                <Route path="statistics" component={Statistics.Overview} />
                <Route path="*" component={Error} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app-container')
)
