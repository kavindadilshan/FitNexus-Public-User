import React,{Component} from "react";
import {Icon} from "react-native-elements";
import {Dimensions, StyleSheet, View,TouchableOpacity} from 'react-native';
import {BackHandler} from "react-native";
import {HardwareBackAction} from "../Actions/HardwareBackAction";

const screenWidth = Math.round(Dimensions.get('window').width);

class App extends Component {

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.props.navigation.addListener('willFocus', this.load);
    }

    load = () => {
        HardwareBackAction.setBackAction(() => {
            this.props.navigation.goBack();
        });
    };

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackPress = async () => {
        this.props.navigation.goBack();
        return true;
    };

    render() {
        return (
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this.handleBackPress}>
                <Icon
                    containerStyle={styles.toggleButton}
                    name='chevron-left'
                    type='FontAwesome'
                    size={screenWidth===800?40:30}
                    color={this.props.color!==undefined?'white':'black'}
                />
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    toggleButton: {
        marginLeft: 20,
    },
});


export default App;
