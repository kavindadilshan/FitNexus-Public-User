import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, BackHandler, StatusBar } from 'react-native';
import IMG from '../../assets/Profile/added.png'
import { Color } from "../../constance/Colors";
import { Font } from "../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', function () { return true })
    }

    render() {
        const { navigation } = this.props;
        const title = navigation.getParam('title');
        const page = navigation.getParam('page');
        const id = navigation.getParam('id');
        const role = navigation.getParam('role');
        const newCard = navigation.getParam('newCard') !== null ? navigation.getParam('newCard') : false;

        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white} />
                <Text style={{ ...styles.textStyle, marginTop: '15%' }}>{title}</Text>
                <Text style={styles.textStyle}>Successfully.</Text>
                <View style={newCard?{...styles.imageHolder,marginTop:'15%'}:styles.imageHolder}>
                    <Image source={IMG} style={{ width: '100%', height: '100%' }} resizeMode={'stretch'} />
                </View>

                {newCard ? (
                    <View style={{ width: '100%', alignItems: 'center', marginTop: '5%' }}>
                        <Text style={styles.textStyle}>Why don't you save your card?</Text>
                        <TouchableOpacity style={styles.btnAddCard} onPress={() => navigation.navigate('UpdateCardForm',{
                            page:page,
                            sessionId: id,
                            role: role,
                            refresh: true
                        })}>
                            <Text style={styles.btnContent}>Add to My Cards</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate(page, {
                            sessionId: id,
                            role: role,
                            refresh: true
                        })}>
                            <Text style={styles.bottomTitle}>Skip for now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.btnSignUp} onPress={() => navigation.navigate(page, {
                        sessionId: id,
                        role: role,
                        refresh: true
                    })}>
                        <Text style={styles.btnContent}>Done</Text>
                    </TouchableOpacity>
                )}


            </View>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

    },
    textStyle: {
        fontFamily: Font.Bold,
        color: Color.darkGray,
        fontSize: 18,
        lineHeight: 22,
    },
    imageHolder: {
        marginTop: '20%',
        width: screenHeight / 100 * 45,
        height: screenHeight / 100 * 45,
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
    btnAddCard: {
        backgroundColor: Color.themeColor,
        width: '95%',
        height: 55,
        borderRadius: 10,
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
        marginVertical:'5%'
    },
    btnContent: {
        color: Color.white,
        fontFamily: Font.SemiBold
    },
    bottomTitle: {
        fontFamily: Font.Medium,
        color: 'blue',
        marginLeft: 5
    }

});

export default App;
