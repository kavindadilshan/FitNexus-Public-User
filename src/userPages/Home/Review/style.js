import {Dimensions, StyleSheet} from "react-native";
import {Color} from "../../../constance/Colors";
import {Font} from "../../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export const styles = StyleSheet.create({
    main: {
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        fontSize: 15,
        color: '#2C2C2C',
        marginVertical: 10
    },
    reviewComment: {
        width: '94%',
        height: screenHeight / 100 * 30,
        backgroundColor: Color.softLightGray,
        marginTop: 10,
        borderRadius: 10,
        marginBottom: 30,
    },
    inputContainerStyle: {
        margin: 10,
        width: '90%',
    },
    inputStyle: {
        backgroundColor: Color.softlightGray,
    },
    inputTextStyle: {
        paddingHorizontal: 10,
        color: '#858585',
    },
    body: {
        width: '100%',
        backgroundColor: Color.softLightGray,
        borderRadius: 10,
        paddingLeft: '3%',
        paddingTop: '3%',
        paddingBottom: 20,
        fontFamily: Font.Medium,
        textAlignVertical: 'top',
        fontSize: screenHeight / 100 * 2.5,
        color:'#858585'
    },
    button: {
        width: '95%',
        height:  55,
        margin: 10,
        position: 'absolute',
        bottom: 0,
        backgroundColor: Color.themeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    gifHolder2: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif2: {
        width: 60,
        height: 60,
    },
});
