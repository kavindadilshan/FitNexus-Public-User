import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    PermissionsAndroid,
    Dimensions, StatusBar, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from "./styles";
import {Avatar} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Edit from '../../assets/Profile/edit.png';
import Camera from '../../assets/Profile/camera.png';
import Arrow from '../../assets/Profile/rightArrow.png';
import Password from '../../assets/Profile/password.png';

import Membership from '../../assets/Profile/membership.png';

import Payment from '../../assets/Profile/payment.png';

import Personal from '../../assets/Profile/personal.png';
import axios from '../../axios/axios';
import {SubUrl} from "../../axios/server_url";
import {StorageStrings} from "../../constance/StorageStrings";
import Logout from '../../assets/Profile/logout.png';
import Help from '../../assets/Profile/helpAndSupport.png';
import AlertMassage from "../../component/Actions/AlertMassage";
import {Font} from "../../constance/AppFonts";
import {AppToast} from "../../constance/AppToast";
import PlaceholderIMG from '../../assets/Sample/placeholderIMG.jpg';
import Flag from "react-native-flags";
import {connect} from 'react-redux';
import * as actionTypes from "../../store/actions";
import {HardwareBackAction} from "../../component/Actions/HardwareBackAction";
import {Color} from "../../constance/Colors";
import {StackActions, NavigationActions} from 'react-navigation';
import VerifyIMG from '../../assets/Profile/verify.png';
import UnverifyIMG from '../../assets/Profile/unverify.png';
import {AppEventsLogger} from "react-native-fbsdk";

import {encryption} from "../../component/Encryption/Encrypt&Decrypt";

import PrivacyIMG from '../../assets/Home/privacy.png'

const options = {
    title: 'Select a profile picture',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

const screenHeight = Math.round(Dimensions.get('window').height);

let email;
let firstName;
let lastName;
let mobile;
let birthday;
let gender;
let country;
let profileImage;
let weight;
let height;
let userId;


class App extends React.Component {
    state = {
        list: [
            {
                image: Personal,
                name: 'Personal Information',
                parameter: 'personal'
            },
            {
                image: Password,
                name: 'Change Password',
                parameter: 'password'
            },
            // {
            //     image: Payment,
            //     name: 'My Cards',
            //     parameter: 'payment'
            // },
            {
                image: Membership,
                name: 'My Memberships',
                parameter: 'membership'
            },
            {
                image: Help,
                name: 'Help & Support',
                parameter: 'help'
            },
            {
                image: PrivacyIMG,
                name: 'Privacy Policy',
                parameter: 'privacy'
            },
            {
                image: Logout,
                name: 'Logout',
                parameter: 'logout'
            },
        ],
        profileImage: {
            uri: null,
            valid: true
        },
        username: '',
        gender: '',
        weight: '',
        height: '',
        birthday: 'YY/MM/DD',
        mobileNumber: '',
        showAlert: false,
        country: '',
        email: '',
        flag: '',
        imageLoading: false,
        authType: '',
        verify: false,
        verifyVisibility: false,
    };

    async componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {

            email = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.EMAIL));
            firstName = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.FIRST_NAME));
            lastName = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.LAST_NAME));
            mobile = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.MOBILE_NUMBER));
            birthday = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.BIRTHDAY));
            gender = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.GENDER));
            country = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.COUNTRY));
            profileImage = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.USER_IMAGE));
            weight = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.WEIGHT));
            height = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.HEIGHT));
            userId = await AsyncStorage.getItem(StorageStrings.USER_ID);

            if (profileImage !== null) {
                this.setState({
                    profileImage: {
                        uri: profileImage,
                        valid: true
                    },
                })
            }
            const authType = await AsyncStorage.getItem(StorageStrings.AUTH_TYPE);
            console.log(authType)


            this.setState({
                authType: authType,
                username: firstName + ' ' + lastName,
                mobileNumber: [mobile.slice(0, 3), " ", mobile.slice(3, 5), " ", mobile.slice(5, 8), " ", mobile.slice(8)].join('')
            })
            this.profileDetails();
            this.getEmailVerification(userId);
            this.getCountryCodeByName(country);
            this.getNotificationCounts(userId);
        })

        const authType = await AsyncStorage.getItem(StorageStrings.AUTH_TYPE);
        this.setState({
            authType: authType,
            username: firstName + ' ' + lastName,
            mobileNumber: [mobile.slice(0, 3), " ", mobile.slice(3, 5), " ", mobile.slice(5, 8), " ", mobile.slice(8)].join(''),
            gender: gender
        })

        this.facebookAnalytics();
    }

    async componentDidMount(): void {
        this.props.navigation.addListener('willFocus', this.load);
    }

    load = () => {
        HardwareBackAction.setBackAction(() => {
            this.props.navigation.navigate('Home');
        });
    };

    /**
     * analytics user profile
     * @returns {Promise<void>}
     */
    facebookAnalytics = async () => {
        AppEventsLogger.setUserData(
            em - email,
            fn - firstName,
            ln - lastName,
            ph - mobile,
            db - birthday,
            ge - gender,
            country - country
        )

    }

    // /**
    //  * google analytics for checkout ui
    //  * @param id
    //  * @returns {Promise<void>}
    //  */
    // googleAnalytics = async(id) =>{
    //     await analytics().logEvent('purchase', {
    //         transaction_id: id!==undefined?id:this.state.stripePaymentMethodId,
    //         currency: CurrencyType.currency,
    //         items: [{
    //             item_id: this.state.typeId,
    //             item_name: this.state.typeName,
    //             item_category: this.state.classType!=='online'?'physical class':'online class',
    //             quantity: 1,
    //             price: this.state.price,
    //         }]
    //     })
    // }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    /**
     * get notification count api
     * @param userId
     * @returns {Promise<void>}
     */
    getNotificationCounts = async (userId) => {
        axios.get(SubUrl.get_notification_count_by_user + userId + '/notifications/count')
            .then(async response => {
                if (response.data.success) {
                    this.props.changeNotificationHolder(response.data.body);
                }

            })
            .catch(error => {
                console.log(error);
            })
    }

    /**
     * check email verify api
     * @param userId
     * @returns {Promise<void>}
     */
    getEmailVerification = async (userId) => {
        axios.get(SubUrl.get_email_verification + userId)
            .then(async response => {
                if (response.data.success) {
                    const verify = response.data.body.emailVerified;
                    this.setState({verify: verify, verifyVisibility: true})
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    /**
     * country code selection
     * @param country
     * @returns {Promise<null>}
     */
    getCountryCodeByName = async (country) => {
        const countryName = country;
        const countries = require('../../component/json/countries');

        for (const c of countries) {
            if (c.name === countryName) {
                this.setState({
                    flag: c.alpha2Code
                })
            }
        }

        return null;
    }

    /**
     * profile data initialize
     * @returns {Promise<void>}
     */
    profileDetails = async () => {

        if (gender !== null) {
            this.setState({
                gender: gender
            })

        }
        if (birthday !== null) {
            this.setState({
                birthday: birthday
            })
        }
        if (weight !== null) {
            this.setState({
                weight: weight
            })
        }
        if (height !== null) {
            this.setState({
                height: height
            })
        }
        if (country !== null) {
            this.setState({
                country: country
            })
        }
        if (email !== null) {
            this.setState({
                email: email
            })
        }
    }

    /**
     * profile image edit api
     * @returns {Promise<void>}
     */
    changeImageHandler = async () => {
        if (Platform.OS == 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                ImagePicker.showImagePicker(options, (response) => {

                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                    } else {
                        // const source = { uri: response.uri };

                        // You can also display the image using data:
                        const source = 'data:image/jpeg;base64,' + response.data;

                        this.setState({
                            profileImage: {
                                uri: source,
                                valid: true
                            },
                            imageLoading: true
                        });
                        this.updateImageHandler();
                    }
                });
            } else {
                this.changeImageHandler();
            }
        } else {
            ImagePicker.showImagePicker(options, (response) => {

                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    // const source = { uri: response.uri };

                    // You can also display the image using data:
                    const source = 'data:image/jpeg;base64,' + response.data;

                    this.setState({
                        profileImage: {
                            uri: source,
                            valid: true
                        },
                        imageLoading: true
                    });
                    this.updateImageHandler();
                }
            });
        }
    };

    /**
     * update profile image api
     * @returns {Promise<void>}
     */
    updateImageHandler = async () => {
        const data = {
            id: Number(await AsyncStorage.getItem(StorageStrings.USER_ID)),
            imageBase64: this.state.profileImage.uri
        };
        axios.put(SubUrl.update_profile_image, data)
            .then(async response => {
                if (response.data.success) {
                    await AsyncStorage.setItem(StorageStrings.USER_IMAGE, encryption.encrypt(this.state.profileImage.uri));
                    this.setState({imageLoading: false});
                }
            })
            .catch(error => {
                AppToast.networkErrorToast();
                this.setState({imageLoading: false});
            })
    }

    /**
     * button click event handler
     * @param type
     * @returns {Promise<void>}
     */
    onButtonClick = async (type) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'profile':
                this.changeImageHandler();
                break;
            case 'password':
                navigate('UpdatePasswordForm');
                break;
            case 'mobile':
                navigate('UpdateMobileForm');
                break;
            case 'email':
                navigate('UpdateEmailForm', {
                    verifyVisibility: this.state.verify
                });
                break;
            case 'payment':
                navigate('UpdateCardForm', {
                    page: 'page',
                    sessionId: 'id',
                    role: 'profile',
                    refresh: true
                });
                break;
            case 'invite':
                navigate('InviteFriendForm');
                break;
            case 'help':
                navigate('HelpAndSupportForm');
                break;
            case 'discount':
                navigate('YourInvitesForm');
                break;
            case 'personal':
                navigate('UpdatePersonalInfo');
                break;
            case 'membership':
                navigate('MyMembershipsForm');
                break;
            case 'privacy':
                navigate("PrivacyPolicyForm");
                break;
            case 'subscription':
                navigate('MySubscriptions');
                break;
            case 'logout':
                this.showAlert();
                break;
            default:
                break
        }
    };

    /**
     * model visible function
     */
    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    /**
     * logout handler
     * @param type
     * @returns {Promise<void>}
     */
    hideAlert = async (type) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'yes':
                await AsyncStorage.clear();
                this.props.sdkInitialized(true);
                this.props.fetchEndpoint(true);
                this.props.changeLatitude(0);
                this.props.changeLongitude(0);
                this.props.fetchOnlineClasses(true);
                this.props.fetchOfflineClasses(true);
                this.props.fetchTrainer(true);
                this.props.checkCorporateState(false);
                this.props.setCorporateName([]);
                this.props.checkSubscriptionState(false);
                this.props.checkHomeBack(true);
                // navigate('AuthForm');
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: 'AuthForm'})],
                });
                this.props.navigation.dispatch(resetAction);
                break;
            case 'no':
                break;
            default:
                break;
        }
        this.setState({
            showAlert: false
        });
    };

    render() {
        const list = this.state.list.map((item, i) => (
            this.state.authType !== 'MOBILE' && item.name === 'Change Password' ? null :
                !this.props.visible && item.parameter === 'subscription' ? null :
                    <TouchableOpacity style={styles.touchOuter} key={i}
                                      onPress={() => this.onButtonClick(item.parameter)}>
                        <View style={styles.iconContainer}>
                            <Image source={item.image} style={{width: '100%', height: '100%'}} resizeMode={'stretch'}/>
                        </View>
                        <Text style={styles.bodyTitle}>{item.name}</Text>
                        <View style={{width: 10, height: 18, position: 'absolute', right: 20}}>
                            <Image source={Arrow} resizeMode={'center'}/>
                        </View>

                    </TouchableOpacity>
        ));
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center'}}>
                        <View style={{width: '100%', alignItems: 'center', height: screenHeight / 100 * 10, flex: 1}}>
                            <Text style={{
                                fontSize: 25,
                                fontFamily: Font.SemiBold,
                                position: 'absolute',
                                bottom: 0
                            }}>Profile</Text>

                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '90%'}}>
                            <View style={styles.profilePicHolder}>
                                <View style={styles.profilePicOuter}>
                                    {this.state.imageLoading ? (
                                        <ActivityIndicator
                                            animating
                                            size={"small"}
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                right: 0,
                                                top: 0,
                                                bottom: 0,
                                                margin: 'auto'
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            source={this.state.profileImage.uri !== null ? this.state.profileImage : PlaceholderIMG}
                                            style={styles.image} resizeMode={'stretch'} rounded={true}/>
                                    )}

                                    <TouchableOpacity style={styles.edit} onPress={() => this.onButtonClick('profile')}>
                                        <Image source={Camera} style={{width: '95%', height: '95%'}}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{flexDirection: 'column', marginLeft: '7%', flex: 1}}>
                                <Text style={styles.headTitle}>{this.state.username}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
                                    <Text style={styles.mobileNumberStyle}>{this.state.mobileNumber}</Text>
                                    <TouchableOpacity style={styles.edit2} onPress={() => this.onButtonClick('mobile')}>
                                        <Image source={Edit} style={{width: '100%', height: '100%'}}
                                               resizeMode={'contain'}/>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        <View style={styles.contactHolder}>
                            <View style={styles.contactOuter}>
                                <View style={styles.contentOuter}>
                                    <Text style={styles.contactTitle}>G E N D E R</Text>
                                    <Text style={styles.dataStyle}>{this.state.gender}</Text>
                                </View>
                                <View style={{...styles.contentOuter, width: '38%'}}>
                                    <Text style={styles.contactTitle}>D A T E O F B I R T H</Text>
                                    <Text style={styles.dataStyle}>{this.state.birthday}</Text>
                                </View>
                                <View style={{...styles.contentOuter, borderRightWidth: 0}}>
                                    <Text style={{...styles.contactTitle, marginBottom: 1}}>C O U N T R Y</Text>
                                    <Flag
                                        code={this.state.flag}
                                        size={32}
                                        style={{marginTop: -10}}
                                    />
                                </View>


                            </View>
                        </View>
                        <View style={{...styles.contactHolder, flexDirection: 'row'}}>
                            <View style={{flexDirection: 'column', position: 'absolute', left: 20}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.contactTitle}>E M A I L</Text>
                                    {this.state.verifyVisibility ? (
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={this.state.verify ? styles.verifyText : {
                                                ...styles.verifyText,
                                                color: Color.red
                                            }}>{this.state.verify ? 'v e r i f i e d' : 'u n v e r i f i e d'}</Text>
                                            <View style={{width: 10, height: 10}}>
                                                <Image source={this.state.verify ? VerifyIMG : UnverifyIMG}
                                                       style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
                                            </View>
                                        </View>
                                    ) : null}
                                </View>
                                <Text style={styles.dataStyle}>{this.state.email}</Text>
                            </View>
                            <TouchableOpacity style={styles.edit2} onPress={() => this.onButtonClick('email')}>
                                <Image source={Edit} style={{width: '100%', height: '100%'}}
                                       resizeMode={'contain'}/>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.bodyContainer}>
                            <View style={{marginTop: 10}}>
                                {list}
                            </View>

                        </View>
                    </View>

                </ScrollView>
                <AlertMassage
                    show={this.state.showAlert}
                    message={"Are you sure you want to logout?"}
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
            </View>


        )
    }
}

const mapStateToProps = (state) => ({
    visible: state.user.visible,
});

const mapDispatchToProps = dispatch => {
    return {
        changeNotificationHolder: notificationCount => dispatch(actionTypes.changeNotificationHolder(notificationCount)),
        sdkInitialized: init => dispatch(actionTypes.sdkInitialized(init)),
        checkEnrollStatus: status => dispatch(actionTypes.checkEnrollState(status)),
        fetchEndpoint: fetch => dispatch(actionTypes.fetchEndpoint(fetch)),
        changeLatitude: latitude => dispatch(actionTypes.changeLatitude(latitude)),
        changeLongitude: longitude => dispatch(actionTypes.changeLongitude(longitude)),
        fetchOnlineClasses: onlineFetch => dispatch(actionTypes.fetchOnlineClasses(onlineFetch)),
        fetchOfflineClasses: offlineFetch => dispatch(actionTypes.fetchOfflineClasses(offlineFetch)),
        fetchTrainer: trainerFetch => dispatch(actionTypes.fetchTrainer(trainerFetch)),
        checkCorporateState: (corporateState) => dispatch(actionTypes.checkCorporateState(corporateState)),
        setCorporateName: (corporateName) => dispatch(actionTypes.setCorporateName(corporateName)),
        checkSubscriptionState:(subscriptionState)=>dispatch(actionTypes.checkSubscriptionState(subscriptionState)),
        checkHomeBack:homeBack=>dispatch(actionTypes.checkHomeBack(homeBack))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
