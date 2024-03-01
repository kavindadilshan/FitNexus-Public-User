import { Dimensions, Image, Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import React from "react";
import { Font } from '../../constance/AppFonts';
import { Color, Color as Colors } from '../../constance/Colors';

const { width, height } = Dimensions.get('window');

const AppCallModal = (props) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{props.message}</Text>
                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'center',
                        marginTop: '20%'
                    }}>
                        <TouchableOpacity
                            style={{
                                ...styles.openButton,
                                backgroundColor: Colors.lightGreen,
                                marginRight:10
                            }}
                            onPress={() => {
                                props.onYes();
                            }}
                        >
                            <Text style={styles.textStyle}>{'Rete'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                ...styles.openButton,
                                backgroundColor: Colors.white,
                                marginLeft: 10,
                            }}
                            onPress={() => {
                                props.onNo();
                            }}
                        >
                            <Text style={{ ...styles.textStyle, color: Color.black }}>{'Not now'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalView: {
        margin: 20,
        backgroundColor: Colors.white,
        padding: 35,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 15,
        height:180,
        width:'80%'
    },
    openButton: {
        width: 102,
        height: 43,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    textStyle: {
        color: Colors.white,
        fontFamily: Font.SemiBold,
        textAlign: "center"
    },
    modalText: {
        fontSize: 18,
        lineHeight: 22,
        fontFamily: Font.Medium,
        color: Color.black,
        textAlign: "center",
    }
});

export default AppCallModal;
