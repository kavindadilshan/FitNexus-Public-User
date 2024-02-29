import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import {Color} from "../../constance/Colors";
import {Icon} from "react-native-elements";
import {Font} from "../../constance/AppFonts";
import IMG from '../../assets/Home/onlineCoachInfo.png';

const screenHeight = Math.round(Dimensions.get('window').height);

class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <TouchableOpacity  style={styles.toggleButton} onPress={() => this.props.closeModal()}>
                    <Icon
                        name='close'
                        color='black'
                        size={30}
                    />
                    </TouchableOpacity>
                    
                    <View style={{alignItems: 'center', justifyContent: 'center', height: '50%', marginTop: '5%'}}>
                        <Text style={styles.header}>How it works?</Text>
                        <View style={styles.imageContainer}>
                            <Image source={IMG} style={styles.imageStyle} resizeMode={'contain'}/>
                        </View>
                    </View>
                    <Text style={styles.textInfo}>Online coaches will provide services such as diet plans, workout plans
                        customized for your needs. Once a package is purchased, you can chat with the coach through
                        Fitzky mobile app.</Text>
                    <TouchableOpacity style={styles.bottomBtn} onPress={() => this.props.closeModal()}>
                        <Text style={styles.bottomBtnText}>Okay, Got it.</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    subContainer: {
        width: '90%',
        backgroundColor: Color.white,
        borderRadius: 10,
        paddingBottom:50
    },
    toggleButton: {
        width:40,
        height:40,
        position: 'absolute',
        right: 5,
        top: 5,
        justifyContent:'center',
        alignItems:'center',
    },
    header: {
        fontFamily: Font.Bold,
        fontSize: 20,
        lineHeight: 22,
        marginVertical: '5%',
        color: Color.black
    },
    imageContainer: {
        width: '70%',
        height: '70%',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    },
    textInfo: {
        fontFamily: Font.Medium,
        fontSize: 14,
        lineHeight: 16,
        color: Color.black,
        marginHorizontal: 20,
        marginTop: 10
    },
    bottomBtn: {
        width: '100%',
        height: 45,
        backgroundColor: Color.pinkBlue,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
    },
    bottomBtnText:{
        fontFamily:Font.SemiBold,
        fontSize:17,
        lineHeight:22,
        color:Color.white
    }
})

export default App;
