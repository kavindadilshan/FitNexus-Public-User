import React,{Component} from "react";
import {Icon} from "react-native-elements";
import {BackHandler, Dimensions, StyleSheet, View} from 'react-native';

class App extends Component {
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackPress = async () => {
        this.props.navigation.goBack();
        return true;
    };

    render() {
        return (
            <View>
                <Icon
                    containerStyle={styles.toggleButton}
                    name='close'
                    color='black'
                    size={30}
                    onPress={this.handleBackPress}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    toggleButton: {
        margin:20,
    },
});


export default App;
