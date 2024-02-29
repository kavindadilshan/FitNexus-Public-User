import React from 'react';
import {Image, Text, View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import Empty from "../../assets/Home/empty.png";
import {Font} from "../../constance/AppFonts";
import {Color} from "../../constance/Colors";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component{
    render(){
        return(
            <View style={{
                width: screenWidth,
                height: screenHeight / 100 * 80,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{width: '75%', height: '80%',}}>
                    <Image source={Empty} style={{width: '100%', height: '100%'}}
                           resizeMode={'contain'}/>
                </View>
                <Text style={styles.alert}>No discounts available</Text>
                <TouchableOpacity
                    style={{...styles.updateButton, marginVertical: '5%'}}
                    onPress={() =>  this.props.onPress()}
                >
                    <Text style={styles.buttonContent}>Invite a friend and get a discount</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

export const styles=StyleSheet.create({
    alert:{
        fontFamily:Font.SemiBold,
        fontSize:14,
        lineHeight:22,
        color:Color.softDarkGray1
    },
    alertWord:{
        fontFamily:Font.SemiBold,
        fontSize:14,
        lineHeight:22,
        color:Color.lightGreen,
    },
    updateButton: {
        width: '95%',
        height: 58,
        backgroundColor: Color.lightGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: '5%'
        // marginTop:'20%'
        // position: 'absolute',
        // bottom:10
    },
    buttonContent: {
        fontFamily: Font.SemiBold,
        color: Color.white,
        fontSize: 15,
        lineHeight: 22
    },
})

export default App;
