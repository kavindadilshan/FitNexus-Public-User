import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity, StatusBar, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Logo from '../../../../assets/Auth/CR_logo.png';
import InputItems from '../../../../component/Actions/InputItems';
import {Color} from '../../../../constance/Colors';
import {StorageStrings} from '../../../../constance/StorageStrings';
import {connect} from 'react-redux';
import * as actionTypes from '../../../../store/actions';
import * as Validation from '../../../Validation/Validation';
import axios from '../../../../axios/axios_token_less';
import {SubUrl} from '../../../../axios/server_url';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from '../../../../component/Lib/react-native-country-picker-modal';
import Toast from 'react-native-simple-toast';
import Button from '../../../../component/Actions/Button';
import {Font} from '../../../../constance/AppFonts';
import {AppToast} from '../../../../constance/AppToast';
import CustomPicker from '../../../../component/CustomPicker/CustomPicker';
import {styles as styles2} from '../../styles';
import {encryption} from '../../../../component/Encryption/Encrypt&Decrypt';
import {NavigationActions, StackActions} from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import axios3 from '../../../../axios/axios';

class App extends React.Component {
    state = {
        firstName: {
            value: '',
            valid: true,
        },
        lastName: {
            value: '',
            valid: true,
        },
        email: {
            value: '',
            valid: true,
        },
        mobile: {
            value: '',
            valid: true,
        },
        password: {
            value: '',
            valid: true,
        },
        confirmPW: {
            value: '',
            valid: true,
        },
        genderType: {
            value: 'Gender',
            valid: true,
        },
        referralCode: {
            value: '',
            valid: true,
        },
        userId: '',
        accessToken: '',
        type: '',
        image: '',
        cca2: 'LK',
        value: '',
        code: '94',
        name: 'Sri Lanka',
        numValid: true,
        loading: false,
        message: '',
        referralCodeMsg: '',
    };

    async componentWillMount() {
        const {navigation} = this.props;
        const data = navigation.getParam('signUpDetails');
        this.setState({
            firstName: {
                value: data.firstName || '',
                valid: true,
            },
            lastName: {
                value: data.lastName || '',
                valid: true,
            },
            email: {
                value: data.email || '',
                valid: true,
            },
            userId: data.userId,
            accessToken: data.authToken,
            type: data.type,
            image: data.profileImage,
        });
    }

    componentDidMount() {
        this.onPressFlag = this.onPressFlag.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.setState({
            pickerData: this.phone.getPickerData(),
        });
    }

    /**
     * check validations
     *
     */
    async updateInfo() {
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        // const password = this.state.password;
        // const confirmPW = this.state.confirmPW;
        const gender = this.state.genderType;
        const email = this.state.email;

        firstName.valid = this.state.firstName.value !== '';
        lastName.valid = this.state.lastName.value !== '';
        gender.valid = Validation.genderValidator(this.state.genderType.value);
        email.valid = Validation.emailValidator(this.state.email.value);
        // password.valid = Validation.textFieldValidator(this.state.password.value, 8);

        // if (confirmPW.value === "") {
        //     this.setState({message: 'Confirm Password text is missing'});
        //     confirmPW.valid = false
        // } else if (password.value === confirmPW.value) {
        //     confirmPW.valid = true
        // } else {
        //     this.setState({message: 'Not match with new password'});
        //     confirmPW.valid = false
        // }

        this.setState({
            value: this.phone.getValue(),
            // password: password,
            // confirmPW: confirmPW,
            genderType: gender,
            email: email,
            firstName: firstName,
            lastName: lastName,
        });

        const value = this.phone.getValue();
        const mobileValue = value.substring(1);
        const mobile = this.state.mobile;
        mobile.valid = Validation.mobileNumberValidator(mobileValue.trim());
        this.setState({mobile: mobile});
        let validNumber = false;
        if (this.state.mobile.valid || this.phone.isValidNumber()) {
            validNumber = true;
            this.setState({numValid: true, valid: true});
        } else {
            this.setState({numValid: false, valid: false});
        }

        if (validNumber && this.state.genderType.valid && this.state.email.valid) {
            const countryName = await this.getCountryName(this.phone.getISOCode().toUpperCase());
            this.setState({name: countryName});
            this.checkSocialAccount(this.phone.getValue(), countryName);
        }

    }

    /**
     * open model for flag select
     */
    onPressFlag() {
        this.countryPicker.openModal();
    }

    /**
     * select flag event
     * @param country
     */
    selectCountry(country) {
        this.phone.selectCountry(country.cca2.toLowerCase());
        this.setState({cca2: country.cca2, code: country.callingCode, name: country.name});
    }

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
     * gender picker
     * @param type
     * @param value
     */
    onPicker = (type, value) => {
        if (value !== 'Gender') {
            this.setState({
                [type]: {
                    value: value,
                    valid: true,
                },
            });
        }
    };

    /**
     * check social media endpoint integration
     * */
    checkSocialAccount = async (mobileNumber, countryName) => {
        this.setState({loading: true});

        const data = {
            firstName: this.state.firstName.value,
            lastName: this.state.lastName.value,
            mobile: mobileNumber,
            email: this.state.email.value,
            socialMediaId: this.state.userId,
            socialMediaToken: this.state.accessToken,
            password: this.state.password.value,
            authType: this.state.type,
            gender: this.state.genderType.value,
            country: countryName,
            referralFrom: this.state.referralCode.value !== '' ? this.state.referralCode.value : null,
        };

        axios.post(SubUrl.check_social_details, data)
            .then(async response => {

                if (response.data.success) {

                    await AsyncStorage.setItem(StorageStrings.USER_ROLE, 'public_user');

                    // const {navigate} = this.props.navigation;
                    // navigate('PinVerifyForm', {
                    //     mobile: mobileNumber,
                    //     firstName: this.state.firstName.value,
                    //     lastName: this.state.lastName.value,
                    //     email: this.state.email.value,
                    //     userId: this.state.userId,
                    //     socialMediaToken: this.state.accessToken,
                    //     authType: this.state.type,
                    //     userImage: this.state.image,
                    //     password: this.state.password.value,
                    //     gender: this.state.genderType.value,
                    //     country: this.state.name,
                    //     referralCode: this.state.referralCode.value

                    // });
                    // this.props.updateActiveRoute('WelcomeForm');

                    /**
                     * change after apple submission
                     */
                    const data = {
                        firstName: this.state.firstName.value,
                        lastName: this.state.lastName.value,
                        mobile: mobileNumber,
                        email: this.state.email.value,
                        socialMediaId: this.state.userId,
                        socialMediaToken: this.state.accessToken,
                        authType: this.state.type,
                        image: this.state.image,
                        password: this.state.password.value,
                        gender: this.state.genderType.value,
                        country: countryName,
                        referralFrom: this.state.referralCode.value !== '' ? this.state.referralCode.value : null,
                    };

                    axios.post(SubUrl.register_social_account, data)
                        .then(async response => {
                            if (response.data.success) {
                                const {navigate} = this.props.navigation;
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
                                    await AsyncStorage.setItem(StorageStrings.HEIGHT, encryption.encrypt(response.data.body.user.userDetails.height));
                                }
                                if (response.data.body.user.userDetails.weight !== null) {
                                    await AsyncStorage.setItem(StorageStrings.WEIGHT, encryption.encrypt(response.data.body.user.userDetails.weight));
                                }
                                if (response.data.body.user.userDetails.verificationNo !== null) {
                                    await AsyncStorage.setItem(StorageStrings.NIC, encryption.encrypt(response.data.body.user.userDetails.verificationNo));
                                }
                                if (response.data.body.user.userDetails.country !== null) {
                                    await AsyncStorage.setItem(StorageStrings.COUNTRY, encryption.encrypt(response.data.body.user.userDetails.country));
                                }
                                if (response.data.body.user.userDetails.referralCode !== null) {
                                    await AsyncStorage.setItem(StorageStrings.INVITE_CODE, encryption.encrypt(response.data.body.user.userDetails.referralCode));
                                }
                                if (response.data.body.user.userDetails.authType !== null) {
                                    await AsyncStorage.setItem(StorageStrings.AUTH_TYPE, response.data.body.user.userDetails.authType);
                                }
                                this.checkGuestUserNavigation(navigate);
                                this.setState({loading: false});
                            } else {
                                AppToast.serverErrorToast();
                                this.setState({loading: false});
                            }
                        })
                        .catch(error => {
                            this.setState({loading: false});
                            AppToast.networkErrorToast();
                        });
                    this.setState({loading: false});
                } else {
                    if (response.data.message === 'Mobile number already exists') {
                        Toast.show(response.data.message);
                        this.setState({loading: false});
                    } else if (response.data.message === 'Email already exists') {
                        Toast.show(response.data.message);
                        this.setState({loading: false});
                    } else if (response.data.message === 'Social media account already exists') {
                        Toast.show(response.data.message);
                        this.setState({loading: false});
                    } else if (response.data.message === 'Invalid referral code') {
                        this.setState({
                            loading: false,
                            referralCodeMsg: response.data.message,
                            referralCode: {value: '', valid: false},
                        });
                    } else {
                        Toast.show(response.data.message);
                        this.setState({loading: false});
                    }
                }

            })
            .then(error => {
                this.setState({loading: false});
                // AppToast.networkErrorToast();
            });


    };

    /**
     * check navigation from guest user page
     * @param navigate
     */
    checkGuestUserNavigation = (navigate) => {
        const params = this.props.navigationParams;
        if (!this.props.asGuestUser) {
            // navigate('WelcomeForm');
            this.resetNavigationAction('', '');
        } else {
            this.props.checkGuestUser(false);
            this.props.checkHomeBack(true);
            this.resetNavigationAction(params.page, params.parameters);
        }
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
     * rest navigation
     * @param page
     * @param parameters
     */
    resetNavigationAction = (page, parameters) => {
        this.updatePushNotificationToken();
        if (page !== '') {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({
                    routeName: page,
                    params: parameters,
                })],
            });
            this.props.navigation.dispatch(resetAction);
        } else {
            this.props.navigation.navigate('Home');
        }

    };

    /**
     * button press event handler
     * */
    onButtonClick = (type) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'signup':
                this.updateInfo();
                break;
            case 'login':
                navigate('AuthForm');
                break;
            default:
                break;
        }
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <View style={{width: '100%'}}>
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <View style={styles.logoOuter}>
                            <Image source={Logo} resizeMode='contain'
                                   style={{width: '100%', height: '100%', borderRadius: 25}}/>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: '48.5%', alignItems: 'center'}}>
                                <InputItems
                                    placeholder={'First Name *'}
                                    value={this.state.firstName.value}
                                    onChangeText={this.onTextChange2('firstName')}
                                    errorMessage={!this.state.firstName.valid ? 'Invalid name' : null}
                                />
                            </View>
                            <View style={{width: '48.5%', alignItems: 'center'}}>
                                <InputItems
                                    placeholder={'Last Name *'}
                                    value={this.state.lastName.value}
                                    onChangeText={this.onTextChange2('lastName')}
                                    errorMessage={!this.state.lastName.valid ? 'Invalid name' : null}
                                />
                            </View>
                        </View>
                        <InputItems
                            placeholder={'Email Address *'}
                            onChangeText={this.onTextChange2('email')}
                            value={this.state.email.value}
                            errorMessage={!this.state.email.valid ? 'Invalid email' : null}
                        />
                        <View style={!this.state.numValid ? {
                            ...styles.textFieldContainer,
                            borderColor: 'red',
                        } : styles.textFieldContainer}>
                            <PhoneInput
                                textProps={{
                                    placeholder: 'Mobile Number *',
                                    returnKeyType: 'done',
                                    keyboardType: 'phone-pad',
                                    // onSubmitEditing: () => {
                                    //     this.this.updateInfo();
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
                                offset={25}
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

                        <CustomPicker
                            items={[
                                {label: 'Male', value: 'MALE'},
                                {label: 'Female', value: 'FEMALE'},
                            ]}
                            onChangeItem={(item) => {
                                this.onPicker('genderType', item.value);
                            }}
                            errorMessage={!this.state.genderType.valid ? 'Please select the gender' : null}
                        />

                        {/* <InputItems
                        refer={input => this.password = input}
                        placeholder={'Password *'}
                        value={this.state.password.value}
                        onChangeText={this.onTextChange2('password')}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        secureTextEntry={true}
                        onSubmitEditing={() => {
                            this.confirmPW.focus();
                        }}
                        errorMessage={!this.state.password.valid ? 'Invalid password' : null}
                    />

                    <InputItems
                        refer={input => this.confirmPW = input}
                        placeholder={'Confirm Password *'}
                        value={this.state.confirmPW.value}
                        onChangeText={this.onTextChange2('confirmPW')}
                        returnKeyType={'done'}
                        secureTextEntry={true}
                        onSubmitEditing={() => {
                            this.referralCode.focus();
                        }}
                        errorMessage={!this.state.confirmPW.valid ? this.state.message : null}
                    /> */}

                        <View style={{justifyContent: 'flex-start', marginTop: 10, width: '95%'}}>
                            <Text style={{
                                ...styles.textStyle,
                                marginLeft: 5,
                                color: Color.inputBorderColor,
                                fontSize: 13,
                            }}>Add a referral code if you have any to get a discount</Text>
                        </View>

                        <InputItems
                            refer={input => this.referralCode = input}
                            placeholder={'Referral Code'}
                            value={this.state.referralCode.value}
                            onChangeText={this.onTextChange2('referralCode')}
                            returnKeyType={'done'}
                            errorMessage={!this.state.referralCode.valid ? this.state.referralCodeMsg : null}
                        />

                        {/*<TouchableOpacity style={styles.btnSignUp} onPress={() => this.onButtonClick('signup')}>*/}
                        {/*<Text style={styles.btnContent}>Sign Up </Text>*/}
                        {/*</TouchableOpacity>*/}

                        <Button
                            text="Sign Up"
                            loading={this.state.loading}
                            onPress={() => this.onButtonClick('signup')}
                        />

                        <View style={{marginTop: 10, flexDirection: 'row', marginBottom: '5%'}}>
                            <Text style={styles.textStyle}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => this.onButtonClick('login')}>
                                <Text style={{...styles.textStyle, color: Color.darkblue, marginLeft: 5}}>Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnSignUp: {
        backgroundColor: Color.black,
        width: '95%',
        height: 55,
        borderRadius: 10,
        marginTop: '15%',
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
        fontFamily: Font.SemiBold,
    },
    textStyle: {
        color: Color.black,
        fontFamily: Font.Medium,
    },
    textFieldContainer: {
        width: '95%',
        height: 55,
        marginTop: '5%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Color.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color.softlightGray,
    },
    picker: {
        width: '95%',
    },
    flagContainer: {
        width: 1,
        height: '100%',
        position: 'absolute',
        left: 65,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: Color.softlightGray,
    },
    logoOuter: {
        width: 107,
        height: 107,
        backgroundColor: Color.white,
        borderRadius: 25,
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginVertical: '8%',
    },
});

const mapStateToProps = (state) => ({
    asGuestUser: state.user.asGuestUser,
    navigationParams: state.user.navigationParams,
    userId: state.user.userId,
});

const mapDispatchToProps = dispatch => {
    return {
        updateActiveRoute: activeRoute => dispatch(actionTypes.updateActiveRoute(activeRoute)),
        checkGuestUser: asGuestUser => dispatch(actionTypes.checkGuestUser(asGuestUser)),
        checkHomeBack: homeBack => dispatch(actionTypes.checkHomeBack(homeBack)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
