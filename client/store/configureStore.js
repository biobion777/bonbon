import {createStore, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import {browserHistory} from 'react-router'
import {fromJS} from 'immutable'
import api from '../middlewares/api'

// import serverErrorHandler from './middlewares/serverErrorHandler'
import rootReducer from '../reducers/index'

const configureStore = (initialState = fromJS({})) => {
    const logger = createLogger({
        collapsed: true,
    })
    let middlewares = applyMiddleware(
        thunk,
        // serverErrorHandler,
        api,
        logger,
    )

    // check if Redux devTools Chrome extension is installed to apply it as a middleware
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        middlewares = compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__())
    }

    const store = createStore(
        rootReducer,
        initialState,
        middlewares,
    )

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}

export default configureStore
