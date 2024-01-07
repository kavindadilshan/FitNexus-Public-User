import {Dimensions, StyleSheet} from 'react-native';
import {Color} from "../../../../constance/Colors";
import {Font} from "../../../../constance/AppFonts";

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

const screenHeight = Math.round(Dimensions.get('window').height);

export default StyleSheet.create({
    safeArea: {
        height:'100%',
        backgroundColor: Color.white
    },
    container: {
        backgroundColor: Color.white,

    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1
    },
    exampleContainer: {
        paddingVertical: 0,
    },
    exampleContainerDark: {
        backgroundColor: Color.white
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleDark: {
        color: Color.white
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible', // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 50,
        marginHorizontal: 0
    },
    sliderTitle:{
        marginHorizontal:10,
        textAlign: 'center',
        fontFamily: Font.Medium,
        fontSize:15
    },
    skipBtn:{
       alignItems:'flex-end',
        paddingRight:'4%',
        marginTop:'20%',
    },
    skipBtnText:{
        color:Color.whiteGray,
        fontFamily: Font.Medium,
        fontSize:15,
    },
    btnSignUp: {
        backgroundColor: Color.themeColor,
        width: '95%',
        height: 55,
        borderRadius: 10,
        marginVertical: '10%',
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
    },
    btnContent: {
        color: Color.white,
        fontFamily: Font.SemiBold
    },
});
