/**
 * @format
 */
import React from 'react'
import {AppRegistry,YellowBox} from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import {name as appName} from './app.json';

YellowBox.ignoreWarnings([
    'Warning:',
    'Require cycle:',
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
    'Module RCTImageLoader requires',
    'Possible Unhandled Promise Rejection',
    'Accessing view manager',
    'VirtualizedLists should',
]);
import configureStore from './src/store/configureStore';

const store=configureStore();
const RNRedux=()=>(
    <Provider store={store}>
        <App/>
    </Provider>
)
AppRegistry.registerComponent(appName, () => RNRedux);
