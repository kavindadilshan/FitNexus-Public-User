import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    NativeEventEmitter, Linking, StatusBar, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Color} from '../../../../constance/Colors';
import Line from '../../../../assets/Sample/Line.png';
import Calandar from '../../../../assets/Home/calender.png';
import Time from '../../../../assets/Home/timeMini.png';
import Prepare from '../../../../assets/Home/prepare.png';
import axios from '../../../../axios/axios';
import {SubUrl} from '../../../../axios/server_url';
import {StorageStrings} from '../../../../constance/StorageStrings';
import Moment from 'moment';
import ProfileContainer from '../../../../component/ProfileContainer/ProfileContainer';
import Toast from 'react-native-simple-toast';
import {
    GROUP_CLASS_ONLY,
    PACKAGE_NUMBER,
    SINGLE_SESSION_PAYMENT
} from '../../../../constance/Const';
import CountDown from 'react-native-countdown-component';
import AwesomeAlert from 'react-native-awesome-alerts';
import {Font} from '../../../../constance/AppFonts';
import {AppToast} from '../../../../constance/AppToast';
import RatingModal from '../../../../component/UIElement/RatingModal';
import PlaceholderIMG from '../../../../assets/Sample/placeholderIMG.jpg';
import gif from '../../../../assets/Home/loading.gif';
import {CurrencyType} from '../../../../constance/AppCurrency';
import locationOuter from '../../../../assets/Home/locationMini.png';
import FacilitiesComponent from '../../../../component/UIElement/FacilitiesComponent';
import UpArrow from '../../../../assets/Home/upArrow.png';
import DownArrow from '../../../../assets/Home/downArrow.png';
import * as actionTypes from '../../../../store/actions';
import {connect} from 'react-redux';
import MembershipComponent from '../../../../component/UIElement/MembershipComponent';
import Orientation from 'react-native-orientation';
import CorporateAlertIMG from '../../../../assets/Home/co-opAlert.png';
import AlertMassage from '../../../../component/Actions/AlertMassage';
import * as Validation from '../../../Validation/Validation';
import YoutubePlayer from 'react-native-youtube-iframe';
import {AppEventsLogger} from 'react-native-fbsdk';
import analytics from '@react-native-firebase/analytics';
import {encryption} from '../../../../component/Encryption/Encrypt&Decrypt';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

function reduceSomeMinutesToTime(startTime, minutestoAdd) {
    const dateObj = new Date(startTime);
    const newDateInNumber = dateObj.setMinutes(dateObj.getMinutes() - minutestoAdd);
    const processedTime = new Date(newDateInNumber).toISOString();
    return processedTime.split('.')[0] + 'Z';
}

let index = PACKAGE_NUMBER;

class App extends React.Component {
    state = {
        name: '',
        image: null,
        rating: '',
        ratingCount: '',
        date: '',
        startTime: '',
        endTime: '',
        endDateAndTime: '',
        trainerImage: null,
        trainerFirstName: '',
        trainerLastName: '',
        description: '',
        howToPrepare: '',
        className: '',
        trainerRating: '',
        trainerRatingCount: '',
        trainerId: '',
        classId: '',
        classDescription: '',
        trainerDescription: '',
        price: '',
        gender: '',
        trainerIdToReview: '',
        available: false,
        buttonStatus: false,
        startSessionButtonEnabled: false,
        count: false,
        showAlert: false,
        loading: false,
        isFirstTimeLoading: true,
        discountMaxAmount: '',
        discountPercentage: '',
        discountDescription: '',
        startDateAndTime: '',
        prepareVisible: false,
        facilitiesVisible: false,
        role: '',
        location: '',
        distance: '',
        listMembership: [],
        placeLongitude: '',
        placeLatitude: '',
        membershipCount: '',
        sessionId: '',
        membershipBooked: false,
        bookedMemberships: [],
        allowCashPayment: false,
        typeName: '',
        corporateMembershipBooked: false,
        corporates: [],
        showAlert2: false,
        youtubeUrl: '',
        guestAlert: false,
        guestAlert2: false,
        promoCodeType: '',
        subscribedPackages: [],
        packageSubscribed: false,
        singleClassPayment: true,
        packageId: '',
        userInMeeting: false,
    };


    async componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {

            this.setState({loading: true});

            const {navigation} = this.props;
            const role = navigation.getParam('role');
            if (role !== 'online') {
                this.getAllPysicalSessionState();
            } else {
                this.setState({singleClassPayment: SINGLE_SESSION_PAYMENT});
                this.getAllInputState();
            }

            this.setState({role: role, count: false, showAlert: false});
            let run = true;


        });
    }

    /**
     * set currency format
     * */
    numberFormat = (value) =>
        new Intl.NumberFormat(CurrencyType.locales, {
            style: 'currency',
            currency: CurrencyType.currency,
        }).format(value).replace(/\.00/g, '');

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    /**
     * get online session details by id
     * */
    getAllInputState = () => {
        const {navigation} = this.props;
        const sessionId = navigation.getParam('sessionId');
        this.setState({loading: true, sessionId: sessionId});
        axios.get(SubUrl.get_session_details + sessionId)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    const name = data.className;
                    const image = data.classImage !== null ? data.classImage : null;
                    const rating = data.classRating;
                    const ratingCount = data.ratingCount;
                    const date = new Date(data.dateAndTime).toDateString();
                    const startTime = Moment(new Date(data.dateAndTime), 'hh:mm').format('LT');
                    const endTime = Moment(new Date(data.endDateAndTime), 'hh:mm').format('LT');
                    const endDateAndTime = data.endDateAndTime;
                    const startDateAndTime = reduceSomeMinutesToTime(data.dateAndTime, 15);
                    const trainerImage = data.trainerImage !== null ? data.trainerImage : null;
                    const trainerFirstName = data.trainerFirstName;
                    const trainerLastName = data.trainerLastName;
                    const description = data.description;
                    const howToPrepare = data.howToPrepare;
                    const className = data.className;
                    const trainerRating = data.trainerRating;
                    const trainerRatingCount = data.trainerRatingCount;
                    const trainerId = data.trainerUserId;
                    const trainerIdToReview = data.trainerId;
                    const classId = data.classId;
                    const classDescription = data.classDescription;
                    const trainerDescription = data.trainerDescription;
                    const price = data.price;
                    const buttonStatus = data.buttonStatus;
                    const sessionStatus = data.sessionStatus;
                    const discountMaxAmount = data.discountMaxAmount;
                    const discountPercentage = data.discountPercentage;
                    const discountDescription = data.discountDescription;
                    const gender = data.gender;
                    const typeName = data.category !== 'GROUP' ? 'One-To-One' : 'Group';
                    const listMembership = data.memberships;
                    const membershipCount = data.membershipCount;
                    const membershipBooked = data.membershipBooked;
                    const bookedMemberships = data.bookedMemberships;
                    const allowCashPayment = data.allowCashPayment;
                    const corporateMembershipBooked = data.corporateMembershipBooked;
                    const corporates = data.corporates !== null ? data.corporates : null;
                    const youtubeUrl = data.youtubeUrl !== null && data.youtubeUrl !== '' ? Validation.YoutubeVideoIdValidator(data.youtubeUrl) : null;
                    const subscribedPackages = data.subscribedPackages !== null ? data.subscribedPackages : null;
                    const packageSubscribed = data.packageSubscribed;
                    const packageId = data.packagesForClass.length !== 0 ? data.packagesForClass[index].id : '';


                    const maxJoiners = data.maxJoiners;
                    const availableCount = data.availableCount;
                    this.props.navigation.setParams({
                        maxJoiners: maxJoiners,
                        availableCount: availableCount,
                    });
                    if (buttonStatus === 'CORPORATE_RESERVE' || buttonStatus === 'PACKAGE_RESERVE') {
                        this.setState({singleClassPayment: true});
                    }

                    this.setState({
                        name: name,
                        image: image,
                        rating: rating,
                        ratingCount: ratingCount,
                        date: date,
                        startTime: startTime,
                        endTime: endTime,
                        trainerImage: trainerImage,
                        trainerFirstName: trainerFirstName,
                        trainerLastName: trainerLastName,
                        description: description,
                        howToPrepare: howToPrepare,
                        className: className,
                        trainerRating: trainerRating,
                        trainerRatingCount: trainerRatingCount,
                        trainerId: trainerId,
                        classId: classId,
                        classDescription: classDescription,
                        trainerDescription: trainerDescription,
                        price: price,
                        buttonStatus: buttonStatus,
                        trainerIdToReview: trainerIdToReview,
                        sessionStatus: sessionStatus,
                        endDateAndTime: endDateAndTime,
                        isFirstTimeLoading: false,
                        discountMaxAmount: discountMaxAmount,
                        discountPercentage: discountPercentage,
                        discountDescription: discountDescription,
                        startDateAndTime: startDateAndTime,
                        gender: gender.charAt(0).toUpperCase() + gender.slice(1),
                        typeName: typeName,
                        membershipCount: membershipCount,
                        membershipBooked: membershipBooked,
                        bookedMemberships: bookedMemberships !== null ? bookedMemberships : [],
                        allowCashPayment: allowCashPayment,
                        listMembership: listMembership,
                        corporateMembershipBooked: corporateMembershipBooked,
                        corporates: corporates,
                        youtubeUrl: youtubeUrl,
                        promoCodeType: typeName !== 'One-To-One' ? 'ONLINE_GROUP_CLASS' : 'ONLINE_PERSONAL_CLASS',
                        subscribedPackages: subscribedPackages,
                        packageSubscribed: packageSubscribed,
                        packageId: packageId,
                    });

                    this.fbAnalyticsClass();
                    this.googleAnalyticsSession();

                    if (this.getButtonStatus(buttonStatus, sessionStatus, endDateAndTime).text === 'Payment Processing') {
                        setTimeout(() => {
                            this.getAllInputState();
                        }, 5000);
                    }


                } else {
                    Toast.show('Failed to load session details');
                }

                this.setState({loading: false});
            })
            .catch(error => {
                this.setState({loading: false});
                AppToast.networkErrorToast();
            });
    };

    /**
     * get physical session details by id
     * */
    getAllPysicalSessionState = async () => {
        const {navigation} = this.props;
        const sessionId = navigation.getParam('sessionId');
        const latitude = this.props.latitude !== 0 ? this.props.latitude : Number(await AsyncStorage.getItem(StorageStrings.LATITUDE));
        const longitude = this.props.longitude !== 0 ? this.props.longitude : Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE));

        this.setState({loading: true, sessionId: sessionId});
        axios.get(SubUrl.get_physical_session_by_id + sessionId + '?longitude=' + longitude + '&latitude=' + latitude)
            .then(async response => {
                if (response.data.success) {

                    const data = response.data.body;
                    const name = data.className;
                    const image = data.classImage !== null ? data.classImage : null;
                    const rating = data.classRating;
                    const ratingCount = data.ratingCount;
                    const date = new Date(data.dateAndTime).toDateString();
                    const startTime = Moment(new Date(data.dateAndTime), 'hh:mm').format('LT');
                    const endTime = Moment(new Date(data.endDateAndTime), 'hh:mm').format('LT');
                    const endDateAndTime = data.endDateAndTime;
                    const startDateAndTime = data.dateAndTime;
                    const trainerImage = data.trainerImage !== null ? data.trainerImage : null;
                    const trainerFirstName = data.trainerFirstName;
                    const trainerLastName = data.trainerLastName;
                    const description = data.description;
                    const howToPrepare = data.howToPrepare;
                    const className = data.className;
                    const trainerRating = data.trainerRating;
                    const trainerRatingCount = data.trainerRatingCount;
                    const trainerId = data.trainerUserId;
                    const trainerIdToReview = data.trainerId;
                    const classId = data.classId;
                    const classDescription = data.classDescription;
                    const trainerDescription = data.trainerDescription;
                    const price = data.price;
                    const buttonStatus = data.buttonStatus;
                    const sessionStatus = data.sessionStatus;
                    const discountMaxAmount = data.discountMaxAmount;
                    const discountPercentage = data.discountPercentage;
                    const discountDescription = data.discountDescription;
                    const location = data.location.addressLine1 + ', ' + (data.location.addressLine2 !== '' ? data.location.addressLine2 + ',' : '') + data.location.city;
                    const placeLatitude = data.location.latitude;
                    const placeLongitude = data.location.longitude;
                    const distance = data.distance;
                    const listMembership = data.memberships;
                    const membershipCount = data.membershipCount;
                    const gender = data.gender;
                    const membershipBooked = data.membershipBooked;
                    const bookedMemberships = data.bookedMemberships;
                    const allowCashPayment = data.allowCashPayment;
                    const corporates = null;
                    const youtubeUrl = data.youtubeUrl !== null && data.youtubeUrl !== '' ? Validation.YoutubeVideoIdValidator(data.youtubeUrl) : null;


                    const maxJoiners = data.maxJoiners;
                    const availableCount = data.availableCount;
                    this.props.navigation.setParams({
                        maxJoiners: maxJoiners,
                        availableCount: availableCount,
                    });

                    this.setState({
                        name: name,
                        image: image,
                        rating: rating,
                        ratingCount: ratingCount,
                        date: date,
                        startTime: startTime,
                        endTime: endTime,
                        trainerImage: trainerImage,
                        trainerFirstName: trainerFirstName,
                        trainerLastName: trainerLastName,
                        description: description,
                        howToPrepare: howToPrepare,
                        className: className,
                        trainerRating: trainerRating,
                        trainerRatingCount: trainerRatingCount,
                        trainerId: trainerId,
                        classId: classId,
                        classDescription: classDescription,
                        trainerDescription: trainerDescription,
                        price: price,
                        buttonStatus: buttonStatus,
                        trainerIdToReview: trainerIdToReview,
                        sessionStatus: sessionStatus,
                        endDateAndTime: endDateAndTime,
                        isFirstTimeLoading: false,
                        discountMaxAmount: discountMaxAmount,
                        discountPercentage: discountPercentage,
                        discountDescription: discountDescription,
                        startDateAndTime: startDateAndTime,
                        location: location,
                        distance: distance.toFixed(1),
                        listMembership: listMembership,
                        placeLatitude: placeLatitude,
                        placeLongitude: placeLongitude,
                        membershipCount: membershipCount,
                        gender: gender.charAt(0).toUpperCase() + gender.slice(1),
                        membershipBooked: membershipBooked,
                        bookedMemberships: bookedMemberships !== null ? bookedMemberships : [],
                        allowCashPayment: allowCashPayment,
                        corporates: corporates,
                        youtubeUrl: youtubeUrl,
                        promoCodeType: 'FITNESS_CLASS',
                    });

                    this.fbAnalyticsClass();
                    this.googleAnalyticsSession();
                    if (this.getButtonStatus(buttonStatus, sessionStatus, endDateAndTime).text === 'Payment Processing') {
                        setTimeout(() => {
                            this.getAllPysicalSessionState();
                        }, 5000);
                    }


                } else {
                    Toast.show('Failed to load session details');
                }

                this.setState({loading: false});
            })
            .catch(error => {
                this.setState({loading: false});
                AppToast.networkErrorToast();
            });
    };

    /**
     * facebook analytics for session profile
     */
    fbAnalyticsClass = () => {
        AppEventsLogger.logEvent('fb_mobile_content_view', {
            'fb_content': this.state.name,
            'fb_content_type': this.state.role !== 'online' ? 'Fitness Class Session' : 'Online Class Session',
            'fb_content_id': this.state.sessionId,
            'fb_currency': CurrencyType.currency,
        });
    };

    /**
     * google analytics for session profile
     */
    googleAnalyticsSession = async () => {
        await analytics().logScreenView({
            screen_class: this.state.role !== 'online' ? 'Fitness Class Session' : this.state.typeName + ' Online Class Session',
            screen_name: this.state.name,
        });
    };

    // /**
    //  * facebook analytics using FBSDK
    //  */
    // fbAnalytics = () => {
    //     AppEventsLogger.logEvent('fb_mobile_add_to_cart', this.state.price, {
    //         'fb_content_type': this.state.role !== 'online' ? 'physical class' : 'online class' ,
    //         'fb_content_id': this.state.sessionId,
    //         'fb_currency': CurrencyType.currency
    //     })
    // }

    /**
     * check conditions for navigate checkout
     * */
    checkbookingSession = async () => {
        const {navigation} = this.props;
        const sessionId = navigation.getParam('sessionId');

        // this.fbAnalytics();

        if (this.state.buttonStatus === 'CORPORATE_RESERVE' || this.state.buttonStatus === 'PACKAGE_RESERVE') {
            this.setState({showAlert2: true});
        } else if (this.state.membershipBooked && this.state.buttonStatus !== 'FIRST_FREE') {
            navigation.navigate('CheckOut2Form', {
                price: this.state.price,
                object: {
                    id: sessionId,
                    promoCodeId: this.state.classId,
                    name: this.state.name,
                    startTime: this.state.startTime,
                    endTime: this.state.endTime,
                    date: this.state.date,
                    discountMaxAmount: this.state.discountMaxAmount,
                    discountPercentage: this.state.discountPercentage,
                    discountDescription: this.state.discountDescription,
                    promoCodeType: this.state.promoCodeType,
                },
                sessionType: this.state.buttonStatus,
                classType: this.state.role,
                bookedMemberships: this.state.bookedMemberships,
                redirectForm: 'SelectedDetails',
                allowCashPayment: this.state.allowCashPayment,
            });
        } else {
            navigation.navigate('CheckOutForm', {
                price: this.state.price,
                object: {
                    id: sessionId,
                    promoCodeId: this.state.classId,
                    name: this.state.name,
                    startTime: this.state.startTime,
                    endTime: this.state.endTime,
                    date: this.state.date,
                    discountMaxAmount: this.state.discountMaxAmount,
                    discountPercentage: this.state.discountPercentage,
                    discountDescription: this.state.discountDescription,
                    promoCodeType: this.state.promoCodeType,
                },
                sessionType: this.state.buttonStatus,
                role: 'class_trainer',
                classType: this.state.role,
                redirectForm: 'SelectedDetails',
                allowCashPayment: this.state.allowCashPayment
            });
        }


    };

    /**
     * open google or apple map
     * */
    openMap = () => {
        const latitude = this.state.placeLatitude;
        const longitude = this.state.placeLongitude;
        const label = this.state.location;

        const url = Platform.select({
            ios: 'maps:' + latitude + ',' + longitude + '?q=' + label,
            android: 'geo:' + latitude + ',' + longitude + '?q=' + label,
        });
        Linking.openURL(url);
    };

    /**
     * button press action handler
     * */
    async onButtonClick(type) {
        const {navigate} = this.props.navigation;
        const {push} = this.props.navigation;
        switch (type) {
            case 'review':
                navigate('ReviewForm', {
                    roleId: this.state.classId,
                    role: 'classes',
                    classType: this.state.role,
                    name: this.state.name,
                });
                break;
            case 'class':
                push('ClassesDetailsForm', {
                    classId: this.state.classId,
                    role: this.state.role,
                    refresh: true,
                });
                break;
            case 'instructor':
                push('InstructorForm', {
                    trainerId: this.state.trainerId,
                    refresh: true,
                    trainerType: this.state.role !== 'online' ? 'fitnessTrainer' : 'onlineTrainer',
                });
                break;
            case 'membership':
                navigate('MembershipForm', {
                    role: 'classMember',
                    list: this.state.listMembership,
                    path: {
                        page: 'SelectedDetails',
                        pageId: this.state.sessionId,
                        pageType: this.state.role,
                        classId: this.state.classId,
                    },
                    membershipBooked: false,
                });
                break;
            case 'book':
                if (this.state.singleClassPayment) {
                    this.setState({isFirstTimeLoading: true});
                    this.checkbookingSession();
                } else {
                    navigate('SubscriptionCheckout', {
                        data: {
                            packageId: this.state.packageId,
                            returnPage: 'SelectedDetails',
                            returnPageId: this.state.sessionId,
                        },
                    });
                }
                break;
            case 'prepare':
                this.setState({prepareVisible: !this.state.prepareVisible});
                break;
            case 'facility':
                this.setState({facilitiesVisible: !this.state.facilitiesVisible});
                break;
            default:
                break;
        }

    }

    /**
     * show alert method
     * */
    showAlert = () => {
        if (Platform.OS === 'ios') {
            Orientation.lockToPortrait();
        }

        this.setState({
            showAlert: true,
        });
    };

    /**
     * hide popup handler
     * @param type
     */
    hideAlert = (type) => {
        switch (type) {
            case 'yes':
                this.setState({showAlert2: true, loading: true});
                this.reserveSession();
                break;
            case 'no':
                break;
            default:
                break;
        }
        this.setState({
            showAlert2: false,
        });
    };

    /**
     * show/hide guest user popup
     * transfer
     * @param type
     */
    async hideAlert2(type) {
        let data;
        const {push} = this.props.navigation;
        if (this.state.role !== 'online') {
            data = {
                page: 'SelectedDetails',
                parameters: {
                    sessionId: this.state.sessionId,
                    role: this.state.role,
                },
            };
        } else {
            data = {
                page: 'SubscriptionCheckout',
                parameters: {
                    data: {
                        packageId: this.state.packageId,
                        returnPage: 'SelectedDetails',
                        returnPageId: this.state.sessionId,
                    },
                },
            };
        }

        this.props.getGuestNavigationParams(data);
        // await AsyncStorage.clear();
        switch (type) {
            case 'yes':
                push('AuthForm');
                break;
            case 'no':
                push('SignOutForm');
                break;
            default:
                break;
        }
        this.setState({guestAlert: false});
    }

    /**
     * show/hide guest user popup for ratings
     * transfer
     * @param type
     */
    async hideAlert3(type) {
        const {push} = this.props.navigation;
        const data = {
            page: 'SelectedDetails',
            parameters: {
                sessionId: this.state.sessionId,
                role: this.state.role,
            },
        };

        this.props.getGuestNavigationParams(data);
        // await AsyncStorage.clear();
        switch (type) {
            case 'yes':
                push('AuthForm');
                break;
            case 'no':
                push('SignOutForm');
                break;
            default:
                break;
        }
        this.setState({guestAlert2: false});
    }


    /**
     * reserve session by membership api
     */
    reserveSession = async () => {

        const data = {
            userId: Number(await AsyncStorage.getItem(StorageStrings.USER_ID)),
            sessionId: this.state.sessionId,
        };
        if (this.state.buttonStatus === 'CORPORATE_RESERVE') {
            Object.assign(data, {
                membershipId: this.state.corporates[0].membershipId,
            });
        } else {
            Object.assign(data, {
                packageId: this.state.subscribedPackages[0].id,
            });
        }
        axios.post(this.state.buttonStatus === 'CORPORATE_RESERVE' ? SubUrl.reserve_online_membership_session : SubUrl.reserve_online_classes_by_subscription_package, data)
            .then(async response => {
                if (response.data.success) {
                    AppToast.successToast(response.data.body);
                    this.getAllInputState();
                } else {
                    this.setState({loading: false});
                    Toast.show(response.data.message);
                }
            })
            .catch(error => {
                this.setState({loading: false});
                AppToast.networkErrorToast();
            });
    };

    /**
     * rate online session popup event handler
     * */
    reviewPopUpCalculator() {
        const {navigation} = this.props;
        const sessionId = navigation.getParam('sessionId');
        navigation.navigate('DualRatingForm', {
            sessionId: sessionId,
        });
    }

    /**
     * session status handler
     * */
    getButtonStatus = (buttonStatus, sessionStatus, endTime, startTime) => {
        if (sessionStatus === 'PENDING' || sessionStatus === 'ONGOING') {
            if (buttonStatus === 'PURCHASED' || buttonStatus === 'PENDING_PURCHASE' || buttonStatus === 'PENDING_PAYMENT') {
                if (Date.parse(new Date()) < Date.parse(new Date(endTime))) {
                    if (buttonStatus === 'PENDING_PURCHASE') {
                        return {
                            text: 'Payment Processing',
                            enabled: false,
                            hidePrice: true,
                            crossPrice: false,
                            color: Color.gray,
                        };
                    } else if (buttonStatus === 'PENDING_PAYMENT') {
                        return {
                            text: 'Pending Payment',
                            enabled: false,
                            hidePrice: true,
                            crossPrice: false,
                            color: Color.gray,
                        };
                    } else {
                        if (Date.parse(new Date()) >= Date.parse(new Date(startTime))) {
                            return {
                                text: this.state.role !== 'online' ? 'Reserved' : this.state.startSessionButtonEnabled ? 'Join this Session' : 'Please wait...',
                                enabled: this.state.startSessionButtonEnabled,
                                hidePrice: true,
                                crossPrice: false,
                                color: this.state.role !== 'online' ? Color.gray : this.state.startSessionButtonEnabled ? Color.lightOrange : Color.gray,
                            };
                        } else {
                            return {
                                text: 'Reserved',
                                enabled: false,
                                hidePrice: true,
                                crossPrice: false,
                                color: Color.gray,
                            };
                        }

                    }
                } else {
                    return {
                        text: 'Session Completed',
                        enabled: false,
                        hidePrice: true,
                        crossPrice: false,
                        color: Color.lightOrange,
                    };
                }
            } else {
                if (Date.parse(new Date()) > Date.parse(new Date(endTime))) {
                    return {
                        text: 'Booking Closed',
                        enabled: false,
                        hidePrice: true,
                        crossPrice: false,
                        color: Color.gray,
                    };
                } else {
                    switch (buttonStatus) {
                        case 'FIRST_FREE':
                            return {
                                text: this.state.singleClassPayment ? 'Try First Class Free' : 'Reserve this Session',
                                enabled: true,
                                hidePrice: !this.state.singleClassPayment,
                                crossPrice: true,
                                color: Color.themeColor,
                            };
                        case 'PAY':
                        case 'DISCOUNT':
                            return {
                                text: this.state.role !== 'online' ? 'Buy this Session' : 'Reserve this Session',
                                enabled: true,
                                hidePrice: !this.state.singleClassPayment,
                                crossPrice: false,
                                color: Color.themeColor,
                            };
                        case 'FULL':
                            return {
                                text: 'Session Full',
                                enabled: false,
                                hidePrice: true,
                                crossPrice: false,
                                color: Color.lightOrange,
                            };
                        case 'CORPORATE_RESERVE':
                        case 'PACKAGE_RESERVE':
                            return {
                                text: 'Reserve For Free',
                                enabled: true,
                                hidePrice: true,
                                crossPrice: false,
                                color: Color.themeColor,
                            };
                        default:
                            return {text: '', enabled: false, hidePrice: true, crossPrice: false};
                    }
                }
            }
        } else if (sessionStatus === 'FINISHED') {
            return {text: 'Completed', enabled: false, hidePrice: true, crossPrice: false, color: Color.lightOrange};
        } else {
            return {text: 'Cancelled', enabled: false, hidePrice: true, crossPrice: false, color: Color.softRed};
        }

    };


    render() {
        return (
            <>
                {
                    this.state.loading && this.state.isFirstTimeLoading ? (
                        <View style={styles.gifHolder}>
                            <Image source={gif} style={styles.gif}/>
                        </View>
                    ) : (
                        <View style={styles.container}>
                            <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                            <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                                <View style={styles.headerContainer}>
                                    <View style={styles.imageHolder}>
                                        <Image
                                            source={this.state.image !== null ? {uri: this.state.image} : PlaceholderIMG}
                                            style={styles.imageStyle} resizeMode={'cover'}/>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            marginLeft: 12,
                                            flex: 1,
                                        }}>
                                        <Text style={styles.headerTitle} numberOfLines={3}>{this.state.name}</Text>
                                        {this.state.role !== 'online' ? (
                                            <Text style={styles.location}>{this.state.distance} Km Away</Text>
                                        ) : null}
                                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                                          onPress={() => this.props.asGuestUser ? this.setState({guestAlert2: true}) : this.onButtonClick('review')}>
                                            <RatingModal
                                                rating={Number(this.state.rating)}
                                                count={this.state.ratingCount}
                                                color={Color.ratingTextColor}
                                                tintColor={Color.white}
                                                fontSize={14}
                                            />

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.props.asGuestUser ? this.setState({guestAlert2: true}) : this.onButtonClick('review')}>
                                            <Text style={styles.rateTitle}>Rate this session</Text>
                                        </TouchableOpacity>

                                        {this.state.typeName !== '' ? (
                                            <View style={{flexDirection: 'row'}}>
                                                <View
                                                    style={this.state.typeName !== 'Group' ? styles.classTypeButton : {
                                                        ...styles.classTypeButton,
                                                        backgroundColor: Color.softLightOrange,
                                                    }}>
                                                    <Text
                                                        style={this.state.typeName !== 'Group' ? styles.classTypeStyle : {
                                                            ...styles.classTypeStyle,
                                                            color: Color.darkOrange,
                                                        }}>{this.state.typeName}</Text>
                                                </View>
                                            </View>
                                        ) : null}


                                    </View>
                                </View>

                                {this.state.youtubeUrl !== null ? (
                                    <View style={{
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 10,
                                        marginTop: 20,
                                        marginBottom: 10,
                                        height: (Platform.OS === 'ios') ? 200 : 220,
                                    }}>
                                        <YoutubePlayer
                                            videoId={this.state.youtubeUrl}
                                            play={false}
                                            loop={true}
                                            onReady={e => this.setState({isReady: true})}
                                            onChangeState={e => this.setState({status: e.state})}
                                            onError={e => this.setState({error: e.error})}
                                            contentScale={1}
                                            height={'100%'}
                                            width={'95%'}
                                            allowWebViewZoom={true}
                                            webViewStyle={{overflow: 'hidden', borderRadius: 10}}
                                            onFullScreenChange={e => e ? Orientation.unlockAllOrientations() : Orientation.lockToPortrait()}
                                        />
                                    </View>
                                ) : null}


                                <View style={{alignItems: 'center', width: '100%', marginBottom: 20}}>
                                    {this.state.role !== 'online' ? (
                                        <TouchableOpacity style={{
                                            ...styles.dateTimeContainer,
                                            width: '95%',
                                            marginTop: this.state.youtubeUrl !== null ? 10 : 20,
                                        }}
                                                          onPress={() => this.openMap()}>
                                            <Image source={locationOuter} style={styles.iconContainer}/>
                                            <Text style={{
                                                ...styles.time,
                                                width: '100%',
                                                flex: 1,
                                            }}>{this.state.location}</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        <View style={styles.dateTimeContainer}>
                                            <Image source={Calandar} style={styles.iconContainer}/>
                                            <Text style={styles.time}>{this.state.date}</Text>
                                        </View>
                                        <View style={styles.dateTimeContainer}>
                                            <Image source={Time} style={styles.iconContainer}/>
                                            <View styles={{flexDirection: 'column', marginLeft: 10}}>
                                                <Text style={{
                                                    ...styles.time,
                                                    width: '100%',
                                                }}>{this.state.startTime}-</Text>
                                                <Text
                                                    style={{...styles.time, width: '100%'}}>{this.state.endTime}</Text>
                                            </View>

                                        </View>
                                    </View>


                                </View>

                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.headline}>Conducted by</Text>
                                </View>

                                <View style={styles.timeSlotContainer}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={styles.imageOuter}>
                                            <Image
                                                source={this.state.trainerImage !== null ? {uri: this.state.trainerImage} : PlaceholderIMG}
                                                reziseMode={'stretch'} style={{width: '100%', height: '100%'}}/>
                                        </View>
                                        <View style={{flexDirection: 'column', width: '70%'}}>
                                            <Text style={styles.containerTitle}
                                                  numberOfLines={1}>{this.state.trainerFirstName} {this.state.trainerLastName}</Text>
                                            <Text style={styles.title}
                                                  numberOfLines={2}>{this.state.trainerDescription}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.linkContainer}
                                                          onPress={() => this.onButtonClick('instructor')}>
                                            <Text style={styles.linkLine}>View Profile</Text>
                                        </TouchableOpacity>

                                    </View>

                                </View>


                                <Image source={Line} style={{marginVertical: 10}}/>


                                <Text style={styles.headline}>Description</Text>
                                <View style={{marginHorizontal: 10, marginTop: 10}}>
                                    <Text style={styles.pharagraph}>{this.state.description}</Text>
                                </View>

                                <View style={styles.tagContainer}>
                                    <Text style={styles.tagText}>Gender-Specific : {this.state.gender}</Text>
                                </View>


                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                                    <Text style={styles.headline}>How to Prepare</Text>
                                    {/* <TouchableOpacity style={{
                                        width: 22,
                                        height: 22,
                                        marginLeft: 10,
                                        marginTop: '2%',
                                    }} onPress={() => this.onButtonClick('prepare')}>
                                        <Image source={this.state.prepareVisible ? UpArrow : DownArrow}
                                               style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
                                    </TouchableOpacity> */}
                                </View>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Image source={Prepare} style={styles.iconContainer}/>
                                    <View style={{width: '85%'}}>
                                        <Text
                                            style={{...styles.time, width: '100%'}}>{this.state.howToPrepare}</Text>
                                    </View>
                                </View>


                                {this.state.facilitiesVisible && this.state.role !== 'online' ? (
                                    <FacilitiesComponent list={this.state.listFacility}/>
                                ) : null}

                                <Image source={Line} style={{marginTop: 10}}/>

                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.headline}>Class Profile</Text>
                                    {/*<Text style={styles.linkLine}>View Profile</Text>*/}
                                </View>

                                <ProfileContainer
                                    image={this.state.image}
                                    name={this.state.name}
                                    rating={this.state.rating}
                                    count={this.state.ratingCount}
                                    onPress={() => this.onButtonClick('class')}
                                />
                                {/*{this.state.count ? (*/}
                                {/*    <CountDown*/}
                                {/*        until={60 * 5 + 10}*/}
                                {/*        onFinish={() => this.showAlert()}*/}
                                {/*        digitStyle={{width: 0, height: 0}}*/}
                                {/*        digitTxtStyle={{fontSize: 0}}*/}
                                {/*        showSeparator={false}*/}
                                {/*        timeToShow={['M', 'S']}*/}
                                {/*        timeLabels={{m: null, s: null}}*/}
                                {/*        timeLabelStyle={{color: 'transparent', width: 0, height: 0}}*/}
                                {/*    />*/}
                                {/*) : null}*/}

                            </ScrollView>
                            <TouchableOpacity style={{
                                ...styles.bottomBtn,
                                backgroundColor: this.getButtonStatus(this.state.buttonStatus, this.state.sessionStatus, this.state.endDateAndTime, this.state.startDateAndTime).color,
                            }}
                                disabled={!this.getButtonStatus(this.state.buttonStatus, this.state.sessionStatus, this.state.endDateAndTime, this.state.startDateAndTime).enabled}
                                onPress={
                                    () => this.onButtonClick('book')
                                }
                                //               onPress={() => this.joinMeetingHandler()}
                            >
                                <Text
                                    style={styles.btnTitle}>
                                    {this.getButtonStatus(this.state.buttonStatus, this.state.sessionStatus, this.state.endDateAndTime, this.state.startDateAndTime).text}
                                </Text>
                                {!this.getButtonStatus(this.state.buttonStatus, this.state.sessionStatus, this.state.endDateAndTime, this.state.startDateAndTime).hidePrice ? (
                                    <Text style={
                                        !this.getButtonStatus(this.state.buttonStatus, this.state.sessionStatus, this.state.endDateAndTime, this.state.startDateAndTime).crossPrice ?
                                            styles.btnTitle : {
                                                ...styles.btnTitle,
                                                textDecorationLine: 'line-through',
                                            }}>({this.numberFormat(this.state.price)})</Text>
                                ) : null}


                            </TouchableOpacity>

                            <AwesomeAlert
                                show={this.state.showAlert}
                                showProgress={false}
                                title={'Add a Review'}
                                message={'You successfully complete the session'}
                                closeOnTouchOutside={true}
                                showCancelButton={true}
                                showConfirmButton={false}
                                cancelText="Rate the Session"
                                onCancelPressed={() => this.reviewPopUpCalculator()}
                                messageStyle={{
                                    fontSize: 15,
                                    lineHeight: 22,
                                    fontFamily: Font.Medium,
                                    color: Color.black,
                                    textAlign: 'center',
                                }}
                                cancelButtonColor={Color.themeColor}
                                contentStyle={{alignItems: 'center', justifyContent: 'center'}}
                                contentContainerStyle={{borderRadius: 15}}
                                cancelButtonStyle={{
                                    width: 220,
                                    height: 43,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            />

                            <AlertMassage
                                show={this.state.showAlert2}
                                message={'Do you want reserve this session?'}
                                onCancelPressed={() => {
                                    this.hideAlert('yes');
                                }}
                                onConfirmPressed={() => {
                                    this.hideAlert('no');
                                }}
                                cancelText={'Yes'}
                                confirmText={'No'}
                                btnSize={110}
                            />

                            <AlertMassage
                                show={this.state.guestAlert}
                                title={this.state.role === 'online' ? 'One Pass - Online Class Package' : null}
                                message={this.state.role !== 'online' ? 'You need to create an account in order to complete this action.' : 'You are just one step away to activate 7 days free trial for over 150+ online classes.'}
                                onCancelPressed={() => this.hideAlert2('yes')}
                                onConfirmPressed={() => this.hideAlert2('no')}
                                cancelText={'I\'m an existing user'}
                                confirmText={'I\'m a new user'}
                                onDismiss={() => this.setState({guestAlert: false})}
                            />

                            <AlertMassage
                                show={this.state.guestAlert2}
                                message={'You need to create an account in order to complete this action.'}
                                onCancelPressed={() => this.hideAlert3('yes')}
                                onConfirmPressed={() => this.hideAlert3('no')}
                                cancelText={'I\'m an existing user'}
                                confirmText={'I\'m a new user'}
                                onDismiss={() => this.setState({guestAlert2: false})}
                            />

                        </View>

                    )
                }
            </>
        );
    }

}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        height: screenHeight / 100 * 22,
        alignItems: 'center',
    },
    imageHolder: {
        width: '42%',
        height: '100%',
        marginLeft: 10,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    btnStyle: {
        width: 66.32,
        height: 26.16,
        backgroundColor: Color.lightGreen,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: Color.darkblue,
        fontFamily: Font.SemiBold,
        fontSize: 20,
        lineHeight: 25,
        marginBottom: 5,
    },
    heilight: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22,
    },
    iconHolder: {
        width: 29,
        height: 27.5,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 191, 133, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    headline: {
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 22,
        marginTop: '2%',
        marginLeft: 10,
    },
    time: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        marginLeft: 10,
        color: Color.darkGray,
        width: '55%',
    },
    pharagraph: {
        fontSize: 15,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: Color.softLightGray3,
    },
    timeSlotContainer: {
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    dateTimeContainer: {
        width: '46%',
        height: 58.36,
        backgroundColor: Color.white,
        marginHorizontal: 5,
        borderRadius: 10,
        elevation: 2,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 33.41,
        height: 31.74,
        marginLeft: 10,
    },
    linkLine: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22,
        // marginTop: '5%',
        color: Color.themeColor,
    },
    linkContainer: {
        position: 'absolute',
        right: 2,
        top: -2,
    },
    imageOuter: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    containerTitle: {
        color: Color.black,
        fontSize: 15,
        marginTop: 8,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
    },
    title: {
        color: Color.softLightGray3,
        fontSize: 13,
        lineHeight: 21,
        fontFamily: Font.SemiBold,
        marginVertical: 2,

    },
    bottomBtn: {
        width: '100%',
        height: 65,
        backgroundColor: Color.lightGreen,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    amountContainer: {
        marginLeft: 10,
        width: '30%',
        height: 50,
        borderRadius: 10,
        backgroundColor: Color.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountText: {
        fontFamily: Font.Bold,
        fontSize: 17,
        lineHeight: 22,
        color: Color.darkGreen,
    },
    bottomBtnStyle: {
        marginLeft: 5,
        width: '95%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: Color.lightGreen,
    },
    btnTitle: {
        color: Color.white,
        fontSize: 17,
        fontFamily: Font.Bold,
        lineHeight: 22,
        marginLeft: 5,
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    },
    tagContainer: {
        marginLeft: 10,
        width: '55%',
        height: 50,
        borderRadius: 10,
        backgroundColor: Color.lightBlue,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    tagText: {
        fontFamily: Font.Bold,
        fontSize: 16,
        lineHeight: 22,
        color: Color.softBlue,
    },
    gifHolder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 90,
        height: 90,
    },
    location: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.softDarkGray,
    },
    membershipBtn: {
        width: '95%',
        height: 50,
        backgroundColor: Color.themeColor,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    membershipBtnText: {
        fontFamily: Font.Bold,
        fontSize: 15,
        lineHeight: 22,
        color: Color.white,
    },
    rateTitle: {
        fontFamily: Font.SemiBold,
        fontSize: 10,
        lineHeight: 15,
        color: Color.softDarkGray1,
        textDecorationLine: 'underline',
    },
    classTypeButton: {
        paddingHorizontal: 10,
        height: 30,
        borderRadius: 8,
        backgroundColor: Color.softLightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    classTypeStyle: {
        color: Color.blueGreen,
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 18,
    },
    corporateAlert: {
        width: '95%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: Color.softPink,
        flexDirection: 'row',
    },
    corporateAlertTxt: {
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 17,
        color: Color.themeColor,
        marginHorizontal: 10,
    },
});

const mapStateToProps = (state) => ({
    latitude: state.user.latitude,
    longitude: state.user.longitude,
    corporateState: state.user.corporateState,
    corporateName: state.user.corporateName,
    asGuestUser: state.user.asGuestUser,
});


const mapDispatchToProps = dispatch => {
    return {
        changeNotificationHolder: notificationCount => dispatch(actionTypes.changeNotificationHolder(notificationCount)),
        getGuestNavigationParams: navigationParams => dispatch(actionTypes.getGuestNavigationParams(navigationParams)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
