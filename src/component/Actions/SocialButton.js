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
import Apple from "../../assets/Auth/appleIcon.png";
import {Font} from "../../constance/AppFonts";

export default class Button extends PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
        disabledText: PropTypes.string,
        loading: PropTypes.bool,
        disabled: PropTypes.bool,
        style: PropTypes.any,
        onPress: PropTypes.func.isRequired,
        image: PropTypes.string,
        apple:PropTypes.bool,
    }

    static defaultProps = {
        disabledText: '',
        loading: false,
        disabled: false,
        style: undefined,
        image:'',
        apple:false
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
        const {text, disabledText, loading, disabled, style,image,apple, ...rest} = this.props

        return (
            loading ? (
                <View
                    style={{...styles.btnStyle, opacity: 0.75}}
                    underlayColor="rgba(0,0,0,0.5)"
                    onPress={this.handlePress}
                >
                    <Image source={image} style={apple?{...styles.iconStyle,width:25}:styles.iconStyle}/>
                    <View style={{position: 'absolute', left: '45%'}}>
                        <ActivityIndicator
                            animating
                            size="small"
                            color={Color.black}
                        />
                    </View>

                </View>
            ) : (
                <TouchableOpacity
                    style={[styles.btnStyle, style]}
                    underlayColor="rgba(0,0,0,0.5)"
                    onPress={this.handlePress}
                >
                    <Image source={image} style={apple?{...styles.iconStyle,width:25}:styles.iconStyle}/>
                    <Text style={styles.btnContent}>{text}</Text>

                </TouchableOpacity>
            )


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
        backgroundColor:Color.white,
        width:'95%',
        height:55,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems:'center',
        marginVertical: 5,
        borderColor:Color.black,
        borderWidth:1
    },
    btnContent: {
        color: Color.black,
        fontFamily: Font.SemiBold
    },
    iconStyle:{
        position:'absolute',
        left:'5%',
        width:32,
        height:32,
    },
})
