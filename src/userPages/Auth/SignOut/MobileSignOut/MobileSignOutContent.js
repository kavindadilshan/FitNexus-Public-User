import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Platform, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import InputItems from '../../../../component/Actions/InputItems'
import {Color} from "../../../../constance/Colors";
import * as Validation from '../../../Validation/Validation';
import {StorageStrings} from "../../../../constance/StorageStrings";
import axios from '../../../../axios/axios_token_less';
import {SubUrl} from "../../../../axios/server_url";
import Button from "../../../../component/Actions/Button";
import Logo from '../../../../assets/Auth/CR_logo.png'
import {AppToast} from "../../../../constance/AppToast";
import CustomPicker from "../../../../component/CustomPicker/CustomPicker";
import Toast from 'react-native-simple-toast';
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import {Api} from "../../../../constance/AppAPIKeys";
import axios3 from "../../../../axios/axios";
import {encryption} from "../../../../component/Encryption/Encrypt&Decrypt";
import * as actionTypes from "../../../../store/actions";
import {connect} from "react-redux";
import {NavigationActions, StackActions} from "react-navigation";

class App extends React.Component {

    state = {
        firstName: {
            value: '',
            valid: true
        },
        lastName: {
            value: '',
            valid: true
        },
        email: {
            value: '',
            valid: true
        },
        password: {
            value: '',
            valid: true
        },
        confirmPW: {
            value: '',
            valid: true
        },
        genderType: {
            value: 'Gender',
            valid: true
        },
        referralCode: {
            value: '',
            valid: true
        },
        loading: false,
        massage: 'Invalid Email',
        message1: '',
        referralCodeMsg: '',
        token: ''
    };

    saveInputState = async (navigate) => {
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        const email = this.state.email;
        const password = this.state.password;
        const confirmPW = this.state.confirmPW;
        const gender = this.state.genderType;

        firstName.valid = Validation.textFieldValidator(firstName.value.trim(), 1);
        lastName.valid = Validation.textFieldValidator(lastName.value.trim(), 1);
        email.valid = Validation.emailValidator(email.value.trim());
        password.valid = Validation.specialPwValidator(password.value.trim());
        gender.valid = Validation.genderValidator(this.state.genderType.value);


        if (confirmPW.value === "") {
            this.setState({message1: 'Confirm Password text is missing'});
            confirmPW.valid = false
        } else if (password.value === confirmPW.value) {
            confirmPW.valid = true
        } else {
            this.setState({message1: 'Not match with new password'});
            confirmPW.valid = false
        }

        this.setState({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPW: confirmPW,
            genderType: gender
        });

        const {navigation} = this.props;
        const mobile = navigation.getParam('mobile');
        const otp = navigation.getParam('otp');

        if (this.state.firstName.valid && this.state.lastName.valid && this.state.email.valid && this.state.password.valid && this.state.confirmPW.valid) {
            const data = {
                firstName: this.state.firstName.value,
                lastName: this.state.lastName.value,
                email: this.state.email.value,
                password: this.state.password.value,
                mobile: mobile,
                otpDetails: {
                    otp: otp,
                },
                gender: this.state.genderType.value,
                country: await AsyncStorage.getItem(StorageStrings.COUNTRY),
                referralFrom: this.state.referralCode.value !== '' ? this.state.referralCode.value : null
            }
            this.setState({loading: true})
            axios.post(SubUrl.register_mobile_user, data)
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
                        if (response.data.body.user.userDetails.referralCode !== null) {
                            await AsyncStorage.setItem(StorageStrings.INVITE_CODE, encryption.encrypt(response.data.body.user.userDetails.referralCode))
                        }
                        if (response.data.body.user.userDetails.authType !== null) {
                            await AsyncStorage.setItem(StorageStrings.AUTH_TYPE, response.data.body.user.userDetails.authType)
                        }
                        this.resetNavigationAction('', '');
                        this.setState({loading: false})
                    } else {
                        if (response.data.message === 'Email already exists') {
                            this.setState({
                                massage: 'Email already exists',
                                email: {
                                    valid: false
                                },
                                loading: false
                            })
                            this.setState({loading: false})
                        } else if (response.data.message === 'Invalid referral code') {
                            this.setState({
                                loading: false,
                                referralCodeMsg: response.data.message,
                                referralCode: {value: '', valid: false}
                            })
                        } else {
                            this.setState({loading: false});
                            Toast.show(response.data.message);
                        }
                    }


                })
                .catch(error => {
                    this.setState({loading: false})
                    if (error.response.status === 401) {
                        AppToast.serverErrorToast();
                    } else {
                        AppToast.networkErrorToast()
                    }
                })
        }
    }


    /**
     * rest navigation
     * @param page
     * @param parameters
     */
    resetNavigationAction = (page, parameters) => {

        if (page !== '') {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({
                    routeName: page,
                    params: parameters
                })],
            });
            this.props.navigation.dispatch(resetAction);
        } else {
            this.props.navigation.navigate('Home');
        }
    }


    /**
     * state changer in text fields
     * @param name
     * @param length
     * @returns {Function}
     */
    onTextChange = (name, length) => val => {
        const item = this.state[name];
        item.value = val;
        item.valid = true;
        this.setState({
            [name]: item,
        });
    };

    onTextChange2 = (name) => val => {
        if (val.toString() === '') {
            const item = this.state[name];
            item.value = '';
            this.setState({
                [name]: item,
            });
        } else if (/^[A-Za-z]+$/.test(val.toString())) {
            const item = this.state[name];
            item.value = val;
            item.valid = true;
            this.setState({
                [name]: item,
            });
        }

    };

    onPicker = (type, value) => {
        if (value !== 'Gender') {
            this.setState({
                [type]: {
                    value: value,
                    valid: true
                },
            });
        }
    };

    onButtonClick = (type) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'signup':
                // navigate('conditionsForm');
                this.saveInputState(navigate);
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
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <ScrollView style={{width: '100%'}}>
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <View style={styles.logoOuter}>
                            <Image source={Logo} resizeMode='contain'
                                   style={{width: '100%', height: '100%', borderRadius: 25}}/>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: '5%'}}>
                            <View style={{width: '48.5%', height: 55, alignItems: 'center'}}>
                                <InputItems
                                    placeholder={'First Name *'}
                                    value={this.state.firstName.value}
                                    onChangeText={this.onTextChange2('firstName')}
                                    returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                                    onSubmitEditing={() => {
                                        this.lastname.focus();
                                    }}
                                    errorMessage={!this.state.firstName.valid ? 'Invalid firstname' : null}
                                />
                            </View>
                            <View style={{width: '48.5%', height: 55, alignItems: 'center'}}>
                                <InputItems
                                    refer={input => this.lastname = input}
                                    placeholder={'Last Name *'}
                                    value={this.state.lastName.value}
                                    onChangeText={this.onTextChange2('lastName')}
                                    returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                                    onSubmitEditing={() => {
                                        this.email.focus();
                                    }}
                                    errorMessage={!this.state.lastName.valid ? 'Invalid lastname' : null}
                                />
                            </View>
                        </View>
                        <InputItems
                            refer={input => this.email = input}
                            placeholder={'Email Address *'}
                            value={this.state.email.value}
                            onChangeText={this.onTextChange('email')}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onSubmitEditing={() => {
                                this.password.focus();
                            }}
                            errorMessage={!this.state.email.valid ? this.state.massage : null}
                        />
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
                        <InputItems
                            refer={input => this.password = input}
                            placeholder={'Password *'}
                            value={this.state.password.value}
                            onChangeText={this.onTextChange('password')}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            secureTextEntry={true}
                            onSubmitEditing={() => {
                                this.confirmPW.focus();
                            }}
                            errorMessage={!this.state.password.valid ? 'Password must be at least 8 characters and contain atleast one of the following: uppercase letters, lowercase letters, numbers, andsymbols.' : null}
                        />

                        <InputItems
                            refer={input => this.confirmPW = input}
                            placeholder={'Confirm Password *'}
                            value={this.state.confirmPW.value}
                            onChangeText={this.onTextChange('confirmPW')}
                            returnKeyType={'done'}
                            secureTextEntry={true}
                            onSubmitEditing={() => {
                                this.referralCode.focus();
                            }}
                            errorMessage={!this.state.confirmPW.valid ? this.state.message1 : null}
                        />
                        <View style={{justifyContent: 'flex-start', marginTop: 10, width: '95%'}}>
                            <Text style={{
                                ...styles.textStyle,
                                marginLeft: 5,
                                color: Color.inputBorderColor,
                                fontSize: 13
                            }}>Add a referral code if you have any to get a discount</Text>
                        </View>

                        <InputItems
                            refer={input => this.referralCode = input}
                            placeholder={'Referral Code'}
                            value={this.state.referralCode.value}
                            onChangeText={this.onTextChange('referralCode')}
                            onSubmitEditing={() => {
                                this.onButtonClick('signup');
                            }}
                            errorMessage={!this.state.referralCode.valid ? this.state.referralCodeMsg : null}
                        />

                        <Button
                            text="Sign Up"
                            loading={this.state.loading}
                            onPress={() => this.onButtonClick('signup')}
                        />

                        <View style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            marginBottom: Platform.OS !== 'android' ? '30%' : '5%'
                        }}>
                            <Text style={styles.textStyle}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => this.onButtonClick('login')}>
                                <Text style={{...styles.textStyle, color: Color.darkblue, marginLeft: 5}}>Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
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
        fontFamily: 'Gilroy-SemiBold'
    },
    textStyle: {
        color: Color.black,
        fontFamily: 'Gilroy-Medium'
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
        borderColor: Color.softlightGray
    },
    textFieldContainerForGender: {
        width: '95%',
        marginTop: '5%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Color.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C6C6C6'
    },
    picker: {
        width: '100%',
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
})

const mapStateToProps = (state) => ({
    asGuestUser: state.user.asGuestUser,
    navigationParams: state.user.navigationParams,
    userId:state.user.userId
});

const mapDispatchToProps = dispatch => {
    return {
        checkGuestUser: asGuestUser => dispatch(actionTypes.checkGuestUser(asGuestUser)),
        checkHomeBack: homeBack => dispatch(actionTypes.checkHomeBack(homeBack)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
