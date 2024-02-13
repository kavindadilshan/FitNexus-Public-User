import {Dimensions, StyleSheet} from "react-native";
import {Font} from "../../../constance/AppFonts";
import {Color} from "../../../constance/Colors";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const deviceScale = Math.round(Dimensions.get("window").scale);

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
    appName: {
        fontFamily: Font.Bold,
        color: Color.themeColor,
        fontSize: 20,
        lineHeight: 22
    },
    categoryName: {
        fontFamily: Font.SemiBold,
        color: Color.black1,
        fontSize: 15,
        lineHeight: 22
    },
    bannerContainer: {
        width: screenWidth,
        height: screenHeight > 667 ? screenHeight / 100 * 70 : screenHeight / 100 * 75,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25
    },
    exploreBtn: {
        backgroundColor: Color.themeColor,
        paddingHorizontal: 25,
        paddingVertical: 8,
        position: 'absolute',
        bottom: 0,
        borderRadius: 20
    },
    btnText: {
        color: Color.white,
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 16
    },
    trainerTitle: {
        color: Color.softDarkGray3,
        fontFamily: Font.SemiBold,
        fontSize: 18,
        lineHeight: 20
    },
    boldTitle: {
        fontFamily: Font.ExtraBold,
        color: Color.softDarkGray3,
        fontSize: 23,
        lineHeight: 25
    },
    imageStyle: {
        width: '100%', height: '100%',
    },
    trainerViewContainer: {
        width: deviceScale < 2 ? screenWidth / 100 * 95 : screenWidth / 100 * 90,
        marginVertical: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    more: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.black1,
    },
    subImag: {
        width: '95%',
        height: 254,
        marginVertical: 10
    },
    avatar: {
        width: 40,
        height: 40,
        marginVertical: 10
    },
    mediumTitle: {
        color: Color.black1,
        fontFamily: Font.Medium,
        fontSize: 18,
        lineHeight: 20
    },
    boldTitles: {
        color: Color.black1,
        fontFamily: Font.Bold,
        fontSize: 22,
        lineHeight: 24,
        marginBottom: 15
    },
    classTypeContainer: {
        width: 110,
        height: 160,
        borderRadius: 10,
        zIndex: 0,
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 1,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
        marginVertical: 8,
        padding: 5,
        backgroundColor: Color.white,
    },
    typeImg: {
        width: '100%',
        height: 88,
        marginBottom: 5,
    },
    typeTitle: {
        color: Color.black1,
        fontFamily: Font.Bold,
        fontSize: 20,
        lineHeight: 22,
    },
    countTitle: {
        color: Color.softDarkGray3,
        fontFamily: Font.Medium,
        fontSize: 16,
        lineHeight: 18
    },
    subTitle: {
        color: Color.black1,
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 15,
        position: 'absolute',
        bottom: 5
    },
    classTypeSubContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: '10%',
        width: '95%',
        justifyContent: 'center'
    },
    joinBtn: {
        backgroundColor: Color.gradientWhite,
        paddingVertical: 20,
        paddingHorizontal: 30,
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 50,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 1,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    joinBtnText: {
        color: Color.themeColor,
        fontFamily: Font.Bold,
        fontSize: 24,
        lineHeight: 26,
    },

    QAndAContainer: {
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: Color.softLightBlack2,
        flex: 1,
        marginTop: 30
    },
    subContainer: {
        width: '100%',
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%',
    },
    textStyle: {
        fontFamily: Font.SemiBold,
        fontSize: 16,
        lineHeight: 22,
        color: Color.black
    },
    QAndAMainTile: {
        fontFamily: Font.Medium,
        fontSize: 20,
        lineHeight: 22,
        color: Color.black,
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 20
    },
    image2: {
        width: 15,
        height: 15,
        position: 'absolute',
        right: '5%',
    },

    colspanContainer: {
        width: '100%',
        paddingHorizontal: '5%',
        paddingBottom: '5%',
        backgroundColor: Color.softLightBlack3
    },
    textContent: {
        fontSize: 13,
        fontFamily: Font.Regular,
        color: Color.black2,
        lineHeight: 14
    },
    bottomContainer: {
        width: '100%',
        height: 70,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: 5
    },
    bottomButton: {
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
})
