import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar} from 'react-native';
import eye from '../../../assets/Auth/eye.png';
import eyeHide from '../../../assets/Auth/eyeHidden.png';
import {Input} from 'react-native-elements';
import {Color} from "../../../constance/Colors";
import * as Validation from '../../Validation/Validation';
import axios from '../../../axios/axios_token_less';
import {SubUrl} from "../../../axios/server_url";
import Button from '../../../component/Actions/Button';
import Toast from 'react-native-simple-toast';
import {Font} from "../../../constance/AppFonts";
import {AppToast} from "../../../constance/AppToast";

class App extends React.Component {
    state = {
        newPW: {
            value: '',
            valid: true
        },
        confirmPW: {
            value: '',
            valid: true
        },
        hidePassword: true,
        hidePassword2: true,
        mobile:'',
        otp:'',
        loading:false
    };
    componentWillMount(){
        const { navigation } = this.props;
        const mobile=navigation.getParam('mobile');
        const otp=navigation.getParam('otp');
        this.setState({
            mobile:mobile,
            otp:otp
        })
    }

    /**
     * text change handler for textfield
     * @param name
     */
    onTextChange = (name) => val => {
        const item = this.state[name];
        item.value = val;
        item.valid=true;
        this.setState({
            [name]: item,
        });
    };

    /**
     * check validations
     * forgot password endpoint integration
     * @returns {Promise<void>}
     */
    updateInputState=async ()=>{
        const newPW=this.state.newPW;
        const confirmPW=this.state.confirmPW;

        newPW.valid=Validation.specialPwValidator(this.state.newPW.value.trim());
        confirmPW.valid = newPW.value === confirmPW.value;

        this.setState({
            newPW:newPW,
            confirmPW:confirmPW
        });
        if (this.state.newPW.valid && this.state.confirmPW.valid) {
            const data={
                mobile:this.state.mobile,
                password:this.state.newPW.value,
                otpDetails:{
                    otp:this.state.otp
                }
            };
            this.setState({loading:true});
            axios.put(SubUrl.authenticate_forgot_password,data)
                .then(async response=>{
                    if (response.data.success) {
                        this.setState({loading:false});
                        Toast.show('Your Password was reset');
                        const {navigate} = this.props.navigation;
                        navigate('AuthForm');
                    }else {
                        this.setState({loading:false});
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error=>{
                    this.setState({loading:false});
                    AppToast.networkErrorToast();
                })
        }
    };

    /**
     * show hide new  password
     */
    managePasswordVisibility = () => {
        this.setState({hidePassword: !this.state.hidePassword});
    };

    /**
     * show hide confirm password
     */
    managePasswordVisibility2 = () => {
        this.setState({hidePassword2: !this.state.hidePassword2});
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <View style={{width:'100%',alignItems:'flex-start',marginBottom:'5%'}}>
                    <Text style={styles.headerTitle}>Please reset your password</Text>
                    <Text style={styles.subHeadTitle}>Reset password to a password you prefer</Text>
                </View>
                <View style={styles.textBoxBtnHolder}>
                    <Input
                        refer={input => this.newPW = input}
                        inputContainerStyle={styles.inputStyle}
                        inputStyle={styles.inputTextStyle}
                        placeholder='New Password'
                        placeholderTextColor="#c0c0c0"
                        underlineColorAndroid="transparent"
                        onChangeText={this.onTextChange('newPW')}
                        value={this.state.newPW.value}
                        secureTextEntry={this.state.hidePassword}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        autoCapitalize='none'
                    />
                    <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn}
                                      onPress={this.managePasswordVisibility}>
                        <Image source={(this.state.hidePassword) ? eye : eyeHide} style={styles.btnImage}/>
                    </TouchableOpacity>
                </View>
                {this.state.newPW.valid?null:(
                    <View style={{alignItems:'flex-start',width:'100%',paddingRight:5}}>
                        <Text style={{color:'red',marginLeft:15,fontSize:12}}>Password must be at least 8 characters and contain at least one of the following: uppercase letters, lowercase letters, numbers, and symbols.</Text>
                    </View>
                )}
                <View style={styles.textBoxBtnHolder}>
                    <Input
                        refer={input => this.confirmPW = input}
                        inputContainerStyle={styles.inputStyle}
                        inputStyle={styles.inputTextStyle}
                        placeholder='Confirm Password'
                        placeholderTextColor="#c0c0c0"
                        underlineColorAndroid="transparent"
                        onChangeText={this.onTextChange('confirmPW')}
                        value={this.state.confirmPW.value}
                        secureTextEntry={this.state.hidePassword2}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        autoCapitalize='none'
                    />
                    <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn}
                                      onPress={this.managePasswordVisibility2}>
                        <Image source={(this.state.hidePassword2) ? eye : eyeHide} style={styles.btnImage}/>
                    </TouchableOpacity>
                </View>
                {this.state.confirmPW.valid?null:(
                    <View style={{alignItems:'flex-start',width:'100%'}}>
                        <Text style={{color:'red',marginLeft:15,fontSize:12}}>Password not matching</Text>
                    </View>
                )}
                <View style={{alignItems:'center',width:'100%',position:'absolute',bottom:35}}>
                    <Button
                        text="Reset Password"
                        loading={this.state.loading}
                        onPress={() => this.updateInputState()}
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
    textBoxBtnHolder:
        {
            height:55,
            width: '95%',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            borderColor: Color.softlightGray,
            borderWidth: 1,
            marginVertical: '3%'
        },

    visibilityBtn:
        {
            position: 'absolute',
            right: 3,
            height: 40,
            width: 35,
        },

    btnImage:
        {
            resizeMode: 'contain',
            height: '100%',
            width: '100%',
        },
    inputStyle: {
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
        // marginBottom:'3%'
    },
    inputTextStyle: {
        color: Color.black
    },
    btnStyle:{
        backgroundColor: Color.black,
        width:'95%',
        height:55,
        borderRadius:10,
        marginTop:'70%',
        justifyContent:'center',
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
    btnContent:{
        color:Color.white,
        fontFamily:Font.SemiBold
    },
});

export default App;
