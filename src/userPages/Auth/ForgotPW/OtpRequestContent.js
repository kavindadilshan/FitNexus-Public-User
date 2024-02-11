import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PhoneInput from 'react-native-phone-input'
import { Color } from "../../../constance/Colors";
import axios from "../../../axios/axios_token_less";
import { SubUrl } from "../../../axios/server_url";
import { StorageStrings } from "../../../constance/StorageStrings";
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';
import CountryPicker from "../../../component/Lib/react-native-country-picker-modal";
import Toast from 'react-native-simple-toast';
import Button from '../../../component/Actions/Button';
import { Font } from "../../../constance/AppFonts";
import { AppToast } from "../../../constance/AppToast";
import { styles as styles2 } from "../styles";
import * as Validation from '../../Validation/Validation';

class App extends React.Component {
    state = {
        cca2: 'LK',
        valid: "",
        code: '94',
        numValid: true,
        loading: false,
        mobile: {
            valid: true
        }
    };
    componentDidMount() {
        this.onPressFlag = this.onPressFlag.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.setState({
            pickerData: this.phone.getPickerData(),
        });
    }

    /**
     * check mobile number validation
     * otp request endpoint integration
     * */
    updateInfo() {
        this.setState({
            value: this.phone.getValue(),
        });
        const valid = this.phone.getValue();
        const number = valid.substring(1);

        const mobile = this.state.mobile;
        mobile.valid = Validation.mobileNumberValidator(number.trim());
        this.setState({ mobile: mobile })

        if (this.phone.isValidNumber() || this.state.mobile.valid) {
            this.setState({ loading: true, numValid: true });
            const data = {
                mobile: this.phone.getValue(),
            };
            axios.patch(SubUrl.authenticate_otp_request, data)
                .then(async response => {
                    console.log(response.data);
                    if (response.data.success) {
                        await AsyncStorage.setItem(StorageStrings.USER_ROLE, 'forgotPWUser');
                        const { navigate } = this.props.navigation;
                        navigate('PinVerifyForm', {
                            mobile: this.phone.getValue(),
                        });
                        this.props.updateActiveRoute('ForgotPWForm');
                    } else {
                        Toast.show(response.data.message);
                    }
                    this.setState({ loading: false });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    AppToast.networkErrorToast();
                })
        } else {
            this.setState({ numValid: false })
        }

    }

    /**
     * open model for change flag
     * */
    onPressFlag() {
        this.countryPicker.openModal();
    }

    /**
     * flag selection
     * */
    selectCountry(country) {
        this.phone.selectCountry(country.cca2.toLowerCase());
        this.setState({ cca2: country.cca2, code: country.callingCode });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white} />
                <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: '5%' }}>
                    <Text style={styles.headerTitle}>Enter Your Mobile Number</Text>
                    <Text style={styles.subHeadTitle}>Please enter your mobile number</Text>
                </View>

                <View style={!this.state.numValid ? { ...styles.textFieldContainer, borderColor: 'red' } : styles.textFieldContainer}>
                    <PhoneInput
                        textProps={{
                            placeholder: 'Mobile Number',
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
                            this.setState({ value: ref, numValid: true })
                        }}
                        textStyle={styles2.phoneInputTextStyle}
                        // onSelectCountry={()=>this.setState({code:this.phone.getCountryCode()})}
                        style={{ width: '100%' }}
                        offset={20}
                        // pickerItemStyle={{backgroundColor:'red'}}
                        allowZeroAfterCountryCode={false}
                        flagStyle={{ width: 50, height: 25, marginLeft: 10 }}
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
                        <View />
                    </CountryPicker>
                    <View style={!this.state.numValid ? { ...styles.flagContainer, borderRightColor: 'red' } : styles.flagContainer}>
                        {/*<Text style={{fontSize: 18}}>(+{this.state.code})</Text>*/}
                    </View>
                </View>

                {this.state.numValid ? null : (
                    <View style={{ alignItems: 'flex-start', width: '100%' }}>
                        <Text style={{ color: 'red', marginLeft: 30, fontSize: 12 }}>Invalid number</Text>
                    </View>
                )}

                {/*<TouchableOpacity style={styles.btnStyle} onPress={() => this.updateInfo()}>*/}
                {/*<Text style={styles.btnContent}>Request OTP</Text>*/}
                {/*</TouchableOpacity>*/}
                <View style={{ alignItems: 'center', width: '100%', marginTop: '45%' }}>
                    <Button
                        text="Send"
                        loading={this.state.loading}
                        onPress={() => this.updateInfo()}
                    />
                </View>


            </View>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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
        lineHeight: 25
    },
    textFieldContainer: {
        width: '95%',
        height: 57,
        marginTop: '5%',
        marginBottom: '3%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Color.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color.softlightGray,
    },
    flagContainer: {
        width: 1,
        height: '100%',
        position: 'absolute',
        left: 65,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: Color.softlightGray
    },
    btnStyle: {
        backgroundColor: Color.black,
        width: '95%',
        height: 55,
        borderRadius: 10,
        marginTop: '90%',
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
})

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return {
        updateActiveRoute: activeRoute => dispatch(actionTypes.updateActiveRoute(activeRoute)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

