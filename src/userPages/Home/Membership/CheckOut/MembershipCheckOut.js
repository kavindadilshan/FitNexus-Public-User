import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator, StatusBar, ImageBackground, Modal
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
import {PUBLIC_URL, SubUrl} from "../../../../axios/server_url";
import Toast from 'react-native-simple-toast';
import {Font} from "../../../../constance/AppFonts";
import {AppToast} from "../../../../constance/AppToast";
import Loading from "../../../../component/Loading/Loading";
import {CurrencyType} from "../../../../constance/AppCurrency";
import {Api} from "../../../../constance/AppAPIKeys";
import PlaceholderIMG from "../../../../assets/Sample/placeholderIMG.jpg";
import RatingModal from "../../../../component/UIElement/RatingModal";
import gif from "../../../../assets/Home/loading.gif";
import {ServerUrl} from "../../../../constance/AppServerUrl";
import AlertMassage from "../../../../component/Actions/AlertMassage";
import CashImg from '../../../../assets/Home/money.png';
import PadlockImg from '../../../../assets/Home/padlock.png';
import PromoLabel from "../../../../assets/Profile/promoLabel.png";
import AddImg2 from "../../../../assets/Profile/addpromo.png";
import AddImg from "../../../../assets/Home/addImg.png";
import Model from "../../../../component/UIElement/AddPromoCodeModal";
import {AppEventsLogger} from "react-native-fbsdk";
import analytics from "@react-native-firebase/analytics";
import RepeatIMG from "../../../../assets/Profile/repeat.png";
import {styles} from "./styles";
import CardHolder from "../../../../component/UIElement/CardHolder";
import {IS_STRIPE_ENABLED} from "../../../../constance/Const";
import PayHereApiService, {createPayHereObj, payHerePaymentUtil} from "../../../../component/PayHere/payhereUtils"
import PayHere from "@payhere/payhere-mobilesdk-reactnative";
import {encryption} from "../../../../component/Encryption/Encrypt&Decrypt";

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
        clientSecretId: '',
        stripePaymentMethodId: '',
        payHerePaymentMethodId: '',
        typeId: '',
        btnVisible: false,
        loading2: false,
        loading3: false,
        role: '',
        listClasses: [],
        name: '',
        description: '',
        discount: '',
        discountPrice: '',
        duration: '',
        price: '',
        loading4: false,
        path: '',
        pathId: '',
        showAlert: false,
        membershipBooked: '',
        pathType: '',
        paymentType: '',
        allowedCashPayment: false,
        classId: '',
        classType: '',
        list2: [],
        modalVisible: false,
        discountMaxAmount: '',
        discountPercentage: '',
        promoDiscount: '',
        selectedDiscountId: '',
        membershipType: '',
        showAlertSaveCard: false
    };

    async componentWillMount() {
        const {navigation} = this.props;
        const role = navigation.getParam('role');
        const roleId = navigation.getParam('roleId');
        let path = navigation.getParam('path');
        const membershipBooked = navigation.getParam('membershipBooked');
        let membershipType = navigation.getParam('membershipType');

        this.setState({
            role: role,
            typeId: roleId,
            path: path.page,
            pathId: path.pageId,
            pathType: path.pageType,
            membershipBooked: membershipBooked,
            membershipType: membershipType
        });

        if (role === 'classMember') {
            this.setState({classId: path.classId, classType: membershipType})
        }


        this.getAllCards();
        if (role !== 'classMember') {
            this.getAllPromoCodes(path.pageId, 'GYM');
        } else {
            this.getAllPromoCodes(roleId, membershipType !== 'ONLINE_CLASS' ? 'PHYSICAL_CLASS_MEMBERSHIP' : 'ONLINE_CLASS_MEMBERSHIP');
        }


        this.getMembershipdetails(roleId, role, membershipType);

    }

    /**
     * get membership by id endpoint
     * */
    getMembershipdetails = async (roleId, role, classType) => {
        this.setState({loading4: true});
        axios.get(SubUrl.get_membership_by_id + roleId)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    const name = data.name;
                    const description = data.description;
                    const discount = data.discount;
                    const discountPrice = data.discountedPrice;
                    const duration = data.duration;
                    const price = data.price;
                    const list = [];
                    const allowedCashPayment = data.allowCashPayment;

                    if (role === 'classMember') {
                        if (classType !== 'ONLINE_CLASS') {
                            data.physicalClassList.map((item) => {
                                list.push({
                                    id: item.classId,
                                    name: item.className,
                                    rating: item.classRating,
                                    count: item.classRatingCount,
                                    image: item.image
                                })
                            });
                        } else {
                            data.onlineClassList.map((item) => {
                                list.push({
                                    id: item.classId,
                                    name: item.className,
                                    rating: item.classRating,
                                    count: item.classRatingCount,
                                    image: item.image
                                })
                            });
                        }

                    } else {
                        list.push({
                            id: data.gymId,
                            name: data.gymName,
                            rating: data.gymRating,
                            count: data.gymRatingCount,
                            image: data.gymImage
                        })
                    }


                    this.setState({
                        name: name,
                        description: description,
                        discount: discount,
                        discountPrice: discountPrice,
                        duration: duration,
                        listClasses: list,
                        price: price,
                        loading4: false,
                        allowedCashPayment: allowedCashPayment
                    })

                    this.fbAnalyticsMembership();
                } else {
                    this.setState({loading4: false});
                    Toast.show(response.data.message)
                }
            })
            .catch(error => {
                this.setState({loading4: true});
                AppToast.networkErrorToast();
            })
    };

    /**
     * facebook analytics for membership profile
     */
    fbAnalyticsMembership = () => {
        AppEventsLogger.logEvent("fb_mobile_content_view", {
            "fb_content": this.state.typeName,
            "fb_content_type": this.state.role !== 'classMember' ? 'Gym Membership' : this.state.classType !== 'ONLINE_CLASS' ? 'Online Class Membership' : 'Fitness Class Membership',
            "fb_content_id": this.state.typeId,
            "fb_currency": CurrencyType.currency
        })
    }


    /**
     * set currency type for amount
     * */
    numberFormat = (value) =>
        new Intl.NumberFormat(CurrencyType.locales, {
            style: 'currency',
            currency: CurrencyType.currency
        }).format(value).replace(/\.00/g, '');


    /**
     * get all cards endpoint
     * */
    getAllCards = async () => {
        this.setState({loading2: true});
        const data = {
            userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
        };
        axios.post(SubUrl.check_stripe, data)
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
                            last4: item.last4.replace(/\D/g, ""),
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


    };

    /**
     * get applicable promo codes
     * @returns {Promise<void>}
     */
    getAllPromoCodes = async (id, type, selectedPromoCode) => {
        this.setState({loading4: true});
        axios.get(SubUrl.get_applicable_promo_codes + type + '/' + id)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    const list2 = [];
                    data.map((item) => {
                        list2.push({
                            id: item.id,
                            percentage: item.percentage,
                            maxDiscount: item.maxDiscount,
                            refNo: item.refNo,
                            usageLimit: item.usageLimit,
                            visible: selectedPromoCode ? selectedPromoCode === item.refNo : false
                        })
                        if (selectedPromoCode && selectedPromoCode === item.refNo) {
                            this.onPromoCodePress({
                                id: item.id,
                                percentage: item.percentage,
                                maxDiscount: item.maxDiscount,
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
            'fb_content_type': this.state.role !== 'classMember' ? 'Gym Membership' : this.state.classType !== 'ONLINE_CLASS' ? 'Online Class Membership' : 'Fitness Class Membership',
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
            transaction_id: id !== undefined ? id : this.state.payHerePaymentMethodId,
            currency: CurrencyType.currency,
            items: [{
                item_id: this.state.typeId,
                item_name: this.state.typeName,
                item_category: this.state.role !== 'classMember' ? 'Gym Membership' : this.state.classType !== 'ONLINE_CLASS' ? 'Online Class Membership' : 'Fitness Class Membership',
                quantity: 1,
                price: this.state.price,
            }]
        })
    }

    /**
     * use cratePaymentMethod logic strip
     * */
    async createPaymentMethod(id, stripePaymentMethodId) {
        try {
            const result = await stripe.confirmPaymentIntent({
                clientSecret: id,
                paymentMethodId: stripePaymentMethodId,

            });

            this.fbAnalytics();
            this.googleAnalytics();

            this.props.navigation.navigate('CardAddedForm', {
                title: 'Your payment done',
                page: this.state.path,
                id: this.state.pathId,
                role: this.state.pathType
            })

        } catch (e) {
            this.setState({loading3: false});
            AppToast.errorToast(e.message);
            this.props.navigation.navigate('CardAddedFailForm', {
                page: 'MembershipCheckOutForm'
            })
        }
    }

    /**
     * stripe payment using saved card
     * purchase membership endpoint
     * */
    getClientSecret = async () => {
        this.setState({loading3: true});

        const {navigation} = this.props;
        const role = navigation.getParam('role');

        let data;

        if (this.state.selectedDiscountId !== '') {
            data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                membershipId: this.state.typeId,
                paymentMethodId: this.state.stripePaymentMethodId !== null ? this.state.stripePaymentMethodId : this.state.payHerePaymentMethodId,
                discountId: this.state.selectedDiscountId,
            };
        } else {
            data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                membershipId: this.state.typeId,
                paymentMethodId: this.state.stripePaymentMethodId !== null ? this.state.stripePaymentMethodId : this.state.payHerePaymentMethodId,
            };
        }

        if (this.state.stripePaymentMethodId === null) {
            Object.assign(data, {
                ipgType: 'PAYHERE',
                deviceType: 'mobile'
            })
        }


        axios.post(this.state.stripePaymentMethodId !== null ? SubUrl.purchase_membership : SubUrl.payhere_purchase_membership, data)
            .then(async response => {

                if (response.data.success) {
                    const data = response.data.body;

                    if (this.state.stripePaymentMethodId !== null) {
                        this.setState({loading3: false});
                        let stripePaymentMethodId = this.state.stripePaymentMethodId;
                        this.createPaymentMethod(data, stripePaymentMethodId, role);
                    } else {
                        this.setState({loading3: false});
                        this.props.navigation.navigate('CardAddedForm', {
                            title: 'Your payment done',
                            page: this.state.path,
                            id: this.state.pathId,
                            role: this.state.pathType
                        })
                        // await this.payHereSavedCardPayments(data)
                    }
                } else {
                    Toast.show(response.data.message);
                    this.setState({loading: false, loading2: false, loading3: false});
                    this.props.navigation.navigate('CardAddedFailForm', {
                        page: 'MembershipCheckOutForm'
                    })
                }

            })
            .catch(error => {
                this.setState({loading3: false});
                AppToast.networkErrorToast();
            })

    };

    /**
     * membership save card payment through payhere
     * @param data
     * @returns {Promise<void>}
     */
    payHereSavedCardPayments = async (data) => {
        await PayHereApiService.payBySavedPayHereCard(data, this.state.role !== 'classMember' ? 'Gym Membership' : this.state.classType !== 'ONLINE_CLASS' ? 'Online Class Membership' : 'Fitness Class Membership')
            .then(res => {
                if (res.success) {
                    this.setState({loading3: false});
                    this.props.navigation.navigate('CardAddedForm', {
                        title: 'Your payment done',
                        page: this.state.path,
                        id: this.state.pathId,
                        role: this.state.pathType
                    })
                } else {
                    this.setState({loading3: false});
                    Toast.show(res.message);
                    this.props.navigation.navigate('CardAddedFailForm', {
                        page: 'MembershipCheckOutForm'
                    })
                }
            })
            .catch(err => {
                this.setState({loading3: false});
                AppToast.networkErrorToast();
            })
    }

    /**
     * stripe payment using new card
     * purchase membership endpoint
     * */
    getClientSecret2 = async (type) => {
        await this.payHereNewCardPayment(type);
    }

    /**
     * this method using for new card payment trough Payhere
     * @returns {Promise<void>}
     */
    payHereNewCardPayment = async (status) => {
        let data;
        if (this.state.selectedDiscountId !== '') {
            data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                membershipId: this.state.typeId,
                discountId: this.state.selectedDiscountId,
                ipgType: 'PAYHERE',
                deviceType: 'mobile'
            };
        } else {
            data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                membershipId: this.state.typeId,
                ipgType: 'PAYHERE',
                deviceType: 'mobile'
            };
        }

        axios.post(SubUrl.payhere_card_with_save_card_or_without_save_card_checkout + status, data)
            .then(async response => {
                if (response.data.success) {
                    const obj = response.data.body;

                    console.log(await createPayHereObj(obj, this.state.role !== 'classMember' ? 'Gym Membership' : this.state.classType !== 'ONLINE_CLASS' ? 'Online Class Membership' : 'Fitness Class Membership',status),)
                    await PayHere.startPayment(
                        await createPayHereObj(obj, this.state.role !== 'classMember' ? 'Gym Membership' : this.state.classType !== 'ONLINE_CLASS' ? 'Online Class Membership' : 'Fitness Class Membership',status),
                        async (paymentId) => {
                            console.log("Payment Completed", paymentId);
                            this.fbAnalytics();
                            this.googleAnalytics(obj.orderId);
                            this.props.navigation.navigate('CardAddedForm', {
                                title: 'Your payment done',
                                page: this.state.path,
                                id: this.state.pathId,
                                role: this.state.pathType,
                                newCard: false,
                            })
                        },
                        async (errorData) => {
                            console.log("PayHere Error", errorData);
                            this.setState({loading3: false});
                            Toast.show("PayHere Error");
                            this.props.navigation.navigate('CardAddedFailForm', {
                                page: 'MembershipCheckOutForm'
                            })

                        },
                        async () => {
                            console.log("Payment Dismissed");
                            this.setState({loading3: false});
                        }
                    );

                } else {
                    this.setState({loading3: false});
                    Toast.show(response.data.message);
                    this.props.navigation.navigate('CardAddedFailForm', {
                        page: 'MembershipCheckOutForm'
                    })
                }
            })
            .catch(error => {
                this.setState({loading3: false})
                AppToast.networkErrorToast();
            })
    }

    handleCardPayPress = async () => {
        if (this.state.role === 'gymMember' && this.state.membershipBooked) {
            this.setState({showAlert: true, paymentType: 'newCardPayment'});
        } else {
            /** TEMP SOLUTION **/
            this.getClientSecret2('no');
            // await this.setState({showAlertSaveCard:true})
        }
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
                });
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
                    visible: false
                })
                if (items.visible) {
                    this.setState({
                        btnVisible: false
                    })
                }

            }
        }
        this.setState({list: list})
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
                membershipId: this.state.typeId,
                paymentMethodId: 'CASH',
                physicalClassId: this.state.classId,
                discountId: this.state.selectedDiscountId
            };
        } else {
            data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                membershipId: this.state.typeId,
                paymentMethodId: 'CASH',
                physicalClassId: this.state.classId,
            };
        }


        this.setState({loading3: true});
        axios.post(SubUrl.purchase_membership, data)
            .then(async response => {
                if (response.data.success) {
                    this.setState({loading3: false});

                    this.fbAnalytics();
                    this.googleAnalytics();

                    this.props.navigation.navigate('CardAddedForm', {
                        title: 'Your payment done',
                        page: this.state.path,
                        id: this.state.pathId,
                        role: this.state.pathType
                    })

                } else {
                    this.setState({loading3: false});
                    Toast.show(response.data.message);
                    this.props.navigation.navigate('CardAddedFailForm', {
                        page: 'MembershipCheckOutForm'
                    })
                }

            })
            .catch(error => {
                AppToast.networkErrorToast();
                this.setState({loading3: false});
            })
    };

    onPromoCodePress = (items, alreadySelected) => {
        const promoDiscount = this.state.discountPrice * items.percentage / 100 <= items.maxDiscount ? this.state.discountPrice * items.percentage / 100 : items.maxDiscount;
        if (alreadySelected) {
            this.setState({
                discountMaxAmount: items.maxDiscount,
                discountPercentage: items.percentage,
                freeSession: true,
                promoDiscount: promoDiscount,
                selectedDiscountId: items.id
            })
        } else {
            const data = this.state.list2;
            const list = [];
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
                        discountMaxAmount: items.maxDiscount,
                        discountPercentage: items.percentage,
                        freeSession: true,
                        promoDiscount: promoDiscount,
                        selectedDiscountId: items.id
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
                        freeSession: false,
                        promoDiscount: 0,
                        selectedDiscountId: ''
                    })
                }
            }
            this.setState({
                list2: list,
            })
        }

    }

    /**
     * set days to year ,month types
     * */
    timePeriodConverter = (days) => {
        if (days >= 365) {
            return (days / 365).toFixed(0) + ' YEAR'
        } else if (days >= 30) {
            return (days / 30).toFixed(0) + ' MONTH'
        } else {
            return days + ' DAY'
        }
    };

    /**
     * button press action handler
     * */
    onButtonClick = async () => {
        if (this.state.role === 'gymMember' && this.state.membershipBooked) {
            this.setState({showAlert: true, paymentType: 'saveCardPayment'})
        } else {
            this.getClientSecret();
        }
    };

    hideAlert = (type) => {
        switch (type) {
            case 'yes':
                if (this.state.paymentType === 'newCardPayment') {
                    // this.getClientSecret2();

                    /** TEMP SOLUTION **/
                    this.getClientSecret2('no');
                    // this.setState({showAlertSaveCard:true})
                } else {
                    this.getClientSecret();
                }
                this.setState({
                    showAlert: false
                })
                break;
            case 'no':
                this.setState({
                    showAlert: false
                });
                break;
            default:
                break;
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

    /**
     * modal save action
     * @returns {Promise<void>}
     */
    toggleModal = async (promoCode) => {
        this.getAllCards();
        if (this.state.role !== 'classMember') {
            this.getAllPromoCodes(this.state.pathId, 'GYM', promoCode.value);
        } else {
            this.getAllPromoCodes(this.state.typeId, this.state.membershipType !== 'ONLINE_CLASS' ? 'PHYSICAL_CLASS_MEMBERSHIP' : 'ONLINE_CLASS_MEMBERSHIP', promoCode.value);
        }
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
        ));

        const listMembershipDetails = this.state.listClasses.map((item, i) => (
            <View
                style={styles.businessContainer} key={i}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.imageOuter}>
                        <Image source={item.image !== null ? {uri: item.image} : PlaceholderIMG} reziseMode={'stretch'}
                               style={styles.imageStyle}/>
                    </View>
                    <View style={{flexDirection: 'column', flex: 1}}>
                        <Text style={styles.containerTitle}>{item.name}</Text>
                        <RatingModal
                            rating={item.rating}
                            count={item.count}
                            color={'#4B6883'}
                            fontSize={14}
                            tintColor={Color.white}
                        />

                    </View>

                </View>

            </View>
        ));

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

        const {loading, token} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <ScrollView contentContainerStyle={{width: '100%', paddingBottom: 20}}>
                    {this.state.role !== 'classMember' && this.state.membershipBooked ? (
                        <View style={styles.alertBox}>
                            <Text style={styles.alertText}>You already purchased a membership of this gym</Text>
                        </View>
                    ) : null}

                    <View style={{width: '100%', alignItems: 'center'}}>
                        {!this.state.loading4 ? (
                            <View style={styles.subContainer}>
                                <Text style={{...styles.nameTitle, marginTop: 20}}>{this.state.name}</Text>
                                <Text style={{...styles.mainTitle, fontSize: 14}}>{this.state.description}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={this.state.role !== 'classMember' ? {
                                        ...styles.membershipTypeContainer,
                                        backgroundColor: Color.purpleBlue
                                    } : styles.membershipTypeContainer}>
                                        <Text style={{...styles.mainTitle, fontSize: 12, color: Color.white}}>
                                            {this.state.role !== 'classMember' ? 'GYM' : this.state.classType === 'PHYSICAL_CLASS' ? 'FITNESS CLASS' : 'ONLINE CLASS'} MEMBERSHIP</Text>
                                    </View>
                                </View>

                                <Text style={{
                                    ...styles.mainTitle,
                                    fontSize: 16
                                }}>{this.state.role !== 'classMember' ? 'Gym Details' : 'Eligible Classes'}</Text>
                                <View style={{width: '100%', alignItems: 'center'}}>
                                    {listMembershipDetails}
                                </View>

                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                                    <Text style={styles.dotStyle}>●</Text>
                                    <Text style={styles.title}>Duration:</Text>
                                    <Text style={styles.currency}>{this.timePeriodConverter(this.state.duration)}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <Text style={styles.dotStyle}>●</Text>
                                    <Text style={styles.title}>Gross Total:</Text>
                                    <Text style={{
                                        ...styles.currency,
                                        color: Color.softlightGray
                                    }}>{this.numberFormat(this.state.price)}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <Text style={styles.dotStyle}>●</Text>


                                    <Text style={styles.title}>Discount:</Text>

                                    <Text style={{
                                        ...styles.currency,
                                        color: Color.softlightGray
                                    }}>-{this.numberFormat((this.state.price / 100 * this.state.discount) + this.state.promoDiscount)}</Text>


                                </View>

                                {this.state.freeSession ? (
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                        <Text style={styles.discountText}>
                                            - Promo Codes <Text
                                            style={{
                                                ...styles.discountText,
                                                color: Color.red
                                            }}>({this.state.discountPercentage}% OFF
                                            upto {this.numberFormat(this.state.discountMaxAmount)})</Text>
                                        </Text>

                                        <Text style={{
                                            ...styles.currency,
                                            color: Color.softlightGray, fontFamily: Font.Medium, fontSize: 12
                                        }}>-{this.numberFormat(this.state.promoDiscount)}</Text>
                                    </View>
                                ) : null}


                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <Text style={styles.discountText}>
                                        - Referral discounts <Text
                                        style={{...styles.discountText, color: Color.red}}>({this.state.discount}%
                                        OFF)</Text>
                                    </Text>

                                    <Text style={{
                                        ...styles.currency,
                                        color: Color.softlightGray, fontSize: 12, fontFamily: Font.Medium,
                                    }}>-{this.numberFormat(this.state.price / 100 * this.state.discount)}</Text>
                                </View>


                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <Text style={styles.dotStyle}>●</Text>
                                    <Text style={styles.title}>Discounted Price:</Text>
                                    <Text
                                        style={styles.currency}>{this.numberFormat(this.state.discountPrice - this.state.promoDiscount)}</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.gifHolder}>
                                <Image source={gif} style={styles.gif}/>
                            </View>
                        )}


                    </View>


                    <View style={{width: '100%'}}>
                        <Image source={Line} style={{width: '100%', marginTop: '8%', marginBottom: '3%'}}/>

                        <View style={{marginBottom: 15}}>

                            {/*<View style={{*/}
                            {/*    flexDirection: 'row',*/}
                            {/*    marginTop: 5,*/}
                            {/*    marginBottom: 10,*/}
                            {/*    alignItems: 'center',*/}
                            {/*    flex: 1,*/}
                            {/*}}>*/}
                            {/*    <Text style={{*/}
                            {/*        ...styles.mainTitle,*/}
                            {/*        fontSize: 16,*/}
                            {/*        marginLeft: 10,*/}
                            {/*    }}>Select a Promo Code</Text>*/}

                            {/*    {this.state.list2.length !== 0 ? (*/}
                            {/*        <TouchableOpacity style={styles.miniPromoCode}*/}
                            {/*                          onPress={() => this.setState({modalVisible: true})}>*/}
                            {/*            <Image source={AddImg2} style={{width: 15, height: 15}}/>*/}
                            {/*            <Text style={styles.addPromoMiniTxt}>Add Promo code</Text>*/}
                            {/*        </TouchableOpacity>*/}
                            {/*    ) : null}*/}
                            {/*</View>*/}


                            {/*{this.state.loading4 ? (*/}
                            {/*    <ActivityIndicator*/}
                            {/*        animating*/}
                            {/*        size="large"*/}
                            {/*        style={{marginVertical: 10}}*/}
                            {/*    />*/}
                            {/*) : this.state.list2.length === 0 ? (*/}
                            {/*    <TouchableOpacity style={styles.addPromoCodeCompo}*/}
                            {/*                      onPress={() => this.setState({modalVisible: true})}>*/}
                            {/*        <Image source={AddImg} style={{width: 15, height: 15, marginRight: 5}}/>*/}
                            {/*        <Text style={styles.addPromoTxt}>Add Promo code</Text>*/}
                            {/*    </TouchableOpacity>*/}
                            {/*) : listPromoCodes}*/}

                        </View>


                        <View style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                            <View style={{width: '95%'}}>
                                <Button
                                    text="Pay"
                                    loading={loading}
                                    onPress={this.handleCardPayPress}
                                />
                            </View>
                        </View>

                    </View>

                    {/*{this.state.role === 'classMember' && this.state.allowedCashPayment ? (*/}
                    {/*    <View style={{width: '100%', alignItems: 'center'}}>*/}
                    {/*        <TouchableOpacity*/}
                    {/*            style={{...styles.btnStyle, backgroundColor: Color.softBlue, marginTop: 10}}*/}
                    {/*            onPress={() => this.onCashPaymentMethod()}*/}
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
                            <Image source={PadlockImg} style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
                        </View>
                        <Text style={{...styles.subTitle, width: '90%', color: Color.black}}>We process your cards
                            securely with Payhere, which is PCI certified and holds the highest level of
                            certification </Text>
                    </View>


                </ScrollView>
                <Loading isVisible={this.state.loading3}/>
                <AlertMassage
                    show={this.state.showAlert}
                    message={"You have already purchased a  membership for this gym.Are you sure you want to purchase more membership?"}
                    onCancelPressed={() => {
                        this.hideAlert('yes');
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert('no');
                    }}
                    cancelText={'Confirm'}
                    confirmText={'Cancel'}
                    btnSize={110}
                />

                <AlertMassage
                    show={this.state.showAlertSaveCard}
                    message={"Do you want to keep this card for future payments?"}
                    onCancelPressed={async () => {
                        await this.setState({showAlertSaveCard:false})
                        await this.getClientSecret2('yes');
                    }}
                    onConfirmPressed={async () => {
                        await this.setState({showAlertSaveCard:false})
                        await this.getClientSecret2('no');
                    }}
                    cancelText={'Yes'}
                    confirmText={'No'}
                    btnSize={110}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <Model
                        toggleModal={(promoCode) => this.toggleModal(promoCode)}
                        closeModal={() => this.closeModal()}
                        id={this.state.role !== 'classMember' ? this.state.pathId : this.state.typeId}
                        category={this.state.role !== 'classMember' ? 'GYM' : this.state.membershipType !== 'ONLINE_CLASS' ? 'PHYSICAL_CLASS_MEMBERSHIP' : 'ONLINE_CLASS_MEMBERSHIP'}
                    />
                </Modal>

            </View>
        )
    }
}

export default App;
