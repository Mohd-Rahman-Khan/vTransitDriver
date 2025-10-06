import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import rootReducers from './reducers';
const middlewares = [thunk];

const store =  createStore(rootReducers, applyMiddleware(...middlewares));

export default store;