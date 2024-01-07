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
                title={this.props.title}
                message={this.props.message!==undefined?this.props.message:null}
                closeOnTouchOutside={this.props.onDismiss !== undefined}
                closeOnHardwareBackPress={this.props.onDismiss !== undefined}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText={this.props.cancelText}
                confirmText={this.props.confirmText}
                confirmButtonColor={Color.white}
                onDismiss={this.props.onDismiss}
                onCancelPressed={this.props.onCancelPressed}
                onConfirmPressed={this.props.onConfirmPressed}
                confirmButtonTextStyle={{color:Color.black,textAlign: "center"}}
                titleStyle={{fontSize: 20,lineHeight:22,fontFamily:Font.SemiBold,color: Color.black,textAlign: "center",marginBottom:10}}
                messageStyle={{fontSize: 15,lineHeight:22,fontFamily:Font.Medium,color: Color.black,textAlign: "center"}}
                cancelButtonColor={Color.themeColor}
                contentStyle={{alignItems: 'center',justifyContent: 'center',marginVertical: '5%'}}
                contentContainerStyle={{borderRadius: 15}}
                cancelButtonStyle={{width: this.props.btnSize !== undefined ? this.props.btnSize : 145,height:43,borderRadius:10,alignItems:'center',justifyContent:'center',elevation: 5,
                shadowColor: Color.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 2,}}
                confirmButtonStyle={{width:this.props.btnSize !== undefined ? this.props.btnSize : 130,height:43,borderRadius:10,alignItems:'center',justifyContent:'center',elevation:5,shadowColor: Color.black,
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.25,
                shadowRadius: 2,}}
                cancelButtonTextStyle={{textAlign: "center"}}
            />
        )
    }
}

export default App;
