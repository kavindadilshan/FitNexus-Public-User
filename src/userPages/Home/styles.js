import {Dimensions, StyleSheet} from 'react-native';
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";


export const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Color.white,
    },
    mainTitle:{
        fontSize:16,
        fontFamily:Font.SemiBold,
        marginLeft:18,
        width:'75%',
    },
    categoryOuter:{
        width:98,
        height:130,
        marginLeft:10,
        paddingBottom:10
    },
    categoryContent:{
        width: '100%',
        height: '95%',
        backgroundColor:Color.white,
        borderRadius:10,
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginVertical:'5%',
        overflow: 'hidden',
    },
    title:{
        fontSize: 14,
        fontFamily: Font.Medium,
        lineHeight:22
    },
    categoryTitle:{
        fontSize: 12,
        fontFamily: Font.Bold,
        lineHeight:15,
        zIndex: 3,
        position:'absolute',
        color:Color.white,
        bottom: 8,
        left:5,
        width:'88%'
    },
    time:{
        fontFamily:Font.SemiBold,
        fontSize:12,
        lineHeight:22,
        color: '#4B6883'
    },
    imageHolder:{
        width:'100%',
        height:'100%',
        zIndex:1,

    },
    imageHolder2:{
        width:'100%',
        height:'100%',
        zIndex: 2,
        position:'absolute'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width:'100%',
    },
    imageHolders: {
        width: 144,
        height: 134,
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
    imageStyle:{
        width: '100%',
        height: '100%',
        overflow: "hidden",
    },
    headerTitle: {
        color: Color.softBlue,
        fontFamily: Font.Bold,
        fontSize: 12,
        lineHeight: 22,
    },
    headline: {
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 22,
        marginHorizontal: 10
    },
    pharagraph: {
        fontSize: 15,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: Color.softLightGray3
    },
    timeSlotContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10,
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
    },
    location:{
        backgroundColor:'#EBF6EE',
        width:35,
        height:35,marginHorizontal:10,
        borderRadius:10
    },
    telephoneHolder:{
        width:'50%',
        height:'90%',
        flexDirection:'row',
        alignItems:'center',
        borderRightColor:'#DFDFDF',
        borderRightWidth:1,
        marginRight:13
    },
    gifHolder: {
        width: 170,height:150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 60,
        height: 60,
    },

    priceHolder:{
        backgroundColor:Color.lightGreen,
        width:'50%',
        height:40,
        position:'absolute',
        bottom:0,
        right:0,
        zIndex:3,
        borderTopLeftRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    price:{
        fontSize:14,
        lineHeight:22,
        color:Color.white,
        fontFamily:Font.SemiBold
    },
    tagOuter:{
        height:35,
        backgroundColor:Color.lightBlue,
        borderRadius:8,
        alignItems:'center',
        justifyContent:'center',
        // marginLeft:5,
        marginRight: 10,
        marginTop:15,
        paddingHorizontal:10
    },
    heilight: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22
    },
    weeks:{
        color:Color.softLightGray1,
        fontFamily:Font.SemiBold,
        fontSize:12,
        lineHeight:22,
    },
    ratingText:{
        fontSize: 14,
        color: '#4B6883',
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        marginLeft:7,
        marginTop:5
    },
    locationBtn:{
        width:'35%',
        height:40,
        backgroundColor:Color.black,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
    },
    locationBtnContent:{
        color:Color.white,
        fontFamily:Font.Medium,
        fontSize:11,
        lineHeight:22,
    },
    horizontalImageHolder: {
        width: '98%',
        marginLeft: 10,
        marginTop: 30,
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
    membershipContainer: {
        height: 65,
        borderRadius: 10,
        backgroundColor: Color.themeColor,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal:10,
        marginBottom:10,
        marginTop:20
    },
    viewAllBtn: {
        width: 70,
        height: 32,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
    },
    labelText: {
        fontSize: 14,
        lineHeight: 22,
        color: Color.white,
        fontFamily: Font.SemiBold
    },
    onlineLabel: {
        backgroundColor: Color.themeColor,
        width: '60%',
        height: 25,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 3,
        borderBottomLeftRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewMoreTitle:{
        fontFamily: Font.SemiBold,
        color: Color.themeColor,
        fontSize:12
    },
    bottomContainer: {
        width: '100%',
        height: 70,
        backgroundColor: Color.white,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        flexDirection:'row',
        paddingTop:5
    },
    bottomBtn: {
        width: '95%',
        height: '75%',
        backgroundColor: Color.themeColor,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomMiniBtn: {
        width: '45%',
        height: '75%',
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
    inviteBannerContent:{
        width:'100%',
        height:60,
        backgroundColor:Color.softPink,
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    corporateContent:{
        width:'100%',
        backgroundColor: Color.softLightBrown1,
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:5,
    },
    inviteBannerText:{
        fontSize:16,
        lineHeight:22,
        fontFamily:Font.Bold,
        color:Color.themeColor
    },
    signInBtn:{
        height:35,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        backgroundColor:Color.themeColor,
        position:'absolute',
        right:10,
        borderRadius:8,
        paddingHorizontal: 10
    },
    signInText:{
        color:Color.white,
        fontFamily:Font.SemiBold,
        fontSize:14,
        lineHeight:15
    }
})
