import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator, StatusBar, Modal, ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import stripe from 'tipsi-stripe';
import {Color} from "../../../../constance/Colors";
import Button from "../../../../component/Stripe/Button2";
import Line from '../../../../assets/Sample/Line.png';
import Visa from '../../../../assets/Home/visa.png';
import OK from '../../../../assets/Home/ok.png';
import UNCHECK from '../../../../assets/Home/uncheck.png';
import axios from '../../../../axios/axios';
import {StorageStrings} from "../../../../constance/StorageStrings";
import {SubUrl} from "../../../../axios/server_url";
import Toast from 'react-native-simple-toast';
import {AppToast} from "../../../../constance/AppToast";
import Loading from "../../../../component/Loading/Loading";
import {CurrencyType} from "../../../../constance/AppCurrency";
import {Api} from "../../../../constance/AppAPIKeys";
import {styles} from "../../CheckOut/styles";
import PadlockImg from '../../../../assets/Home/padlock.png';
import PromoLabel from "../../../../assets/Profile/promoLabel.png";
import AddImg2 from "../../../../assets/Profile/addpromo.png";
import AddImg from "../../../../assets/Home/addImg.png";
import Model from "../../../../component/UIElement/AddPromoCodeModal";
import {AppEventsLogger} from "react-native-fbsdk";
import analytics from "@react-native-firebase/analytics";
import RepeatIMG from "../../../../assets/Profile/repeat.png";
import CardHolder from "../../../../component/UIElement/CardHolder";
import PayHereApiService, {createPayHereObj, payHerePaymentUtil} from "../../../../component/PayHere/payhereUtils";
import {IS_STRIPE_ENABLED} from "../../../../constance/Const";
import AlertMassage from "../../../../component/Actions/AlertMassage";
import PayHere from "@payhere/payhere-mobilesdk-reactnative";

stripe.setOptions({
    publishableKey: Api.stripe
});

class App extends React.Component {
    static title = 'Card Form';

    state = {
        loading: false,
        token: null,
        save: false,
        list: [],
        price: '',
        clientSecretId: '',
        stripePaymentMethodId: '',
        payHerePaymentMethodId:'',
        freeSession: false,
        typeId: '',
        typeName: '',
        date: '',
        time: '',
        btnVisible: false,
        loading2: false,
        loading3: false,
        loading4: false,
        gymId: '',
        promoCodeType: '',
        list2: [],
        modalVisible: false,
        discountMaxAmount: '',
        discountPercentage: '',
        sessionType: '',
        discountDescription: '',
        selectedDiscountId: '',
        showAlertSaveCard: false
    };

    async componentWillMount() {
        const {navigation} = this.props;
        const id = navigation.getParam('id');
        const name = navigation.getParam('name');
        const price = navigation.getParam('price');
        const gymId = navigation.getParam('gymId');
        const promoCodeType = navigation.getParam('promoCodeType');

        this.setState({
            price: price,
            typeId: id,
            typeName: name,
            gymId: gymId,
            promoCodeType: promoCodeType
        });


    }

    /**
     * set currency type
     * @param value
     * @returns {*}
     */
    numberFormat = (value) =>
        new Intl.NumberFormat(CurrencyType.locales, {
            style: 'currency',
            currency: CurrencyType.currency
        }).format(value).replace(/\.00/g, '');








    handleCardPayPress = async (type) => {
        await this.setState({showAlertSaveCard:false})

    };

    /**
     * select card from card holder
     * */
    onHolderPress(items) {
        const data = this.state.list;
        const list = [];

        for (let i = 0; i < data.length; i++) {
            if (items.id === data[i].id && !items.visible) {
                list.push({
                    id: data[i].id,
                    brand: data[i].brand,
                    stripePaymentMethodId: data[i].stripePaymentMethodId,
                    payHerePaymentMethodId: data[i].payHerePaymentMethodId,
                    last4: data[i].last4,
                    visible: true
                })
                this.setState({
                    stripePaymentMethodId: data[i].stripePaymentMethodId,
                    payHerePaymentMethodId: data[i].payHerePaymentMethodId,
                    btnVisible: true
                })
            } else {
                list.push({
                    id: data[i].id,
                    brand: data[i].brand,
                    stripePaymentMethodId: data[i].stripePaymentMethodId,
                    payHerePaymentMethodId: data[i].payHerePaymentMethodId,
                    last4: data[i].last4,
                })
                if (items.visible) {
                    this.setState({
                        btnVisible: false
                    })
                }
            }
        }
        this.setState({list: list})
    }

    /**
     * button press action handler
     */
    onButtonClick = async () => {
        const list = this.state.list;
        for (let i = 0; i < list.length; i++) {
            if (list[i].visible) {
                this.setState({stripePaymentMethodId: list[i].stripePaymentMethodId})
            }
        }

    };

    /**
     * modal close action
     * @returns {Promise<void>}
     */
    closeModal = async () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    render() {
        const myCards = this.state.list.map((items, i) => (
            <TouchableOpacity style={{marginHorizontal: 10}} key={i} onPress={() => this.onHolderPress(items)}>
                <CardHolder
                    cardNumber={'  ' + items.last4}
                    checkBox={true}
                    visible={items.visible}
                    cardType={items.brand}
                />
            </TouchableOpacity>
        ))

        const {loading, token} = this.state
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <Text style={styles.amount}>{!this.state.freeSession ? this.numberFormat(this.state.price) :
                            this.state.price * this.state.discountPercentage / 100 <= this.state.discountMaxAmount ?
                                this.numberFormat(this.state.price - (this.state.price) * this.state.discountPercentage / 100) :
                                this.numberFormat(this.state.price - this.state.discountMaxAmount)}</Text>

                        <View style={{...styles.cardHolder, width: '95%', justifyContent: 'center', paddingLeft: '5%'}}>
                            <Text style={{...styles.mainTitle, fontSize: 15}}>{this.state.typeName}</Text>
                            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>

                                <Text style={{
                                    ...styles.mainTitle,
                                    fontSize: 15
                                }}>{new Date().toDateString()}</Text>

                                {this.state.freeSession ? (
                                    <Text style={{
                                        ...styles.mainTitle,
                                        fontSize: 15,
                                        position: 'absolute',
                                        right: 10
                                    }}>{this.numberFormat(this.state.price)}</Text>
                                ) : null}

                            </View>


                        </View>
                    </View>
                    <Image source={Line} style={{width: '100%', marginTop: '8%', marginBottom: '3%'}}/>

                    {this.state.freeSession ? (
                        <View style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 20,
                            paddingHorizontal: 10
                        }}>
                            <Text style={{...styles.mainTitle, fontSize: 14, color: Color.themeColor, width: '75%'}}>
                                {this.state.discountDescription + '(Upto ' + this.numberFormat(this.state.discountMaxAmount) + ')'} </Text>
                            <Text
                                style={{...styles.subTitle, color: Color.themeColor, position: 'absolute', right: 10}}>
                                {this.state.discountPercentage + '%'} OFF</Text>
                        </View>
                    ) : null}

                    <View style={{marginBottom: 20}}>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 5,
                            marginBottom: 10,
                            alignItems: 'center',
                            flex: 1,
                        }}>
                            <Text style={{
                                ...styles.mainTitle,
                                fontSize: 16,
                                marginLeft: 10,
                            }}>Select a Promo Code</Text>

                            {this.state.list2.length !== 0 ? (
                                <TouchableOpacity style={styles.miniPromoCode}
                                                  onPress={() => this.setState({modalVisible: true})}>
                                    <Image source={AddImg2} style={{width: 15, height: 15}}/>
                                    <Text style={styles.addPromoMiniTxt}>Add Promo code</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>


                    </View>


                    {this.state.list.length !== 0 ? (
                        <View style={{marginHorizontal: 10, marginBottom: 10}}>
                            <Text style={{...styles.mainTitle, fontSize: 16}}>Select a payment method</Text>
                            <Text style={styles.subTitle}>Tap to select a card from below</Text>
                        </View>
                    ) : null}


                    {this.state.loading2 ? (
                        <ActivityIndicator
                            animating
                            size="large"
                            style={{marginVertical: 10}}
                        />
                    ) : myCards}


                    {this.state.list.length !== 0 ? (
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <TouchableOpacity style={this.state.btnVisible ? styles.btnStyle : {
                                ...styles.btnStyle,
                                backgroundColor: Color.softDarkGray3
                            }} onPress={() => this.onButtonClick()}
                                              disabled={!this.state.btnVisible}>
                                <Text style={styles.btnContent}>Continue</Text>
                            </TouchableOpacity>

                        </View>
                    ) : null}

                    <View style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                        <View style={{width: '95%'}}>
                            <Button
                                text="Pay"
                                loading={loading}
                                onPress={()=> {
                                    /** TEMP SOLUTION **/
                                    this.handleCardPayPress('no');
                                    // this.setState({showAlertSaveCard: true})
                                }}
                            />
                        </View>
                    </View>

                    <View style={{marginHorizontal: 10, marginTop: 10, flexDirection: 'row'}}>
                        <View style={{width: 23, height: 23, marginRight: 10, marginTop: 5}}>
                            <Image source={PadlockImg} style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
                        </View>
                        <Text style={{...styles.subTitle, width: '90%', color: Color.black}}>We process your cards
                            securely with Stripe, which is PCI certified and holds the highest level of
                            certification </Text>
                    </View>

                </ScrollView>
                <Loading isVisible={this.state.loading3}/>

                <AlertMassage
                    show={this.state.showAlertSaveCard}
                    message={"Do you want to keep this card for future payments?"}
                    onCancelPressed={() => {
                        this.handleCardPayPress('yes');
                    }}
                    onConfirmPressed={() => {
                        this.handleCardPayPress('no');
                    }}
                    cancelText={'Yes'}
                    confirmText={'No'}
                    btnSize={110}
                />

            </View>
        )
    }
}

export default App;
