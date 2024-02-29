import React from 'react';
import { Image, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Empty from "../../assets/Home/empty.png";
import { Font } from "../../constance/AppFonts";
import { Color } from "../../constance/Colors";

const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component {
    render() {
        const { navigation } = this.props;
        const page = 'Home';
        return (
            <View style={styles.container}>
                <View style={{ width: 300, height: 300 ,marginBottom:10}}>
                    <Image source={Empty} style={{ width: '100%', height: '100%' }}
                        resizeMode={'contain'} />
                </View>

                {this.props.message===undefined?(
                    <Text style={{...styles.alert,fontSize:14}}>There's <Text
                    style={styles.alertWord}>nothing</Text> happening here!</Text>
                ):(
                    <View style={{width:'95%',alignItems:'center',justifyContent:'center'}}>
                        <Text style={styles.alert}>{this.props.message}</Text>
                    </View>

                )}




                {/* <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => navigation.navigate(page)}
                >
                    <Text style={styles.buttonContent}>Let's Explore</Text>
                </TouchableOpacity> */}

            </View>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:10
    },
    alert: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.softDarkGray1,
        textAlign:'center'
    }
    ,
    alertWord: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.themeColor,
    }
    ,
    updateButton: {
        width: '95%',
        height: 58,
        backgroundColor:
            Color.themeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginVertical: '5%'
    }
    ,
    buttonContent: {
        fontFamily: Font.SemiBold,
        color:
            Color.white,
        fontSize: 15,
        lineHeight: 22
    }
    ,
})

export default App;
