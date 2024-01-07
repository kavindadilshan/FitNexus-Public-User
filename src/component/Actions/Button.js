import React, {PureComponent} from 'react'
import {
    View,
    Text,
    TouchableHighlight,
    ActivityIndicator,
    Platform,
    StyleSheet, Image,
    TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import {Color} from "../../constance/Colors";
import Card from "../../assets/Profile/Card.png";
import Add from "../../assets/Profile/add.png";
import {Font} from "../../constance/AppFonts";

export default class Button extends PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
        disabledText: PropTypes.string,
        loading: PropTypes.bool,
        disabled: PropTypes.bool,
        style: PropTypes.any,
        onPress: PropTypes.func.isRequired,
    }

    static defaultProps = {
        disabledText: '',
        loading: false,
        disabled: false,
        style: undefined,
    }

    handlePress = (event) => {
        const {loading, disabled, onPress} = this.props

        if (loading || disabled) {
            return
        }

        if (onPress) {
            onPress(event)
        }
    }

    render() {
        const {text, disabledText, loading, disabled, style, ...rest} = this.props

        return (
            <TouchableOpacity
                style={[styles.btnStyle, style]}
                underlayColor="rgba(0,0,0,0.5)"
                onPress={this.handlePress}
                disabled={loading}
            >
                {loading?(
                    <ActivityIndicator
                        animating
                        size="small"
                    />

                ):(
                    <Text style={styles.btnContent}>{text}</Text>
                )}



            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        margin: 10,
        height: Platform.OS === 'ios' ? 35 : 40,
        minWidth: 160,
        overflow: 'hidden',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    btnTitle: {
        color: Color.white,
        marginLeft: 10,
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 22,
    },
    btnStyle: {
        backgroundColor: Color.themeColor,
        width: '95%',
        height: 55,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginTop: '3%'
    },
    btnContent: {
        color: Color.white,
        fontFamily: Font.SemiBold
    },
})
