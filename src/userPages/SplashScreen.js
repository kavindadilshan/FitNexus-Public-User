import React from 'react';
import {View, Image, Dimensions, Vibration, Platform, Linking, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {StorageStrings} from '../constance/StorageStrings';
import image from '../assets/Auth/CR_logo.png';
import OneSignal from 'react-native-onesignal';
import {Api} from '../constance/AppAPIKeys';
import * as actionTypes from '../store/actions';
import {connect} from 'react-redux';
import {PUBLIC_URL, SubUrl} from '../axios/server_url';
import {ServerUrl} from '../constance/AppServerUrl';
import {Color} from "../constance/Colors";

const ONE_SECOND_IN_MS = 1000;

const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
];

class App extends React.Component {


    constructor(props: P, context: any) {
        super(props, context);
        this.state = {
            showCallModal: false,
            callData: {},
            callDetails: {},
            timePassed: false,
            showAlert: false,
            count: false,
            showReviewAlert: false,
        };
    }

    async componentWillMount() {

        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            OneSignal.setLogLevel(6, 0);

            OneSignal.setAppId(PUBLIC_URL !== ServerUrl.prod_url ? Api.oneSignal : Api.oneSignal_prod)
            OneSignal.promptForPushNotificationsWithUserResponse();


            //Method for handling notifications received while app in foreground
            OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
                console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
                let notification = notificationReceivedEvent.getNotification();
                console.log("notification: ", notification);
                const notificationData = notification.additionalData
                console.log("additionalData: ", notificationData);

                // Complete with null means don't show a notification.
                notificationReceivedEvent.complete(notification);
            });

            //Method for handling notifications opened
            OneSignal.setNotificationOpenedHandler(notificationOpenedEvent => {
                console.log("OneSignal: notification opened:", notificationOpenedEvent);
                const notificationData = notificationOpenedEvent?.notification.additionalData
                console.log("additionalData: ", notificationData);
            });

            OneSignal.addSubscriptionObserver(event => {
                console.log("OneSignal: subscription changed:", event);
                if (event?.to.userId !== null && event?.to.userId !== undefined) {
                    this.props.changeOneSignalUserId(event.to.userId.toString());
                }
            });
            OneSignal.addPermissionObserver(event => {
                console.log("OneSignal: permission changed:", event);
            });

            //get device Ids
            const device = await OneSignal.getDeviceState();
            console.log('FCM Token Data:::::::::::::::', device)
            if (device.userId !== null && device.userId !== undefined) {
                this.props.changeOneSignalUserId(device.userId.toString());
            }

            await this.getNavigationPage();
        });


    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }


    /**
     *check user logged and navigate to pages
     */
    async getNavigationPage() {
        const {navigate} = this.props.navigation;
        if (await AsyncStorage.getItem(StorageStrings.LOGGED) === 'true') {
            navigate('Home');
        } else {
            navigate('conditionsForm');
        }
    }

    render() {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: Color.softLightGreen}}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.themeColor}/>
                <View style={{width: 360, height: 360, margin: 24, backgroundColor: Color.themeColor}}>
                    <Image source={image} style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    visible: state.user.visible,
    asGuestUser: state.user.asGuestUser
});


const mapDispatchToProps = dispatch => {
    return {
        changeOneSignalUserId: userId => dispatch(actionTypes.changeOneSignalUserId(userId)),
        setLoading: (isLoading) => dispatch(actionTypes.setLoading(isLoading)),
        checkCorporateState: (corporateState) => dispatch(actionTypes.checkCorporateState(corporateState)),
        setCorporateName: (corporateName) => dispatch(actionTypes.setCorporateName(corporateName)),
        checkSubscriptionState: (subscriptionState) => dispatch(actionTypes.checkSubscriptionState(subscriptionState))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
