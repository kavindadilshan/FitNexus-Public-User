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
import {Color} from "../../../constance/Colors";
import Button from "../../../component/Stripe/Button2";
import Line from '../../../assets/Sample/Line.png';
import Visa from '../../../assets/Home/visa.png';
import OK from '../../../assets/Home/ok.png';
import UNCHECK from '../../../assets/Home/uncheck.png';
import axios from '../../../axios/axios';
import {StorageStrings} from "../../../constance/StorageStrings";
import {PUBLIC_URL, SubUrl} from "../../../axios/server_url";
import Toast from 'react-native-simple-toast';
import {AppToast} from "../../../constance/AppToast";
import Loading from "../../../component/Loading/Loading";
import {CurrencyType} from "../../../constance/AppCurrency";
import {Api} from "../../../constance/AppAPIKeys";
import CashImg from '../../../assets/Home/money.png';
import {styles} from "./styles";
import {ServerUrl} from "../../../constance/AppServerUrl";
import * as actionTypes from "../../../store/actions";
import {connect} from 'react-redux';
import PadlockImg from '../../../assets/Home/padlock.png';
import PromoLabel from "../../../assets/Profile/promoLabel.png";
import AddImg from "../../../assets/Home/addImg.png";
import Model from "../../../component/UIElement/AddPromoCodeModal";
import AddImg2 from '../../../assets/Profile/addpromo.png';
import {AppEventsLogger} from 'react-native-fbsdk';
import analytics from '@react-native-firebase/analytics';
import RepeatIMG from "../../../assets/Profile/repeat.png";
import CardHolder from "../../../component/UIElement/CardHolder";
import {IS_STRIPE_ENABLED} from "../../../constance/Const";
import PayHereApiService, {createPayHereObj, payHerePaymentUtil} from "../../../component/PayHere/payhereUtils";
import PayHere from "@payhere/payhere-mobilesdk-reactnative";
import AlertMassage from "../../../component/Actions/AlertMassage";

stripe.setOptions({
    publishableKey: PUBLIC_URL !== ServerUrl.prod_url ? Api.stripe : Api.stripe_prod
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
        payHerePaymentMethodId: '',
        freeSession: false,
        typeId: '',
        typeName: '',
        date: '',
        time: '',
        btnVisible: false,
        loading2: false,
        loading3: false,
        loading4: false,
        discountMaxAmount: '',
        discountPercentage: '',
        sessionType: '',
        discountDescription: '',
        role: '',
        trainerName: '',
        classType: '',
        redirectForm: '',
        packageId: '',
        isSubscribed: false,
        thisEnrolled: false,
        list2: [],
        promoCodeType: '',
        modalVisible: false,
        selectedDiscountId: '',
        promoDiscountMaxAmount: '',
        promoDiscountPercentage: '',
        promoDiscountDescription: '',
        discountedPrice: '',
        selectedPromoDiscount: '',
        inviteDiscountVisible: false,
        promoCodeId: '',
        showAlertSaveCard: false,
        allowCashPayment: false
    };

    async componentWillMount() {
        const {navigation} = this.props;
        const role = navigation.getParam('role');
        const price = navigation.getParam('price');
        const object = navigation.getParam('object');
        const redirectForm = navigation.getParam('redirectForm');
        const allowCashPayment = navigation.getParam('allowCashPayment');

        if (role === 'class_trainer') {
            const sessionType = navigation.getParam('sessionType');
            const classType = navigation.getParam('classType');
            if (sessionType === 'FIRST_FREE' || sessionType === 'DISCOUNT') {
                this.setState({
                    freeSession: true,
                    inviteDiscountVisible: true
                })

                if (sessionType === 'DISCOUNT') {
                    let discountedPrice;

                    if (price * object.discountPercentage / 100 <= object.discountMaxAmount) {
                        discountedPrice = price - price * object.discountPercentage / 100
                    } else {
                        discountedPrice = price - object.discountMaxAmount
                    }
                    this.setState({
                        discountedPrice: discountedPrice
                    })
                }
            }
            this.setState({
                price: price,
                typeId: object.id,
                typeName: object.name,
                date: object.date,
                time: object.startTime + ' - ' + object.endTime,
                discountMaxAmount: object.discountMaxAmount,
                discountPercentage: object.discountPercentage,
                discountDescription: object.discountDescription,
                sessionType: sessionType,
                role: role,
                classType: classType,
                redirectForm: redirectForm,
                promoCodeType: object.promoCodeType,
                promoCodeId: object.promoCodeId,
                allowCashPayment: allowCashPayment
            });

        } else {
            const name = navigation.getParam('name');
            const trainerId = navigation.getParam('trainerId');
            const isSubscribed = navigation.getParam('isSubscribed');
            this.setState({
                price: object.price,
                typeId: trainerId,
                packageId: object.id,
                typeName: object.packageName,
                time: object.timePeriod,
                role: role,
                trainerName: name,
                redirectForm: redirectForm,
                isSubscribed: isSubscribed,
                thisEnrolled: object.thisEnrolled,
                promoCodeType: object.promoCodeType,
                promoCodeId: object.promoCodeId,
                allowCashPayment: allowCashPayment,
            });
        }

        if (!object.thisEnrolled) {
            this.getAllCards();
            this.getAllPromoCodes();
        }

    }

    /**
     * set currency format
     * @param value
     * @returns {*}
     */
    numberFormat = (value) =>
        new Intl.NumberFormat(CurrencyType.locales, {
            style: 'currency',
            currency: CurrencyType.currency
        }).format(value).replace(/\.00/g, '');

    /**
     * get all cards api using online class/offline class/instructor packages
     * @returns {Promise<void>}
     */
    getAllCards = async () => {
        this.setState({loading2: true});

        const {navigation} = this.props;
        const role = navigation.getParam('role');

        if (role === 'instructor') {
            const data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                packageId: this.state.packageId
            }
            axios.post(SubUrl.user_check_booking_instructor, data)
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body.cards;
                        const list = [];
                        data.map((item) => {
                            list.push({
                                id: item.id,
                                brand: item.brand,
                                stripePaymentMethodId: item.stripePaymentMethodId,
                                payHerePaymentMethodId: item.payHerePaymentMethodId,
                                last4: item.last4.replace(/\D/g, ''),
                                visible: false
                            })
                        })

                        this.setState({
                            list: list,
                            loading2: false
                        })
                    } else {
                        this.setState({loading2: false})
                        Toast.show(response.data.message)
                    }
                })
                .catch(error => {
                    this.setState({loading2: true})
                    AppToast.networkErrorToast();
                })
        } else {
            const data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                sessionId: this.state.typeId
            };

            if (this.state.classType !== 'online') {
                axios.post(SubUrl.user_check_booking_physical_session, data)
                    .then(async response => {
                        if (response.data.success) {
                            const data = response.data.body.cards;
                            const list = [];
                            data.map((item) => {
                                list.push({
                                    id: item.id,
                                    brand: item.brand,
                                    stripePaymentMethodId: item.stripePaymentMethodId,
                                    payHerePaymentMethodId: item.payHerePaymentMethodId,
                                    last4: item.last4.replace(/\D/g, ''),
                                    visible: false
                                })
                            })

                            this.setState({
                                list: list,
                                loading2: false
                            })
                        } else {
                            this.setState({loading2: false})
                            Toast.show(response.data.message)
                        }
                    })
                    .catch(error => {
                        this.setState({loading2: true})
                        AppToast.networkErrorToast();
                    })
            } else {
                axios.post(SubUrl.user_check_booking_session, data)
                    .then(async response => {
                        if (response.data.success) {
                            const data = response.data.body.cards;
                            const list = [];
                            data.map((item) => {
                                list.push({
                                    id: item.id,
                                    brand: item.brand,
                                    stripePaymentMethodId: item.stripePaymentMethodId,
                                    payHerePaymentMethodId: item.payHerePaymentMethodId,
                                    last4: item.last4.replace(/\D/g, ''),
                                    visible: false
                                })
                            })

                            this.setState({
                                list: list,
                                loading2: false
                            })
                        } else {
                            this.setState({loading2: false})
                            Toast.show(response.data.message)
                        }
                    })
                    .catch(error => {
                        this.setState({loading2: true})
                        AppToast.networkErrorToast();
                    })
            }
        }
    };

    /**
     * get applicable promo codes
     * @returns {Promise<void>}
     */
    getAllPromoCodes = async (selectedPromoCode) => {
        this.setState({loading4: true});
        const {navigation} = this.props;
        const object = navigation.getParam('object');

        axios.get(SubUrl.get_applicable_promo_codes + object.promoCodeType + '/' + object.promoCodeId)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    const list2 = [];
                    data.map((item) => {
                        list2.push({
                            id: item.id,
                            percentage: item.percentage,
                            maxDiscount: item.maxDiscount,
                            description: item.description,
                            refNo: item.refNo,
                            usageLimit: item.usageLimit,
                            visible: selectedPromoCode ? selectedPromoCode === item.refNo : false
                        })
                        if (selectedPromoCode && selectedPromoCode === item.refNo) {
                            this.onPromoCodePress({
                                id: item.id,
                                percentage: item.percentage,
                                maxDiscount: item.maxDiscount,
                                description: item.description,
                                refNo: item.refNo,
                                usageLimit: item.usageLimit,
                                visible: true
                            }, true)
                        }
                    })
                    this.setState({
                        list2: list2,
                        loading4: false
                    })
                }

            })
            .catch(error => {
                console.log(error)
                this.setState({loading4: false})
            })
    }

    /**
     * facebook analytics using FBSDK
     */
    fbAnalytics = () => {
        AppEventsLogger.logPurchase(this.state.price, CurrencyType.currency, {
            'fb_content_id': this.state.typeId,
            'fb_content': this.state.typeName,
            'fb_content_type': this.state.role !== 'class_trainer' ? 'online coaching' : this.state.classType !== 'online' ? 'physical class' : 'online class',
            'fb_payment_info_available': 1,
        })
    }

    /**
     * google analytics for checkout ui
     * @param id
     * @returns {Promise<void>}
     */
    googleAnalytics = async (id) => {
        await analytics().logEvent('purchase', {
            transaction_id: id !== undefined ? id : this.state.stripePaymentMethodId,
            currency: CurrencyType.currency,
            items: [{
                item_id: this.state.typeId,
                item_name: this.state.typeName,
                item_category: this.state.role !== 'class_trainer' ? 'online coaching' : this.state.classType !== 'online' ? 'physical class' : 'online class',
                quantity: 1,
                price: this.state.price,
            }]
        })
    }

    /**
     * create payment method in strip
     * @param id
     * @param stripePaymentMethodId
     * @param role
     * @returns {Promise<void>}
     */
    async createPaymentMethod(id, stripePaymentMethodId, role) {
        try {
            const result = await stripe.confirmPaymentIntent({
                clientSecret: id,
                paymentMethodId: stripePaymentMethodId,

            })
            this.fbAnalytics();
            this.googleAnalytics();
            this.props.navigation.navigate('CardAddedForm', {
                title: 'Your payment done',
                page: this.state.redirectForm,
                id: this.state.typeId,
                role: this.state.classType
            })

        } catch (error) {
            this.setState({loading: false, loading3: false})
            AppToast.errorToast(error.message)
        }
    }

    /**
     * user_subscribe_booking_instructor api
     * user_book_physical_session api
     * user booking online class api
     * this api use for saving card payment
     * @returns {Promise<void>}
     */
    getClientSecret = async () => {
        this.setState({loading3: true});

        const {navigation} = this.props;
        const role = navigation.getParam('role');

        if (role === 'instructor') {


            let data;

            if (this.state.selectedDiscountId === '') {
                data = {
                    userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                    packageId: this.state.packageId,
                    paymentMethodId: this.state.stripePaymentMethodId
                };
            } else {
                data = {
                    userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                    packageId: this.state.packageId,
                    paymentMethodId: this.state.stripePaymentMethodId,
                    discountId: this.state.selectedDiscountId
                };
            }

            axios.post(SubUrl.user_subscribe_booking_instructor, data)
                .then(async response => {

                    if (response.data.success) {
                        const id = response.data.body;
                        let stripePaymentMethodId = this.state.stripePaymentMethodId;

                        this.createPaymentMethod(id, stripePaymentMethodId, role);

                    } else {
                        Toast.show(response.data.message);
                        this.setState({loading: false, loading2: false, loading3: false});
                        this.props.navigation.navigate('CardAddedFailForm', {
                            page: 'CheckOutForm'
                        })
                    }

                })
                .catch(error => {
                    this.setState({loading3: false});
                    AppToast.networkErrorToast();
                })

        } else {

            let data;

            if (this.state.selectedDiscountId === '') {
                data = {
                    userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                    sessionId: this.state.typeId,
                    paymentMethodId: this.state.stripePaymentMethodId !== null ? this.state.stripePaymentMethodId : this.state.payHerePaymentMethodId
                };
            } else {
                data = {
                    userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                    sessionId: this.state.typeId,
                    paymentMethodId: this.state.stripePaymentMethodId !== null ? this.state.stripePaymentMethodId : this.state.payHerePaymentMethodId,
                    discountId: this.state.selectedDiscountId
                };
            }

            if (this.state.stripePaymentMethodId === null) {
                Object.assign(data, {
                    // ipgType: 'PAYHERE',
                    deviceType: 'mobile'
                })
            }

            if (this.state.classType !== 'online') {
                axios.post(this.state.stripePaymentMethodId !== null ? SubUrl.user_book_physical_session : SubUrl.user_book_physical_session_by_payhere, data)
                    .then(async response => {

                        if (response.data.success) {
                            if (this.state.stripePaymentMethodId !== null) {

                                if (response.data.body === 'FIRST_FREE') {
                                    this.setState({freeSession: true});
                                    this.props.fetchOfflineClasses(true);
                                } else {
                                    const data = response.data.body;
                                    let stripePaymentMethodId = this.state.stripePaymentMethodId;
                                    this.createPaymentMethod(data, stripePaymentMethodId);

                                }

                            } else {
                                const data = response.data.body;
                                if (data.firstSessionIsFree) {
                                    this.setState({freeSession: true});
                                    this.props.fetchOfflineClasses(true);
                                } else {
                                    // await this.payHereSavedCardPayments(data)

                                    this.setState({loading3: false});
                                    this.props.navigation.navigate('CardAddedForm', {
                                        title: 'Your payment done',
                                        page: this.state.redirectForm,
                                        id: this.state.typeId,
                                        role: this.state.classType
                                    })
                                }
                            }

                        } else {
                            Toast.show(response.data.message);
                            this.setState({loading: false, loading2: false, loading3: false});
                            this.props.navigation.navigate('CardAddedFailForm', {
                                page: 'CheckOutForm'
                            })
                        }
                    })
                    .catch(error => {
                        this.setState({loading3: false})
                        AppToast.networkErrorToast();
                    })

            } else {

                axios.post(SubUrl.user_book_session, data)
                    .then(async response => {

                        if (response.data.success) {
                            if (response.data.body === 'FIRST_FREE') {
                                this.setState({freeSession: true});
                                this.props.fetchOnlineClasses(true);
                            } else {
                                const id = response.data.body;
                                let stripePaymentMethodId = this.state.stripePaymentMethodId;

                                this.createPaymentMethod(id, stripePaymentMethodId);

                            }
                        } else {
                            Toast.show(response.data.message);
                            this.setState({loading: false, loading2: false, loading3: false});
                            this.props.navigation.navigate('CardAddedFailForm', {
                                page: 'CheckOutForm'
                            })
                        }
                    })
                    .catch(error => {
                        this.setState({loading3: false});
                        AppToast.networkErrorToast();
                        this.props.navigation.navigate('CardAddedFailForm', {
                            page: 'CheckOutForm'
                        })
                    })
            }


        }

    };


    /**
     * class saved card payment through payhere
     * @param data
     * @returns {Promise<void>}
     */
    payHereSavedCardPayments = async (data) => {
        await PayHereApiService.payBySavedPayHereCard(data, 'physical class')
            .then(res => {
                if (res.success) {
                    this.setState({loading3: false});
                    this.props.navigation.navigate('CardAddedForm', {
                        title: 'Your payment done',
                        page: this.state.redirectForm,
                        id: this.state.typeId,
                        role: this.state.classType
                    })
                } else {
                    this.setState({loading3: false});
                    Toast.show(res.message);
                    this.props.navigation.navigate('CardAddedFailForm', {
                        page: 'CheckOutForm'
                    })
                }
            })
            .catch(err => {
                this.setState({loading3: false});
                AppToast.networkErrorToast();
            })
    }

    /**
     * user_subscribe_booking_instructor api
     * user_book_physical_session api
     * user booking online class api
     * this api use for new card payments
     */
    getClientSecret2 = async (status) => {
            await this.payHereNewCardPayment(status);
    };

    payHereNewCardPayment = async (status) => {
        let data;
        if (this.state.selectedDiscountId === '') {
            data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                sessionId: this.state.typeId,
                ipgType: 'PAYHERE',
                deviceType: 'mobile',
                isSaveCard: status === 'yes'
            };
        } else {
            data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                sessionId: this.state.typeId,
                discountId: this.state.selectedDiscountId,
                ipgType: 'PAYHERE',
                deviceType: 'mobile',
                isSaveCard: status === 'yes'
            };
        }

        axios.post(SubUrl.user_book_physical_session_by_payhere, data)
            .then(async response => {
                if (response.data.success) {
                    if (response.data.firstSessionIsFree) {
                        this.setState({loading3: false});
                        this.props.fetchOfflineClasses(true);
                        this.props.navigation.navigate(this.state.redirectForm, {
                            sessionId: this.state.typeId,
                            role: this.state.classType
                        })
                    } else {
                        const obj = response.data.body;

                        await PayHere.startPayment(
                            await createPayHereObj(obj, 'physical class', status),
                            async (paymentId) => {
                                console.log("Payment Completed", paymentId);
                                this.fbAnalytics();
                                this.googleAnalytics(obj.orderId);
                                this.props.navigation.navigate('CardAddedForm', {
                                    title: 'Your payment done',
                                    page: this.state.redirectForm,
                                    id: this.state.typeId,
                                    role: this.state.classType,
                                    newCard: false
                                })
                            },
                            async (errorData) => {
                                console.log("PayHere Error", errorData);
                                this.setState({loading3: false});
                                Toast.show("PayHere Error");
                                this.props.navigation.navigate('CardAddedFailForm', {
                                    page: 'CheckOutForm'
                                })

                            },
                            async () => {
                                console.log("Payment Dismissed");
                                this.setState({loading3: false});
                            }
                        );


                    }

                } else {
                    this.setState({loading: false, loading2: false, loading3: false});
                    Toast.show(response.data.message);
                    this.props.navigation.navigate('CardAddedFailForm', {
                        page: 'CheckOutForm'
                    })
                }
            })
            .catch(error => {
                this.setState({loading3: false})
                AppToast.networkErrorToast();
            })
    }

    /**
     * api of first free online and offline classes
     */
    getClientSecret3 = async () => {
        const data = {
            userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
            sessionId: this.state.typeId,
        };
        this.setState({loading3: true});

        if (this.state.classType !== 'online') {
            axios.post(SubUrl.user_book_physical_session, data)
                .then(async response => {

                    if (response.data.success) {
                        if (response.data.body === 'FIRST_FREE') {
                            this.setState({loading3: false});
                            this.props.fetchOfflineClasses(true);
                            this.props.navigation.navigate(this.state.redirectForm, {
                                sessionId: this.state.typeId,
                                role: this.state.classType
                            })
                        }
                    } else {
                        this.setState({loading3: false});
                        Toast.show(response.data.message);
                        this.props.navigation.navigate('CardAddedFailForm', {
                            page: 'CheckOutForm'
                        })
                    }
                })
                .catch(error => {
                    this.setState({loading3: false})
                    AppToast.networkErrorToast();
                })
        } else {
            axios.post(SubUrl.user_book_session, data)
                .then(async response => {

                    if (response.data.success) {
                        if (response.data.body === 'FIRST_FREE') {
                            this.setState({loading3: false});
                            this.props.fetchOnlineClasses(true);
                            this.props.navigation.navigate(this.state.redirectForm, {
                                sessionId: this.state.typeId,
                                role: this.state.classType
                            })
                        }
                    } else {
                        this.setState({loading3: false});
                        Toast.show(response.data.message);
                        this.props.navigation.navigate('CardAddedFailForm', {
                            page: 'CheckOutForm'
                        })
                    }
                })
                .catch(error => {
                    this.setState({loading3: false})
                    AppToast.networkErrorToast();
                })
        }

    };

    /**
     * on new card payment press action
     */
    handleCardPayPress = async (type) => {
        await this.setState({showAlertSaveCard:false})
        await this.getClientSecret2(type);
    };

    /**
     *  on save card holder press action
     * @param items
     */
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
     * select promo code action
     * @param items
     */
    onPromoCodePress = (items, alreadySelected) => {
        if (alreadySelected) {
            this.setState({
                promoDiscountMaxAmount: items.maxDiscount,
                promoDiscountPercentage: items.percentage,
                promoDiscountDescription: items.description,
                sessionType: 'DISCOUNT',
                freeSession: true,
                selectedDiscountId: items.id,
            })
        } else {
            const data = this.state.list2;
            const list = [];
            const {navigation} = this.props;
            const sessionType = this.state.role !== 'class_trainer' ? 'PAY' : navigation.getParam('sessionType');
            for (let i = 0; i < data.length; i++) {
                if (items.id === data[i].id && !items.visible) {
                    list.push({
                        id: data[i].id,
                        percentage: data[i].percentage,
                        maxDiscount: data[i].maxDiscount,
                        description: data[i].description,
                        refNo: data[i].refNo,
                        visible: true
                    })

                    this.setState({
                        promoDiscountMaxAmount: items.maxDiscount,
                        promoDiscountPercentage: items.percentage,
                        promoDiscountDescription: items.description,
                        sessionType: 'DISCOUNT',
                        freeSession: true,
                        selectedDiscountId: data[i].id,
                    })
                } else {
                    list.push({
                        id: data[i].id,
                        percentage: data[i].percentage,
                        refNo: data[i].refNo,
                        maxDiscount: data[i].maxDiscount,
                        description: data[i].description,
                    })
                }

                if (items.id === data[i].id && items.visible) {
                    this.setState({
                        sessionType: sessionType,
                        freeSession: sessionType === 'DISCOUNT',
                        selectedDiscountId: '',
                        promoDiscountMaxAmount: '',
                        promoDiscountPercentage: '',
                        promoDiscountDescription: '',
                    })
                }
            }
            this.setState({
                list2: list,
            })
        }

    }

    /**
     * on ButtonPress action
     * @returns {Promise<void>}
     */
    onButtonClick = async () => {
        if (!this.state.freeSession || this.state.sessionType === 'DISCOUNT') {
            const list = this.state.list;
            for (let i = 0; i < list.length; i++) {
                if (list[i].visible) {
                    this.setState({
                        stripePaymentMethodId: list[i].stripePaymentMethodId,
                        payHerePaymentMethodId: list[i].payHerePaymentMethodId,
                    })
                }
            }
            this.getClientSecret();
        } else {
            this.getClientSecret3();
        }

    };

    /**
     * pay by cash button action
     * @returns {Promise<void>}
     */
    onCashPaymentMethod = async () => {
        let data;

        if (this.state.selectedDiscountId !== '') {
            data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                sessionId: this.state.typeId,
                paymentMethodId: null,
                discountId: this.state.selectedDiscountId
            };
        } else {
            data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                sessionId: this.state.typeId,
                paymentMethodId: null
            };
        }

        this.setState({loading3: true});
        axios.post(SubUrl.cash_payment_for_physical_sessions, data)
            .then(async response => {
                if (response.data.success) {
                    this.setState({loading3: false});

                    this.props.navigation.navigate('CardAddedForm', {
                        title: 'Your payment done',
                        page: this.state.redirectForm,
                        id: this.state.typeId,
                        role: this.state.classType
                    })
                } else {
                    this.setState({loading3: false});
                    Toast.show(response.data.message);
                    this.props.navigation.navigate('CardAddedFailForm', {
                        page: 'CheckOutForm'
                    })
                }

            })
            .catch(error => {
                AppToast.networkErrorToast();
                this.setState({loading3: false});
            })
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

    /**
     * modal save action
     * @returns {Promise<void>}
     */
    toggleModal = async (promoCode) => {
        this.getAllPromoCodes(promoCode.value);
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    calculateTotal = (freeSession, first_free, promoDisountPercentage, promoDiscountMax) => {
        if (!freeSession) {
            return this.state.price
        } else if (first_free === 'FIRST_FREE') {
            return 0
        } else if (this.state.promoDiscountPercentage === '') {
            return this.state.discountedPrice
        } else if (this.state.discountedPrice !== '') {
            if (this.state.price * promoDisountPercentage / 100 <= promoDiscountMax) {
                return this.state.discountedPrice - (this.state.price * promoDisountPercentage / 100)
            } else {
                return this.state.discountedPrice - promoDiscountMax
            }
        } else {
            if (this.state.price * promoDisountPercentage / 100 <= promoDiscountMax) {
                return this.state.price - (this.state.price * promoDisountPercentage / 100)
            } else {
                return this.state.price - (promoDiscountMax)
            }
        }
    }

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

        const listPromoCodes = this.state.list2.map((item, i) => (
            <TouchableOpacity style={styles.promoCodeContainer} key={i}
                              onPress={() => this.onPromoCodePress(item, false)}>
                <View style={{flexDirection: 'column'}}>
                    <Text style={styles.code}>{item.refNo}</Text>
                    {item.usageLimit !== undefined && (
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={RepeatIMG} style={{width: 10, height: 10, marginRight: 5}}/>
                            <Text
                                style={styles.promoSubTxt}>{item.usageLimit !== -1 ? `${item.usageLimit} Remaining` : 'Unlimited'}</Text>
                        </View>
                    )}
                </View>
                <ImageBackground source={PromoLabel} style={styles.promoLabelOuter}
                                 resizeMode={'stretch'}>
                    <Text style={styles.promoLabelText}>{item.percentage}% Discount</Text>
                </ImageBackground>


                <View style={styles.okImage2}>
                    <Image source={item.visible ? OK : UNCHECK} style={{width: '100%', height: '100%'}}
                           resizeMode={'stretch'}/>
                </View>


            </TouchableOpacity>
        ))

        const {loading, token} = this.state
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <ScrollView contentContainerStyle={{paddingBottom: 20}} showsVerticalScrollIndicator={false}>
                    <View style={{width: '100%', alignItems: 'center'}}>
                        {this.state.thisEnrolled ? (
                            <View style={styles.alertBox}>
                                <Text style={styles.alertText}>You already purchased this package</Text>
                            </View>
                        ) : this.state.isSubscribed ? (
                            <View style={styles.alertBox}>
                                <Text style={styles.alertText}>You already purchased a package of this coach</Text>
                            </View>
                        ) : null}

                        <Text style={styles.amount}>
                            {this.numberFormat(this.calculateTotal(this.state.freeSession, this.state.sessionType, this.state.promoDiscountPercentage, this.state.promoDiscountMaxAmount))}
                        </Text>

                        <View style={styles.descriptionHolder}>
                            <Text style={this.state.role !== 'class_trainer' ? {
                                ...styles.mainTitle,
                                fontSize: 15,
                                color: Color.black
                            } : {...styles.mainTitle, fontSize: 15}}>{this.state.typeName}</Text>
                            <Text style={{
                                ...styles.mainTitle,
                                fontSize: 15
                            }}>{this.state.role === 'class_trainer' ? this.state.date : this.state.trainerName}</Text>
                            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={this.state.role !== 'class_trainer' ? {
                                    ...styles.mainTitle,
                                    fontSize: 14
                                } : {...styles.mainTitle, fontSize: 15}}>{this.state.time}</Text>
                                {this.state.freeSession && this.state.role === 'class_trainer' ? (
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

                    {!this.state.thisEnrolled ? (
                        <Image source={Line} style={{width: '100%', marginTop: '8%', marginBottom: '3%'}}/>) : null}

                    {this.state.freeSession && this.state.inviteDiscountVisible ? (
                        <View style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: this.state.selectedDiscountId !== '' ? 10 : 20,
                            paddingHorizontal: 10
                        }}>
                            <Text style={{...styles.mainTitle, fontSize: 14, color: Color.themeColor, width: '75%'}}>
                                {this.state.sessionType === 'FIRST_FREE' ? 'First Session free offer' : this.state.discountDescription + '(Upto ' + this.numberFormat(this.state.discountMaxAmount) + ')'} </Text>
                            <Text
                                style={{...styles.subTitle, color: Color.themeColor, position: 'absolute', right: 10}}>
                                {this.state.sessionType === 'FIRST_FREE' ? '100%' : this.state.discountPercentage + '%'} OFF</Text>
                        </View>
                    ) : null}

                    {this.state.freeSession && this.state.selectedDiscountId !== '' ? (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 20,
                            paddingHorizontal: 10
                        }}>
                            <Text style={{...styles.mainTitle, fontSize: 14, color: Color.themeColor, width: '75%'}}>
                                {this.state.promoDiscountDescription + '(Upto ' + this.numberFormat(this.state.promoDiscountMaxAmount) + ')'} </Text>
                            <Text
                                style={{...styles.subTitle, color: Color.themeColor, position: 'absolute', right: 10}}>
                                {this.state.promoDiscountPercentage + '%'} OFF</Text>
                        </View>
                    ) : null}


                    {!this.state.thisEnrolled ? (
                        !this.state.freeSession || this.state.sessionType === 'DISCOUNT' ?

                            <View>

                                {this.state.loading4 ? (
                                    <ActivityIndicator
                                        animating
                                        size="large"
                                        style={{marginVertical: 10}}
                                    />
                                ) : null}

                            </View>

                            : null
                    ) : null}

                    {!this.state.thisEnrolled ? (
                        !this.state.freeSession || this.state.sessionType === 'DISCOUNT' ? (
                            <View style={{width: '100%', alignItems: 'center'}}>

                                <View style={{width: '95%'}}>
                                    <Button
                                        text="Pay"
                                        loading={loading}
                                        onPress={() => {
                                            /** TEMP SOLUTION **/
                                            this.handleCardPayPress('no');
                                            // this.setState({showAlertSaveCard: true})
                                        }}
                                    />
                                </View>

                                {/*{this.state.allowCashPayment ? (*/}
                                {/*    <View style={{width: '100%', alignItems: 'center'}}>*/}
                                {/*        <TouchableOpacity style={styles.buttonOutline}*/}
                                {/*                          onPress={() => this.onCashPaymentMethod()}*/}
                                {/*        >*/}
                                {/*            <View style={styles.imageHolder}>*/}
                                {/*                <Image source={CashImg} style={{width: '100%', height: '100%'}}/>*/}
                                {/*            </View>*/}
                                {/*            <Text style={styles.btnContent}>Pay by Cash</Text>*/}
                                {/*        </TouchableOpacity>*/}
                                {/*    </View>*/}
                                {/*) : null}*/}

                                <View style={{marginHorizontal: 10, marginTop: 10, flexDirection: 'row'}}>
                                    <View style={{width: 23, height: 23, marginRight: 10, marginTop: 5}}>
                                        <Image source={PadlockImg} style={{width: '100%', height: '100%'}}
                                               resizeMode={'contain'}/>
                                    </View>
                                    <Text style={{...styles.subTitle, width: '90%', color: Color.black}}>We process your
                                        cards securely with Payhere, which is PCI certified and holds the highest level
                                        of certification </Text>
                                </View>

                            </View>
                        ) : (
                            <View style={{width: '100%', alignItems: 'center', marginTop: '50%'}}>
                                <TouchableOpacity style={styles.btnStyle} onPress={() => this.onButtonClick()}>
                                    <Text style={styles.btnContent}>Continue</Text>
                                </TouchableOpacity>

                            </View>
                        )
                    ) : null}


                </ScrollView>
                <Loading isVisible={this.state.loading3}/>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <Model
                        toggleModal={(promoCode) => this.toggleModal(promoCode)}
                        closeModal={() => this.closeModal()}
                        id={this.state.promoCodeId}
                        category={this.state.promoCodeType}
                    />
                </Modal>

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


const mapStateToProps = (state) => ({});


const mapDispatchToProps = dispatch => {
    return {
        fetchOnlineClasses: onlineFetch => dispatch(actionTypes.fetchOnlineClasses(onlineFetch)),
        fetchOfflineClasses: offlineFetch => dispatch(actionTypes.fetchOfflineClasses(offlineFetch))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
