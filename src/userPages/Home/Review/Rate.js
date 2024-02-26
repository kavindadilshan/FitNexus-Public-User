import React from 'react';
import KeyboardShift from "../../../component/KeyShift/KeyBordShift";
import Content from './RateContainer';

class App extends React.Component{
    render() {

        return (
            Platform.OS === 'ios' ? <KeyboardShift>
                {() => (
                    <Content navigation={this.props.navigation}/>
                )}
            </KeyboardShift>:<Content navigation={this.props.navigation}/>
        );
    }
}

export default App;
