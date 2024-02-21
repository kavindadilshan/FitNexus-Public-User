import {Dimensions, StyleSheet} from 'react-native';
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:Color.white,
        // height:screenHeight
    },
    listContainer:{
        width: screenWidth/100*95,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        marginTop: '2%',
        paddingVertical:5,
        marginBottom:5
    },
    imageHolder:{
        width:'100%',
        height:'100%',
        zIndex:1,

    },
    imageContainer: {
        width: '100%',
        height: '70%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10

    },
    containerTitle:{
        color:'#6A6A6A',
        fontSize:15,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        width:'60%',

    },
    bodyTitle:{
        fontFamily:Font.Medium,
        fontSize:12,
        lineHeight:22,
        color: '#9E9E9E',
    },
    imageOuter:{
        width:70,
        height:70,
        borderRadius:6,
        marginHorizontal:10,
        marginTop:5,
        overflow:'hidden'
    },
    mainContainer:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
    },
    cancelBtn:{
        width:'25%',
        height:30,
        backgroundColor:Color.softPink,
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
        borderRadius:5
    },
    cancelBtnTitle:{
        color:Color.darkPink,
        fontSize:13,
        lineHeight:22,
        fontFamily:Font.Bold
    },
    subImageHolder: {
        width: 33,
        height: 30,
        borderRadius: 7,
        marginLeft: 10
    },
    time: {
        fontSize: 13,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: '#8E8E8E',
        marginLeft:10
    },
    imageBottomLiner: {
        zIndex: 3,
        position: 'absolute',
        bottom: 10,
        width: '100%',
        height: 50,
    },
    titleContent: {
        fontSize: 16,
        lineHeight: 18,
        fontFamily: Font.Medium,
        color: Color.white,
        marginLeft: 14
    },
    mainTitle:{
        fontFamily:Font.SemiBold,
        fontSize:15,
        lineHeight:20,
        color:Color.darkGray,
        width:'75%',
        marginLeft:10
    },
    timeStamp:{
        fontFamily:Font.SemiBold,
        fontSize:11,
        lineHeight:22,
        color:'#9D9D9D',
        marginLeft:10,
        position: 'absolute',
        right:10,
        top:5
    },
    dateFormat:{
        fontFamily:Font.SemiBold,
        fontSize:15,
        lineHeight:22,
        color:'#9D9D9D',
        marginVertical: 10
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
})
