import React, {Component} from 'react';
import {Styles} from "./ElementsCommenStyles/CommonStyles";
import {Image, Text, View} from "react-native";
import Visa from "../../assets/Home/visa.png";
import OK from "../../assets/Home/ok.png";
import UNCHECK from "../../assets/Home/uncheck.png";
import { PaymentIcon } from 'react-native-payment-icons'

class CardHolder extends Component {
    render() {
        return (
            <View style={Styles.cardHolder}>
                <Text style={Styles.cardTitle}>Card Holder</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={Styles.cardImage}>
                        {/*<Image source={Visa} style={{width: '100%', height: '100%'}}*/}
                        {/*       resizeMode={'stretch'}/>*/}
                        <PaymentIcon type={this.props.cardType?this.props.cardType.toLowerCase():null} width={34} />
                    </View>
                    <Text style={Styles.cardNumTitle}>. . . .   . . . .   . . . .
                        {this.props.cardNumber}</Text>
                </View>

                {this.props.checkBox ? (
                    <View style={Styles.okImage}>
                        <Image source={this.props.visible ? OK : UNCHECK} style={{width: '100%', height: '100%'}}
                               resizeMode={'stretch'}/>
                    </View>
                ) : null}

            </View>
        );
    }
}

export default CardHolder;
