import React, {Component} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Styles} from './ElementsCommenStyles/CommonStyles';
import AIALogo from '../../assets/Home/aiaLogo.png';
import {Color} from "../../constance/Colors";

class TermsAndConditions extends Component {
    render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.imageContent}>
                    <Image source={{uri:this.props.modelData.image}} style={Styles.imageStyle} resizeMode={'cover'}/>
                </View>
                <View style={Styles.bodyContent}>
                    <Text style={{...Styles.mainTitle,fontSize:23, lineHeight:24}}>Terms and Conditions</Text>
                    <View style={Styles.ScrollViewStyle}>
                        <ScrollView contentContainerStyle={{paddingHorizontal: 10}} indicatorStyle={"black"}>
                            <Text style={{...Styles.subText,fontSize:17, lineHeight:20,marginTop:10}}>
                                {this.props.modelData.termsAndConditions}
                            </Text>
                        </ScrollView>

                    </View>
                </View>
                <View style={Styles.bottomButtonContent}>
                    <TouchableOpacity style={{...Styles.buttonContainer, marginRight: 10}}
                                      onPress={this.props.onAgreeBtnPress}>
                        <Text style={Styles.buttonText}>Agree</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.buttonCloseContainer} onPress={this.props.onCloseBtnPress}>
                        <Text style={{...Styles.buttonText, color: Color.black}}>Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default TermsAndConditions;
