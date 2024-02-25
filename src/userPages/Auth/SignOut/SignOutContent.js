import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Platform, StatusBar, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import * as actionTypes from '../../../store/actions';
import {styles as styles2, styles} from "../styles";
import Logo from '../../../assets/Auth/CR_logo.png';
import {Color} from "../../../constance/Colors";
import Google from '../../../assets/Auth/googleIcon.png';
import FB from '../../../assets/Auth/fbIcon.png';
import {LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-community/google-signin';
import {StorageStrings} from "../../../constance/StorageStrings";
import axios from '../../../axios/axios_token_less';
import {SubUrl} from "../../../axios/server_url";
import CountryPicker from "../../../component/Lib/react-native-country-picker-modal";
import PhoneInput from "react-native-phone-input";
import BackgroundIMG from '../../../assets/Auth/backgroundIMG.png';
import Toast from 'react-native-simple-toast';
import Button from '../../../component/Actions/Button';
import SocialMediaButton from '../../../component/Actions/SocialButton';
import {Api} from "../../../constance/AppAPIKeys";
import {AppToast} from "../../../constance/AppToast";
import Loading from "../../../component/Loading/AuthLoading";
import Video from 'react-native-video';
import VideoFile from '../../../assets/video.mp4';
import DeviceInfo from 'react-native-device-info';
import axios3 from "../../../axios/axios";
import * as Validation from "../../Validation/Validation";
import {encryption} from "../../../component/Encryption/Encrypt&Decrypt";

const screenHeight = Math.round(Dimensions.get('window').height);


class App extends React.Component {

    state = {
        cca2: 'LK',
        value: "",
        code: '94',
        numValid: true,
        name: 'Sri Lanka',
        loading: false,
        googleLoading: false,
        fbLoading: false,
        isProcessing: false,
        token: '',
        mobileNum_074: {
            valid: true
        },
    }

    async componentDidMount() {
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

    /**
     * fb login
     */
    fbLogin(navigate) {
        const app = this;
        this.setState({fbLoading: true})
        LoginManager.logInWithPermissions(["public_profile"]).then(
            function (result) {
                if (result.isCancelled) {
                    // Toast.show('Facebook login cancelled.');
                    app.setState({fbLoading: false});
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            let accessToken = data.accessToken;

                            async function responseInfoCallback(error, result) {
                                if (error) {
                                    app.setState({fbLoading: false});
                                } else {
                                    const data = {
                                        type: 'FACEBOOK',
                                        userId: result.id,
                                        name: result.name,
                                        firstName: result.first_name,
                                        lastName: result.last_name,
                                        email: result.email,
                                        profileImage: `https://graph.facebook.com/${result.id}/picture?type=large&width=300&height=300`,
                                        authToken: accessToken,
                                    };

                                    app.socialMediaLogin(navigate, data)
                                }
                            };

                            const infoRequest = new GraphRequest(
                                '/me',
                                {
                                    accessToken: accessToken,
                                    parameters: {
                                        fields: {
                                            string: 'id,first_name,last_name,picture',
                                        },
                                    },
                                },
                                responseInfoCallback,
                            );

                            // Start the graph request.
                            new GraphRequestManager().addRequest(infoRequest).start();


                        },
                    );
                }
            },
            function (error) {
                App.setState({fbLoading: false});
                AppToast.loginFailedToast();
            }
        );
    }

    /**
     *google login
     */
    _signIn = async (navigate) => {
        this.setState({googleLoading: true})
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const currentUser = await GoogleSignin.getCurrentUser();

            const data = {
                type: 'GOOGLE',
                userId: currentUser.user.id,
                firstName: currentUser.user.givenName,
                lastName: currentUser.user.familyName,
                email: currentUser.user.email,
                profileImage: currentUser.user.photo,
                authToken: currentUser.idToken,
            };
            this.socialMediaLogin(navigate, data);

        } catch (error) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    Toast.show('Google sign in already in progress.');
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    Toast.show('Google play services not available.');
                    break;
                // case statusCodes.SIGN_IN_CANCELLED:
                //     Toast.show('Google sign in cancelled.');
                //     break;
            }
            this.setState({googleLoading: false});
        }
    };

    /**
     *social media login endpoint
     * get userId,token,social type in fb and google
     */
    socialMediaLogin = async (navigate, value) => {
        const data = {
            socialMediaId: value.userId,
            socialMediaToken: value.authToken,
            authType: value.type
        };
        this.setState({isProcessing: true});
        axios.post(SubUrl.public_user_login, data)
            .then(async response => {
                if (response.data.success) {
                    AppToast.alreadyAccountToast();
                    await AsyncStorage.setItem(StorageStrings.LOGGED, 'true');
                    await AsyncStorage.setItem(StorageStrings.ACCESS_TOKEN, response.data.body.access_token);
                    await AsyncStorage.setItem(StorageStrings.REFRESH_TOKEN, response.data.body.refresh_token);
                    await AsyncStorage.setItem(StorageStrings.USER_ID, response.data.body.user.userDetails.id.toString());
                    await AsyncStorage.setItem(StorageStrings.MOBILE_NUMBER, encryption.encrypt(response.data.body.user.userDetails.mobile));
                    await AsyncStorage.setItem(StorageStrings.EMAIL, encryption.encrypt(response.data.body.user.userDetails.email));
                    await AsyncStorage.setItem(StorageStrings.FIRST_NAME, encryption.encrypt(response.data.body.user.userDetails.firstName));
                    await AsyncStorage.setItem(StorageStrings.LAST_NAME, encryption.encrypt(response.data.body.user.userDetails.lastName));
                    if (response.data.body.user.userDetails.gender !== null) {
                        await AsyncStorage.setItem(StorageStrings.GENDER, encryption.encrypt(response.data.body.user.userDetails.gender));
                    }
                    if (response.data.body.user.userDetails.image !== null) {
                        await AsyncStorage.setItem(StorageStrings.USER_IMAGE, encryption.encrypt(response.data.body.user.userDetails.image));
                    }
                    if (response.data.body.user.userDetails.dateOfBirth !== null) {
                        await AsyncStorage.setItem(StorageStrings.BIRTHDAY, encryption.encrypt(response.data.body.user.userDetails.dateOfBirth));
                    }
                    if (response.data.body.user.userDetails.height !== null) {
                        await AsyncStorage.setItem(StorageStrings.HEIGHT, encryption.encrypt(response.data.body.user.userDetails.height))
                    }
                    if (response.data.body.user.userDetails.weight !== null) {
                        await AsyncStorage.setItem(StorageStrings.WEIGHT, encryption.encrypt(response.data.body.user.userDetails.weight))
                    }
                    if (response.data.body.user.userDetails.verificationNo !== null) {
                        await AsyncStorage.setItem(StorageStrings.NIC, encryption.encrypt(response.data.body.user.userDetails.verificationNo))
                    }
                    if (response.data.body.user.userDetails.country !== null) {
                        await AsyncStorage.setItem(StorageStrings.COUNTRY, encryption.encrypt(response.data.body.user.userDetails.country))
                    }
                    if (response.data.body.user.userDetails.referralCode !== null) {
                        await AsyncStorage.setItem(StorageStrings.INVITE_CODE, encryption.encrypt(response.data.body.user.userDetails.referralCode))
                    }
                    if (response.data.body.user.userDetails.authType !== null) {
                        await AsyncStorage.setItem(StorageStrings.AUTH_TYPE, response.data.body.user.userDetails.authType)
                    }
                    const {navigate} = this.props.navigation;
                    this.setState({fbLoading: false, googleLoading: false, isProcessing: false});
                    navigate('Home');
                } else {
                    this.setState({fbLoading: false, googleLoading: false, isProcessing: false});
                    navigate('SocialMediaSignUp', {
                        signUpDetails: value
                    });
                }
            })
            .catch(error => {
                this.setState({fbLoading: false, googleLoading: false, isProcessing: false});
                AppToast.networkErrorToast();
            });
    };

    /**
     *request otp endpoint
     */
    requestUserData = async (mobileNumber,countryName) => {
        this.setState({loading: true});
        const data = {
            mobile: mobileNumber,
            smsSecret: 'Q2V5ZW50cmFUZWNobm9sb2dpZXNDb2xsYWJvcmF0ZVdpdGhMaW9uVG91cnNAMTIzNDU='
        };
        const {navigate} = this.props.navigation;
        axios.patch(SubUrl.requestOtp, data)
            .then(async response => {
                if (response.data.success) {
                    await AsyncStorage.setItem(StorageStrings.COUNTRY, countryName)
                    await AsyncStorage.setItem(StorageStrings.USER_ROLE, 'mobile_user');
                    this.setState({loading: false, isProcessing: false});
                    navigate('PinVerifyForm', {
                        mobile: mobileNumber,
                    });
                    this.props.updateActiveRoute('MobileSignOutForm');
                } else {
                    if (response.data.message === 'Mobile number already exists') {
                        this.setState({loading: false, isProcessing: false});
                        AppToast.mobileNumberAlreadyToast();
                    } else {
                        this.setState({loading: false, isProcessing: false});
                        Toast.show(response.data.message)
                    }
                }
                this.setState({loading: false, isProcessing: false});
            })
            .catch(error => {
                this.setState({loading: false, isProcessing: false});
                if (error.response.status === 401) {
                    AppToast.serverErrorToast();
                } else {
                    AppToast.networkErrorToast();
                }
            })

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
     * get country name to dynamic change mobile number
     * @param countryCode
     * @returns {Promise<null|*>}
     */
    getCountryName = async (countryCode) => {
        const code = countryCode;
        const countries = require('../../../component/json/countries.json');

        for (const c of countries) {
            if (c.alpha2Code === code) {
                return c.name;
            }
        }
        return null;
    }

    /**
     * mobile number validation
     * use react-native-phone-input
     * */
    async updateInfo() {
        const value = this.phone.getValue();
        const mobile = this.state.mobileNum_074;
        const mobileValue = value.substring(1);
        mobile.valid = Validation.mobileNumberValidator(mobileValue.trim());
        this.setState({mobileNum_074: mobile})

        if (this.phone.isValidNumber() || this.state.mobileNum_074.valid) {
            const countryName = await this.getCountryName(this.phone.getISOCode().toUpperCase());
            this.setState({
                numValid: true,
                valid: true,
                value: value,
                name: countryName
            });

            this.requestUserData(this.phone.getValue(),countryName);
        } else {
            this.setState({
                numValid: false,
                valid: false,
                value: value,
            });
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
        this.setState({
            cca2: country.cca2,
            code: country.callingCode,
            name: country.name
        });
    }

    /**
     * button press event handler
     * */
    onButtonClick = (type) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'signup':
                this.updateInfo();
                // navigate('PinVerifyForm');
                // this.props.updateActiveRoute('MobileSignOutForm');
                break;
            case 'login':
                navigate('AuthForm');
                break;
            case 'googleSignup':
                this._signIn(navigate);
                break;
            case 'fb':
                this.fbLogin(navigate);
                break;
            default:
                break;
        }
    }

    render() {
        return (
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

                        <Text style={styles.headerTitles}>Register with FitNexus</Text>

                        <View style={!this.state.numValid ? {
                            ...styles.textFieldContainer,
                            borderColor: 'red'
                        } : {...styles.textFieldContainer, marginBottom: '5%'}}>
                            <PhoneInput
                                textProps={{
                                    placeholder: 'Mobile Number',
                                    returnKeyType: 'done',
                                    keyboardType: 'phone-pad',
                                    // onSubmitEditing: () => {
                                    //     this.onButtonClick('signup');
                                    // }
                                }}
                                ref={ref => {
                                    this.phone = ref;
                                }}
                                onChangePhoneNumber={(ref) => {
                                    this.setState({value: ref, numValid: true})
                                }}
                                textStyle={styles2.phoneInputTextStyle}
                                // onSelectCountry={()=>this.setState({code:this.phone.getCountryCode()})}
                                style={{width: '100%'}}
                                offset={20}
                                // pickerItemStyle={{backgroundColor:'red'}}
                                allowZeroAfterCountryCode={false}
                                flagStyle={{width: 45, height: 25, marginLeft: 10}}
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
                                borderRightColor: 'red'
                            } : styles.flagContainer}>
                                {/*<Text style={{fontSize: 18}}>(+{this.state.code})</Text>*/}
                            </View>
                        </View>
                        {this.state.numValid ? null : (
                            <View style={{alignItems: 'flex-start', width: '100%'}}>
                                <Text style={{color: 'red', marginLeft: 30, fontSize: 12}}>Invalid number</Text>
                            </View>
                        )}

                        <Button
                            text="Register"
                            loading={this.state.loading}
                            onPress={() => this.onButtonClick('signup')}
                        />

                        <View style={{marginTop: '4%', flexDirection: 'row', marginBottom: '8%'}}>
                            <Text style={styles.textStyle}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => this.onButtonClick('login')}>
                                <Text style={{...styles.textStyle, color: Color.darkblue, marginLeft: 5}}>Sign in</Text>
                            </TouchableOpacity>
                        </View>


                        {Platform.OS === 'android' ? (
                            <View style={{width: '100%', alignItems: 'center'}}>
                                <SocialMediaButton
                                    text={'Register with Google'}
                                    onPress={() => this.onButtonClick('googleSignup')}
                                    loading={this.state.googleLoading}
                                    image={Google}
                                    apple={false}
                                />

                                <View style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    marginBottom: screenHeight / 100 * 10
                                }}>

                                    <SocialMediaButton
                                        text={'Register with Facebook'}
                                        onPress={() => this.onButtonClick('fb')}
                                        loading={this.state.fbLoading}
                                        image={FB}
                                        apple={false}
                                    />

                                </View>
                            </View>
                        ) : null}

                    </View>

                </ScrollView>


                <Loading isVisible={this.state.isProcessing}/>

            </View>

        );
    }

}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return {
        updateActiveRoute: activeRoute => dispatch(actionTypes.updateActiveRoute(activeRoute)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

