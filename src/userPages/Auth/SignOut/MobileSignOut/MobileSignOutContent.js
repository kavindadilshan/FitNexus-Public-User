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
