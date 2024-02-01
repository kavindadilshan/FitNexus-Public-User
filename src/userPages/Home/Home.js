import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View, Dimensions,
    StatusBar, Platform, PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from './styles';
import {Color} from '../../constance/Colors';
import example1 from '../../assets/Sample/example1.png';
import example2 from '../../assets/Home/PersonalClass.png';
import example3 from '../../assets/Sample/example2.png';
import GymImg from '../../assets/Home/Gym.png';
import GroupClassImg from '../../assets/Home/Group_class.png';
import Filter from '../../assets/Sample/Filter.png';
import {StorageStrings} from "../../constance/StorageStrings";
import logo from '../../assets/Auth/fitNexusLogo.png';
import axios from '../../axios/axios';
import {SubUrl} from "../../axios/server_url";
import gif from '../../assets/Home/loading.gif';
import SessionContainer from '../../component/UIElement/SessionComponent';
import TrainerContainer from '../../component/UIElement/TrainerContainer';
import {AppToast} from "../../constance/AppToast";
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import {CurrencyType} from "../../constance/AppCurrency";
import {HardwareBackAction} from "../../component/Actions/HardwareBackAction";
import AlertMassage from "../../component/Actions/AlertMassage";
import GymsComponent from '../../component/UIElement/GymsComponent';
import PageLoading from "../../component/Loading/PageLoading";
import ImageSlider from './ImageSlider/ImageSlider';
import Geolocation from 'react-native-geolocation-service';
import InviteBannerIMG from '../../assets/Home/inviteBannerIMG.png';
import {Icon} from "react-native-elements";
import CorporativeImage from '../../assets/Home/co-opHome.png';
import {encryption} from "../../component/Encryption/Encrypt&Decrypt";
import UpcomingComponent from "../../component/UIElement/UpcomingComponent";
import Moment from "moment";
import {GROUP_CLASS_ONLY} from "../../constance/Const";


const isCloseToRight = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToRight = 25;
    return layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToRight;
};


class App extends React.Component {

    state = {
        listClass: [],
        listGyms: [],
        listTrainer: [],
        listPhysicalTrainer: [],
        listPersonalCoach: [],
        listUpcomingGroupClass: [],
        firstName: '',
        wish: '',
        pageNumber: 0,
        finished: false,
        loading: false,
        pageNumber1: 0,
        finished1: false,
        loading1: false,
        loading2: false,
        pageNumber2: 0,
        finished2: false,
        list: [],
        showAlert: false,
        latitude: '',
        longitude: '',
        locationName: '',
        modalVisible: false,
        loadLocation: false,
        loading3: false,
        finished3: false,
        pageNumber3: 0,
        pageLoading: false,
        listBanner: [],
        loading4: false,
        finished4: false,
        pageNumber4: 0,
        loading5: false,
        finished5: false,
        pageNumber5: 0,
        loading6: false,
        finished6: false,
        pageNumber6: 0,
        locationAccess: false
    };

    async componentWillMount() {
        this.setState({
            pageLoading: true,
        });
        this.getAllBannerImages();
        this.props.checkHomeBack(false);
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            if (!this.state.locationAccess) {
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );
                    console.log(granted)
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.getLocationHandler();
                    } else {
                        await AsyncStorage.setItem(StorageStrings.LATITUDE, '6.9271');
                        await AsyncStorage.setItem(StorageStrings.LONGITUDE, '79.8612');
                        this.setState({
                            latitude: this.props.latitude === 0 ? 6.9271 : this.props.latitude,
                            longitude: this.props.latitude === 0 ? 79.8612 : this.props.longitude,
                        });
                        this.fetchAPIs();
                    }
                } else {
                    const status = await Geolocation.requestAuthorization('whenInUse');
                    console.log(status);
                    if (status === 'denied') {

                        await AsyncStorage.setItem(StorageStrings.LATITUDE, '6.9271');
                        await AsyncStorage.setItem(StorageStrings.LONGITUDE, '79.8612');
                        this.setState({
                            latitude: this.props.latitude === 0 ? 6.9271 : this.props.latitude,
                            longitude: this.props.latitude === 0 ? 79.8612 : this.props.longitude,
                        });
                        this.fetchAPIs();

                    } else {
                        this.getLocationHandler();
                    }

                }


                this.watchID = Geolocation.watchPosition(
                    async (position) => {
                        await AsyncStorage.setItem(StorageStrings.LATITUDE, position.coords.latitude.toString());
                        await AsyncStorage.setItem(StorageStrings.LONGITUDE, position.coords.longitude.toString());

                        setInterval(() => {
                            // this.setlocation(coordinate, coordinate);
                        }, 5000);
                    },
                    (error) => {
                        console.log(error);
                    },
                    {enableHighAccuracy: true, distanceFilter: 0, interval: 100, fastestInterval: 100}
                );

                const hr = new Date().getHours();
                if (hr >= 0 && hr < 12) {
                    this.setState({wish: "Good Morning!"});
                } else if (hr >= 12 && hr <= 17) {
                    this.setState({wish: "Good Afternoon!"})
                } else {
                    this.setState({wish: "Good Evening!"})
                }
                this.setState({
                    locationAccess: true,
                    firstName: encryption.decrypt(await AsyncStorage.getItem(StorageStrings.FIRST_NAME)),
                });

            } else {
                if (this.props.fetch) {
                    this.setState({pageLoading: true});
                }

                const hr = new Date().getHours();
                if (hr >= 0 && hr < 12) {
                    this.setState({wish: "Good Morning!"});
                } else if (hr >= 12 && hr <= 17) {
                    this.setState({wish: "Good Afternoon!"})
                } else {
                    this.setState({wish: "Good Evening!"})
                }

                this.setState({
                    firstName: encryption.decrypt(await AsyncStorage.getItem(StorageStrings.FIRST_NAME)),
                    latitude: this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LATITUDE)) : this.props.latitude,
                    longitude: this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE)) : this.props.longitude,
                });
                this.fetchAPIs();

                this.getNotificationCounts();
            }


        });


    }

    async componentDidMount(): void {
        this.props.navigation.addListener('willFocus', this.load);
    };


    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
            Geolocation.clearWatch(this.watchID);
        }
    };

    /**
     * check gps permission
     */
    getLocationHandler() {
        Geolocation.getCurrentPosition(
            async (position) => {
                console.log(position);

                await AsyncStorage.setItem(StorageStrings.LATITUDE, position.coords.latitude.toString());
                await AsyncStorage.setItem(StorageStrings.LONGITUDE, position.coords.longitude.toString());

                this.setState({
                    latitude: this.props.latitude === 0 ? position.coords.latitude : this.props.latitude,
                    longitude: this.props.latitude === 0 ? position.coords.longitude : this.props.longitude,
                });
                this.fetchAPIs();
                Geolocation.stopObserving();

            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            {
                enableHighAccuracy: false, timeout: 15000, maximumAge: 10000
            },
        );
    }

    /**
     * get advertisment banner images
     * @returns {Promise<void>}
     */
    getAllBannerImages = async () => {
        axios.get(SubUrl.get_advertisement_banner)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;

                    const list = [];
                    for (let i = 0; i < data.length; i++) {
                        list.push({
                            illustration: data[i] !== null ? data[i] : null
                        })
                    }
                    this.setState({
                        listBanner: list
                    });

                }
            })
            .catch(error => {
                console.log(error)
            })
    };

    fetchAPIs = () => {
        if (this.props.offlineFetch || this.props.change) {
            this.setState({
                listClass: [],
                loading2: !this.state.loading2,
                pageNumber2: 0,
                finished2: false,
            });
            this.getPopularOfflineClass();
            this.props.fetchOfflineClasses(false);
        }

        if (this.props.fetch || this.props.change) {
            this.setState({
                loading3: !this.state.loading3,
                pageNumber3: 0,
                finished3: false,
                listGyms: [],
            });
            this.getPopularGyms();
            this.props.fetchEndpoint(false);
        }


        if (this.props.trainerFetch || this.props.change) {
            this.setState({
                listPhysicalTrainer: [],
                loading4: !this.state.loading4,
                pageNumber4: 0,
                finished4: false,
            });
            this.getPopularPhysicalTrainers();

        }
    };

    /**
     * back button press action
     */
    load = () => {
        HardwareBackAction.setBackAction(() => {
            this.setState({showAlert: true});
        });
    };

    /**
     * change currency format
     * @param value
     * @returns {*}
     */
    numberFormat = (value) =>
        new Intl.NumberFormat(CurrencyType.locales, {
            style: 'currency',
            currency: CurrencyType.currency
        }).format(value).replace(/\.00/g, '');


    /**
     * get notification count endpoint integration
     * set value from redux
     */
    getNotificationCounts = async () => {
        const userId = await AsyncStorage.getItem(StorageStrings.USER_ID);
        axios.get(SubUrl.get_notification_count_by_user + userId + '/notifications/count')
            .then(async response => {
                if (response.data.success) {
                    this.props.changeNotificationHolder(response.data.body);
                }

            })
            .catch(error => {
                console.log(error);
            })
    };

    /**
     * get popular gyms endpoint integration
     * @param page
     */
    getPopularGyms = async (page) => {
        if (page === undefined) {
            page = 0
        }

        const latitude = this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LATITUDE)) : this.props.latitude;
        const longitude = this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE)) : this.props.longitude;
        axios.get(SubUrl.get_popular_gyms + '?page=' + page + '&size=5&latitude=' + latitude + '&longitude=' + longitude)
            .then(async response => {
                this.setState({loading3: !this.state.loading3});
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.last && data.empty) {
                        this.setState({finished3: true, loading3: false, pageLoading: false});
                    } else {
                        const list = this.state.listGyms;
                        data.content.map((items) => {
                            list.push({
                                id: items.gymId,
                                name: items.gymName,
                                image: items.profileImage !== null ? items.profileImage : null,
                                staringValue: items.rating,
                                count: items.ratingCount,
                                distance: items.distance,
                                city: items.city,
                            })
                        });
                        if (data.last) {
                            this.setState({finished3: true, loading3: false, pageLoading: false});
                        }

                        this.setState({listGyms: list, pageLoading: false})
                    }
                } else {
                    this.setState({loading3: false, pageLoading: false});
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({loading3: false, pageLoading: false});
                AppToast.networkErrorToast();
            })
    };


    /**
     * get popular physical classes endpoint integration
     * @param page
     */
    getPopularOfflineClass = async (page) => {
        if (page === undefined) {
            page = 0
        }
        axios.get(SubUrl.get_popular_physical_classes + '?page=' + page + '&size=5')
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.last && data.empty) {
                        this.setState({finished2: true, loading2: false});
                    } else {
                        const list = this.state.listClass;
                        data.content.map((items) => {
                            list.push({
                                id: items.id,
                                name: items.name,
                                image: items.profileImage !== null ? items.profileImage : null,
                                staringValue: items.rating,
                                count: items.ratingCount,
                                sessionPerWeek: items.averageSessionsPerWeek,
                                price: items.startingFrom,
                                calorie: items.calorieBurnOut,
                                buttonStatus: items.buttonStatus,
                                sessionsUpcoming: items.sessionsUpcoming
                            })
                        });
                        if (data.last) {
                            this.setState({finished2: true, loading2: false});
                        }

                        this.setState({listClass: list});
                    }
                } else {
                    this.setState({loading2: false});
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({loading2: false});
                AppToast.networkErrorToast();
            })
    };


    /**
     * get popular physical class trainer endpoint integration
     * @param page
     */
    getPopularPhysicalTrainers = async (page) => {
        if (page === undefined) {
            page = 0
        }
        axios.get(SubUrl.get_popular_physical_class_trainer + '?page=' + page + '&size=5')
            .then(async response => {
                this.setState({loading4: !this.state.loading4});
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.last && data.empty) {
                        this.setState({finished4: true, loading4: false});
                    } else {
                        const list = this.state.listPhysicalTrainer;
                        data.content.map((items) => {
                            list.push({
                                id: items.userId,
                                firstName: items.firstName,
                                lastName: items.lastName,
                                image: items.image !== null ? items.image : null,
                                staringValue: items.rating,
                                count: items.ratingCount,

                            });
                            if (data.last) {
                                this.setState({finished4: true, loading4: false});
                            }

                            this.setState({
                                listPhysicalTrainer: list,
                            })
                        });
                    }
                } else {
                    this.setState({loading4: false});
                    AppToast.networkErrorToast();
                }
            })
            .catch(error => {
                this.setState({loading4: false});
                AppToast.networkErrorToast();
            })
    };

    /**
     * popup ui visibility handler
     * @param type
     */
    hideAlert = (type) => {
        switch (type) {
            case 'yes':
                this.props.fetchEndpoint(true);
                this.props.changeLatitude(0);
                this.props.changeLongitude(0);
                this.props.fetchOfflineClasses(true);
                this.props.fetchTrainer(true);
                HardwareBackAction.exitApp();
                break;
            case 'no':
                this.setState({
                    showAlert: false
                });
                break;
            default:
                break;
        }
        this.setState({
            showAlert: false
        });
    };

    /**
     * button press event handler
     * @param type
     * @param item
     * @param role
     */
    onButtonClick = async (type, item, role) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'classes':
                navigate('Sessions', {
                    category: item,
                    selectedIndex: 0,
                    checkIn: false,
                    selectedCorporateId: ''
                });
                break;
            case 'trainers':
                navigate('TrainersForm');
                break;
            case 'class':
                navigate('ClassesDetailsForm', {
                    classId: item.id,
                    role: role,
                    refresh: true
                });
                break;
            case 'fitnessTrainer':
                navigate('InstructorForm', {
                    trainerId: item.id,
                    refresh: true,
                    trainerType: type
                });
                break;
            case 'viewMore':
                navigate('ViewMoreForm', {
                    role: item,
                    refresh: true
                });
                break;
            case 'gyms':
                navigate('GymProfileForm', {
                    gymId: item.id,
                    gymName: item.name,
                    refresh: true
                });
                break;
            case 'gym':
                navigate('GymsForm');
                break;
            case 'invite':
                navigate('InviteFriendForm');
                break;
            case 'co-opSessions':
                if (!GROUP_CLASS_ONLY) {
                    navigate('Sessions', {
                        category: 'GROUP',
                        selectedIndex: 1,
                        checkIn: true,
                        selectedCorporateId: item
                    });
                } else {
                    navigate('GroupClassExplore', {
                        selectedCorporateId: item
                    })
                }
                break;
            case 'new_online_group':
                if (!this.props.subscriptionState) {
                    navigate('MainUI');
                } else {
                    navigate('GroupClassExplore', {
                        selectedCorporateId: ''
                    })
                }
                break;
            case 'upcomingSession':
                navigate('SelectedDetails', {
                    sessionId: item.id,
                    role: role
                });
                break;
            default:
                break;
        }

    };

    render() {

        const classList = this.state.listClass.map((item, i) => (
            <SessionContainer
                onPress={() => this.onButtonClick('class', item, 'offline')}
                image={item.image}
                price={this.numberFormat(item.price)}
                calorie={item.calorie + ' cal Burn Workout'}
                name={item.name}
                sessionPerWeek={item.sessionPerWeek}
                staringValue={item.staringValue}
                count={item.count}
                buttonStatus={item.buttonStatus}
                sessionsUpcoming={item.sessionsUpcoming}
                role={'offline'}
                key={i}
            />

        ));

        const gymsList = this.state.listGyms.map((item, i) => (
            <GymsComponent
                onPress={() => this.onButtonClick('gyms', item)}
                image={item.image}
                name={item.name}
                distance={item.distance.toFixed(1)}
                city={item.city}
                staringValue={item.staringValue}
                count={item.count}
                key={i}
            />

        ));

        const trainerList1 = this.state.listPhysicalTrainer.map((item, i) => (
            <TrainerContainer
                onPress={() => this.onButtonClick('fitnessTrainer', item)}
                image={item.image}
                firstName={item.firstName}
                lastName={item.lastName}
                staringValue={item.staringValue}
                count={item.count}
                key={i}
            />
        ));

        return (
            !this.state.pageLoading ? (
                <SafeAreaView style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{
                            width: '100%',
                            alignItems: 'center',
                            height: 35,
                            marginVertical: 10,
                            justifyContent: 'center'
                        }}>
                            <View style={{width: '35%', height: '50%'}}>
                                <Image source={logo} style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
                            </View>
                        </View>

                        <Text style={{...styles.mainTitle, fontSize: 22}}>Hello {this.state.firstName},</Text>
                        <Text style={{
                            ...styles.title,
                            fontSize: 15,
                            marginLeft: 18,
                            marginBottom: 20
                        }}>{this.state.wish}</Text>
                        <Text style={{...styles.mainTitle, marginBottom: 5}}>Explore Types of Fitness Services</Text>


                        <SafeAreaView style={{marginHorizontal: 5}}>
                            <ScrollView style={{width: '100%'}} horizontal={true}
                                        showsHorizontalScrollIndicator={false}>

                                <TouchableOpacity style={styles.categoryOuter}
                                                  onPress={() => this.onButtonClick('gym')}>
                                    <View style={styles.categoryContent}>
                                        <Image source={GymImg} style={styles.imageHolder} resizeMode={'cover'}/>
                                        <Image source={Filter} style={styles.imageHolder2} resizeMode={'stretch'}/>
                                        <Text style={styles.categoryTitle}>Gyms</Text>
                                    </View>

                                </TouchableOpacity>

                                <TouchableOpacity style={styles.categoryOuter}
                                                  onPress={() => this.onButtonClick('classes', 'OFFLINE_CLASS')}>
                                    <View style={styles.categoryContent}>
                                        <Image source={example2} style={styles.imageHolder} resizeMode={'cover'}/>
                                        <Image source={Filter} style={styles.imageHolder2} resizeMode={'stretch'}/>
                                        <Text style={styles.categoryTitle}>Fitness Classes</Text>
                                    </View>

                                </TouchableOpacity>


                            </ScrollView>
                        </SafeAreaView>


                        {this.state.listBanner.length !== 0 ? (
                            <SafeAreaView>
                                <ImageSlider list={this.state.listBanner} paddingTop={10} clickable={false}/>
                            </SafeAreaView>
                        ) : null}


                        {/*popular gyms*/}

                        {this.state.listGyms.length !== 0 ? (
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '5%'}}>
                                <Text style={styles.mainTitle}>Most Popular Gyms</Text>
                                <TouchableOpacity style={{position: 'absolute', right: 10}}
                                                  onPress={() => this.onButtonClick('viewMore', 'Popular Gyms')}>
                                    <Text style={styles.viewMoreTitle}>View more</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}


                        <SafeAreaView style={{marginHorizontal: 5, marginTop: 10}}>

                            <ScrollView style={{width: '100%', marginLeft: 10}}
                                        showsHorizontalScrollIndicator={false} horizontal={true}
                                        onScroll={({nativeEvent}) => {
                                            if (isCloseToRight(nativeEvent)) {
                                                if (!this.state.finished3) {
                                                    this.setState({
                                                        pageNumber3: this.state.pageNumber3 + 1,
                                                        loading3: !this.state.loading3,
                                                    });
                                                    const page = this.state.pageNumber3 + 1;
                                                    this.getPopularGyms(page);
                                                }
                                            }
                                        }}>
                                {gymsList}
                                {
                                    this.state.loading3 ?
                                        <View style={styles.gifHolder}>
                                            <Image source={gif} style={styles.gif}/>
                                        </View>
                                        : null
                                }
                            </ScrollView>

                        </SafeAreaView>

                        {/*popular fitness class*/}

                        {this.state.listClass.length !== 0 ? (
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '5%'}}>
                                <Text style={styles.mainTitle}>Most Popular Fitness Classes</Text>
                                <TouchableOpacity style={{position: 'absolute', right: 10}}
                                                  onPress={() => this.onButtonClick('viewMore', 'Popular Fitness Classes')}>
                                    <Text style={styles.viewMoreTitle}>View more</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}


                        <SafeAreaView style={{marginHorizontal: 5, marginTop: 10}}>

                            <ScrollView style={{width: '100%', marginLeft: 10}}
                                        showsHorizontalScrollIndicator={false} horizontal={true}
                                        onScroll={({nativeEvent}) => {
                                            if (isCloseToRight(nativeEvent)) {
                                                if (!this.state.finished2) {
                                                    this.setState({
                                                        pageNumber2: this.state.pageNumber2 + 1,
                                                        loading2: !this.state.loading2,
                                                    });
                                                    const page = this.state.pageNumber2 + 1;
                                                    this.getPopularOfflineClass(page);
                                                }
                                            }
                                        }}>
                                {classList}
                                {
                                    this.state.loading2 ?
                                        <View style={styles.gifHolder}>
                                            <Image source={gif} style={styles.gif}/>
                                        </View>
                                        : null
                                }
                            </ScrollView>

                        </SafeAreaView>


                        {/*popular fitness class trainers*/}

                        {this.state.listPhysicalTrainer.length !== 0 ? (
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '5%'}}>
                                <Text style={styles.mainTitle}>Most Popular Fitness Class Trainers</Text>
                                <TouchableOpacity style={{position: 'absolute', right: 10}}
                                                  onPress={() => this.onButtonClick('viewMore', 'Popular Fitness Trainers')}>
                                    <Text style={styles.viewMoreTitle}>View more</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        <SafeAreaView style={{marginHorizontal: 5, marginTop: 10}}>

                            <ScrollView style={{width: '100%', marginLeft: 10}}
                                        showsHorizontalScrollIndicator={false} horizontal={true}
                                        onScroll={({nativeEvent}) => {
                                            if (isCloseToRight(nativeEvent)) {
                                                if (!this.state.finished4) {
                                                    this.setState({
                                                        pageNumber4: this.state.pageNumber4 + 1,
                                                        loading4: !this.state.loading4,
                                                    });
                                                    const page = this.state.pageNumber4 + 1;
                                                    this.getPopularPhysicalTrainers(page);
                                                }
                                            }
                                        }}
                            >
                                {trainerList1}
                                {
                                    this.state.loading4 ?
                                        <View style={styles.gifHolder}>
                                            <Image source={gif} style={styles.gif}/>
                                        </View>
                                        : null
                                }
                            </ScrollView>

                        </SafeAreaView>
                    </ScrollView>

                    <AlertMassage
                        show={this.state.showAlert}
                        message={"Are you sure you want to exit the App?"}
                        onCancelPressed={() => {
                            this.hideAlert('yes');
                        }}
                        onConfirmPressed={() => {
                            this.hideAlert('no');
                        }}
                        cancelText={'Yes'}
                        confirmText={'No'}
                        btnSize={110}
                    />

                </SafeAreaView>
            ) : (
                <PageLoading/>
            )


        )
    }
}


const mapStateToProps = (state) => ({
    latitude: state.user.latitude,
    longitude: state.user.longitude,
    fetch: state.user.fetch,
    offlineFetch: state.user.offlineFetch,
    trainerFetch: state.user.trainerFetch,
    visible: state.user.visible,
    change: state.user.change,
    corporateState: state.user.corporateState,
    corporateName: state.user.corporateName,
    subscriptionState: state.user.subscriptionState
});


const mapDispatchToProps = dispatch => {
    return {
        changeNotificationHolder: notificationCount => dispatch(actionTypes.changeNotificationHolder(notificationCount)),
        fetchEndpoint: fetch => dispatch(actionTypes.fetchEndpoint(fetch)),
        fetchOfflineClasses: offlineFetch => dispatch(actionTypes.fetchOfflineClasses(offlineFetch)),
        fetchTrainer: trainerFetch => dispatch(actionTypes.fetchTrainer(trainerFetch)),
        changeLatitude: latitude => dispatch(actionTypes.changeLatitude(latitude)),
        changeLongitude: longitude => dispatch(actionTypes.changeLongitude(longitude)),
        changePlatform: change => dispatch(actionTypes.changePlatform(change)),
        checkCorporateState: (corporateState) => dispatch(actionTypes.checkCorporateState(corporateState)),
        setCorporateName: (corporateName) => dispatch(actionTypes.setCorporateName(corporateName)),
        checkHomeBack: homeBack => dispatch(actionTypes.checkHomeBack(homeBack))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
