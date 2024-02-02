/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Image, Text, Dimensions, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import RNRestart from 'react-native-restart';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import SplashScreen2 from './src/userPages/SplashScreen';
import LandingForm from './src/userPages/Auth/LandingForm';
import AuthForm from './src/userPages/Auth/Auth';
import SignOutForm from './src/userPages/Auth/SignOut/SignOut';
import PinVerifyForm from './src/userPages/Auth/SignOut/PinVerify/PinVerify';
import MobileSignOutForm from './src/userPages/Auth/SignOut/MobileSignOut/MobileSignOut';
import SocialMediaSignUpForm from './src/userPages/Auth/SignOut/SocialMediaSignUp/SocialMediaSignUp';
import HomeScreen from './src/userPages/Home/Home';
import PurchasedScreen from './src/userPages/Purchased/Purchased';
import NotificationScreen from './src/userPages/Notifications/Notifications';
import ProfileScreen from './src/userPages/Profile/Profile';
import ConditionsForm from './src/userPages/Auth/Conditions/Conditions';
import SessionsForm from './src/userPages/Home/Classes/Explore/Sessions';
import SelectedDetailsForm from './src/userPages/Home/Classes/SelectedDetails/SelectedDetails';
import UpdatePasswordForm from './src/userPages/Profile/UpdateFiles/UpdatePassword';
import UpdateMobileForm from './src/userPages/Profile/UpdateFiles/UpdateMobile';
import UpdateEmailForm from './src/userPages/Profile/UpdateFiles/UpdateEmail';
import ForgotPWForm from './src/userPages/Auth/ForgotPW/ForgotPW';
import OtpRequestForm from './src/userPages/Auth/ForgotPW/OtpRequestForm';
import UpdateCardForm from './src/userPages/Profile/UpdateFiles/UpdateCard/UpdateCard';
import FitnessForm from './src/userPages/Home/Classes/FitnessForm/FitnessForm';
import ClassesDetailsForm from './src/userPages/Home/Classes/ClassesDetails/ClassesDetails';
import ReviewForm from './src/userPages/Home/Review/Review';
import TrainersForm from './src/userPages/Home/Trainers/Trainers';
import InstructorForm from './src/userPages/Home/Trainers/Instructor/InstructorForm';
import BusinessProfileForm from './src/userPages/Home/Business/BusinessProfile';
import CardAddedAlertForm from './src/component/Actions/CardAddedAlert';
import CheckOutForm from './src/userPages/Home/CheckOut/CheckOut';
import RateForm from './src/userPages/Home/Review/Rate';
import DualRatingForm from './src/userPages/Home/Review/RateBeforeCall/DualRate';
import UpCommingClassesForm from './src/userPages/Home/Classes/ClassesDetails/UpCommingClasses';
import InviteFriend from './src/userPages/Profile/InviteFriend';
import ViewMoreForm from './src/userPages/Home/ViewMore';
import HelpAndSupportForm from './src/userPages/Profile/Help&Support';
import YourInvitesForm from './src/userPages/Profile/YourInvites';
import UpdatePersonalInfo from './src/userPages/Profile/UpdateFiles/UpdatePersonalInformation';
import CardAddedFailForm from './src/component/Actions/CardAddedFailAlert';
import PackagesForm from './src/userPages/Home/Trainers/Instructor/Packages/Packages';
import GymProfileForm from './src/userPages/Home/Gyms/GymProfile';
import GymsForm from './src/userPages/Home/Gyms/Gyms';
import MembershipForm from './src/userPages/Home/Membership/Membership';
import MembershipCheckOutForm from './src/userPages/Home/Membership/CheckOut/MembershipCheckOut';
import MyMembershipsForm from './src/userPages/Profile/MyMemberships/MyMemberships';
import MembershipDetailsForm from './src/userPages/Profile/MyMemberships/MembershipDetails';
import BusinessMembershipsForm from './src/userPages/Home/Membership/BusinessMemberships';
import DayPassCheckOutForm from './src/userPages/Home/Gyms/CheckOut/DayPassCheckOut';
import CheckOut2Form from './src/userPages/Home/CheckOut/CheckOut2';
import ReserveSucessForm from './src/component/UIElement/ReserveSuccessForm';
import DayPassDetailsForm from './src/userPages/Home/Gyms/DaayPassDetails';
import HelpSubmitForm from './src/userPages/Profile/HelpSubmitForm';
import InstructorTypesForm from './src/userPages/Home/Trainers/InstructorTypes';
import ScheduleForm from './src/userPages/Home/Business/Schedule';
import PrivacyPolicyForm from './src/userPages/Profile/PrivacyPolicy';

import {connect} from 'react-redux';

import LeftIcon from './src/component/HeaderIcon/HeaderLeftIcon';
import RightCloseIcon from './src/component/HeaderIcon/HeaderRightCloseIcon';
import RightContIcon from './src/component/HeaderIcon/HeaderRightSessionsCount';
import RightInfoIcon from './src/component/HeaderIcon/HeaderRightInfoIcon';
import LeftHomeBackIcon from './src/component/HeaderIcon/HeaderLeftHomeIcon';
import {Color} from './src/constance/Colors';
import homeClick from './src/assets/BottomTabs/ClickedState/homeClick.png';
import purchasedClick from './src/assets/BottomTabs/ClickedState/purchasedClick.png';
import notificationClick from './src/assets/BottomTabs/ClickedState/notificationClick.png';
import profileClick from './src/assets/BottomTabs/ClickedState/profileClick.png';
import home from './src/assets/BottomTabs/IdleState/home.png';
import purchased from './src/assets/BottomTabs/IdleState/purchased.png';
import notification from './src/assets/BottomTabs/IdleState/notification.png';
import profile from './src/assets/BottomTabs/IdleState/profile.png';
import {Font} from './src/constance/AppFonts';
import {StorageStrings} from './src/constance/StorageStrings';
import SplashScreen from 'react-native-splash-screen';
import {PUBLIC_URL, SubUrl} from './src/axios/server_url';
import * as actionTypes from './src/store/actions';
import Loading from './src/component/Loading/Loading';
import AlertMassage from './src/component/Actions/AlertMassage2';
import {fetch} from 'react-native-ssl-pinning';

import Orientation from 'react-native-orientation';
import {Domains, ServerUrl} from "./src/constance/AppServerUrl";


const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export const styles = {
    header: {
        backgroundColor: '#fff',
        borderBottomWidth: 0,
        elevation: 0,
        height: screenHeight / 100 * 10,
    },
    header2: {
        backgroundColor: '#fff',
        borderBottomWidth: 0,
        elevation: 0,
        height: screenHeight / 100 * 5,
    },
    tabBarIcon: {
        width: 22,
        height: 22,
    },
    barStyle: {
        width: '100%',
        backgroundColor: Color.white,
    },
    notification: {
        backgroundColor: 'red',
        width: 13, height: 13,
        borderRadius: 1000,
        position: 'absolute',
        top: 1,
        right: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationCount: {
        color: Color.white,
        fontFamily: Font.Bold,
        fontSize: 7,
        marginLeft: 1,
    },
};
let count = 0;

class App extends React.Component {

    state = {
        continue: false,
        isNetworkDisabled: false
    };

    async componentDidMount() {
        SplashScreen.hide();
        if (Platform.OS === 'ios') {
            Orientation.lockToPortrait()
        }
        this.checkNetInfo();
        if (Platform.OS === 'android') {
            const domain = PUBLIC_URL !== ServerUrl.url ? Domains.prod : Domains.dev
            this.getKeyPinning(domain);
        }

    }


    checkNetInfo = () => {
        NetInfo.fetch().then(async state => {
            if (state.isConnected) {
                if (await AsyncStorage.getItem(StorageStrings.LOGGED) === 'true') {
                    this.props.checkOnlineClassVisibility(false);
                } else {
                    this.setState({continue: true});
                }
            } else {
                this.setState({isNetworkDisabled: true})
            }
        });
    }

    getKeyPinning = (domain) => {
        fetch(domain.url, {
            method: "GET",
            timeoutInterval: 10000, // milliseconds
            // your certificates array (needed only in android) ios will pick it automatically
            pkPinning: true,
            sslPinning: {
                certs: [domain.sha]
            },
            headers: {
                Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "e_platform": "mobile",
            }
        })
            .then(r => console.log(r))
            .catch(e => console.log(e))
    }

    hideAlert = () => {
        this.setState({isNetworkDisabled: false});
        RNRestart.Restart();
    }


    render() {
        return (
            <>
                <AppContainer2 screenProps={{count: this.props.notificationCount}}/>
                <Loading isVisible={this.props.payload}/>
                <AlertMassage
                    show={this.state.isNetworkDisabled}
                    message={"Something went wrong! Please check your connection"}
                    onCancelPressed={() => this.hideAlert()}
                />
            </>
        );
    }
}

export const BottomNavigator2 = createMaterialBottomTabNavigator({
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarLabel: <Text style={{fontFamily: Font.SemiBold}}>Home</Text>,
                tabBarIcon: ({tintColor, focused}) => (
                    <Image source={focused ? homeClick : home} style={styles.tabBarIcon} resizeMode={'contain'}/>
                ),
            },
        },
        Purchased: {
            screen: PurchasedScreen,
            navigationOptions: {
                tabBarLabel: <Text style={{fontFamily: Font.SemiBold}}>Purchases</Text>,
                tabBarIcon: ({tintColor, focused}) => (
                    <Image source={focused ? purchasedClick : purchased} style={styles.tabBarIcon} resizeMode={'contain'}/>
                ),
            },
        },
        Notifications: {
            screen: NotificationScreen,
            navigationOptions: ({navigation, navigationOptions, screenProps}) => {
                return {
                    // Step2. here use screenProps to retrieve the value passed in .
                    tabBarLabel: <Text style={{fontFamily: Font.SemiBold}}>Notifications</Text>,
                    tabBarIcon: ({tintColor, focused}) => (
                        <View>
                            <Image source={focused ? notificationClick : notification} style={styles.tabBarIcon}
                                   resizeMode={'contain'}/>
                            {screenProps.count !== 0 ? !focused ? (
                                <View style={styles.notification}>
                                    {screenProps.count <= 99 ? (
                                        <Text style={styles.notificationCount}>{screenProps.count}</Text>
                                    ) : (
                                        <Text style={styles.notificationCount}>99+</Text>
                                    )}

                                </View>
                            ) : null : null}

                        </View>
                    ),
                };
            },
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarLabel: <Text style={{fontFamily: Font.SemiBold}}>Profile</Text>,
                tabBarIcon: ({tintColor, focused}) => (
                    <Image source={focused ? profileClick : profile} style={styles.tabBarIcon} resizeMode={'contain'}/>
                ),
            },
        },
    },
    {
        initialRouteName: 'Home',
        activeColor: Color.black,
        inactiveColor: '#C7C7C7',
        barStyle: styles.barStyle,
        shifting: false,
    },
);

export const ContactStack2 = createStackNavigator({

    SplashScreen: {
        screen: SplashScreen2,
        navigationOptions: {
            header: null,
        },
    },

    conditionsForm: {
        screen: ConditionsForm,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
    },

    LandingForm: {
        screen: LandingForm,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
    },

    AuthForm: {
        screen: AuthForm,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },

    },

    SignOutForm: {
        screen: SignOutForm,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
    },
    PinVerifyForm: {
        screen: PinVerifyForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerRight: <RightCloseIcon navigation={navigation}/>,
            headerTitle: 'Verify',
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },
    MobileSignOutForm: {
        screen: MobileSignOutForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerRight: <RightCloseIcon navigation={navigation}/>,
            headerLeft: null,
        }),
    },
    SocialMediaSignUp: {
        screen: SocialMediaSignUpForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerRight: <RightCloseIcon navigation={navigation}/>,
            headerLeft: null,
        }),
    },
    BottomNavigation: {
        screen: BottomNavigator2,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
    },
    Sessions: {
        screen: SessionsForm,
        navigationOptions: ({navigation}) => ({
            // headerStyle: styles.header,
            // headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            // headerTitle: navigation.getParam('className', ''),
            // headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold, width: screenWidth / 100 * 75},
            header: null
        }),
    },

    SelectedDetails: {
        screen: SelectedDetailsForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            headerRight: <RightContIcon count1={navigation.getParam('maxJoiners', '')}
                                        count2={navigation.getParam('availableCount', '')}/>,
            headerTitle: 'Session',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    GymsForm: {
        screen: GymsForm,
        navigationOptions: ({navigation}) => ({
            // headerStyle: styles.header,
            // headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            // headerTitle: 'Gyms around you',
            // headerTitleStyle: {fontSize: 23, fontFamily: Font.SemiBold},
            header: null
        }),
    },
    GymProfileForm: {
        screen: GymProfileForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            headerTitle: navigation.getParam('gymName', ''),
            headerTitleStyle: {fontSize: 18, fontFamily: Font.SemiBold, width: screenWidth / 100 * 75},
        }),
    },
    MembershipForm: {
        screen: MembershipForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            headerTitle: 'Membership Packages',
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold, width: screenWidth / 100 * 75},
        }),
    },
    MembershipCheckOutForm: {
        screen: MembershipCheckOutForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'CheckOut',
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },

    MembershipDetailsForm: {
        screen: MembershipDetailsForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Membership Details',
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },
    ReviewForm: {
        screen: ReviewForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Reviews',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    RateForm: {
        screen: RateForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: null,
            headerRight: <RightCloseIcon navigation={navigation}/>,
            headerTitle: 'Write a Review',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    DualRatingForm: {
        screen: DualRatingForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerRight: <RightCloseIcon navigation={navigation}/>,
            headerTitle: 'Write a Review',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    UpdatePasswordForm: {
        screen: UpdatePasswordForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },
    UpdateMobileForm: {
        screen: UpdateMobileForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },
    UpdateEmailForm: {
        screen: UpdateEmailForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },
    UpdateCardForm: {
        screen: UpdateCardForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerTitle: 'My Cards',
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    MyMembershipsForm: {
        screen: MyMembershipsForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },
    PrivacyPolicyForm: {
        screen: PrivacyPolicyForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },

    OtpRequestForm: {
        screen: OtpRequestForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerRight: <RightCloseIcon navigation={navigation}/>,
            headerTitle: 'Forgot Password',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },

    ForgotPWForm: {
        screen: ForgotPWForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerRight: <RightCloseIcon navigation={navigation}/>,
            headerTitle: 'Forgot Password',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    FitnessForm: {
        screen: FitnessForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Fitness Categories',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    ClassesDetailsForm: {
        screen: ClassesDetailsForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            headerTitle: 'Class',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    InstructorForm: {
        screen: InstructorForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            headerTitle: navigation.getParam('trainerName', ''),
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold, width: screenWidth / 100 * 75},
        }),
    },
    PackagesForm: {
        screen: PackagesForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerTitle: 'Packages',
            headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },

    TrainersForm: {
        screen: TrainersForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            headerRight: <RightInfoIcon navigation={navigation}/>,
            headerTitle: 'Online Coaching',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold},
        }),
    },
    BusinessProfile: {
        screen: BusinessProfileForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: navigation.getParam('BusinessName', ''),
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold, width: screenWidth / 100 * 75},
        }),
    },
    ScheduleForm: {
        screen: ScheduleForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: navigation.getParam('BusinessName', ''),
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold, width: screenWidth / 100 * 75},
        }),
    },
    CardAddedForm: {
        screen: CardAddedAlertForm,
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
    },
    ReserveSuccessForm: {
        screen: ReserveSucessForm,
        navigationOptions: {
            header: null,
        },
    },
    CardAddedFailForm: {
        screen: CardAddedFailForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: null,
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    CheckOutForm: {
        screen: CheckOutForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Checkout',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    CheckOut2Form: {
        screen: CheckOut2Form,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Checkout',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    UpCommingClassesForm: {
        screen: UpCommingClassesForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Upcoming Classes',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    InviteFriendForm: {
        screen: InviteFriend,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },
    ViewMoreForm: {
        screen: ViewMoreForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: navigation.getParam('role', ''),
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold, width: screenWidth / 100 * 75},
        }),
    },
    HelpAndSupportForm: {
        screen: HelpAndSupportForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },
    YourInvitesForm: {
        screen: YourInvitesForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold},
        }),
    },
    UpdatePersonalInfo: {
        screen: UpdatePersonalInfo,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Profile',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    BusinessMembershipsForm: {
        screen: BusinessMembershipsForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftHomeBackIcon navigation={navigation}/>,
            headerTitle: navigation.getParam('BusinessName', ''),
            headerTitleStyle: {fontSize: 18, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    DayPassCheckOutForm: {
        screen: DayPassCheckOutForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Checkout',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    DayPassDetailsForm: {
        screen: DayPassDetailsForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Day Pass Details',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    HelpSubmitForm: {
        screen: HelpSubmitForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: null,
            headerRight: <RightCloseIcon navigation={navigation}/>,
            headerTitle: 'Any questions?',
            headerTitleStyle: {fontSize: 20, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },
    InstructorTypesForm: {
        screen: InstructorTypesForm,
        navigationOptions: ({navigation}) => ({
            headerStyle: styles.header,
            headerLeft: <LeftIcon navigation={navigation}/>,
            headerTitle: 'Coach Categories',
            headerTitleStyle: {fontSize: 25, fontFamily: Font.SemiBold, width: '100%'},
        }),
    },


}, {
    headerLayoutPreset: 'center',

});


const AppContainer2 = createAppContainer(ContactStack2);

const mapStateToProps = (state) => ({
    notificationCount: state.user.notificationCount,
    visible: state.user.visible,
    status: state.user.status,
    payload: state.user.payload,
});

const mapDispatchToProps = dispatch => {
    return {
        checkOnlineClassVisibility: visible => dispatch(actionTypes.checkOnlineClassVisibility(visible)),
        sdkInitialized: init => dispatch(actionTypes.sdkInitialized(init)),
        fetchEndpoint: fetch => dispatch(actionTypes.fetchEndpoint(fetch)),
        changeLatitude: latitude => dispatch(actionTypes.changeLatitude(latitude)),
        changeLongitude: longitude => dispatch(actionTypes.changeLongitude(longitude)),
        fetchOnlineClasses: onlineFetch => dispatch(actionTypes.fetchOnlineClasses(onlineFetch)),
        fetchOfflineClasses: offlineFetch => dispatch(actionTypes.fetchOfflineClasses(offlineFetch)),
        fetchTrainer: trainerFetch => dispatch(actionTypes.fetchTrainer(trainerFetch)),
        setLoading: (payload) => dispatch(actionTypes.setLoading(payload)),
        checkCorporateState: (corporateState) => dispatch(actionTypes.checkCorporateState(corporateState)),
        setCorporateName: (corporateName) => dispatch(actionTypes.setCorporateName(corporateName))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
