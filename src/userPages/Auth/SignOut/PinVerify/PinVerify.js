import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Keyboard, Platform, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Color} from "../../../../constance/Colors";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {connect} from 'react-redux';
import RNOtpVerify from 'react-native-otp-verify';
import axios from '../../../../axios/axios_token_less';
import axios2 from '../../../../axios/axios';
import {StorageStrings} from "../../../../constance/StorageStrings";
import {SubUrl} from "../../../../axios/server_url";
import Toast from 'react-native-simple-toast';
import Button from '../../../../component/Actions/Button';
import CountDown from 'react-native-countdown-component';
import {Font} from "../../../../constance/AppFonts";
import {AppToast} from "../../../../constance/AppToast";
import OneSignal from "react-native-onesignal";
import {Api} from "../../../../constance/AppAPIKeys";
import DeviceInfo from "react-native-device-info";
import {encryption} from "../../../../component/Encryption/Encrypt&Decrypt";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const currentSize = screenWidth / 360;

class App extends React.Component {
    state = {
        mobile: '',
        code: {
            value: '',
            valid: true
        },
        type: '',
        firstName: '',
        lastName: '',
        email: '',
        userId: '',
        socialMediaToken: '',
        authType: '',
        userImage: '',
        password: '',
        gender: '',
        country: '',
        loading: false,
        countVisible: true,
        btnVisible: false,
        number: '',
        referralCode:'',
        token: ''
    };

    async componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            this.getHash();
            this.startListeningForOtp();
        })

        const {navigation} = this.props;
        const role = await AsyncStorage.getItem(StorageStrings.USER_ROLE);
        if (role === 'authenticate_user') {
            const number = navigation.getParam('number');
            this.setState({
                mobile: number,
                type: role
            })
        } else if (role === 'public_user') {
            const mobile = navigation.getParam('mobile');
            const firstName = navigation.getParam('firstName');
            const lastName = navigation.getParam('lastName');
            const email = navigation.getParam('email');
            const userId = navigation.getParam('userId');
            const socialMediaToken = navigation.getParam('socialMediaToken');
            const authType = navigation.getParam('authType');
            const userImage = navigation.getParam('userImage');
            const password = navigation.getParam('password');
            const gender = navigation.getParam('gender');
            const country = navigation.getParam('country');
            const referralCode=navigation.getParam('referralCode');

            this.setState({
                mobile: mobile,
                firstName: firstName,
                lastName: lastName,
                email: email,
                userId: userId,
                socialMediaToken: socialMediaToken,
                authType: authType,
                userImage: userImage,
                password: password,
                gender: gender,
                country: country,
                type: role,
                referralCode:referralCode
            })
        } else if ('mobile_user') {
            const mobile = navigation.getParam('mobile');
            this.setState({
                mobile: mobile,
                type: role
            })
        } else if ('forgotPWUser') {
            const mobile = navigation.getParam('mobile');
            this.setState({
                mobile: mobile,
                type: role
            })
        }

        else {
            this.setState({
                mobile: encryption.decrypt(await AsyncStorage.getItem(StorageStrings.MOBILE_NUMBER)),
                type: role
            })
        }

        this.setState({
            number: '* * * * * * * * * *' + this.state.mobile.slice(10)
        })


    }

    getHash = () =>
        RNOtpVerify.getHash()
            .then(console.log)
            .catch(console.log);

    startListeningForOtp = () =>
        RNOtpVerify.getOtp()
            .then(p => RNOtpVerify.addListener(this.otpHandler))
            .catch(p => console.log(p));

    otpHandler = (message: string) => {
        const otp = /(\d{4})/g.exec(message)[1];
        this.setState({code: otp});
        RNOtpVerify.removeListener();
        Keyboard.dismiss();
    }

    componentWillUnmount() {
        if (RNOtpVerify) {
            RNOtpVerify.removeListener();
        }
    }

    /**
     * otp verification endpoint
     * @param navigate
     * @returns {Promise<void>}
     */
    verifyInputState = async (navigate) => {
        this.setState({loading: true})
        const data = {
            mobile: this.state.mobile,
            otp: this.state.code.value
        };
        axios.patch(SubUrl.verifyOtp, data)
            .then(async response => {
                if (response.data.message === 'Incorrect OTP') {
                    this.setState({
                        code: {
                            value: '',
                            valid: false
                        },
                        loading: false
                    })
                }
                if (response.data.success) {
                    if (this.state.type === 'mobile_user') {
                        navigate(this.props.activeRoute, {
                            otp: this.state.code.value,
                            mobile: this.state.mobile
                        });
                        this.setState({loading: false})
                    } else if (this.state.type === 'authenticate_user') {
                        const data = {
                            id: await AsyncStorage.getItem(StorageStrings.USER_ID),
                            mobile: this.state.mobile,
                            otpDetails: {
                                otp: this.state.code.value
                            }
                        }
                        axios2.put(SubUrl.update_user_mobile, data)
                            .then(async response => {
                                if (response.data.success) {
                                    await AsyncStorage.setItem(StorageStrings.MOBILE_NUMBER, encryption.encrypt(this.state.mobile));
                                    navigate(this.props.activeRoute);
                                    this.setState({loading: false})
                                }else {
                                    AppToast.serverErrorToast();
                                }
                            })
                            .catch(error => {
                                this.setState({loading: false})
                                AppToast.networkErrorToast();
                            })

                    } else if (this.state.type === 'public_user') {

                        const data = {
                            firstName: this.state.firstName,
                            lastName: this.state.lastName,
                            mobile: this.state.mobile,
                            email: this.state.email,
                            socialMediaId: this.state.userId,
                            socialMediaToken: this.state.socialMediaToken,
                            authType: this.state.authType,
                            otpDetails: {
                                otp: this.state.code.value,
                            },
                            image: this.state.userImage,
                            password: this.state.password,
                            gender: this.state.gender,
                            country:this.state.country,
                            referralFrom:this.state.referralCode!==''?this.state.referralCode:null
                        }

                        axios.post(SubUrl.register_social_account, data)
                            .then(async response => {
                                if (response.data.success) {
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
                                    if (response.data.body.user.userDetails.referralCode !==null){
                                        await AsyncStorage.setItem(StorageStrings.INVITE_CODE,encryption.encrypt(response.data.body.user.userDetails.referralCode))
                                    }
                                    if (response.data.body.user.userDetails.authType !== null) {
                                        await AsyncStorage.setItem(StorageStrings.AUTH_TYPE, response.data.body.user.userDetails.authType)
                                    }
                                    navigate(this.props.activeRoute);
                                    this.setState({loading: false})
                                }else {
                                    AppToast.serverErrorToast();
                                }


                            })
                            .catch(error => {
                                this.setState({loading: false});
                                AppToast.networkErrorToast();
                            })

                    } else if (this.state.type === 'forgotPWUser') {
                        navigate(this.props.activeRoute, {
                            otp: this.state.code.value,
                            mobile: this.state.mobile
                        });
                        this.setState({loading: false})
                    }

                }
            })
            .catch(error => {
                this.setState({loading: false})
                AppToast.networkErrorToast();
            })
    };

    /**
     * request otp endpoint integration
     * check social media acc endpoint integration
     * @returns {Promise<void>}
     */
    reRequestOtp = async () => {
        if (this.state.type === 'mobile_user') {
            const data = {
                mobile: this.state.mobile,
                smsSecret: 'Q2V5ZW50cmFUZWNobm9sb2dpZXNDb2xsYWJvcmF0ZVdpdGhMaW9uVG91cnNAMTIzNDU='
            };
            axios.patch(SubUrl.requestOtp, data)
                .then(async response => {
                    if (response.data.message === 'Please wait 30 seconds from the last OTP') {
                        Toast.show('Please wait 30 seconds from the last OTP');
                    }
                    if (response.data.success) {
                        this.setState({
                            code: {
                                value: '',
                                valid: true
                            }
                        })
                    }else {
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type === 'public_user') {
            const data = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                mobile: this.state.mobile,
                email: this.state.email,
                socialMediaId: this.state.userId,
                socialMediaToken: this.state.socialMediaToken,
                password: this.state.password,
                authType: this.state.authType,
                country: this.state.country
            };

            axios.post(SubUrl.check_social_details, data)
                .then(async response => {
                    if (response.data.success) {
                        this.setState({
                            code: ''
                        })
                    }else {
                        AppToast.serverErrorToast();
                    }
                })
                .then(error => {
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type === 'authenticate_user') {
            const data = {
                mobile: this.state.mobile,
                smsSecret: 'Q2V5ZW50cmFUZWNobm9sb2dpZXNDb2xsYWJvcmF0ZVdpdGhMaW9uVG91cnNAMTIzNDU='
            };
            axios.patch(SubUrl.requestOtp, data)
                .then(async response => {
                    if (response.data.message === 'Please wait 30 seconds from the last OTP') {
                        Toast.show('Please wait 30 seconds from the last OTP');
                    }
                    if (response.data.success) {
                        this.setState({
                            code: ''
                        })
                    }else {
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type === 'forgotPWUser') {
            const data = {
                mobile: this.state.mobile,
            };
            axios.patch(SubUrl.authenticate_otp_request, data)
                .then(async response => {
                    if (response.data.message === 'Please wait 30 seconds from the last OTP') {
                        AppToast.otpRerequestToast();
                    }
                    if (response.data.message === 'User not found') {
                        AppToast.userNotFoundToast2();
                    }
                    if (response.data.success) {
                        this.setState({
                            code: ''
                        })
                    }else {
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    AppToast.networkErrorToast();
                })
        }

    }

    onButtonClick = (type) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'continue':
                this.verifyInputState(navigate);
                break;
            case 'resend':
                this.setState({countVisible: true, btnVisible: false})
                this.reRequestOtp();
                break;
            default:
                break;
        }
    };

    checkVisible() {
        this.setState({
            countVisible: false,
            btnVisible: true,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <Text style={styles.headerTitle}>Confirm your number</Text>
                <Text style={styles.subHeadTitle}>Enter the 4-digit code Fitzky just send to</Text>
                <Text style={{...styles.subHeadTitle, color: Color.gray}}>{this.state.number}</Text>

                <View style={{alignItems: 'center', marginTop: '10%'}}>
                    <SmoothPinCodeInput
                        containerStyle={{width: '95%', height: screenHeight / 100 * 15}}
                        cellSize={50}
                        codeLength={4}
                        cellStyle={this.state.code.valid?styles.pinCell:{...styles.pinCell,borderColor: 'red'}}
                        value={this.state.code.value}
                        animated={true}
                        textStyle={styles.pinText}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onFulfill={() => {
                            Keyboard.dismiss();
                        }}
                        onTextChange={code => {
                            this.setState({code: {value: code, valid: true}});
                        }}

                    />

                    {this.state.code.valid?null:(
                    <Text style={{color: 'red', fontSize: 12}}>Incorrect OTP Number</Text>
                    )}
                    <Button
                        text="Continue"
                        loading={this.state.loading}
                        onPress={() => this.onButtonClick('continue')}
                    />
                    <View style={{marginTop: 10, flexDirection: 'row', marginBottom: '15%', alignItems: 'center'}}>
                        <Text style={styles.textStyle}>Didn't get the code?</Text>
                        {this.state.countVisible === true ? (
                            <CountDown
                                until={60 * 0 + 30}
                                onFinish={() => this.checkVisible()}
                                digitStyle={{...styles.textStyle, fontSize: 12}}
                                digitTxtStyle={{color: Color.darkblue, marginTop: 2, fontSize: 12}}
                                showSeparator={true}
                                separatorStyle={{color: '#2E6FFF'}}
                                timeToShow={['M', 'S']}
                                timeLabels={{m: null, s: null}}
                                timeLabelStyle={{color: 'transparent'}}
                            />
                        ) : (
                            <TouchableOpacity onPress={() => this.onButtonClick('resend')}>
                                <Text style={{...styles.textStyle, color: Color.darkblue, marginLeft: 2}}>Resend</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </View>
            </View>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.backgroundColor,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Font.SemiBold,
        marginLeft: '3%',
        marginTop: '3%'
    },
    subHeadTitle: {
        fontFamily: Font.Regular,
        fontSize: 15,
        color: Color.lightGray,
        marginLeft: '3%',
        marginTop: '2%',
        lineHeight: 25
    },
    pinCell: {
        width: 55 * currentSize,
        height: 60 * currentSize,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Color.lightGray,

    },
    btnStyle: {
        backgroundColor: Color.black,
        width: '95%',
        height: 55,
        borderRadius: 10,
        marginTop: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    btnContent: {
        color: Color.white,
        fontFamily: Font.SemiBold
    },
    textStyle: {
        color: Color.black,
        fontFamily: Font.Medium,
    },
    pinText: {
        fontSize: 38,
        color: Color.black,
    },
    btnResend: {
        fontFamily: 'Poppins-Medium',
        color: Color.darkblue,
        fontSize: screenHeight / 100 * 2.5,
        // marginTop:screenWidth===800?'55%':'45%',
        marginBottom: '3%',
    },
});

const mapStateToProps = (state) => ({
    activeRoute: state.user.activeRoute,
});

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
