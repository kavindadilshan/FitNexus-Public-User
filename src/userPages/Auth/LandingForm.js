import React from 'react';
import {
    View,
    Image,
    ScrollView,
    ImageBackground,
    Dimensions,
    StatusBar,
} from 'react-native';
import {styles as styles2, styles} from "./styles";
import Logo from '../../assets/Auth/CR_logo.png';
import {Color} from "../../constance/Colors";
import Button from '../../component/Actions/Button';
import Video from 'react-native-video';
import VideoFile from '../../assets/video.mp4'
import {HardwareBackAction} from "../../component/Actions/HardwareBackAction";
import axios from "../../axios/axios_token_less";
import {SubUrl} from "../../axios/server_url";
import Toast from "react-native-simple-toast";
import {AppToast} from "../../constance/AppToast";
import AsyncStorage from "@react-native-community/async-storage";
import {StorageStrings} from "../../constance/StorageStrings";
import Loading from "../../component/Loading/AuthLoading";
import {encryption} from "../../component/Encryption/Encrypt&Decrypt";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component {

    state = {
        password: {
            value: '',
            valid: true
        },
        cca2: 'LK',
        value: "",
        code: '94',
        numValid: true,
        loading: false,
        appleLoading: false,
        googleLoading: false,
        fbLoading: false,
        isProcessing: false,
        token: '',
        showAlert: false,
        socialMediaData: {},
    };

    componentDidMount() {
        this.props.navigation.addListener('willFocus', this.load);
    }

    load = () => {
        this.setState({showAlert: false})
        HardwareBackAction.setBackAction(() => {
            HardwareBackAction.exitApp();
        });
    };

    guestUserAuth = async (navigate) => {
        axios.get(SubUrl.guest_user_auth)
            .then(async response => {
                if (response.data.success) {
                    this.setState({isProcessing:false})
                    await AsyncStorage.setItem(StorageStrings.ACCESS_TOKEN, response.data.body.access_token);
                    await AsyncStorage.setItem(StorageStrings.REFRESH_TOKEN, response.data.body.refresh_token);
                    await AsyncStorage.setItem(StorageStrings.USER_ID, response.data.body.user.userDetails.id.toString());
                    await AsyncStorage.setItem(StorageStrings.FIRST_NAME, encryption.encrypt(response.data.body.user.userDetails.firstName));
                    await AsyncStorage.setItem(StorageStrings.LAST_NAME,encryption.encrypt(response.data.body.user.userDetails.lastName));
                    if (response.data.body.user.userDetails.gender !== null) {
                        await AsyncStorage.setItem(StorageStrings.GENDER,encryption.encrypt(response.data.body.user.userDetails.gender));
                    }
                    navigate('GuestHomeForm')
                } else {
                    this.setState({isProcessing:false})
                    Toast.show('Social sign in failed!');
                }
            })
            .catch(error => {
                this.setState({isProcessing:false})
                AppToast.networkErrorToast();
            })
    }


    /**
     * buttons press event handler
     * */
    onButtonClick = (type) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'register':
                navigate('SignOutForm');
                break;
            case 'signIn':
                navigate('AuthForm');
                break;
            case 'guest':
                // navigate('GuestHomeForm');
                this.setState({isProcessing:true})
                this.guestUserAuth(navigate)
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

                    <View style={{zIndex: 3, alignItems: 'center', height: screenHeight}}>

                        <View style={styles.logoOuter}>
                            <Image source={Logo} resizeMode='contain'
                                   style={{width: '100%', height: '100%', borderRadius: 25}}/>
                        </View>


                        <View style={{width: '100%', alignItems: 'center', position: 'absolute', bottom: 45}}>

                            <View style={{flexDirection: 'row', width: '95%', marginBottom: 15}}>
                                <View style={{width: '50%', alignItems: 'flex-start'}}>
                                    <Button
                                        text="Sign in"
                                        loading={this.state.loading}
                                        onPress={() => this.onButtonClick('signIn')}
                                    />
                                </View>
                                <View style={{width: '50%', alignItems: 'flex-end'}}>
                                    <Button
                                        text="Register"
                                        loading={this.state.loading}
                                        onPress={() => this.onButtonClick('register')}
                                    />
                                </View>

                            </View>
                        </View>
                        <View style={{width: '100%', alignItems: 'center', marginBottom: screenHeight / 100 * 10}}></View>
                    </View>
                </ScrollView>

                <Loading isVisible={this.state.isProcessing} />

            </View>
        );
    }


}

export default App;
