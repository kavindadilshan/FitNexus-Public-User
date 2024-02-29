import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import {Icon} from "react-native-elements";
import IMG from "../../assets/Home/onlineCoachInfo.png";
import {Styles} from "./ElementsCommenStyles/CommonStyles";
import SuccessIMG from '../../assets/Home/sucessRound.png';
import WarningIMG from '../../assets/Home/warningRound.png'


class AlertModal extends Component {
    render() {
        return (
            <View style={Styles.modalContainer}>
                <View style={Styles.modalSubContainer}>
                    <View style={Styles.imageContent}>
                        <Image source={this.props.verified ? SuccessIMG : WarningIMG} style={Styles.imageStyle}
                               resizeMode={'cover'}/>
                    </View>
                    <Text style={{
                        ...Styles.mainTitle,
                        fontSize: 24,
                        lineHeight: 26
                    }}>{this.props.verified ? 'Success' : 'Invalid Code'}</Text>
                    <Text style={{
                        ...Styles.subText,
                        textAlign: 'center',
                        marginTop: 10
                    }}>{this.props.verified ? this.props.verificationMsg : 'Please enter a valid corporation promo code'}</Text>
                    <TouchableOpacity style={Styles.bottomBtn} onPress={this.props.onButtonPress}>
                        <Text style={Styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

export default AlertModal;
