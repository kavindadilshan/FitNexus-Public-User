import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image, Modal, Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Color} from "../../../../constance/Colors";
import SearchBtn from '../../../../assets/Sample/search.png';
import RangeSlider from 'rn-range-slider';
import Filter from '../../../../assets/Sample/filter2.png';
import Calander from '../../../../assets/Home/grayCalendar.png';
import CalendarStrip from '../../../../component/Lib/react-native-calendar-strip';
import axios from '../../../../axios/axios';
import {SubUrl} from "../../../../axios/server_url";
import gif from '../../../../assets/Home/loading.gif';
import {StorageStrings} from "../../../../constance/StorageStrings";
import Moment from 'moment';
import {styles} from "../ClassesDetails/styles";
import {connect} from 'react-redux';
import * as actionTypes from '../../../../store/actions';
import Flag from "react-native-flags";
import {Font} from "../../../../constance/AppFonts";
import {AppToast} from "../../../../constance/AppToast";
import RatingModal from "../../../../component/UIElement/RatingModal";
import EmptyAlert from '../../../../component/UIElement/EmptyAlert';
import PlaceholderIMG from '../../../../assets/Sample/placeholderIMG.jpg';
import {CurrencyType} from "../../../../constance/AppCurrency";
import rightArrow from '../../../../assets/Home/rightArrow.png';
import leftArrow from '../../../../assets/Home/leftArrow.png';
import LocationImg from '../../../../assets/Home/whiteLocation.png';
import Geocoder from "react-native-geocoding";
import LocationChanger from "../../../../component/UIElement/LocationChanger";
import Model from "../../../../component/GooglePlacesModel/Model";
import ButtonGroup from '../../../../component/Actions/ButtonGroup';
import Orientation from 'react-native-orientation';
import CheckIMG from '../../../../assets/Home/ok.png';
import UncheckIMG from '../../../../assets/Home/uncheck.png';
import AlertMassage from '../../../../component/Actions/AlertMassage';
import Toast from 'react-native-simple-toast';
import Location from '../../../../assets/Home/locationGray.png';
import {AppEventsLogger} from "react-native-fbsdk";
import analytics from '@react-native-firebase/analytics';
import {encryption} from "../../../../component/Encryption/Encrypt&Decrypt";
import SessionCard from "../../../../component/UIElement/SessionCard";
import HeaderSearchBar from "../../../../component/UIElement/HeaderSearchBar";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

let prev = 0;


class App extends React.Component {

    state = {
        selectedIndex: 0,
        listClasses: [],
        listBusiness: [],
        selectedDate: new Date(),
        date: Moment(new Date()).format('YYYY-MM-DD'),
        rangeLow: new Date(new Date().setHours(6, 0, 0, 0)),
        rangeHigh: new Date(new Date().setHours(21, 0, 0, 0)),
        pageNumber: 0,
        list: [],
        classType: '',
        listCategory: [],
        categoryId: '',
        searchKey: {
            value: '',
            valid: true
        },
        nameSelect: false,
        categorySelect: false,
        finished: false,
        loading: false,
        btnVisible: false,
        typeSelect: false,
        empty: false,
        day: 0,
        selectedList: [],
        loading2: false,
        role: '',
        locationName: '',
        modalVisible: false,
        loadLocation: false,
        businessType: '',
        checkIn: false,
        corporates: [],
        sessionId: '',
        listClassTypes: [],
        promoCodeType: '',
        selectedCorporateId: '',
        selectedSessionId: ''
    };


    async componentWillMount() {
        const {navigation} = this.props;
        let selectedIndex = navigation.getParam('selectedIndex');
        let checkIn = navigation.getParam('checkIn');
        this.updateIndex = this.updateIndex.bind(this);
        const now = new Date(new Date().setHours(0, 0, 0, 0));
        let selectedCorporateId = navigation.getParam('selectedCorporateId');
        this.setState({
            selectedIndex: selectedIndex,
            checkIn: checkIn,
            min: now,
            max: new Date(now.getTime() + 1000 * 60 * 60 * 24 - 1),
            selectedCorporateId: selectedCorporateId
        });

        const category = navigation.getParam('category');

        this.setState({
            role: 'offline',
            businessType: 'PHYSICAL',
            loadLocation: !this.state.loadLocation,
            promoCodeType: 'FITNESS_CLASS'
        });
        this.getLocationAddress();

        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {

            if (Platform.OS === 'ios') {
                Orientation.lockToPortrait()
            }

            this.setState({
                empty: false,
                pageNumber: 0,
                searchKey: {
                    value: '',
                    valid: true
                },
                list: [],
                listBusiness: [],
                finished: false,
            });


            if (this.state.selectedIndex !== 0) {
                this.checkClassTypes('firstTime');
            } else {
                this.getAllBusiness();
                this.getCategory();
            }

            if (selectedIndex !== 0 && checkIn) {
                this.getCategory();
            }


            this.setState({loading: true});
        });
        this.setState({loading: !this.state.loading});
    };

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    /**
     * facebook analytics
     * @param type
     */
    facebookAnalytics = (type) => {
        if (type !== 'business') {
            AppEventsLogger.logEvent("fb_mobile_search", {
                'fb_content_type': type,
                'fb_search_string': this.state.searchKey.value,
                'fb_success': true
            })
        } else {
            AppEventsLogger.logEvent("fb_mobile_search", {
                'fb_content_type': 'Studio Profile',
                'fb_search_string': this.state.searchKey.value,
                'fb_success': true
            })
        }

    }

    /**
     * google analytics
     */
    googleAnalytics = async () => {
        await analytics().logSearch({
            search_term: this.state.searchKey.value,
        });
    }

    /**
     * load online endpoints or offline endpoints
     * @param type
     */
    checkClassTypes( type) {
        this.facebookAnalytics('physical classes')
        type === 'fistTime' ? this.getAllOffineSessions() : this.getAllOffineSessions('click');
    }


    /**
     * call country code from countries json
     * @param countryName
     * @returns {*}
     */
    static getCountryCodeByName(countryName): string {
        const countries = require('../../../../component/json/countries.json');

        for (const c of countries) {
            if (c.name === countryName) {
                return c.alpha2Code;
            }
        }

        return null;
    }

    /**
     * set currency to amount
     * @param value
     * @returns {*}
     */
    numberFormat = (value) =>
        new Intl.NumberFormat(CurrencyType.locales, {
            style: 'currency',
            currency: CurrencyType.currency
        }).format(value);


    /**
     * preview location nearest city name
     */
    async getLocationAddress() {

        const latitude = this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LATITUDE)) : this.props.latitude;
        const longitude = this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE)) : this.props.longitude;

        Geocoder.from(latitude, longitude)
            .then(json => {
                let locationName = (json.results[json.results.length - 4].formatted_address);
                locationName = locationName.split(", ")[0];

                this.setState({
                    locationName: locationName,
                    loadLocation: false
                });
            })
            .catch(error => console.warn(error));
    }

    /**
     * change button group actions
     * @param selectedIndex
     */
    updateIndex(selectedIndex) {
        if (selectedIndex !== this.state.selectedIndex) {
            this.setState({
                selectedIndex,
                searchKey: {value: '', valid: true},
                pageNumber: 0,
                categoryId: '',
                nameSelect: false,
                categorySelect: false,
                finished: false,
                loading: false,
                btnVisible: false,
                typeSelect: false,
                empty: false,
                list: [],
                listBusiness: [],
            });

            if (selectedIndex !== 0) {
                this.setState({loading: !this.state.loading});
                this.checkClassTypes('notFirst');
            } else {
                this.getAllBusiness(0, 'click', '')
            }
        }
    }

    /**
     * search and get all business profiles endpoint
     * @param page
     * @param click
     * @param searchKey
     * @returns {Promise<void>}
     */
    getAllBusiness = async (page, click, searchKey) => {

        if (page === undefined) {
            page = 0
        }

        let filterString = '';
        let name = '';
        const latitude = this.props.latitude !== 0 ? this.props.latitude : Number(await AsyncStorage.getItem(StorageStrings.LATITUDE));
        const longitude = this.props.longitude !== 0 ? this.props.longitude : Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE));
        for (const selectedElm of this.state.selectedList) {
            filterString += selectedElm + ',';
        }
        filterString = filterString.substring(0, filterString.length - 1);
        name = searchKey !== '' ? this.state.searchKey.value : '';
        this.setState({loading: true});
        axios.get(SubUrl.get_all_business_profile + '?page=' + page + '&size=10' + '&name=' + name + '&classTypes=' + filterString + '&type=' + this.state.businessType + '&longitude=' + longitude + '&latitude=' + latitude)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.empty && data.pageable.pageNumber === 0) {
                        this.setState({empty: true})
                    }
                    if (data.last && data.empty) {
                        this.setState({finished: true, loading: false});
                    } else {
                        let list = '';
                        if (click !== 'click') {
                            list = this.state.listBusiness;
                        } else {
                            list = [];
                        }


                        data.content.map((items) => {
                            list.push({
                                id: items.id,
                                name: items.businessName,
                                country: items.addresses.length === 0 ? null : items.addresses[0].country,
                                mobile: items.telephone !== null ? items.telephone : null,
                                image: items.profileImage !== null ? items.profileImage : null,
                                rating: items.rating,
                                ratingCount: items.ratingCount,
                                description: items.description,
                                city: items.headOffice.city,
                                distance: items.distance,
                                classTypes: items.classTypes,
                                averageClassesPerWeek: items.averagePhysicalClassesPerWeek
                            })
                        });

                        if (data.last) {
                            this.setState({finished: true, loading: false});
                        }

                        this.setState({
                            listBusiness: list,
                            nameSelect: false,
                        });
                    }
                } else {
                    this.setState({loading: false, empty: true});
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({loading: !this.state.loading});
                AppToast.networkErrorToast();
            })
    }

    /**
     * search and get all sessions endpoint
     * @param click
     */
    getAllOffineSessions = async (click) => {
        const gender = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.GENDER));
        const page = this.state.pageNumber;
        const date = this.state.selectedDate;
        const name = this.state.searchKey.value;
        const latitude = this.props.latitude !== 0 ? this.props.latitude : Number(await AsyncStorage.getItem(StorageStrings.LATITUDE));
        const longitude = this.props.longitude !== 0 ? this.props.longitude : Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE));
        const country = await AsyncStorage.getItem(StorageStrings.COUNTRY);

        let filterString = '';
        for (const selectedElm of this.state.selectedList) {
            filterString += selectedElm + ',';
        }
        filterString = filterString.substring(0, filterString.length - 1);


        const min = new Date(new Date(date).setHours(new Date(this.state.rangeLow).getHours(), new Date(this.state.rangeLow).getMinutes(), new Date(this.state.rangeLow).getSeconds()))
        const max = new Date(new Date(date).setHours(new Date(this.state.rangeHigh).getHours(), new Date(this.state.rangeHigh).getMinutes(), new Date(this.state.rangeHigh).getSeconds()))

        const startDateAndTime = new Date(min).toISOString().split('.')[0] + "Z";
        const endDateAndTime = new Date(max).toISOString().split('.')[0] + "Z";

        this.setState({loading: true});

        axios.get(SubUrl.get_all_physical_sessions + '?page=' + page + '&size=5' + '&gender=' + gender + '&startDateTime=' + startDateAndTime + '&endDateTime=' + endDateAndTime + '&classTypes=' + filterString + '&name=' + name + '&category=' + 'GROUP' + '&longitude=' + longitude + '&latitude=' + latitude + '&country=' + country)
            .then(async response => {
                console.log(response.data)
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.empty && data.pageable.pageNumber === 0) {
                        this.setState({empty: true})
                    }
                    if (data.last && data.empty) {
                        this.setState({finished: true, loading: false});
                    } else {
                        let list;
                        if (click !== 'click') {
                            list = this.state.list;
                        } else {
                            list = [];
                        }

                        data.content.map((items) => {
                            if (this.getButtonStatus(items.buttonStatus, items.sessionStatus, items.endDateAndTime).text !== 'Booking Closed') {
                                list.push({
                                    id: items.id,
                                    name: items.className,
                                    startTime: Moment(new Date(items.dateAndTime), 'hh:mm').format('LT'),
                                    endTime: Moment(new Date(items.endDateAndTime), 'hh:mm').format('LT'),
                                    endDateAndTime: items.endDateAndTime,
                                    date: new Date(items.dateAndTime).toDateString(),
                                    duration: items.duration,
                                    classTypeName: items.classTypeName,
                                    image: items.classProfileImage !== null ? items.classProfileImage : null,
                                    rating: items.classRating,
                                    ratingCount: items.ratingCount,
                                    price: items.price,
                                    location: items.location.city,
                                    buttonStatus: items.buttonStatus,
                                    sessionStatus: items.sessionStatus,
                                    discountMaxAmount: items.discountMaxAmount,
                                    discountPercentage: items.discountPercentage,
                                    discountDescription: items.discountDescription,
                                    membershipBooked: items.membershipBooked,
                                    bookedMemberships: items.bookedMemberships,
                                    allowCashPayment: items.allowCashPayment,
                                    classId: items.classId,
                                    promoCodeType: 'FITNESS_CLASS'
                                });
                            }


                        });

                        if (list.length === 0) {
                            this.setState({empty: true})
                        }

                        if (data.last) {
                            this.setState({finished: true, loading: false});
                        }
                        this.setState({
                            list: list,
                            nameSelect: false,
                        });
                    }
                } else {
                    this.setState({loading: false, empty: true});
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({loading: false});
                AppToast.networkErrorToast();
            });
    };

    /**
     * load 3 category
     */
    getCategory = async () => {
        this.setState({loading2: true});
        axios.get(SubUrl.get_all_class_types)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    const list = [];
                    for (let i = 0; i < 3; i++) {
                        list.push({
                            id: data[i].id,
                            name: data[i].typeName,
                        })
                    }
                    this.setState({
                        listCategory: list,
                        loading2: false
                    })
                } else {
                    this.setState({loading2: false});
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({loading2: false});
                AppToast.networkErrorToast();
            })
    }

    /**
     * state changer in text fields
     * @param name
     * @param length
     * @returns {Function}
     */
    onTextChange = (name, length) => val => {

        prev = new Date().getTime();

        const item = this.state[name];
        item.value = val;
        this.setState({
            [name]: item,
        });
        this.setState({
            list: [],
            listBusiness: [],
            nameSelect: false,
            classType: '',
            empty: false,
            pageNumber: 0,
            finished: false,
            loading: false,

        });

        setTimeout(() => {
            let now = new Date().getTime();
            if (now - prev >= 1000) {
                prev = now;

                if (this.state.selectedIndex !== 0) {
                    this.checkClassTypes('click');
                } else {
                    this.getAllBusiness(0, 'click');
                    this.facebookAnalytics('business')
                }
                this.googleAnalytics();
            }
        }, 1000)

    };

    isItemSelected = (item) => {
        for (let i = 0; i < this.state.selectedList.length; i++) {
            if (item === this.state.selectedList[i]) {
                return i;
            }
        }
        return -1;
    };

    onCategoryClick = (item) => {
        const selectedList = this.state.selectedList;
        const number = this.isItemSelected(item);
        if (number === -1) {
            selectedList.push(item);
        } else {
            selectedList.splice(number, 1);
        }

        this.setState({
            selectedList: selectedList
        });


        console.log(this.state.selectedList);

        this.setState({
            list: [],
            listBusiness: [],
            pageNumber: 0,
            empty: false,
            typeSelect: true,
            finished: false,
            loading: !this.state.loading,
        })
        if (this.state.selectedIndex !== 0) {
            this.checkClassTypes('firstTime');
        } else {
            this.getAllBusiness();
        }

    };
    async hideAlert2(type) {
        const {push} = this.props.navigation;
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
    }

    /**
     * location search visibility handler
     * @returns {Promise<void>}
     */
    toggleModal = async () => {
        this.setState({
            empty: false,
            pageNumber: 0,
            searchKey: {
                value: '',
                valid: true
            },
            list: [],
            listBusiness: [],
            finished: false,
            loadLocation: !this.state.loadLocation,
            modalVisible: !this.state.modalVisible,
        });
        this.getLocationAddress();
        if (this.state.selectedIndex !== 0) {
            this.checkClassTypes('firstTime');
        } else {
            this.getAllBusiness();
        }
    };

    closeModal = async () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    onButtonClick = async (type, item) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'book':
                navigate('SelectedDetails', {
                    sessionId: item.id,
                    role: this.state.role
                });
                this.setState({
                    searchKey: {
                        value: '',
                        valid: true
                    },
                    selectedList: [],
                    checkIn: false
                })
                break;
            case 'modal':
                this.setState({modalVisible: true});
                break;
            case 'fitness':
                this.setState({
                    nameSelect: false,
                    typeSelect: false
                });
                navigate('FitnessForm', {
                    selectedList: this.state.selectedList,
                    category: 'class',
                    redirectPage: 'Sessions'
                });

                // this.props.updateActiveRoute('Sessions');
                break;
            case 'search':
                if (this.state.selectedIndex !== 0) {
                    this.setState({
                        nameSelect: true,
                        empty: false,
                        list: [],
                        loading: !this.state.loading,
                        categoryId: ''
                    });
                    this.checkClassTypes('firstTime');

                } else {
                    this.setState({nameSelect: true, listBusiness: [], empty: false, loading: !this.state.loading});
                    this.facebookAnalytics('business');
                    this.getAllBusiness(0, 'click');
                }
                this.googleAnalytics();
                break;
            case 'business':
                navigate('BusinessProfile', {
                    businessId: item.id,
                    businessName: item.name,
                    navigateState: this.state.role,
                    classCategory: this.state.businessType,
                    refresh: true
                });
                this.setState({
                    searchKey: {
                        value: '',
                        valid: true
                    },
                    selectedList: []
                })
                break;
            case 'buttonStatus':

                if (item.membershipBooked && item.buttonStatus !== 'FIRST_FREE') {
                    navigate('CheckOut2Form', {
                        price: item.price,
                        object: {
                            id: item.id,
                            name: item.name,
                            startTime: item.startTime,
                            endTime: item.endTime,
                            date: item.date,
                            discountMaxAmount: item.discountMaxAmount,
                            discountPercentage: item.discountPercentage,
                            discountDescription: item.discountDescription,
                            promoCodeType: item.promoCodeType,
                            promoCodeId: item.classId
                        },
                        sessionType: item.buttonStatus,
                        classType: this.state.role,
                        bookedMemberships: item.bookedMemberships,
                        redirectForm: 'Sessions',
                        allowCashPayment: item.allowCashPayment
                    })
                } else {
                    navigate('CheckOutForm', {
                        price: item.price,
                        object: {
                            id: item.id,
                            name: item.name,
                            startTime: item.startTime,
                            endTime: item.endTime,
                            date: item.date,
                            discountMaxAmount: item.discountMaxAmount,
                            discountPercentage: item.discountPercentage,
                            discountDescription: item.discountDescription,
                            promoCodeType: item.promoCodeType,
                            promoCodeId: item.classId
                        },
                        sessionType: item.buttonStatus,
                        role: 'class_trainer',
                        classType: this.state.role,
                        redirectForm: 'Sessions'
                    })
                }

                break;
            default:
                break;
        }
    };

    getButtonStatus = (buttonStatus, sessionStatus, endTime) => {
        if (sessionStatus === 'PENDING' || sessionStatus === 'ONGOING') {
            if (buttonStatus === 'PURCHASED' || buttonStatus === 'PENDING_PURCHASE' || buttonStatus === 'PENDING_PAYMENT') {
                if (Date.parse(new Date()) > Date.parse(new Date(endTime))) {
                    return {text: 'Session Completed', enabled: false, hidePrice: true, crossPrice: false}
                } else if (buttonStatus === 'PENDING_PAYMENT') {
                    return {
                        text: 'Pending Payment',
                        enabled: false,
                        hidePrice: true,
                        crossPrice: false,
                        color: Color.gray
                    }
                } else {
                    return {text: 'Reserved', enabled: false, hidePrice: true, crossPrice: false};
                }
            } else {
                if (Date.parse(new Date()) > Date.parse(new Date(endTime))) {
                    return {text: 'Booking Closed', enabled: false, hidePrice: true, crossPrice: false}
                } else {
                    switch (buttonStatus) {
                        case 'FIRST_FREE':
                            return {text: 'Try First Class Free', enabled: true, hidePrice: false, crossPrice: true};
                        case 'PAY':
                        case 'DISCOUNT':
                            return {text: 'Reserve this Session', enabled: true, hidePrice: false, crossPrice: false};
                        case 'FULL':
                            return {text: 'Session Full', enabled: false, hidePrice: true, crossPrice: false};
                        case 'CORPORATE_RESERVE':
                            return {text: 'Reserve Session', enabled: true, hidePrice: false, crossPrice: false}
                        default:
                            return {text: '', enabled: false, hidePrice: true, crossPrice: false};
                    }
                }
            }
        } else if (sessionStatus === 'FINISHED') {
            return {text: 'Completed', enabled: false, hidePrice: true, crossPrice: false}
        } else {
            return {text: 'Cancelled', enabled: false, hidePrice: true, crossPrice: false}
        }

    };



    render() {
        const buttons = ['Studios', 'Calendar'];
        const {selectedIndex} = this.state;

        const listClasses = this.state.list.map((item, i) => (
            <SessionCard
                role={this.state.role}
                data={item}
                onCardPress={() => this.onButtonClick('book', item)}
                onBtnPress={() => this.onButtonClick('buttonStatus', item)}
                key={i}
            />
        ));


        const listBusiness = this.state.listBusiness.map((item, i) => (
            <TouchableOpacity
                style={styles.businessContainer} key={i}
                onPress={() => this.onButtonClick('business', item)}>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.imageOuter}>
                        <Image source={item.image !== null ? {uri: item.image} : PlaceholderIMG} reziseMode={'stretch'}
                               style={styles.imageStyle}/>
                    </View>
                    <View style={{flexDirection: 'column', width: '70%'}}>
                        <Text style={this.state.role !== 'online' ? styles.containerTitle : {
                            ...styles.containerTitle,
                            lineHeight: 22
                        }}>{item.name}</Text>
                        <Text style={styles.address}>Offers {item.averageClassesPerWeek} Classes a week</Text>
                        <RatingModal
                            rating={item.rating}
                            count={item.ratingCount}
                            color={'#4B6883'}
                            fontSize={14}
                            tintColor={Color.white}
                        />


                        {this.state.role !== 'online' ? (
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{width: 10, height: 10, marginRight: 5}}>
                                    <Image source={Location} style={{width: '100%', height: '100%'}}
                                           resizeMode={'contain'}/>
                                </View>
                                <Text style={styles.address}>{item.city + ' (' + item.distance + ' Km Away)'}</Text>
                            </View>

                        ) : null}


                        <View style={styles.categoryOuter}>
                            {item.classTypes.map((items, j) => (
                                <View key={j}>
                                    {j < 3 ? (
                                        <View style={styles.categoryBox}>
                                            <Text style={styles.categoryName}>{items}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            ))}
                            {item.classTypes.length > 3 ? (
                                <View style={styles.categoryBox}>
                                    <Text style={styles.categoryName}>+{item.classTypes.length - 3}</Text>
                                </View>
                            ) : null}


                        </View>

                    </View>

                </View>

            </TouchableOpacity>
        ));

        const categoyList = this.state.listCategory.map((item, i) => (
            <TouchableOpacity
                style={this.isItemSelected(item.id) > -1 ? {
                    ...styles.categoryBtn,
                    backgroundColor: Color.darkOrange,
                    borderWidth: 0
                } : styles.categoryBtn}
                key={i}
                onPress={() => this.onCategoryClick(item.id)}>
                <Text style={this.isItemSelected(item.id) > -1 ? {
                    ...styles.categoryTitle,
                    color: Color.white
                } : styles.categoryTitle}
                      adjustsFontSizeToFit={true}
                      minimumFontScale={0.1}
                >{item.name}</Text>
            </TouchableOpacity>
        ))

        return (
            <SafeAreaView style={styles.container}>
                <HeaderSearchBar
                    value={this.state.searchKey.value}
                    onTextChange={this.onTextChange('searchKey')}
                    navigation={this.props.navigation}
                    headerTitle={'Fitness classes around you'}
                    searchBtnPlaceholder={this.state.selectedIndex !== 0 ? 'Search for any class' : 'Search for any studios'}
                />
                <ScrollView
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {

                            if (!this.state.finished) {
                                this.setState({
                                    pageNumber: this.state.pageNumber + 1,
                                    loading: !this.state.loading,
                                });
                                if (this.state.selectedIndex !== 0) {

                                    this.checkClassTypes('fistTime');
                                } else {
                                    const page = this.state.pageNumber + 1;
                                    this.getAllBusiness(page);
                                }


                            }
                        }
                    }}
                    style={{width: '100%'}}
                >

                    {this.state.role !== 'online' ? (
                        <LocationChanger
                            loadLocation={this.state.loadLocation}
                            locationName={this.state.locationName}
                            onPress={() => this.onButtonClick('modal')}
                        />
                    ) : null}


                    <View style={styles.AuthHolder}>
                        <ButtonGroup
                            buttons={buttons}
                            onPress={this.updateIndex}
                            selectedIndex={selectedIndex}
                            containerStyle={styles.containerStyle}
                            bgColor={Color.pinkBlue}

                        />

                        <View style={styles.categoryHolder}>
                            <Text style={styles.filterTitle}>Filter by class type</Text>
                            {this.state.loading2 ? (
                                <ActivityIndicator
                                    animating
                                    size="small"
                                    style={{marginVertical: 10}}
                                />
                            ) : (
                                <View style={{
                                    flexDirection: 'row', width: '100%', alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {categoyList}
                                    <TouchableOpacity
                                        style={{
                                            ...styles.categoryBtn,
                                            backgroundColor: Color.softLightOrange,
                                            borderWidth: 0
                                        }}
                                        onPress={() => this.onButtonClick('fitness')}>
                                        {/*<Image source={Filter1} style={{width: '50%', height: '50%'}}*/}
                                        {/*resizeMode={'contain'}/>*/}
                                        <Text style={{...styles.categoryTitle, fontSize: 13, color: Color.darkOrange}}>More
                                            Filters</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </View>

                        {this.state.selectedIndex !== 0 ? (
                            <View style={styles.pickerContainer}>

                                <CalendarStrip
                                    // scrollable={true}
                                    startingDate={this.state.selectedDate}
                                    selectedDate={this.state.selectedDate}
                                    // minDate={new Date()}
                                    onDateSelected={(date) => {
                                        this.setState({
                                            date: Moment(date).format('YYYY-MM-DD'),
                                            selectedDate: date,
                                            finished: false,
                                            list: [],
                                            nameSelect: false,
                                            pageNumber: 0,
                                            empty: false,
                                            loading: !this.state.loading
                                        })


                                        this.checkClassTypes();
                                    }}
                                    highlightDateNumberStyle={{
                                        top: 10,
                                        lineHeight: 23,
                                        backgroundColor: Color.orange,
                                        width: 30,
                                        height: 25,
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                        color: Color.white,
                                        fontSize: 12,
                                        fontFamily: Font.Regular
                                    }}
                                    calendarHeaderPosition={"above"}
                                    style={{height: 100, width: screenWidth / 100 * 95, marginTop: 15}}
                                    calendarHeaderStyle={{color: Color.black, fontSize: 12, fontFamily: Font.Regular}}
                                    dateNameStyle={{
                                        color: '#868686',
                                        fontSize: 11,
                                        lineHeight: 25,
                                        fontFamily: Font.Regular
                                    }}
                                    dateNumberStyle={{
                                        color: '#A7A7A7',
                                        fontSize: 12,
                                        marginTop: 10,
                                        fontFamily: Font.Regular
                                    }}
                                    datesBlacklist={(date) => {
                                        return Date.parse(new Date().toDateString()) >= Date.parse(new Date(date));
                                    }}
                                    disabledDateNameStyle={{
                                        color: '#868686',
                                        fontSize: 11,
                                        lineHeight: 25,
                                        fontFamily: Font.Regular
                                    }}
                                    disabledDateNumberStyle={{
                                        color: '#A7A7A7',
                                        fontSize: 12,
                                        marginTop: 10,
                                        fontFamily: Font.Regular
                                    }}
                                    iconLeft={leftArrow}
                                    iconRight={rightArrow}
                                />

                                <View style={{width: '50%', marginBottom: 10}}>
                                    <RangeSlider
                                        valueType="time"
                                        ref={component => this._slider = component}
                                        gravity={'bottom'}
                                        labelStyle={'none'}
                                        style={{width: screenWidth * 90 / 100, height: 50}}
                                        min={this.state.min}
                                        max={this.state.max}
                                        selectionColor={Color.lightGreen}
                                        blankColor="#DCDCDC"
                                        step={3600000}
                                        textFormat="HH:mm"
                                        onTouchStart={() => {
                                            this.setState({
                                                list: [],
                                                nameSelect: false,
                                                pageNumber: 0,
                                                empty: false,
                                                loading: !this.state.loading,
                                            });
                                        }}
                                        onTouchEnd={() => {
                                            this.checkClassTypes();
                                        }}
                                        onValueChanged={(low, high, fromUser) => {
                                            this.setState({
                                                rangeLow: low,
                                                rangeHigh: high,
                                            });
                                        }}
                                        lineWidth={5}
                                        labelTextColor={Color.red}
                                        thumbColor={Color.white}
                                        labelBackgroundColor={Color.white}
                                        labelBorderColor={Color.black}
                                        thumbBorderWidth={1}
                                        initialLowValue={this.state.rangeLow}
                                        initialHighValue={this.state.rangeHigh}
                                    />
                                    <Text
                                        style={styles.timeMarker}>{Moment(this.state.rangeLow, 'hh:mm').format('LT')}</Text>
                                    <Text style={{
                                        ...styles.timeMarker,
                                        right: 0
                                    }}>{Moment(this.state.rangeHigh, 'hh:mm').format('LT')}</Text>

                                </View>
                                {this.state.empty && this.state.list.length === 0 ? (
                                    <EmptyAlert message={'Sorry,we could\'t find matching results'}/>
                                ) : listClasses}


                            </View>
                        ) : (
                            <View style={{marginTop: 10}}>
                                {this.state.empty ? (
                                    <EmptyAlert message={'Sorry,we could\'t find matching results'}/>
                                ) : listBusiness}

                            </View>
                        )}

                    </View>
                    {
                        this.state.loading ?
                            <View style={styles.gifHolder}>
                                <Image source={gif} style={styles.gif}/>
                            </View>
                            : null
                    }
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <Model
                        toggleModal={() => this.toggleModal()}
                        closeModal={() => this.closeModal()}
                    />
                </Modal>

            </SafeAreaView>

        )
    }
}


const mapStateToProps = (state) => ({
    latitude: state.user.latitude,
    longitude: state.user.longitude
});

const mapDispatchToProps = dispatch => {
    return {
        updateActiveRoute: activeRoute => dispatch(actionTypes.updateActiveRoute(activeRoute)),
        getGuestNavigationParams: navigationParams => dispatch(actionTypes.getGuestNavigationParams(navigationParams))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
