
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { apiMiddleware } from 'redux-api-middleware';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import './index.css';
import App from './App';
import TeamAppReducer from './reducers'

const loggerMiddleware = createLogger()

const store = createStore(
  TeamAppReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware, // neat middleware that logs actions
    apiMiddleware // for simple api calls
  )
)

render(
  <Provider store={store}>
    	<App store={store} />
  </Provider>,
  document.getElementById('root')
);
