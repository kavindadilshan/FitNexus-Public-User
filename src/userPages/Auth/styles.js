import {Dimensions, StyleSheet,Platform} from 'react-native';
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export const styles = StyleSheet.create({
    backgroundImageContainer:{
        height: null,
        width: screenWidth,
        resizeMode: "cover",
        overflow: "hidden",
        flex: 1
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex:0,
        flex:1
    },
    opacityLayer:{
        width: screenWidth,
        height: '100%',
        zIndex: 1,
        position: 'absolute',
        backgroundColor: 'white',
        opacity: .65
    },
    container:{
        flex:1,
        alignItems:'center',
    },
    logoOuter:{
        width:107,
        height:107,
        backgroundColor:Color.white,
        borderRadius:25,
        elevation: 2,
        shadowColor: Color.black,
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginTop:'15%',
        marginBottom: '5%',
    },
    btnSignUp:{
        backgroundColor: Color.black,
        width:'95%',
        height:55,
        borderRadius:10,
        marginTop:'10%',
        justifyContent:'center',
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
    btnContent:{
        color:Color.white,
        fontFamily:Font.SemiBold
    },

    socialSignUp:{
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
    iconStyle:{
        position:'absolute',
        left:'5%',
        width:25,
        height:32,
    },
    textStyle:{
        color:Color.black,
        fontFamily:Font.Medium
    },
    textFieldContainer:{
        width:'95%',
        height:60,
        marginBottom:2,
        justifyContent:'center',
        flexDirection:'row',
        backgroundColor:Color.white,
        borderRadius:10,
        borderWidth:1,
        borderColor: Color.softlightGray,
        marginTop:Platform.OS!=='android'?'20%':'5%'
    },
    flagContainer:{
        width: 1,
        height: '100%',
        position: 'absolute',
        left: 65,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: Color.softlightGray,
    },
    phoneInputTextStyle: {
        fontSize: 16,
        height: 40,
        color:Color.black,
        fontFamily: Font.Medium,
    },
    alertContainer:{
        width:screenWidth,
        height: screenHeight,
    },
    headerTitles:{
        color:Color.black,
        fontFamily:Font.Bold,
        fontSize:28,
        lineHeight:42
    }
})
