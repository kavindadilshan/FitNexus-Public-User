import {Dimensions, StyleSheet} from 'react-native';
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%',
        height:'100%',
        backgroundColor: Color.softWhite1,
        alignItems: 'center',
    },

    containerStyle: {
        height: 50,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        marginBottom: 20,
        backgroundColor: Color.softLightGray,
        alignItems: 'center',
        width: '90%',
        borderRadius:20

    },
    profilePicOuter: {
        width: '100%',
        height: '100%',
        borderRadius: 10000,
        borderColor: Color.themeColor,
        borderWidth: 5,
        zIndex: 2,
        position: 'absolute',
    },
    profilePicHolder: {
        width: screenWidth / 100 * 30,
        height: screenWidth / 100 * 30,
        borderRadius: 100,
        marginTop: '3%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        zIndex: 1,
        overflow: "hidden",
    },
    edit: {
        width: 25,
        height: 25,
        backgroundColor: 'transparent',
        position: 'absolute',
        borderRadius: 100,
        zIndex: 2,
        right: -15,
        bottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    edit2: {
        width: 25,
        height: 25,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        backgroundColor:Color.themeColor,
        padding:6
    },
    headTitle: {
        fontFamily: Font.Bold,
        fontSize: 18,
        lineHeight: 22,
        color: Color.darkGray,
        marginTop: 10
    },
    mobileNumberStyle: {
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 22,
        color: Color.black,
    },
    bodyContainer: {
        width: '100%',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: Color.white,
        marginTop: '10%',
    },
    touchOuter: {
        flexDirection: 'row',
        width: '100%',
        height: screenHeight / 100 * 9.5,
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 5
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12
    },
    bodyTitle: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.darkGray,
        marginLeft: 13
    },
    headlineTitle: {
        fontSize: 22,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: Color.black,
        marginLeft: 20,
        marginTop: '10%'
    },
    headlineTitle1: {
        fontSize: 22,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: Color.black,
        backgroundColor:Color.softWhite1,
        paddingLeft:20,
        paddingTop:'10%',
        paddingBottom:'20%'
    },
    updateButton: {
        width: '95%',
        height: 58,
        backgroundColor: Color.themeColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: '5%'
        // marginTop:'20%'
        // position: 'absolute',
        // bottom:10
    },
    buttonContent: {
        fontFamily: Font.SemiBold,
        color: Color.white,
        fontSize: 15,
        lineHeight: 22
    },
    title: {
        fontFamily: Font.Medium,
        color: Color.softDarkBlack,
        fontSize: 15,
        // lineHeight:22,
        width: '100%',
        marginLeft: '10%',
        marginTop: 2
    },
    title2: {
        fontFamily: Font.Medium,
        color: Color.softDarkBlack,
        fontSize: 15,
        width: '100%',
        marginLeft: '5%',
        marginTop: 2
    },
    labelText: {
        fontFamily: Font.Medium,
        color: Color.softDarkBlack,
        fontSize: 18,
    },
    textFieldContainer: {
        width: '95%',
        height: 57,
        marginVertical: '5%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Color.inputBackground,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color.softDarkBlack
    },
    textFieldContainer2: {
        width: '95%',
        height: 40,
        justifyContent: 'center',
        flexDirection: 'row',
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 1.5,
        borderColor: Color.black1
    },
    label: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: Color.softDarkBlack
    },
    container2: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    picker: {
        width: '100%',

    },
    country: {
        position: 'absolute',
        left: '20%',
        top: 10,
        fontSize: 16,
        lineHeight: 22,
        color: Color.black,
        fontFamily: Font.Medium
    },
    flagOuter: {
        position: 'absolute',
        left: 15,
        top: 10
    },
    flagOuter2: {
        position: 'absolute',
        left: 0,
        top: 5
    },
    flagContainer: {
        width: 1,
        height: '100%',
        position: 'absolute',
        left: 65,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: Color.softDarkBlack
    },
    picker1: {
        height: 62,
        width: '90%',
        backgroundColor: Color.inputBackground,
        borderRadius: 10,
        marginVertical: '5%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    promoBtn:{
        width:60,
        height:55,
        backgroundColor:Color.themeColor,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
    },
    code: {
        color: '#676767',
        fontFamily: Font.Bold,
        fontSize: 17,
        lineHeight: 28,
        width:'35%',
    },
    searchOuter: {
        width: '90%',
        height: 50,
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
        marginTop: '5%',
        borderColor: Color.inputBackground,
        borderWidth: 1,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    searchTitle: {
        // position: 'absolute',
        // left: 13,
        fontFamily: Font.SemiBold,
        fontSize: 16,
        height: '100%',
        color: Color.softDarkBlack,
        width: '85%',
        alignItems: 'center',
        marginLeft: '3%'
    },
    searchIcon: {
        position: 'absolute',
        right: 16,
    },
    subContainer: {
        width: '100%',
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderBottomColor: Color.inputBackground,
        borderBottomWidth: 1,
        paddingHorizontal: '5%',
    },
    textStyle: {
        fontFamily: Font.SemiBold,
        fontSize: 16,
        lineHeight: 22,
        color: Color.lightGray
    },
    textStyle2: {
        fontFamily: Font.Medium,
        fontSize: 12,
        lineHeight: 22,
        color: Color.lightBrown2,
        marginVertical: '2%'
    },
    textPrivacy: {
        fontFamily: Font.Medium,
        fontSize: 13,
        lineHeight: 22,
        color: Color.lightBrown2,
        marginVertical: '2%'
    },
    dotStyle: {
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        marginVertical: '2%',
        marginRight: 10,
        marginLeft:20,
        fontSize: 10,
        color: Color.lightBrown2
    },
    textPrivacyTitle: {
        fontFamily: Font.Bold,
        fontSize: 15,
        lineHeight: 22,
        color: Color.lightBrown2,
        marginVertical: '2%'
    },
    image2: {
        width: 15,
        height: 10,
        position: 'absolute',
        right: '5%',
    },
    colspanContainer: {
        width: '100%',
        paddingHorizontal: '5%',
        paddingVertical: '10%'

    },
    count: {
        fontFamily: Font.Bold,
        color: Color.darkGreen,
        fontSize: 14,
        lineHeight: 22
    },
    subBodyContainer: {
        width: '95%',
        flex:1,
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomColor: Color.softLightBrown,
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical:10,
    },
    subBodyContainer1: {
        width: '95%',
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomColor: Color.softLightBrown,
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical:10,
    },
    promoCodeContainer: {
        width: '90%',
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginVertical: '3%',
        padding: 10,
    },
    dateStyle: {
        fontFamily: Font.SemiBold,
        color: Color.black,
        fontSize: 17,
        lineHeight: 22,
    },
    userNameStyle: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.softLightGray1
    },
    discountOuter: {
        width: '100%',
        height: 40,
        backgroundColor: Color.softLightGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    contactOuter: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90%'
    },
    contactHolder: {
        width: '90%',
        height: 63,
        borderRadius: 10,
        borderColor: Color.borderGary,
        borderWidth: 1,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentOuter: {
        width: '32%',
        height: '75%',
        borderRightWidth: 0.5,
        borderRightColor: Color.borderGary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 2
    },
    contactTitle: {
        fontFamily: Font.Bold,
        fontSize: 10,
        lineHeight: 22,
        color: Color.TitleGray,
    },
    dataStyle: {
        fontFamily: Font.Bold,
        fontSize: 15,
        lineHeight: 22,
        color: Color.black
    },
    miniCurrency: {
        fontFamily: Font.SemiBold,
        fontSize: 10,
        lineHeight: 22,
        color: Color.softLightGray1,
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
    membershipTypeContainer: {
        backgroundColor: Color.darknessGreen,
        paddingHorizontal:10,
        height: 23,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom:15
    },
    membershipTypeContainerTitle: {
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        fontSize: 12,
        color: Color.white
    },
    verifyText:{
        fontFamily:Font.Bold,
        fontSize:10,
        lineHeight:22,
        color:Color.lightGreen,
        marginLeft:15,
        marginRight:5
    },
    verifyButtonText:{
        fontFamily:Font.SemiBold,
        fontSize:16,
        lineHeight:22,
        color:Color.lightGreen,
    },
    verifyButton:{
        width: '95%',
        height: 58,
        backgroundColor: Color.white,
        borderWidth:2,
        borderColor:Color.darkGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: '5%',
    },
    promoLabelOuter:{
        marginLeft: 10,
        height: 25,
        justifyContent: 'center',
        alignItems:'center',
        paddingHorizontal:10,
        position:'absolute',
        left: '32.5%',
    },
    promoLabelText:{
        fontFamily:Font.SemiBold,
        fontSize:14,
        lineHeight:17,
        color:Color.white,
        zIndex: 1,
        textAlign:'center'
    },
    promoSubTxt:{
        fontFamily:Font.SemiBold,
        fontSize:12,
        lineHeight:14,
        color:Color.lightGray,
    },
    promoSubContainer:{
        position:'absolute',
        right:0,
    }



})
