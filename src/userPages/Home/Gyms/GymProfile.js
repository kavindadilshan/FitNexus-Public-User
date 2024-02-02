import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Linking,
    StatusBar,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import {Color} from "../../../constance/Colors";
import DownArrow from '../../../assets/Home/downArrow.png';
import axios from '../../../axios/axios';
import {SubUrl} from "../../../axios/server_url";
import {Font} from "../../../constance/AppFonts";
import {AppToast} from "../../../constance/AppToast";
import RatingModal from "../../../component/UIElement/RatingModal";
import PlaceholderIMG from '../../../assets/Sample/placeholderIMG.jpg';
import Toast from "react-native-simple-toast";
import PageLoading from "../../../component/Loading/PageLoading";
import {CurrencyType} from "../../../constance/AppCurrency";
import {styles} from "./styles";
import UpArrow from "../../../assets/Home/upArrow.png";
import FacilityComponent from '../../../component/UIElement/FacilitiesComponent';
import MembershipPackages from "../../../component/UIElement/MembershipPackages";
import MembershipComponent from "../../../component/UIElement/MembershipComponent";
import * as actionTypes from "../../../store/actions";
import {connect} from 'react-redux';
import AsyncStorage from "@react-native-community/async-storage";
import {StorageStrings} from "../../../constance/StorageStrings";
import AlertMassage2 from "../../../component/Actions/AlertMassage2";
import LocationIMG from '../../../assets/Home/locationMini.png';
import TimeIMG from '../../../assets/Home/timeMini.png';
import DumbleImg from '../../../assets/Home/dumble.png';
import AlertMassage from "../../../component/Actions/AlertMassage";
import * as Validation from "../../Validation/Validation";
import YoutubePlayer from "react-native-youtube-iframe";
import {AppEventsLogger} from "react-native-fbsdk";
import analytics from "@react-native-firebase/analytics";
import Orientation from 'react-native-orientation';


class App extends React.Component {
    state = {
        name: '',
        rating: '',
        description: '',
        ratingCount: '',
        list: [],
        listClasses: [],
        gender: '',
        lowestPrice: '',
        image: null,
        list2: [],
        businessName: '',
        businessRating: '',
        businessRatingCount: '',
        businessImage: null,
        businessId: '',
        viewAs: false,
        pageNumber: 0,
        finished: false,
        loading: false,
        gymId: '',
        listEquipment: [],
        listFacility: [],
        distance: '',
        address: '',
        weekDaysClosingHour: '',
        weekDaysOpeningHour: '',
        weekendClosingHour: '',
        weekendOpeningHour: '',
        placeLatitude: '',
        placeLongitude: '',
        listMembership: [],
        membershipBooked: false,
        membershipExpireDateTime: '',
        membershipCount: '',
        dayPassName: '',
        dayPassPrice: '',
        dayPassId: '',
        dayPassAllowed: false,
        dayPassStatus: '',
        dayValid: false,
        dayPassDiscount: '',
        dayPassDiscountedPrice: '',
        specialNoteVisible: false,
        specialNote: '',
        city: '',
        showAlert: false,
        saturdayOpeningHour: '',
        saturdayClosingHour: '',
        sundayOpeningHour: '',
        sundayClosingHour: '',
        imageLoad: true,
        isFirstTimeLoad: true,
        guestAlert: false,
        youtubeUrl: ''
    };

    async componentDidMount() {

    }

    /**
     * set currency type
     * @param value
     * @returns {*}
     */
    numberFormat = (value) =>
        new Intl.NumberFormat(CurrencyType.locales, {
            style: 'currency',
            currency: CurrencyType.currency
        }).format(value).replace(/\.00/g, '');

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    /**
     * set AM or PM in time
     * @param time
     * @returns {string}
     */
    timeConvert = (time) => {
        let timeString = time;
        let H = +timeString.substr(0, 2);
        let h = H % 12 || 12;
        let ampm = (H < 12 || H === 24) ? " AM" : " PM";
        return h + timeString.substr(2, 3) + ampm;
    };

    /**
     * find today
     * @param day
     * @returns {*}
     */
    findDay = (day) => {
        switch (day) {
            case 0:
                return 'sunday';
            case 1:
                return 'monday';
            case 2:
                return 'tuesday';
            case 3:
                return 'wednesday';
            case 4:
                return 'thursday';
            case 5:
                return 'friday';
            case 6:
                return 'saturday';
            default:
                return null;
        }
    };

    /**
     * facebook analytics using FBSDK
     */
    fbAnalytics = () => {
        AppEventsLogger.logEvent('fb_mobile_add_to_cart', this.state.dayPassDiscountedPrice, {
            'fb_content_type': 'gym',
            'fb_content_id': this.state.gymId,
            'fb_currency': CurrencyType.currency
        })
    }


    /**
     * view your location via open google map
     */
    openMap = () => {
        const latitude = this.state.placeLatitude;
        const longitude = this.state.placeLongitude;
        const label = this.state.address;

        const url = Platform.select({
            ios: "maps:" + latitude + "," + longitude + "?q=" + label,
            android: "geo:" + latitude + "," + longitude + "?q=" + label
        });
        Linking.openURL(url);
    };

    /**
     * button press action handler
     * @param name
     * @param item
     */
    onButtonPress = (name, item) => {
        const {navigate} = this.props.navigation;
        const {push} = this.props.navigation;
        switch (name) {
            case 'review':
                navigate('ReviewForm', {
                    roleId: this.state.gymId,
                    role: 'gym',
                    name: this.state.name
                });
                break;
            case 'business':
                push('BusinessProfile', {
                    businessId: this.state.businessId,
                    businessName: this.state.businessName
                });
                break;
            case 'instructor':
                push('InstructorForm', {
                    trainerId: item.id
                });
                break;
            case 'membership':
                navigate('MembershipForm', {
                    role: 'gymMember',
                    list: this.state.listMembership,
                    path: {
                        page: 'GymProfileForm',
                        pageId: this.state.gymId,
                        pageType: 'gym',
                        classType: 'gymClass'
                    },
                    membershipBooked: this.state.membershipBooked
                });
                break;
            case 'checkOut':
                this.fbAnalytics();
                navigate('DayPassCheckOutForm', {
                    id: this.state.dayPassId,
                    name: this.state.dayPassName,
                    price: this.state.dayPassDiscountedPrice,
                    gymId: this.state.gymId,
                    promoCodeType: 'GYM'
                });
                break;
            case 'dayPassDetails':
                navigate('DayPassDetailsForm', {
                    dayPass: {
                        gymName: this.state.name,
                        gymRating: this.state.rating,
                        gymRatingCount: this.state.ratingCount,
                        gymLocation: this.state.address,
                        discount: this.state.dayPassDiscount,
                        discountedPrice: this.state.dayPassDiscountedPrice,
                        city: this.state.city,
                        gymImage: this.state.image,
                        price: this.state.dayPassPrice
                    }
                });
                break;
            default:
                break;
        }
    };

    hideAlert() {
        this.setState({showAlert: false})
    }

    async hideAlert2(type) {
        const {push} = this.props.navigation;
        const data = {
            page: 'GymProfileForm',
            parameters:{
                gymId: this.state.gymId,
                gymName: this.state.name,
                refresh: true
            }
        }
        this.props.getGuestNavigationParams(data);
        // await AsyncStorage.clear();
        switch (type) {
            case 'yes':
                push('AuthForm');
                break;
            case 'no':
                push('SignOutForm');
                break;
            default:
                break;
        }
        this.setState({guestAlert: false})
    }

    render() {
        const list = this.state.list.map((item, i) => (
            <View style={styles.listContainer} key={i}>

                {this.state.imageLoad ? (
                    <ActivityIndicator
                        animating
                        size={"small"}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            margin: 'auto'
                        }}
                    />
                ) : null}

                <Image source={item.image !== null ? {uri: item.image} : PlaceholderIMG} style={styles.imageStyle}
                       resizeMode={'cover'}
                       onLoadStart={() => this.setState({imageLoad: true})}
                       onLoadEnd={() => this.setState({imageLoad: false})}
                />
            </View>
        ));

        const listEquipment = this.state.listEquipment.map((item, i) => (
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}} key={i}>
                <View style={styles.timeImg}>
                    <Image source={DumbleImg} style={{...styles.imageStyle,tintColor:Color.themeColor}} resizeMode={'contain'}/>
                </View>
                <Text style={styles.pharagraph}>{item.name}</Text>
            </View>
        ));

        return (
            !this.state.loading ? (
                <View style={this.state.listMembership.length === 0 ? styles.container : {
                    ...styles.container,
                    paddingBottom: 70
                }}>
                    <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.headerContainer}>
                            <View style={styles.imageHolder}>
                                <Image source={this.state.image !== null ? {uri: this.state.image} : PlaceholderIMG}
                                       style={styles.imageStyle} resizeMode={'stretch'}/>
                            </View>
                            <View style={{flexDirection: 'column', marginLeft: 12, height: '100%', flex: 1}}>
                                <TouchableOpacity style={{flexDirection: 'row', alignContent: 'center', marginTop: 5}}
                                                  onPress={() => this.openMap()}>
                                    <View style={{width: '15%'}}>
                                        <View style={styles.locationOuter}>
                                            <Image source={LocationIMG} style={{width: '100%', height: '100%',tintColor:Color.themeColor}}
                                                   resizeMode={'contain'}/>
                                        </View>
                                    </View>
                                    <View style={{width: '85%', flex: 1}}>
                                        <Text style={styles.headerTitle}>{this.state.address}</Text>
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.subTitle}>{this.state.distance} Km Away</Text>
                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                                  onPress={() => this.props.asGuestUser ? this.setState({guestAlert: true}) : this.onButtonPress('review')}>
                                    <RatingModal
                                        rating={this.state.rating}
                                        count={this.state.ratingCount}
                                        color={Color.ratingTextColor}
                                        tintColor={Color.white}
                                        fontSize={14}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.asGuestUser ? this.setState({guestAlert: true}) : this.onButtonPress('review')}>
                                    <Text style={styles.rateTitle}>Rate this gym</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                        <ScrollView style={styles.horizontalImageHolder} horizontal={true}
                                    showsHorizontalScrollIndicator={false}>
                            {list}
                        </ScrollView>

                        {this.state.youtubeUrl !== null ? (
                            <View style={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                                marginTop: 10,
                                marginBottom: 15,
                                height: (Platform.OS === 'ios') ? 200 : 220
                            }}>
                                <YoutubePlayer
                                    videoId={this.state.youtubeUrl}
                                    play={false}
                                    onReady={e => this.setState({isReady: true})}
                                    onChangeState={e => this.setState({status: e.state})}
                                    onError={e => this.setState({error: e.error})}
                                    contentScale={1}
                                    height={'100%'}
                                    width={'95%'}
                                    allowWebViewZoom={true}
                                    webViewStyle={{overflow: "hidden", borderRadius: 10}}
                                    webViewProps={{
                                        allowsInlineMediaPlayback: false,
                                        allowsFullscreenVideo: true,
                                        androidLayerType: 'hardware', // <- SOLUTION
                                        // androidHardwareAccelerationDisabled: true, // <-- PROBLEM
                                    }}
                                    onFullScreenChange={e => e ? Orientation.unlockAllOrientations() : Orientation.lockToPortrait()}
                                />
                            </View>
                        ) : null}

                        {this.state.membershipBooked || this.state.dayPassStatus ? (
                            <MembershipComponent
                                type={'Gym'}
                                status={this.state.membershipBooked}
                                dayPassStatus={this.state.dayPassStatus}
                                onPress={() => this.onButtonPress('membership')}
                                membershipCount={this.state.membershipCount}
                                expireDate={new Date(this.state.membershipExpireDateTime).toLocaleDateString()}
                                slot={0}
                                list={[]}
                            />
                        ) : null}

                        {this.state.dayPassAllowed && !this.state.dayPassStatus && this.state.dayValid ? (
                            <View style={styles.membershipContainer}>
                                <View style={{flexDirection: 'column', width: '75%'}}>
                                    <Text style={{...styles.pharagraph, color: Color.white, marginLeft: 10}}>
                                        Get a Single
                                        Entry{' (' + this.numberFormat(this.state.dayPassDiscountedPrice) + ')'}
                                    </Text>
                                    <Text style={{
                                        ...styles.pharagraph,
                                        color: Color.white,
                                        marginLeft: 10,
                                        fontFamily: Font.Regular
                                    }}>
                                        Only valid for {new Date().toLocaleDateString()}
                                    </Text>
                                </View>

                                <TouchableOpacity style={styles.viewAllBtn}
                                                  onPress={() => this.props.asGuestUser ? this.setState({guestAlert: true}) :
                                                      this.state.membershipBooked ? this.onButtonPress('dayPassDetails') :
                                                          this.onButtonPress('checkOut')
                                                  }>
                                    <Text style={{
                                        ...styles.pharagraph,
                                        color: Color.white
                                    }}>{!this.state.membershipBooked ? 'Purchase' : 'View'}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        {this.state.listMembership.length !== 0 && !this.state.membershipBooked ? (
                            <Text style={styles.headline}>Membership Packages</Text>
                        ) : null}

                        {this.state.listMembership.length !== 0 && !this.state.membershipBooked ? (
                            <MembershipPackages list={this.state.listMembership} role={'gym'}/>
                        ) : null}

                        {this.state.listMembership.length !== 0 && !this.state.membershipBooked ? (
                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity onPress={() => this.onButtonPress('membership')}>
                                    <Text style={styles.viewMoreTitle}>View more</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        <Text style={styles.headline}>Description</Text>
                        <View style={{marginHorizontal: 10, marginTop: 10, paddingLeft: 5}}>
                            <Text style={styles.pharagraph}>{this.state.description}</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                            <Text style={styles.headline}>Open Hours</Text>
                            {/* <View style={styles.dropDownStyle}>
                                <Image source={UpArrow}
                                       style={styles.imageStyle} resizeMode={'contain'}/>
                            </View> */}
                        </View>
                        <View>
                            {this.state.weekDaysOpeningHour !== null && this.state.weekDaysClosingHour !== null ? (
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <View style={styles.timeImg}>
                                        <Image source={TimeIMG} style={{...styles.imageStyle,tintColor:Color.themeColor}} resizeMode={'contain'}/>
                                    </View>
                                    <Text style={styles.pharagraph}>Weekdays</Text>
                                    <Text style={{
                                        ...styles.pharagraph,
                                        position: 'absolute',
                                        right: 10
                                    }}>{this.state.weekDaysOpeningHour} - {this.state.weekDaysClosingHour}</Text>
                                </View>
                            ) : null}

                            {this.state.saturdayOpeningHour !== null && this.state.saturdayClosingHour !== null ? (
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <View style={styles.timeImg}>
                                        <Image source={TimeIMG} style={{...styles.imageStyle,tintColor:Color.themeColor}} resizeMode={'contain'}/>
                                    </View>
                                    <Text style={styles.pharagraph}>Saturday</Text>
                                    <Text style={{
                                        ...styles.pharagraph,
                                        position: 'absolute',
                                        right: 10
                                    }}>{this.state.saturdayOpeningHour} - {this.state.saturdayClosingHour}</Text>
                                </View>
                            ) : null}

                            {this.state.sundayOpeningHour !== null && this.state.saturdayClosingHour !== null ? (
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <View style={styles.timeImg}>
                                        <Image source={TimeIMG} style={{...styles.imageStyle,tintColor:Color.themeColor}} resizeMode={'contain'}/>
                                    </View>
                                    <Text style={styles.pharagraph}>Sunday</Text>
                                    <Text style={{
                                        ...styles.pharagraph,
                                        position: 'absolute',
                                        right: 10
                                    }}>{this.state.sundayOpeningHour} - {this.state.sundayClosingHour}</Text>
                                </View>
                            ) : null}

                            {this.state.specialNoteVisible ? (
                                <Text style={{
                                    ...styles.subTitle,
                                    fontSize: 12,
                                    fontFamily: Font.Medium,
                                    marginLeft: 10
                                }}>{'(' + this.state.specialNote + ')'}</Text>
                            ) : null}
                        </View>

                        {this.state.listEquipment.length !== 0 ? (
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>

                                <Text style={styles.headline}>Equipment</Text>

                                {/* <View style={styles.dropDownStyle}>
                                    <Image source={UpArrow}
                                           style={styles.imageStyle} resizeMode={'contain'}/>
                                </View> */}
                            </View>
                        ) : null}
                        {listEquipment}

                        {this.state.listFacility.length !== 0 ? (
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>

                                <Text style={styles.headline}>Facilities</Text>

                                {/* <View style={styles.dropDownStyle}>
                                    <Image source={UpArrow}
                                           style={styles.imageStyle} resizeMode={'contain'}/>
                                </View> */}
                            </View>
                        ) : null}

                        <FacilityComponent list={this.state.listFacility}/>


                    </ScrollView>

                    {this.state.listMembership.length !== 0 ? (
                        <View style={styles.bottomContainer}>


                            <View style={{
                                width: this.state.dayPassAllowed ? '50%' : '100%',
                                alignItems: 'center',
                            }}>
                                <TouchableOpacity style={styles.bottomBtn}
                                                  onPress={() => this.onButtonPress('membership')}>
                                    <Text
                                        style={styles.bottomBtnText}>{this.state.dayPassAllowed ? 'Memberships' : 'View All Memberships'}</Text>
                                </TouchableOpacity>
                            </View>

                            {this.state.dayPassAllowed ? (
                                <View style={{width: '50%', alignItems: 'center'}}>
                                    <TouchableOpacity style={{...styles.bottomBtn, backgroundColor: Color.softBlue}}
                                                      onPress={() => this.props.asGuestUser ? this.setState({guestAlert: true}) :
                                                          this.state.dayValid ? this.state.membershipBooked || this.state.dayPassStatus ?
                                                              this.onButtonPress('dayPassDetails') : this.onButtonPress('checkOut') :
                                                              this.setState({showAlert: true})}
                                    >
                                        <Text style={styles.bottomBtnText}>Single Entry</Text>
                                        <Text
                                            style={styles.bottomBtnText}>{'(' + this.numberFormat(this.state.dayPassDiscountedPrice) + ')'}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>

                    ) : this.state.dayPassAllowed ? (
                        <View style={styles.bottomContainer}>
                            <View style={{width: '100%', alignItems: 'center'}}>
                                <TouchableOpacity style={{...styles.bottomBtn, backgroundColor: Color.softBlue}}
                                                  onPress={() => this.state.dayValid ? this.state.membershipBooked || this.state.dayPassStatus ?
                                                      this.onButtonPress('dayPassDetails') : this.onButtonPress('checkOut') :
                                                      this.setState({showAlert: true})}
                                >
                                    <Text style={styles.bottomBtnText}>Single Entry</Text>
                                    <Text
                                        style={styles.bottomBtnText}>{'(' + this.numberFormat(this.state.dayPassDiscountedPrice) + ')'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}


                    <AlertMassage2
                        show={this.state.showAlert}
                        message={"Sorry, " + this.state.name + " is not offering day passes on today!"}
                        onCancelPressed={() => this.hideAlert()}
                    />

                    <AlertMassage
                        show={this.state.guestAlert}
                        message={"You need to create an account in order to complete this action."}
                        onCancelPressed={() => this.hideAlert2('yes')}
                        onConfirmPressed={() => this.hideAlert2('no')}
                        cancelText={'I\'m an existing user'}
                        confirmText={'I\'m a new user'}
                        onDismiss={() => this.setState({guestAlert:false})}
                    />

                </View>
            ) : (
                <PageLoading/>
            )

        )
    }
}

const mapStateToProps = (state) => ({
    latitude: state.user.latitude,
    longitude: state.user.longitude,
    review: state.user.review,
    asGuestUser: state.user.asGuestUser
});

const mapDispatchToProps = dispatch => {
    return {
        updateActiveRoute: activeRoute => dispatch(actionTypes.updateActiveRoute(activeRoute)),
        reviewItem: review => dispatch(actionTypes.reviewItem(review)),
        getGuestNavigationParams: navigationParams => dispatch(actionTypes.getGuestNavigationParams(navigationParams))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
