import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions,
    Platform, StatusBar, PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles as styles2, styles} from './styles';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import Logo from '../../assets/Auth/CR_logo.png';
import InputItems from '../../component/Actions/InputItems';
import {Color} from '../../constance/Colors';
import Google from '../../assets/Auth/googleIcon.png';
import FB from '../../assets/Auth/fbIcon.png';
import {LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';
import * as Validation from '../Validation/Validation';
import axios from '../../axios/axios_auth';
import axios2 from '../../axios/axios_token_less';
import axios3 from '../../axios/axios';
import {SubUrl} from '../../axios/server_url';
import {StorageStrings} from '../../constance/StorageStrings';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from '../../component/Lib/react-native-country-picker-modal';
import Button from '../../component/Actions/Button';
import SocialMediaButton from '../../component/Actions/SocialButton';
import Toast from 'react-native-simple-toast';
import {Api} from '../../constance/AppAPIKeys';
import {AppToast} from '../../constance/AppToast';
import Loading from '../../component/Loading/AuthLoading';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import Video from 'react-native-video';
import VideoFile from '../../assets/video.mp4';
import {HardwareBackAction} from '../../component/Actions/HardwareBackAction';
import AlertMassage from '../../component/Actions/AlertMassage3';
import {encryption} from '../../component/Encryption/Encrypt&Decrypt';
import {NavigationActions, StackActions} from 'react-navigation';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component {

    state = {
        password: {
            value: '',
            valid: true,
        },
        mobileNum_074: {
            valid: true,
        },
        cca2: 'LK',
        value: '',
        code: '94',
        numValid: true,
        loading: false,
        googleLoading: false,
        fbLoading: false,
        isProcessing: false,
        token: '',
        showAlert: false,
        socialMediaData: {},
    };

    componentDidMount() {
            this.props.navigation.addListener('willFocus', this.load);
        // this.getLocationHandler();
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/plus.me'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: Api.google, // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            // hostedDomain: '', // specifies a hosted domain restriction
            // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
            forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
            // accountName: '', // [Android] specifies an account name on the device that should be used
            // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        });
        this.onPressFlag = this.onPressFlag.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.setState({
            pickerData: this.phone.getPickerData(),
        });
    }

    load = () => {
        this.setState({showAlert: false});
        HardwareBackAction.setBackAction(() => {
            HardwareBackAction.exitApp();
        });
    };

    /**
     * check gps permission
     */
    getLocationHandler() {
        Geolocation.getCurrentPosition(
            async (position) => {
                console.log(position);

                await AsyncStorage.setItem(StorageStrings.LATITUDE, position.coords.latitude.toString());
                await AsyncStorage.setItem(StorageStrings.LONGITUDE, position.coords.longitude.toString());

            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
                this.requestMultiplePermission();

            },
            {
                // enableHighAccuracy: true,
                timeout: 2000,
                // maximumAge: 2000
            },
        );
    }

    /**
     *request to platform permission
     */
    requestMultiplePermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the location');
                this.getLocationHandler();
            } else {
                this.getLocationHandler();
            }
        } else {
            const status = await Geolocation.requestAuthorization('whenInUse');
            console.log(status);
            this.getLocationHandler();
        }

    };





    /**
     *normal login
     */
    mobileUserLogin = async (mobileNumber) => {
        this.setState({isProcessing: true});
        const {navigate} = this.props.navigation;
        const details = {
            'username': mobileNumber,
            'password': this.state.password.value,
            'grant_type': 'password',
        };
        let formBody = [];
        for (const property in details) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        axios.post(SubUrl.auth, formBody)
            .then(async response => {
                await AsyncStorage.setItem(StorageStrings.LOGGED, 'true');
                await AsyncStorage.setItem(StorageStrings.ACCESS_TOKEN, response.data.access_token);
                await AsyncStorage.setItem(StorageStrings.REFRESH_TOKEN, response.data.refresh_token);
                await AsyncStorage.setItem(StorageStrings.USER_ID, response.data.user.userDetails.id.toString());
                await AsyncStorage.setItem(StorageStrings.MOBILE_NUMBER, encryption.encrypt(response.data.user.userDetails.mobile));
                if (response.data.user.userDetails.email !== null) {
                    await AsyncStorage.setItem(StorageStrings.EMAIL, encryption.encrypt(response.data.user.userDetails.email));
                }
                await AsyncStorage.setItem(StorageStrings.FIRST_NAME, encryption.encrypt(response.data.user.userDetails.firstName));
                await AsyncStorage.setItem(StorageStrings.LAST_NAME, encryption.encrypt(response.data.user.userDetails.lastName));
                if (response.data.user.userDetails.image !== null) {
                    await AsyncStorage.setItem(StorageStrings.USER_IMAGE, encryption.encrypt(response.data.user.userDetails.image));
                }
                await AsyncStorage.setItem(StorageStrings.PASSWORD, encryption.encrypt(this.state.password.value));
                if (response.data.user.userDetails.gender !== null) {
                    await AsyncStorage.setItem(StorageStrings.GENDER, encryption.encrypt(response.data.user.userDetails.gender));
                }
                if (response.data.user.userDetails.dateOfBirth !== null) {
                    await AsyncStorage.setItem(StorageStrings.BIRTHDAY, encryption.encrypt(response.data.user.userDetails.dateOfBirth));
                }
                if (response.data.user.userDetails.height.toString() !== null) {
                    await AsyncStorage.setItem(StorageStrings.HEIGHT, encryption.encrypt(response.data.user.userDetails.height));
                }
                if (response.data.user.userDetails.weight.toString() !== null) {
                    await AsyncStorage.setItem(StorageStrings.WEIGHT, encryption.encrypt(response.data.user.userDetails.weight));
                }
                if (response.data.user.userDetails.verificationNo !== null) {
                    await AsyncStorage.setItem(StorageStrings.NIC, encryption.encrypt(response.data.user.userDetails.verificationNo));
                }
                if (response.data.user.userDetails.country !== null) {
                    await AsyncStorage.setItem(StorageStrings.COUNTRY, encryption.encrypt(response.data.user.userDetails.country));
                }
                if (response.data.user.userDetails.referralCode !== null) {
                    await AsyncStorage.setItem(StorageStrings.INVITE_CODE, encryption.encrypt(response.data.user.userDetails.referralCode));
                }
                if (response.data.user.userDetails.authType !== null) {
                    await AsyncStorage.setItem(StorageStrings.AUTH_TYPE, response.data.user.userDetails.authType);
                }
                this.setState({
                    password: {
                        value: '',
                        valid: true,
                    },
                    value: '',
                });
                navigate('Home');
            })
            .catch(error => {
                if (error.response.data.message === 'You have entered an invalid username or password') {
                    Toast.show('You have entered an invalid username or password');
                } else if (error.response.data.message === 'You have reached the maximum number of sign-in attempts, please try again 1 hour later.') {
                    Toast.show('You have reached the maximum number of sign-in attempts, please try again 1 hour later.');
                } else {
                    AppToast.networkErrorToast();
                }
                this.setState({isProcessing: false});
            });

    };

    /**
     *social media login endpoint
     * get userId,token,social type in fb and google
     */
    socialMediaLogin = async (navigate, value) => {
        const data = {
            socialMediaId: value.userId,
            socialMediaToken: value.authToken,
            authType: value.type,
        };
        
    };

    /**
     * update onesignal push notification user token
     * */
    updatePushNotificationToken = async () => {

        let uniqueId = DeviceInfo.getUniqueId();
        const data = {
            userId: Number(await AsyncStorage.getItem(StorageStrings.USER_ID)),
            token: this.props.userId,
            deviceType: Platform.OS.toUpperCase(),
            deviceMac: uniqueId,
        };

        axios3.post(SubUrl.update_push_notification_token_of_user, data)
            .then(async response => {

            })
            .catch(error => {

            });

    };

    /**
     * get user corporate status
     */
    checkCorporateState = () => {
        axios3.get(SubUrl.check_user_corporate_status)
            .then(async response => {
                if (response.data.success) {
                    const state = response.data.body.state;
                    if (state) {
                        const corporateName = response.data.body.corporates;
                        this.props.checkCorporateState(state);
                        this.props.setCorporateName(corporateName);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    /**
     * check user allowed any subscription packages
     */
    checkSubscriptionPackageStatus = async (page, parameters, navigate) => {
        await this.updatePushNotificationToken();
        this.checkCorporateState();
        let state = false;
        const userId = await AsyncStorage.getItem(StorageStrings.USER_ID);
        axios3.get(SubUrl.check_subscription_state + userId)
            .then(async response => {
                if (response.data.success) {
                    state = response.data.body.status;
                    this.props.checkSubscriptionState(state);
                }
                if (navigate === undefined) {
                    this.resetNavigationAction(page, parameters, state);
                } else {
                    navigate('Home');
                }

            })
            .catch(error => {
                console.log(error);
                if (navigate === undefined) {
                    this.resetNavigationAction(page, parameters, state);
                } else {
                    navigate('Home');
                }
            });
    };

    /**
     * rest navigation
     * @param page
     * @param parameters
     * @param state
     */
    resetNavigationAction = (page, parameters, state) => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
                routeName: state && page === 'SubscriptionCheckout' ? this.returnPages(parameters).page : page,
                params: state && page === 'SubscriptionCheckout' ? this.returnPages(parameters).params : parameters,
            })],
        });
        this.props.navigation.dispatch(resetAction);
        if (state && page === 'SubscriptionCheckout') {
            AppToast.errorToast('You have already obtained the trial package.');
        }
        this.setState({isProcessing: false, fbLoading: false, googleLoading: false, appleLoading: false});
    };

    returnPages = (parameters) => {
        switch (parameters.data.returnPage) {
            case 'GroupClassExplore':
                return {page: 'GroupClassExplore', params: {selectedCorporateId: ''}};
            default:
                return {page: 'SelectedDetails', params: {sessionId: parameters.data.returnPageId, role: 'online'}};
        }
    };

    /**
     * change state in text fields value
     * check regex in typically=>regex for only Number values
     * @param name
     * @returns {Function}
     */
    onTextChange = (name) => val => {
        if (val.toString() === '') {
            const item = this.state[name];
            item.value = '';
            this.setState({
                [name]: item,
            });
        } else if (/^\d+$/.test(val.toString())) {
            const item = this.state[name];
            item.value = val;
            item.value = item.value.replace(/^0+/, '');
            this.setState({
                [name]: item,
            });
        } else {
            this.setState({
                [name]: this.state[name],
            });
        }

    };

    /**
     * state changer in text fields
     * @param name
     * @param length
     * @returns {Function}
     */
    onTextChange2 = (name, length) => val => {
        const item = this.state[name];
        item.value = val;
        item.valid = true;
        this.setState({
            [name]: item,
        });
    };

    /**
     * mobile number validation
     * use react-native-phone-input
     * */
    updateInfo() {
        const password = this.state.password;
        password.valid = Validation.textFieldValidator(this.state.password.value.trim(), 2);
        const value = this.phone.getValue();
        this.setState({
            value: value,
            password: password,
        });

        const mobile = this.state.mobileNum_074;
        const mobileValue = value.substring(1);
        mobile.valid = Validation.mobileNumberValidator(mobileValue.trim());
        this.setState({mobileNum_074: mobile});


        if (this.phone.isValidNumber() && this.state.password.valid) {
            this.setState({numValid: true});
            this.mobileUserLogin(this.phone.getValue());
        } else if (mobile.valid && this.state.password.valid) {
            this.setState({numValid: true});
            this.mobileUserLogin(this.phone.getValue());
        } else {
            this.setState({numValid: false});
        }
    }

    /**
     * get county popup for change flag icon
     * */
    onPressFlag() {
        this.countryPicker.openModal();
    }

    /**
     * select country
     * */
    selectCountry(country) {
        this.phone.selectCountry(country.cca2.toLowerCase());
        this.setState({cca2: country.cca2, code: country.callingCode});
    }

    /**
     * check popup display
     * @param {*} type
     */
    hideAlert(type) {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'yes':
                navigate('SocialMediaSignUp', {
                    signUpDetails: this.state.socialMediaData,
                });
                break;
            case 'no':
                this.setState({showAlert: false});
                break;
            default:
                break;
        }
    }

    /**
     * buttons press event handler
     * */
    onButtonClick = (type) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'signup':
                navigate('SignOutForm');
                break;
            case 'login':
                // navigate('BottomNavigation');
                this.updateInfo();
                break;
            case 'fb':
                this.fbLogin(navigate);
                break;
            case 'google':
                this._signIn(navigate);
                break;
            case 'forgotPW':
                navigate('OtpRequestForm');
                break;
            default:
                break;
        }
    };

    render() {
        return (
            // <ImageBackground source={BackgroundIMG} style={styles.container} blurRadius={0} imageStyle={{opacity: .5}}>
            <View style={{flex: 1}}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <Video source={VideoFile}
                       repeat
                       resizeMode={'cover'}
                       style={styles.backgroundVideo}/>

                <View style={styles.opacityLayer}/>
                <ScrollView showsVerticalScrollIndicator={false}
                            style={{zIndex: 2, width: '100%', position: 'absolute', height: screenHeight}}>

                    <View style={{zIndex: 3, alignItems: 'center'}}>
                        <View style={styles.logoOuter}>
                            <Image source={Logo} resizeMode='contain'
                                   style={{width: '100%', height: '100%', borderRadius: 25}}/>
                        </View>

                        <Text style={styles.headerTitles}>Sign in</Text>

                        <View style={!this.state.numValid ? {
                            ...styles.textFieldContainer,
                            borderColor: 'red',
                        } : styles.textFieldContainer}>
                            <PhoneInput
                                textProps={{
                                    placeholder: 'Mobile Number',
                                    returnKeyType: 'done',
                                    keyboardType: 'phone-pad',
                                    // onSubmitEditing: () => {
                                    //     this.password.focus();
                                    // }
                                }}
                                ref={ref => {
                                    this.phone = ref;
                                }}
                                onChangePhoneNumber={(ref) => {
                                    this.setState({value: ref, numValid: true});
                                }}
                                textStyle={styles2.phoneInputTextStyle}

                                // onSelectCountry={()=>this.setState({code:this.phone.getCountryCode()})}
                                style={{width: '100%'}}
                                offset={20}
                                // pickerItemStyle={{backgroundColor:'red'}}
                                allowZeroAfterCountryCode={false}
                                flagStyle={{width: 50, height: 25, marginLeft: 10}}
                                initialCountry={'lk'}
                                onPressFlag={this.onPressFlag}
                                value={'+' + this.state.code}
                            />
                            <CountryPicker
                                ref={(ref) => {
                                    this.countryPicker = ref;
                                }}
                                onChange={value => this.selectCountry(value)}
                                translation="eng"
                                cca2={this.state.cca2}
                            >
                                <View/>
                            </CountryPicker>
                            <View style={!this.state.numValid ? {
                                ...styles.flagContainer,
                                borderRightColor: 'red',
                            } : styles.flagContainer}>
                                {/*<Text style={{fontSize: 18}}>(+{this.state.code})</Text>*/}
                            </View>
                        </View>
                        {this.state.numValid ? null : (
                            <View style={{alignItems: 'flex-start', width: '100%'}}>
                                <Text style={{color: 'red', marginLeft: 30, fontSize: 12}}>Invalid number</Text>
                            </View>
                        )}

                        <InputItems
                            refer={input => this.password = input}
                            placeholder={'Password'}
                            value={this.state.password.value}
                            onChangeText={this.onTextChange2('password')}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            // onSubmitEditing={() => {
                            //     this.onButtonClick('login')
                            // }}
                            secureTextEntry={true}
                            errorMessage={!this.state.password.valid ? 'Invalid password' : null}
                        />

                        <View style={{width: '100%', alignItems: 'flex-end'}}>
                            <TouchableOpacity style={{marginRight: 10, marginTop: 10}}
                                              onPress={() => this.onButtonClick('forgotPW')}>
                                <Text style={styles.textStyle}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>


                        <Button
                            text="Sign in"
                            loading={this.state.loading}
                            onPress={() => this.onButtonClick('login')}
                        />

                        <View style={{marginTop: '4%', flexDirection: 'row', marginBottom: '8%'}}>
                            <Text style={styles.textStyle}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => this.onButtonClick('signup')}>
                                <Text
                                    style={{...styles.textStyle, color: Color.darkblue, marginLeft: 5}}>Register</Text>
                            </TouchableOpacity>
                        </View>

                            <View style={{width: '100%', alignItems: 'center'}}>

                                <SocialMediaButton
                                    text={'Sign in with Google'}
                                    onPress={() => this.onButtonClick('google')}
                                    loading={this.state.googleLoading}
                                    image={Google}
                                    apple={false}
                                />
                                <View style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    marginBottom: screenHeight / 100 * 10,
                                }}>
                                    <SocialMediaButton
                                        text={'Sign in with Facebook'}
                                        onPress={() => this.onButtonClick('fb')}
                                        loading={this.state.fbLoading}
                                        image={FB}
                                        apple={false}
                                    />
                                </View>
                            </View>


                    </View>
                </ScrollView>

                <Loading isVisible={this.state.isProcessing}/>

                <View style={this.state.showAlert ?
                    {
                        width: screenWidth,
                        height: screenHeight,
                        zIndex: 3,
                        position: 'absolute',
                    } : styles.alertContainer}>
                    <AlertMassage
                        show={this.state.showAlert}
                        message={'There is no registered Fitzky user under this account. Do you wish to create new account?'}
                        onCancelPressed={() => this.hideAlert('yes')}
                        onConfirmPressed={() => this.hideAlert('no')}
                        cancelText={'Okay'}
                        confirmText={'Not now'}
                        btnSize={110}
                    />
                </View>


            </View>

            // </ImageBackground >
        );
    }


}

const mapStateToProps = (state) => ({
    navigationParams: state.user.navigationParams,
    userId: state.user.userId,
});

const mapDispatchToProps = dispatch => {
    return {
        updateActiveRoute: activeRoute => dispatch(actionTypes.updateActiveRoute(activeRoute)),
        checkHomeBack: homeBack => dispatch(actionTypes.checkHomeBack(homeBack)),
        checkCorporateState: (corporateState) => dispatch(actionTypes.checkCorporateState(corporateState)),
        setCorporateName: (corporateName) => dispatch(actionTypes.setCorporateName(corporateName)),
        checkSubscriptionState: (subscriptionState) => dispatch(actionTypes.checkSubscriptionState(subscriptionState)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
