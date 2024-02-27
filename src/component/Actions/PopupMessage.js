import React, {Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {Color} from "../../constance/Colors";

class App extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={()=>this.props.onPress()}>
                <View style={styles.subContainer}>
                    <Text>You have already purchased a membership for this gym</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    subContainer: {
        width: '80%',
        height:'50%',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 4,
        shadowColor:Color.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        paddingVertical:20
    },

})

export default App;
