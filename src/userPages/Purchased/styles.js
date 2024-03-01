import {Dimensions, StyleSheet} from 'react-native';
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export const styles=StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:Color.white
    },
    AuthHolder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerStyle: {
        height: 50,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        marginBottom: 20,
        backgroundColor: 'transparent',
        alignItems: 'center',
        width: '100%',
        marginTop: -5,

    },
    listContainer: {
        width: screenWidth / 100 * 95,
        height: 187,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        marginBottom: '5%'
    },
    imageContainer: {
        width: '100%',
        height: '70%',
        backgroundColor: 'pink',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow:'hidden'

    },
    image: {
        width: '100%',
        height: '100%',
        zIndex: 1,
        position: 'absolute'
    },
    dotStyle: {
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        marginHorizontal:5,
        fontSize: 11,
        color: Color.white
    },
    subImageHolder: {
        width: 25,
        height: 25,
        borderRadius: 7,
        backgroundColor: 'rgba(100, 100, 100, 0.4)',
        marginLeft: 14
    },
    time: {
        fontSize: 12,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: Color.softDarkGray,
        zIndex: 4,

    },
    imageBottomLiner: {
        zIndex: 3,
        position: 'absolute',
        bottom: 5,
        width: '100%',
        height: 50,
        flex: 1
    },
    titleContent: {
        fontSize: 16,
        lineHeight: 18,
        fontFamily: Font.Medium,
        color: Color.white,
        marginLeft: 14
    },
    btnStyle: {
        position:'absolute',
        right:5,
        width: 110.82,
        height: 39.84,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: Color.lightGreen
    },
    btnTitle: {
        color: Color.white,
        fontSize: 12,
        fontFamily: Font.Bold,
        lineHeight: 22
    },
    imageOuter: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginHorizontal: 10
    },
    containerTitle: {
        color: Color.black,
        fontSize: 15,
        marginTop: 8,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
    },
    address: {
        fontFamily: Font.Medium,
        fontSize: 12,
        lineHeight: 22,
    },
    amountContainer: {
        marginLeft: 5,
        width: 60,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#D6FFDF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    amountText: {
        fontFamily: Font.Bold,
        fontSize: 12,
        lineHeight: 22,
        color: Color.darkGreen
    },
    timeMarker: {
        position: 'absolute',
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22,
        color: '#3E3E3E',
        marginTop: '2%'
    },
    bottomBtnHolder:{
        position:'absolute',
        right: 0,
        bottom:0,
    },
    bottomBtn: {
        width: screenHeight/100*15,
        height: screenHeight/100*15
    },
    searchOuter: {
        width: '95%',
        height: screenHeight / 100 * 8.5,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginVertical: '5%',
        borderColor: Color.inputBackground,
        borderWidth: 1,
    },
    searchTitle: {
        position: 'absolute',
        left: 13,
        fontFamily: Font.SemiBold,
        fontSize: 17,
        lineHeight: 22,
        color: Color.softDarkBlack,
        width: '85%'
    },
    searchIcon: {
        position: 'absolute',
        right: 16,
        width: 18,
        height: 17,
        top: screenHeight / 100 * 2.5
    },
    textFieldContainer:{
        width:'95%',
        height:55,
        marginBottom:'5%',
        justifyContent:'center',
        flexDirection:'row',
        backgroundColor:Color.white,
        borderRadius:10,
        borderWidth:1,
        borderColor:Color.softDarkBlack
    },
    gifHolder: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 90,
        height: 90,
    },
    ratingCount: {
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        marginLeft: 7,
        fontSize: 14,
        color: Color.white
    },
    mainTitle:{
        color: Color.black,
        fontSize: 17,
        lineHeight: 22,
        fontFamily: Font.Bold,
        marginHorizontal:10
    },
    mainTitleContainer:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:10,
        width:screenWidth,
    },
    amountContainer2: {
        // width: 60,
        height: 40,
        borderRadius: 10,
        backgroundColor: Color.lightBlue,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        paddingHorizontal: 5,
        marginRight: 5
    },
    amountText2: {
        fontFamily: Font.Bold,
        fontSize: 12,
        lineHeight: 22,
        color: Color.softBlue,

    },

})
