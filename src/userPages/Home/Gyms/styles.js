import {Dimensions, StyleSheet} from 'react-native';
import {Color} from "../../../constance/Colors";
import {Font} from "../../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export const styles=StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        height: screenHeight / 100 * 18,
        alignItems: 'center',
        marginTop:5
    },
    imageHolder: {
        width: '30%',
        height: '90%',
        marginLeft: 10,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        overflow: 'hidden'
    },
    headerTitle: {
        color: Color.softLightGray1,
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 20
    },
    heilight: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22
    },
    btnStyle: {
        width: 66.32,
        height: 26.16,
        backgroundColor: Color.lightGreen,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listContainer: {
        width: 148.13,
        height: 138.31,
        borderRadius: 10,
        marginRight: 5,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginBottom: 8,
        overflow: 'hidden'
    },
    horizontalImageHolder: {
        width: '98%',
        marginLeft: 10,
        marginTop: 30,
        marginBottom:10
    },
    subTitle: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.softDarkGray,
    },
    headline: {
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 22,
        marginTop: '2%',
        marginLeft: 10
    },
    pharagraph: {
        fontSize: 15,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: Color.softLightGray3,
    },
    classesListContainer: {
        width: '95%',
        height: 45,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        backgroundColor: Color.white,
        marginBottom: 5,
        alignItems: 'center',
        // justifyContent:'center',
        flexDirection: 'row'
    },
    title: {
        fontFamily: Font.Medium,
        fontSize: 13,
        lineHeight: 22,
        color: Color.darkGray,
        marginLeft: 10
    },
    iconContainer: {
        width: 33.41,
        height: 31.74,
        marginLeft: 10
    },
    info: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        marginLeft: 10,
        color: Color.darkGray,
        width: '100%'
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    },
    categoryContent: {
        width: '100%',
        height: '65%',
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginVertical: '5%',
        overflow: 'hidden'
    },
    categoryTitle: {
        fontSize: 15,
        fontFamily: Font.Medium,
        lineHeight: 22
    },
    address: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        marginLeft: 10,
        color: Color.darkGray,
        flex:1
    },
    imageHolder1: {
        width: '100%',
        height: '100%',
        zIndex: 1,

    },
    imageHolder2: {
        width: '100%',
        height: '100%',
        zIndex: 2,
        position: 'absolute'
    },
    ratingText: {
        fontSize: 14,
        color: '#4B6883',
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        marginLeft: 7,
        marginTop: 5
    },
    gifHolder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 90,
        height: 90,
    },
    addressHolder:{
        flex: 1,
        paddingVertical:10,
        marginHorizontal:10,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical:10
    },
    btnTitle: {
        color: Color.white,
        fontSize: 12,
        fontFamily: Font.Bold,
        lineHeight: 22
    },
    dropDownStyle:{
        width: 22,
        height: 22,
        marginLeft: 10,
        marginTop: '2%',
    },
    dotStyle:{
        fontSize:10,
        color: Color.softLightGray3,
        marginLeft:10,
        marginRight: 5
    },
    bottomContainer: {
        width: '100%',
        height: 70,
        backgroundColor: Color.white,
        position: 'absolute',
        bottom: 0,
        justifyContent:'center',
        flexDirection:'row',
        paddingTop:5
    },
    bottomBtn: {
        width: '95%',
        height: '80%',
        backgroundColor: Color.themeColor,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBtnText: {
        fontFamily: Font.Bold,
        fontSize: 15,
        lineHeight: 22,
        color: Color.white
    },
    rateTitle:{
        fontFamily: Font.SemiBold,
        fontSize: 10,
        lineHeight: 15,
        color: Color.softDarkGray1,
        textDecorationLine: 'underline',
    },
    viewMoreTitle:{
        fontFamily: Font.SemiBold,
        color: Color.themeColor,
        fontSize:12,
        marginTop:10
    },
    membershipContainer: {
        paddingVertical:10,
        borderRadius: 10,
        backgroundColor: Color.themeColor,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal:10,
        marginBottom:10,
    },
    viewAllBtn: {
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
    },
    locationOuter:{
        width:30,
        height:30,
        marginRight:5,
        marginTop:2
    },
    timeImg:{
        width:23,
        height:23,
        marginHorizontal:10,
    }
})
