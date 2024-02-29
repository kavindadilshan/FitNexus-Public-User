import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, BackHandler, StatusBar} from 'react-native';
import IMG from '../../assets/Home/errorIcon.png'
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component {

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', function() {return true})
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <Text style={{...styles.textStyle,marginTop:'5%'}}>Something went wrong.Let's</Text>
                <Text style={styles.textStyle}>try one more again</Text>
                <View style={styles.imageHolder}>
                    <Image source={IMG} style={{width: '100%', height: '100%'}} resizeMode={'stretch'}/>
                </View>
                <TouchableOpacity style={styles.btnSignUp} onPress={() => navigation.goBack()}>
                    <Text style={styles.btnContent}>Try again</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        height: screenHeight
    },
    textStyle: {
        fontFamily: Font.Bold,
        color: Color.darkGray,
        fontSize: 18,
        lineHeight: 22,
    },
    imageHolder: {
        marginTop: '15%',
        width: screenHeight / 100 * 45,
        height: screenHeight / 100 * 45
    },
    btnSignUp: {
        backgroundColor: Color.themeColor,
        width: '95%',
        height: 55,
        borderRadius: 10,
        position: 'absolute',
        bottom: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    btnContent: {
        color: Color.white,
        fontFamily: Font.SemiBold
    },

});

export default App;
