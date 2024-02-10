import {Dimensions, StyleSheet} from 'react-native'
import {Color} from "../../../../constance/Colors";
import {Font} from "../../../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);
const deviceScale = Math.round(Dimensions.get("window").scale);

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    searchOuter: {
        width: '95%',
        height: 45,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 2,
        shadowColor: Color.black,
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        marginVertical: '3%',
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
        // width: 18,
        // height: 17,
        // top: 13
    },
    AuthHolder: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    pickerContainer: {
        // justifyContent: 'flex-start',
        alignItems: 'center',
        // marginTop: 25,
    },
    categoryHolder: {
        width: screenWidth,
        paddingVertical: 5,
        borderTopColor: Color.softWhite,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: Color.softWhite,
        // alignItems: 'center',
        // justifyContent:'center',
        paddingLeft: 10,
    },
    categoryBtn: {
        width: '23%',
        height: 40,
        backgroundColor: Color.white,
        borderRadius: 10,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Color.softDarkGray3,
        borderWidth: 1,
    },
    categoryTitle: {
        width: '95%',
        color: Color.softDarkGray3,
        fontFamily: Font.Medium,
        textAlign: 'center'
    },
    listContainer: {
        width: screenWidth / 100 * 95,
        height: 187,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 1,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginBottom: 10
    },
    businessContainer: {
        width: screenWidth / 100 * 95,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 1,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        paddingVertical: 10,
    },
    imageContainer: {
        width: '100%',
        height: '70%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: "hidden",
    },
    image: {
        width: '100%',
        height: '100%',
        zIndex: 1,
        position: 'absolute',

    },
    subImageHolder: {
        width: 25,
        height: 25,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
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
        // position: 'absolute',
        // width: 110.82,
        // right: 5,
        paddingHorizontal: 10,
        height: 39.84,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: Color.lightGreen
    },
    btnTitle: {
        color: Color.white,
        fontSize: 10,
        fontFamily: Font.Bold,
        lineHeight: 22
    },
    imageOuter: {
        width: 85,
        height: 85,
        borderRadius: 6,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    imageOuter2: {
        width: 107,
        height: 107,
        borderRadius: 6,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    },
    containerTitle: {
        color: Color.black,
        fontSize: 15,
        lineHeight: 15,
        fontFamily: Font.SemiBold,
    },
    address: {
        fontFamily: Font.Medium,
        fontSize: 12,
        lineHeight: 20,
        color: Color.softLightGray1
    },
    amountContainer: {
        // width: 60,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // position: 'absolute',
        // right: 120,
        paddingHorizontal: 5,
        marginRight: 5
    },
    amountText: {
        fontFamily: Font.Bold,
        fontSize: 12,
        lineHeight: 22,
        color: Color.themeColor,

    },
    timeMarker: {
        position: 'absolute',
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22,
        color: '#3E3E3E',
        marginTop: '2%'
    },
    bottomBtnHolder: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    bottomBtn: {
        width: screenHeight / 100 * 15,
        height: screenHeight / 100 * 15
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
    timeSlotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
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
        paddingVertical: 10
    },
    nameTitle: {
        color: Color.black,
        fontSize: 15,
        marginTop: 8,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
    },
    title: {
        color: Color.softLightGray3,
        fontSize: 13,
        lineHeight: 21,
        fontFamily: Font.Medium,

    },
    ratingCount: {
        fontFamily: Font.Regular,
        lineHeight: 22,
        marginLeft: 7,
        fontSize: 14,
        color: Color.white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dotStyle: {
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        marginHorizontal: 5,
        fontSize: 11,
        color: Color.white
    },
    labelContainer: {
        width: 60,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    labelImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 0
    },
    currency: {
        fontFamily: Font.Bold,
        color: Color.softDarkBlue,
        lineHeight: 22,
        fontSize: 14,
        marginRight: 5
    },
    mainTitle: {
        color: Color.black,
        fontSize: 17,
        lineHeight: 22,
        fontFamily: Font.Bold,
        marginHorizontal: 10
    },
    mainTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    rateTitle: {
        fontFamily: Font.SemiBold,
        fontSize: 10,
        lineHeight: 15,
        color: Color.softDarkGray1,
        textDecorationLine: 'underline',
    },
    filterTitle: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 16,
        color: Color.softDarkGray3,
        marginTop: 5,
        marginBottom: 10
    },
    checkBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        paddingRight: 10
    },
    corporativeTitle: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 16,
        color: Color.softDarkGray3,
        marginLeft: 10,
    },
    timeDurationContent: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        backgroundColor: Color.softGrayBlue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 8,
        position: 'absolute',
        right: 10
    },
    timeDuration: {
        color: Color.blueGray,
        fontSize: 10,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
    },
    price: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.softDarkBlue,
        position: 'absolute',
        right: 10,
        bottom: 0
    },
    activeLabel: {
        width: 30,
        height: 30,
    },
    labelTag: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
    },
    categoryOuter: {
        flex: 1,
        paddingRight: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5
    },
    categoryBox: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        backgroundColor: Color.whiteBlue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 4
    },
    categoryName: {
        color: Color.pinkBlue,
        fontSize: 10,
        lineHeight: 22,
        fontFamily: Font.SemiBold
    },
    singleClassOuter: {
        width: '95%',
        height: 75,
        borderRadius: 10,
        backgroundColor: Color.darknessGreen,
        marginBottom: 10,
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center'
    },
    singleClassTitle: {
        fontFamily: Font.Bold,
        color: Color.white,
        fontSize: 15,
        lineHeight: 22,
        marginLeft: 10
    },
    singleClassDescription: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.white,
        marginLeft: 10,
        marginTop: 10
    },
    singleClassButton: {
        height: 32,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        position: 'absolute',
        right: 10
    },
    description: {
        width: '95%',
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 17,
        color: Color.softLightGray1,
        marginBottom: 10
    },
    maskView: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bannerHeadTitle: {
        color: Color.white,
        fontSize: 36,
        lineHeight: 37,
        fontFamily: Font.Bold,
    },
    bannerBodyTitle: {
        color: Color.white,
        fontSize: 18,
        lineHeight: 27,
        fontFamily: Font.SemiBold,
    },
    notAlignView: {
        alignItems: 'flex-start',
        width: '95%',
        borderBottomWidth: 1,
        borderBottomColor: Color.softlightGray,
        paddingBottom: 5,
    },
    outer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '95%',
    },
    subTitle: {
        color: Color.softLightRed,
        fontSize: 12.75,
        lineHeight: 22,
        fontFamily: Font.Medium,
    },
    scheduleBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: Color.darkOrange,
        position: 'absolute',
        right: 0,
        elevation: 2,
        shadowColor: Color.black,
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    containerStyle2: {
        height: 40,
        backgroundColor: Color.white,
        width: '78%',
        borderRadius: 12,
        left: -10,
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,

    },
    filterBtn: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: Color.white,
        position: 'absolute',
        right: 0,
        top: 3.5,
        paddingHorizontal: 13,
        borderColor: Color.darkOrange,
        borderWidth: 1,
        elevation: 0.5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0.2,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    freeLabel: {
        backgroundColor: 'red',
        flex: 1,
        paddingHorizontal: 5,
        height: 30,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 3,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    classTypeLabel: {
        backgroundColor: Color.lightBlue,
        flex: 1,
        paddingHorizontal: 10,
        height: 30,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 3,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
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
        paddingHorizontal:'10%',
        backgroundColor: Color.themeColor,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBtnText: {
        fontFamily: Font.Bold,
        fontSize: 15,
        lineHeight: 22,
        color: Color.white,
        textAlign:'center'
    },
    dateStyle: {
        textAlign: 'left',
        flex: 1,
        width: '100%',
        color: Color.black,
        fontFamily: Font.SemiBold,
        fontSize: 16,
        lineHeight: 18,
        marginTop: 10,
    },
    trainerViewContent: {
        width: deviceScale < 3 ? screenWidth / 100 * 90 : screenWidth / 100 * 85,
        marginVertical: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
})
