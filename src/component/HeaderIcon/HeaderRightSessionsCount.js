import React, { Component } from "react";
import { Dimensions, StyleSheet, View, Text, Image } from 'react-native';
import { Color } from "../../constance/Colors";
import Count1 from '../../assets/Home/count1.png';
import Count2 from '../../assets/Home/count2.png';
import { Font } from "../../constance/AppFonts";


class App extends Component {

    render() {
        return (
            <View>
                <View style={styles.toggleButton}>
                    <View style={{ flexDirection: 'column',justifyContent:'center',alignItems:'center',borderRightWidth:1,borderRightColor:Color.softGray }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 20, height: 20 }}>
                                <Image source={Count1} style={{ width: '100%', height: '100%' }} />
                            </View>
                            <Text style={styles.textStyle}>{this.props.count1}</Text>
                        </View>
                        <Text style={styles.description}>Total</Text>
                    </View>
                    <View style={{ flexDirection: 'column',justifyContent:'center',alignItems:'center',marginLeft:5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 20, height: 20 }}>
                                <Image source={Count2} style={{ width: '100%', height: '100%' }} />
                            </View>
                            <Text style={styles.textStyle}>{this.props.count2}</Text>
                        </View>
                        <Text style={styles.description}>Available</Text>
                    </View>

                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    toggleButton: {
        marginRight: 20,
        paddingVertical:5,
        height: '70%',
        borderRadius: 10,
        backgroundColor: '#EBF6EE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8
    },
    textStyle: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22,
        color: Color.black1,
        marginHorizontal: 4
    },
    description: {
        fontFamily: Font.SemiBold,
        fontSize: 9,
        lineHeight: 12,
        color: Color.softGray
    }
});


export default App;
