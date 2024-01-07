import React from 'react';
import {Color} from "../../constance/Colors";
import AwesomeAlert from "react-native-awesome-alerts";
import {Font} from "../../constance/AppFonts";

class App extends React.Component{
    render(){
        return(
            <AwesomeAlert
                show={this.props.show}
                showProgress={false}
                message={this.props.message}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText={this.props.cancelText}
                confirmText={this.props.confirmText}
                confirmButtonColor={Color.white}
                onCancelPressed={this.props.onCancelPressed}
                onConfirmPressed={this.props.onConfirmPressed}
                confirmButtonTextStyle={{color:Color.black}}
                messageStyle={{fontSize: 15,lineHeight:22,fontFamily:Font.Medium,color: Color.black,textAlign: "center",}}
                cancelButtonColor={Color.themeColor}
                contentStyle={{alignItems: 'center',justifyContent: 'center',marginVertical: '5%'}}
                contentContainerStyle={{borderRadius: 15}}
                cancelButtonStyle={{width:102,height:43,borderRadius:10,alignItems:'center',justifyContent:'center',elevation: 5,
                shadowColor: Color.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 2,}}
                confirmButtonStyle={{width:102,height:43,borderRadius:10,alignItems:'center',justifyContent:'center',elevation:5,shadowColor: Color.black,
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.25,
                shadowRadius: 2,}}
            />
        )
    }
}

export default App;
