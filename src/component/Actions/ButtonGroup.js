import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Color} from "../../constance/Colors";
import {ButtonGroup} from "react-native-elements";
import {Font} from "../../constance/AppFonts";

class app extends Component {
    render() {
        return (
            <ButtonGroup
                buttons={this.props.buttons}
                onPress={this.props.onPress}
                selectedIndex={this.props.selectedIndex}
                containerStyle={styles.containerStyle}
                selectedButtonStyle={{
                    backgroundColor: this.props.bgColor,
                    borderWidth: 0
                }}
                selectedTextStyle={{color: Color.white}}
                innerBorderStyle={{color: 'transparent',}}
                textStyle={styles.btnGroupText}
                buttonStyle={styles.btnGroupStyle}

            />
        );
    }
}

export const styles=StyleSheet.create({
    containerStyle: {
        height: 45,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        marginBottom: 10,
        backgroundColor: 'transparent',
        width: '95%',
    },
    btnGroupText:{
        fontSize: 15,
        fontFamily: Font.Medium,
        lineHeight: 22,
        color: Color.softDarkGray3
    },
    btnGroupStyle:{
        width: '75%',
        borderRadius: 10,
        marginLeft: '13%',
        borderColor: Color.softDarkGray3,
        borderWidth: 1,
    },
});

export default app;
