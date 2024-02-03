import React from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import gif from "../../assets/Home/loading.gif";
import {Color} from "../../constance/Colors";

class App extends React.Component{
    render(){
        return(
            <View style={styles.gifHolder}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <Image source={gif} style={styles.gif}/>
            </View>
        )
    }
}

export const styles=StyleSheet.create({
    gifHolder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 90,
        height: 90,
    },
});

export default App;
