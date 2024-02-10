import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ActivityIndicator,
    Platform
} from 'react-native';
import {Color} from "../../../../constance/Colors";
import Line from '../../../../assets/Sample/Line.png';
import Calandar from '../../../../assets/Home/calandarOrange.png';
import Calandar2 from '../../../../assets/Home/calanderWhite.png';
import Prepare from "../../../../assets/Home/prepare.png";
import axios from '../../../../axios/axios';
import {SubUrl} from "../../../../axios/server_url";
import Moment from 'moment';
import ProfileContainer from '../../../../component/ProfileContainer/ProfileContainer'
import {Font} from "../../../../constance/AppFonts";
import {AppToast} from "../../../../constance/AppToast";
import RatingModal from "../../../../component/UIElement/RatingModal";
import TrainerContainer from "../../../../component/UIElement/TrainerContainer";
import PlaceholderIMG from '../../../../assets/Sample/placeholderIMG.jpg';
import Toast from "react-native-simple-toast";
import PageLoading from "../../../../component/Loading/PageLoading";
import {CurrencyType} from "../../../../constance/AppCurrency";
import * as actionTypes from "../../../../store/actions";
import {connect} from 'react-redux';
import AsyncStorage from "@react-native-community/async-storage";
import {StorageStrings} from "../../../../constance/StorageStrings";
import MembershipComponent from '../../../../component/UIElement/MembershipComponent';
import MembershipPackages from '../../../../component/UIElement/MembershipPackages';
import LocationWhite from '../../../../assets/Home/whiteLocation.png';
import LocationBlack from '../../../../assets/Home/locationIcon.png';
import Orientation from 'react-native-orientation';
import YoutubePlayer from "react-native-youtube-iframe";
import * as Validation from '../../../Validation/Validation';
import AlertMassage from "../../../../component/Actions/AlertMassage";
import {AppEventsLogger} from "react-native-fbsdk";
import analytics from "@react-native-firebase/analytics";
import {ONLINE_MEMBERSHIP_VISIBLE, SINGLE_SESSION_PAYMENT} from "../../../../constance/Const";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component {
    state = {
        name: '',
        rating: '',
        howToPrepare: '',
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
        classId: '',
        role: '',
        listMembership: [],
        membershipBooked: true,
        bookedMemberships: [],
        membershipCount: '',
        imageLoad: true,
        typeName: '',
        youtubeUrl: '',
        guestAlert: false,
        singleSessionReserve: true
    };

    async componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {

            if (Platform.OS === 'ios') {
                Orientation.lockToPortrait();
            }


            if (this.props.navigation.getParam('refresh') || this.props.review) {
                this.setState({
                    list: [],
                    listClasses: [],
                    list2: [],
                });
                const {navigation} = this.props;
                const role = navigation.getParam('role');
                this.setState({role: role});

                this.getAllPysicalClassDetails();
                this.getAllCoaches(role);
                this.props.navigation.setParams({
                    refresh: false,
                });
                this.props.reviewItem(false);
            }

        })
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    /**
     * set currency format
     * @param value
     * @returns {*}
     */
    numberFormat = (value) =>
        new Intl.NumberFormat(CurrencyType.locales, {
            style: 'currency',
            currency: CurrencyType.currency
        }).format(value).replace(/\.00/g, '');

    /**
     * get physical class details by id api
     * @returns {Promise<void>}
     */
    getAllPysicalClassDetails = async () => {
        this.setState({loading: true});
        const {navigation} = this.props;
        const classId = navigation.getParam('classId');
        const dateTime = new Date().toISOString().split('.')[0] + "Z";
        const latitude = this.props.latitude !== 0 ? this.props.latitude : Number(await AsyncStorage.getItem(StorageStrings.LATITUDE));
        const longitude = this.props.longitude !== 0 ? this.props.longitude : Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE));

        axios.get(SubUrl.get_physical_class_by_id + classId + '?longitude=' + longitude + '&latitude=' + latitude + '&dateTime=' + dateTime)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    const name = data.name;
                    const rating = data.rating !== null ? data.rating : 0;
                    const howToPrepare = data.howToPrepare;
                    const description = data.description;
                    const ratingCount = data.ratingCount;
                    const image = data.profileImage !== null ? data.profileImage : null;
                    const businessName = data.businessProfile.businessName;
                    const businessRating = data.businessProfile.rating !== null ? data.businessProfile.rating : 0;
                    const businessRatingCount = data.businessProfile.ratingCount;
                    const businessImage = data.businessProfile.profileImage !== null ? data.businessProfile.profileImage : null;
                    const businessId = data.businessProfile.id;
                    const classId = data.id;
                    const listMembership = data.memberships;
                    const bookedMemberships = data.bookedMemberships;
                    const membershipBooked = data.membershipBooked;
                    const membershipCount = data.membershipCount;
                    let lowestPrice = data.startingFrom !== null ? data.startingFrom : 0;
                    const youtubeUrl = data.youtubeUrl !== null && data.youtubeUrl !== '' ? Validation.YoutubeVideoIdValidator(data.youtubeUrl) : null

                    const list = [];
                    for (let i = 0; i < data.images.length; i++) {
                        list.push({
                            image: data.images[i] !== null ? data.images[i] : null
                        })
                    }

                    const list2 = [];
                    if (data.classSessions.length !== 0) {
                        for (let i = 0; i < data.classSessions.length; i++) {
                            list2.push({
                                id: data.classSessions[i].id,
                                date: new Date(data.classSessions[i].dateAndTime).toDateString(),
                                startTime: Moment(new Date(data.classSessions[i].dateAndTime), 'hh:mm').format('LT'),
                                endTime: Moment(new Date(data.classSessions[i].endDateAndTime), 'hh:mm').format('LT'),
                                location: data.classSessions[i].location.addressLine1 + ', ' + (data.classSessions[i].location.addressLine2 !== '' ? data.classSessions[i].location.addressLine2 + ',' : '') + data.classSessions[i].location.city
                            })
                        }
                    }

                    this.setState({
                        name: name,
                        rating: rating,
                        howToPrepare: howToPrepare,
                        description: description,
                        ratingCount: ratingCount,
                        list: list,
                        listClasses: list2,
                        lowestPrice: lowestPrice,
                        image: image,
                        businessName: businessName,
                        businessRating: businessRating,
                        businessRatingCount: businessRatingCount,
                        businessImage: businessImage,
                        businessId: businessId,
                        classId: classId,
                        loading: false,
                        listMembership: listMembership !== null ? listMembership : [],
                        membershipBooked: membershipBooked,
                        bookedMemberships: bookedMemberships !== null ? bookedMemberships : [],
                        membershipCount: membershipCount,
                        youtubeUrl: youtubeUrl
                    })

                    this.fbAnalyticsClass();
                    this.googleAnalyticsClass()

                } else {
                    this.setState({loading: false});
                    Toast.show(response.data.message);
                }
            })
            .catch(error => {
                this.setState({loading: false});
                AppToast.networkErrorToast();
            })
    };

    /**
     * get all trainer details by class id api
     * @returns {Promise<void>}
     */
    getAllCoaches = async (role) => {
        const {navigation} = this.props;
        const classId = navigation.getParam('classId');
        axios.get(role !== 'online' ? SubUrl.get_trainers_by_physical_class + classId : SubUrl.get_trainers_by_class + classId)
            .then(async response => {
                const list = this.state.list2;
                const data = response.data.body;
                console.log(data)
                data.map((items) => {
                    list.push({
                        id: items.id,
                        firstName: items.firstName,
                        lastName: items.lastName,
                        image: items.image !== null ? items.image : null,
                        staringValue: items.rating !== null ? items.rating : 0,
                        count: items.ratingCount
                    })
                    this.setState({
                        list2: list
                    })
                })
            })
            .catch(error => {
                AppToast.networkErrorToast();
            })
    };

    /**
     * facebook analytics for session profile
     */
    fbAnalyticsClass = () => {
        AppEventsLogger.logEvent("fb_mobile_content_view", {
            "fb_content": this.state.name,
            "fb_content_type": this.state.role !== 'online' ? 'Fitness Class' : this.state.typeName + ' Online Class',
            "fb_content_id": this.state.classId,
            "fb_currency": CurrencyType.currency
        })
    }

    /**
     * google analytics for class profile
     */
    googleAnalyticsClass = async () => {
        await analytics().logScreenView({
            screen_class: this.state.role !== 'online' ? 'Fitness Class' : this.state.typeName + ' Online Class',
            screen_name: this.state.name,
        });
    }

    /**
     * buttun click action handler
     * for using upcoming class click
     * @param type
     */
    onButtonClick = async (type) => {
        const items = this.state.listClasses;
        const list = [];

        for (let i = 0; i < items.length; i++) {
            if (items[i].id === type.id) {
                list.push({
                    id: items[i].id,
                    date: items[i].date,
                    startTime: items[i].startTime,
                    endTime: items[i].endTime,
                    location: items[i].location,
                    visible: true,
                });
                const {navigate} = this.props.navigation;
                navigate('SelectedDetails', {
                    sessionId: items[i].id,
                    role: this.state.role
                })
            } else {
                list.push({
                    id: items[i].id,
                    date: items[i].date,
                    startTime: items[i].startTime,
                    endTime: items[i].endTime,
                    location: items[i].location,
                    visible: false,
                });
            }
        }
        this.setState({
            listClasses: list,
        })

    };

    async hideAlert2(type) {
        const {push} = this.props.navigation;
        const data = {
            page: 'ClassesDetailsForm',
            parameters: {
                classId: this.state.classId,
                role: this.state.role,
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
                this.setState({guestAlert: false});
                push('SignOutForm');
                break;
            default:
                break;
        }
    }

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
                    roleId: this.state.classId,
                    role: 'classes',
                    classType: this.state.role,
                    name: this.state.name
                });
                break;
            case 'business':
                push('BusinessProfile', {
                    businessId: this.state.businessId,
                    businessName: this.state.businessName,
                    navigateState: this.state.role,
                    refresh: true,
                    classCategory: this.state.typeName !== 'Group' ? 'PERSONAL' : 'GROUP'
                });
                break;
            case 'instructor':
                push('InstructorForm', {
                    trainerId: item.id,
                    refresh: true,
                    trainerType: this.state.role !== 'online' ? 'fitnessTrainer' : 'onlineTrainer'
                });
                break;
            case 'upcoming':
                push('UpCommingClassesForm', {
                    classId: this.state.classId,
                    name: this.state.name,
                    role: this.state.role
                });
                break;
            case 'membership':
                navigate('MembershipForm', {
                    role: 'classMember',
                    list: this.state.listMembership,
                    path: {
                        page: 'ClassesDetailsForm',
                        pageId: this.state.classId,
                        pageType: this.state.role,
                        classId: this.state.classId,
                    },
                    membershipBooked: false
                });
                break;
            default:
                break;
        }
    };

    checkButtonStatus(membership, upcomingSessions) {
        if (membership !== 0 || upcomingSessions >= 3) {
            if (membership !== 0 && upcomingSessions < 3) {
                return {
                    membeshipBtnSize: '95%',
                    upcomingBtnSize: 0,
                    upcomingBtnVisible: false,
                    membershipBtnVisible: true,
                    bottomVisible: true,
                    margin: 0
                }
            } else if (membership === 0 && upcomingSessions >= 3) {
                return {
                    membeshipBtnSize: 0,
                    upcomingBtnSize: '95%',
                    upcomingBtnVisible: true,
                    membershipBtnVisible: false,
                    bottomVisible: true,
                    margin: 0
                }
            } else {
                return {
                    membeshipBtnSize: '45%',
                    upcomingBtnSize: '45%',
                    upcomingBtnVisible: true,
                    membershipBtnVisible: true,
                    bottomVisible: true,
                    margin: 10
                }
            }
        } else {
            return {
                membeshipBtnSize: 0,
                upcomingBtnSize: 0,
                upcomingBtnVisible: false,
                membershipBtnVisible: false,
                bottomVisible: false,
                margin: 0
            }
        }

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
        const listClasses = this.state.listClasses.map((item, i) => (
            <TouchableOpacity style={item.visible ? {
                ...styles.classesListContainer,
                backgroundColor: Color.themeColor
            } : styles.classesListContainer} key={i} onPress={() => this.onButtonClick(item)}>
                <Image source={item.visible ? Calandar2 : Calandar} style={{width: 28, height: 28, marginLeft: 10}}/>

                <View style={{flexDirection: 'column', width: '50%'}}>
                    <Text style={item.visible ? {...styles.title, color: Color.white} : styles.title}>{item.date}</Text>
                    {this.state.role !== 'online' ? (
                        <View style={{flexDirection: 'row', marginLeft: 10}}>
                            <View style={{width: 10, height: 10, marginRight: 2}}>
                                <Image source={item.visible ? LocationWhite : LocationBlack}
                                       style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
                            </View>
                            <Text style={!item.visible ? styles.address : {...styles.address, color: Color.white}}
                                  numberOfLines={2}>{item.location}</Text>
                        </View>
                    ) : null}

                </View>

                <Text style={item.visible ? {
                    ...styles.title,
                    color: Color.white,
                    position: 'absolute',
                    right: 30
                } : {
                    ...styles.title,
                    color: Color.softDarkGray,
                    position: 'absolute',
                    right: 30
                }}> {item.startTime}-{item.endTime}</Text>
            </TouchableOpacity>
        ));

        const classList = this.state.list2.map((item, i) => (
            <TrainerContainer
                onPress={() => this.onButtonPress('instructor', item)}
                image={item.image}
                firstName={item.firstName}
                lastName={item.lastName}
                staringValue={item.staringValue}
                count={item.count}
                key={i}
            />
        ));

        return (
            !this.state.loading ? (
                <View
                    style={this.checkButtonStatus(this.state.listMembership.length, this.state.listClasses.length).bottomVisible ? {
                        ...styles.container,
                        paddingBottom: 60
                    } : styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.headerContainer}>
                            <View style={styles.imageHolder}>
                                <Image source={this.state.image !== null ? {uri: this.state.image} : PlaceholderIMG}
                                       style={styles.imageStyle} resizeMode={'cover'}/>
                            </View>
                            <View style={{flexDirection: 'column', marginLeft: 12, flex: 1}}>
                                <Text style={styles.headerTitle} numberOfLines={3}>{this.state.name}</Text>
                                {this.state.singleSessionReserve && (
                                    <Text style={styles.subTitle}>Staring
                                        From {this.numberFormat(this.state.lowestPrice)}</Text>
                                )}
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
                                    <Text style={styles.rateTitle}>Rate this class</Text>
                                </TouchableOpacity>
                                {this.state.typeName !== '' ? (
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={this.state.typeName !== 'Group' ? styles.classTypeButton : {
                                            ...styles.classTypeButton,
                                            backgroundColor: Color.softLightOrange
                                        }}>
                                            <Text style={this.state.typeName !== 'Group' ? styles.classTypeStyle : {
                                                ...styles.classTypeStyle,
                                                color: Color.darkOrange
                                            }}>{this.state.typeName}</Text>
                                        </View>
                                    </View>

                                ) : null}


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
                                marginVertical: 10,
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
                                    webViewStyle={{borderRadius: 10}}
                                    initialPlayerParams={{
                                        controls: true,
                                        loop: true,
                                    }}
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


                        <Text style={styles.headline}>Description</Text>
                        <View style={{marginHorizontal: 10, marginTop: 10}}>
                            <Text style={styles.pharagraph}>{this.state.description}</Text>
                        </View>

                        <Image source={Line} style={{marginVertical: 10}}/>

                        {this.state.role !== 'online' || ONLINE_MEMBERSHIP_VISIBLE ? (
                            <MembershipComponent
                                type={'Class'}
                                status={this.state.membershipBooked}
                                dayPassStatus={false}
                                onPress={() => this.onButtonPress('membership')}
                                membershipCount={this.state.membershipCount}
                                expireDate={0}
                                slot={100}
                                list={this.state.bookedMemberships}
                            />
                        ) : null}


                        {this.state.listMembership.length !== 0 && !this.state.membershipBooked && this.state.role !== 'online' ? (
                            <View style={{width: '100%'}}>
                                <Text style={styles.headline}>Membership Packages</Text>
                                <MembershipPackages list={this.state.listMembership} role={'class'}/>

                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableOpacity onPress={() => this.onButtonPress('membership')}>
                                        <Text style={styles.more}>View More</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        ) : null}

                        <Text style={{...styles.headline, marginTop: 10}}>Upcoming Classes</Text>

                        <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
                            {this.state.listClasses.length !== 0 ? listClasses : (
                                <View style={{alignItems: 'flex-start'}}>
                                    <Text style={{...styles.pharagraph, fontSize: 13}}>No upcoming classes</Text>
                                </View>
                            )}

                            {this.state.listClasses.length === 3 ? (
                                <TouchableOpacity onPress={() => this.onButtonPress('upcoming')}>
                                    <Text style={styles.more}>View More</Text>
                                </TouchableOpacity>
                            ) : null}

                        </View>


                        <Image source={Line} style={{marginVertical: 10}}/>

                        <Text style={{...styles.headline, marginTop: 10}}>How to Prepare</Text>
                        <View style={{flexDirection: 'row', marginVertical: 10}}>
                            <Image source={Prepare} style={styles.iconContainer}/>
                            <View style={{width: '85%'}}>
                                <Text style={styles.info}>{this.state.howToPrepare}</Text>
                            </View>
                        </View>

                        {this.state.list2.length !== 0 ? (
                            <Text style={styles.headline}>Our Coaches</Text>
                        ) : null}

                        <ScrollView style={{width: '100%', marginLeft: 10, marginTop: 5}}
                                    showsHorizontalScrollIndicator={false} horizontal={true}
                        >
                            {classList}
                        </ScrollView>

                        <Text style={styles.headline}>Studio Profile</Text>
                        <ProfileContainer
                            image={this.state.businessImage}
                            name={this.state.businessName}
                            rating={this.state.businessRating}
                            count={this.state.businessRatingCount}
                            onPress={() => this.onButtonPress('business')}
                        />


                    </ScrollView>
                    {this.checkButtonStatus(this.state.listMembership.length, this.state.listClasses.length).bottomVisible ? (
                        <View style={styles.bottomContainer}>
                            <TouchableOpacity style={{
                                ...styles.bottomMiniBtn,
                                width: this.checkButtonStatus(this.state.listMembership.length, this.state.listClasses.length).upcomingBtnSize
                            }} onPress={() => this.onButtonPress('upcoming')}>
                                <Text
                                    style={styles.bottomBtnText}>{this.state.singleSessionReserve ? 'Buy Single Class' : 'Reserve a Session'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                ...styles.bottomMiniBtn2,
                                width: this.checkButtonStatus(this.state.listMembership.length, this.state.listClasses.length).membeshipBtnSize,
                                marginLeft: this.checkButtonStatus(this.state.listMembership.length, this.state.listClasses.length).margin
                            }} onPress={() => this.onButtonPress('membership')}>
                                <Text style={styles.bottomBtnText}>Buy Class packages</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

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

export const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        height: screenHeight / 100 * 21,
    },
    imageHolder: {
        width: '42%',
        height: '100%',
        marginLeft: 10,
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        overflow: 'hidden'
    },
    headerTitle: {
        color: Color.darkblue,
        fontFamily: Font.SemiBold,
        fontSize: 20,
        lineHeight: 22,
        marginBottom: 2
    },
    heilight: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22
    },
    btnStyle: {
        width: 66.32,
        height: 26.16,
        backgroundColor: Color.lightGreen,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listContainer: {
        width: 148.13,
        height: 138.31,
        borderRadius: 10,
        marginRight: 5,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginBottom: 8,
        overflow: 'hidden'
    },
    horizontalImageHolder: {
        width: '98%',
        marginLeft: 10,
        marginTop: 30,

    },
    subTitle: {
        fontFamily: Font.Bold,
        fontSize: 14,
        lineHeight: 22,
        color: '#454A4E'
    },
    headline: {
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 22,
        marginTop: '2%',
        marginLeft: 10
    },
    pharagraph: {
        fontSize: 15,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: Color.softLightGray3
    },
    classesListContainer: {
        width: '95%',
        height: 50,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        backgroundColor: Color.white,
        marginBottom: 5,
        alignItems: 'center',
        // justifyContent:'center',
        flexDirection: 'row'
    },
    title: {
        fontFamily: Font.Medium,
        fontSize: 13,
        lineHeight: 22,
        color: Color.darkGray,
        marginLeft: 10
    },
    more: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.themeColor,
        marginTop: 10
    },
    iconContainer: {
        width: 33.41,
        height: 31.74,
        marginLeft: 10
    },
    info: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        marginLeft: 10,
        color: Color.darkGray,
        width: '100%'
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    },
    categoryContent: {
        width: '100%',
        height: '65%',
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginVertical: '5%',
        overflow: 'hidden'
    },
    categoryTitle: {
        fontSize: 15,
        fontFamily: Font.Medium,
        lineHeight: 22
    },
    time: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22,
        color: '#4B6883'
    },
    imageHolder1: {
        width: '100%',
        height: '100%',
        zIndex: 1,

    },
    imageHolder2: {
        width: '100%',
        height: '100%',
        zIndex: 2,
        position: 'absolute'
    },
    ratingText: {
        fontSize: 14,
        color: '#4B6883',
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        marginLeft: 7,
        marginTop: 5
    },
    gifHolder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 90,
        height: 90,
    },
    bottomContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        backgroundColor: Color.white,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        paddingTop: 5
    },
    bottomBtn: {
        width: '95%',
        height: '75%',
        backgroundColor: Color.themeColor,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomMiniBtn: {
        width: '50%',
        height: '75%',
        backgroundColor: Color.themeColor,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomMiniBtn2: {
        width: '45%',
        height: '75%',
        backgroundColor: Color.softBlue,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    bottomBtnText: {
        fontFamily: Font.Bold,
        fontSize: 15,
        lineHeight: 22,
        color: Color.white
    },
    rateTitle: {
        fontFamily: Font.SemiBold,
        fontSize: 10,
        lineHeight: 15,
        color: Color.softDarkGray1,
        textDecorationLine: 'underline',
    },
    address: {
        fontFamily: Font.Medium,
        fontSize: 10,
        lineHeight: 10,
        color: Color.softDarkGray,
    },
    classTypeButton: {
        paddingHorizontal: 10,
        height: 30,
        borderRadius: 8,
        backgroundColor: Color.softLightGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    classTypeStyle: {
        color: Color.blueGreen,
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 18,
    }
});

const mapStateToProps = (state) => ({
    latitude: state.user.latitude,
    longitude: state.user.longitude,
    review: state.user.review,
    asGuestUser: state.user.asGuestUser
});


const mapDispatchToProps = dispatch => {
    return {
        changeNotificationHolder: notificationCount => dispatch(actionTypes.changeNotificationHolder(notificationCount)),
        reviewItem: review => dispatch(actionTypes.reviewItem(review)),
        getGuestNavigationParams: navigationParams => dispatch(actionTypes.getGuestNavigationParams(navigationParams))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
