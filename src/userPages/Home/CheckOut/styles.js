import {Dimensions, StyleSheet} from "react-native";
import {Font} from "../../../constance/AppFonts";
import {Color} from "../../../constance/Colors";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: screenHeight
    },
    alertBox:{
        width:'100%',
        height:45,
        backgroundColor:Color.darklessRed,
        alignItems:'center',
        justifyContent:'center'
    },
    alertText:{
        fontFamily:Font.SemiBold,
        color:Color.white,
        fontSize:14,
        lineHeight:22
    },
    amount: {
        fontFamily: Font.SemiBold,
        color: Color.black,
        fontSize: 36,
        lineHeight: 37,
        marginVertical: '5%'
    },
    mainTitle: {
        fontFamily: Font.SemiBold,
        color: Color.lightGray,
        fontSize: 17,
        lineHeight: 22,
    },
    subTitle: {
        fontFamily: Font.Medium,
        fontSize: 14,
        lineHeight: 22,
        color: Color.softGray
    },
    cardHolder: {
        width: '100%',
        height: 85,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginVertical: 5,
    },
    descriptionHolder: {
        width: '95%', justifyContent: 'center', paddingHorizontal: '5%',
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginVertical: 5,
        paddingVertical:10
    },
    okImage: {
        width: 22.76,
        height: 22.76,
        position: 'absolute',
        right: 10,
        top: 30,
    },
    okImage2: {
        width: 22.76,
        height: 22.76,
        position: 'absolute',
        right: 10,
        top: '55%'
    },
    btnStyle: {
        backgroundColor: Color.themeColor,
        width: '95%',
        height: 55,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginVertical: 20,
    },
    btnContent: {
        color: Color.white,
        fontFamily: Font.SemiBold
    },
    buttonOutline: {
        backgroundColor: Color.softBlue,
        width: '95%',
        height: 55,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginVertical: 20,
        flexDirection: 'row'
    },
    imageHolder: {
        width: 40,
        height: 40,
        position: 'absolute',
        left: 20
    },
    membershipContainer: {
        height: 85,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginVertical: 5,
        width: '95%',
        justifyContent: 'center',
        paddingLeft: '5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    promoSubTxt:{
        fontFamily:Font.SemiBold,
        fontSize:12,
        lineHeight:14,
        color:Color.lightGray,
    },
    promoCodeContainer: {
        marginHorizontal: 10,
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
        marginVertical: 5,
        padding: 10,
        paddingVertical:15,
        flexDirection:'row',
        alignItems:'center'
    },
    code: {
        color: '#676767',
        fontFamily: Font.Bold,
        fontSize: 18,
        lineHeight: 28
    },
    promoLabelOuter:{
        marginLeft: 10,
        height: 25,
        justifyContent: 'center',
        alignItems:'center',
        paddingHorizontal:10,
        position:'absolute',
        left: '35%',
        top:'55%'
    },
    promoLabelText:{
        fontFamily:Font.SemiBold,
        fontSize:14,
        lineHeight:17,
        color:Color.white,
        textAlign:'center',
    },
    addPromoCodeCompo:{
        marginHorizontal: 10,
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
        marginVertical: 5,
        paddingVertical:25,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    addPromoTxt:{
        fontFamily:Font.SemiBold,
        fontSize:15,
        lineHeight:22,
        color:Color.themeColor,
        marginLeft:5
    },
    miniPromoCode:{
        width:'32%',
        height:30,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Color.blueGreen,
        borderRadius:5,
        flexDirection:'row',
        position:'absolute',
        right:10
    },
    addPromoMiniTxt:{
        fontFamily:Font.SemiBold,
        fontSize:12,
        lineHeight:13,
        color:Color.white,
        marginLeft:2
    },
});
