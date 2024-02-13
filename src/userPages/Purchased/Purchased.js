import React, {PureComponent} from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from "./styles";
import Filter from "../../assets/Sample/filter2.png";
import Calander from "../../assets/Home/grayCalendar.png";
import {Color} from "../../constance/Colors";
import {ButtonGroup} from "react-native-elements";
import axios from '../../axios/axios'
import {StorageStrings} from "../../constance/StorageStrings";
import {SubUrl} from "../../axios/server_url";
import Moment from 'moment';
import gif from "../../assets/Home/loading.gif";
import Flag from "react-native-flags";
import {Font} from "../../constance/AppFonts";
import {AppToast} from "../../constance/AppToast";
import CustomPicker from "../../component/CustomPicker/CustomPicker";
import RatingModal from '../../component/UIElement/RatingModal';
import EmptyAlert from "../../component/UIElement/EmptyAlert";
import PlaceholderIMG from '../../assets/Sample/placeholderIMG.jpg';
import Toast from 'react-native-simple-toast';
import {connect} from 'react-redux';
import * as actionTypes from "../../store/actions";
import {HardwareBackAction} from "../../component/Actions/HardwareBackAction";
import LocationImg from "../../assets/Home/whiteLocation.png";
import CoachTabComponent from "../../component/UIElement/CoachTabComponent";
import UpArrow from "../../assets/Home/upArrow.png";
import DownArrow from "../../assets/Home/downArrow.png";
import MembershipCard from "../../component/UIElement/MembershipCard";
import {CurrencyType} from "../../constance/AppCurrency";
import {AccordionList} from 'accordion-collapse-react-native';
import CorporateComponent from '../../component/UIElement/CorporateComponent';
import {GROUP_CLASS_ONLY} from "../../constance/Const";


const screenHeight = Math.round(Dimensions.get('window').height);

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

class App extends PureComponent {
    state = {
        selectedIndex: 0,
        type: {
            value: 'OFFLINE',
            valid: true
        },
        pageNumber: 0,
        finished: false,
        loading: false,
        list: [],
        list2: [],
        listClassMemberships: [],
        empty: false,
        role: ''
    };

    componentWillMount() {
        this.updateIndex = this.updateIndex.bind(this);
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            if (this.state.selectedIndex === 0) {
                this.getAllUpCommingList('scroll');
            } else {
                this.getAllPastList('scroll');
            }

            this.setState({
                loading: !this.state.loading,
                pageNumber: 0,
                finished: false,
                list: [],
                list2: [],
                empty: false
            });
            this.getNotificationCounts();
        })


    }

    async componentDidMount(): void {
        this.props.navigation.addListener('willFocus', this.load);
    }

    /**
     * handle device back action
     */
    load = () => {
        HardwareBackAction.setBackAction(() => {
            this.props.navigation.navigate('Home');
        });
    };

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    /**
     * get notification count api
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
     * button group action handler
     * @param selectedIndex
     */
    updateIndex(selectedIndex) {
        if (selectedIndex !== this.state.selectedIndex) {
            this.setState({
                selectedIndex,
                pageNumber: 0,
                finished: false,
                loading: true,
                list: [],
                list2: [],
                empty: false
            });
            if (selectedIndex === 0) {
                this.getAllUpCommingList();
            } else {
                this.getAllPastList();
            }
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
     * drop down select action handler
     * @param type
     * @param value
     */
    onPicker = (type, value) => {
        this.setState({
            [type]: {
                value: value,
                valid: true
            },
            pageNumber: 0,
            finished: false,
            loading: false,
            list: [],
            list2: [],
            empty: false
        });
        this.setState({loading: !this.state.loading});
        if (this.state.selectedIndex !== 0) {
            this.getAllPastList();
        } else {
            this.getAllUpCommingList();
        }


    };

    /**
     * get country flag using country code
     * @param countryName
     * @returns {*}
     */
    static getCountryCodeByName(countryName): string {
        const countries = require('../../component/json/countries');

        for (const c of countries) {
            if (c.name === countryName) {
                return c.alpha2Code;
            }
        }

        return null;
    }


    /**
     * Active classes api of online classes/physical classes/class & gym memberships/online coaching/daypasses
     * @param scroll
     */
    getAllUpCommingList = async (scroll) => {
        const userId = await AsyncStorage.getItem(StorageStrings.USER_ID);
        const page = this.state.pageNumber;

        if (this.state.type.value === 'GROUP' || this.state.type.value === 'PERSONAL') {
            this.setState({role: 'online'});
            axios.get(SubUrl.get_all_booked_upcomming_session_of_the_user + userId + '/booked?page=' + page + '&size=5' + '&category=' + this.state.type.value)
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {
                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list
                            }

                            data.content.map((items) => {
                                list.push({
                                    id: items.id,
                                    name: items.className,
                                    rating: items.classRating,
                                    count: items.ratingCount,
                                    startTime: Moment(new Date(items.dateAndTime), 'hh:mm').format('LT'),
                                    endTime: Moment(new Date(items.endDateAndTime), 'hh:mm').format('LT'),
                                    date: new Date(items.dateAndTime).toDateString(),
                                    image: items.classProfileImage !== null ? items.classProfileImage : null,
                                    language: items.language,
                                    country: items.country
                                })
                            });

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }

                            this.setState({
                                list: list,
                                loading: false
                            })
                        }


                    } else {
                        this.setState({loading: false});
                        Toast.show(response.data.message)
                    }

                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'OFFLINE') {
            this.setState({role: 'offline'});
            axios.get(SubUrl.get_all_booked_upcoming_physical_session_of_the_user + userId + '/booked/physical?page=' + page + '&size=5')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {
                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list
                            }

                            data.content.map((items) => {
                                list.push({
                                    id: items.id,
                                    name: items.className,
                                    rating: items.classRating,
                                    count: items.ratingCount,
                                    startTime: Moment(new Date(items.dateAndTime), 'hh:mm').format('LT'),
                                    endTime: Moment(new Date(items.endDateAndTime), 'hh:mm').format('LT'),
                                    date: new Date(items.dateAndTime).toDateString(),
                                    image: items.classProfileImage !== null ? items.classProfileImage : null,
                                    language: items.language,
                                    country: items.country,
                                    location: items.location.city,
                                })
                            });

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }

                            this.setState({
                                list: list,
                                loading: false
                            })
                        }


                    } else {
                        this.setState({loading: false});
                        Toast.show(response.data.message)
                    }

                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'CLASS_MEMBERSHIP') {

            axios.get(SubUrl.get_active_purchased_physical_class_memberships + userId + '?page=' + page + '&size=10')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {

                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list
                            }

                            data.content.map((item) => {
                                list.push({
                                    id: item.classId,
                                    name: item.className,
                                    membershipBooked: false,
                                    memberships: item.memberships
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }
                            this.setState({
                                list: list,
                                loading: false
                            });

                        }
                    } else {
                        this.setState({loading: false});
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'ONLINE_CLASS_MEMBERSHIP') {

            axios.get(SubUrl.get_active_purchased_online_class_memberships + userId + '?page=' + page + '&size=10')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {

                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list
                            }

                            data.content.map((item) => {
                                list.push({
                                    id: item.classId,
                                    name: item.className,
                                    membershipBooked: false,
                                    memberships: item.memberships
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }
                            this.setState({
                                list: list,
                                loading: false
                            });

                        }
                    } else {
                        this.setState({loading: false});
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'CORPORATE_MEMBERSHIP') {
            axios.get(SubUrl.get_active_purchased_corporative_memberships + userId + '?page=' + page + '&size=10')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {

                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((item) => {
                                list.push({
                                    id: item.classId,
                                    name: item.className,
                                    memberships: item.memberships,
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }
                            this.setState({
                                list: list,
                                loading: false
                            });

                        }
                    } else {
                        this.setState({loading: false});
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'GYM_MEMBERSHIP') {
            axios.get(SubUrl.get_active_purchased_gym_memberships + userId + '?page=' + page + '&size=10')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {

                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((item) => {
                                list.push({
                                    id: item.gymId,
                                    name: item.gymName,
                                    memberships: [item.membership],
                                    publicUserMembershipId: item.publicUserMembershipId
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }
                            this.setState({
                                list: list,
                                loading: false
                            });

                        }
                    } else {
                        this.setState({loading: false});
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'DAY_PASS') {
            axios.get(SubUrl.get_active_day_passes + userId + '?page=' + page + '&size=5')
                .then(async response => {

                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {
                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list
                            }

                            data.content.map((items) => {
                                list.push({
                                    id: items.gymId,
                                    name: items.gymName,
                                    rating: items.gymRating,
                                    count: items.gymRatingCount,
                                    date: new Date().toDateString(),
                                    image: items.gymImage !== null ? items.gymImage : null,
                                    location: items.location.city,
                                    price: items.membership.discountedPrice
                                })
                            });

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }

                            this.setState({
                                list: list,
                                loading: false
                            })
                        }


                    } else {
                        this.setState({loading: false});
                        Toast.show(response.data.message)
                    }


                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else {
            axios.get(SubUrl.get_active_purchased_online_coaching + userId + '/subscribed?page=' + page + '&size=5')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {
                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list
                            }

                            data.content.map((items) => {
                                list.push({
                                    id: items.instructor.id,
                                    firstName: items.instructor.firstName,
                                    lastName: items.instructor.lastName,
                                    types: items.instructor.packageTypes,
                                    country: App.getCountryCodeByName(items.instructor.country),
                                    image: items.instructor.image !== null ? items.instructor.image : null,
                                    description: items.instructor.description !== null ? items.instructor.description : null,
                                    rating: items.rating,
                                    ratingCount: items.ratingCount
                                })
                            });

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }

                            this.setState({
                                list: list,
                                loading: false
                            })
                        }


                    } else {
                        this.setState({loading: false});
                        Toast.show(response.data.message)
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        }

    };


    /**
     * Inactive classes api of online classes/physical classes/class & gym memberships/online coaching/daypasses
     * @param scroll
     */
    getAllPastList = async (scroll) => {
        const userId = await AsyncStorage.getItem(StorageStrings.USER_ID);
        const page = this.state.pageNumber;

        if (this.state.type.value === 'GROUP' || this.state.type.value === 'PERSONAL') {
            this.setState({role: 'online'})
            axios.get(SubUrl.get_all_book_history_of_user + userId + '/booked/history?page=' + page + '&size=5' + '&category=' + this.state.type.value)
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {
                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((items) => {
                                list.push({
                                    id: items.id,
                                    name: items.className,
                                    rating: items.classRating,
                                    count: items.ratingCount,
                                    startTime: Moment(new Date(items.dateAndTime), 'hh:mm').format('LT'),
                                    endTime: Moment(new Date(items.endDateAndTime), 'hh:mm').format('LT'),
                                    date: new Date(items.dateAndTime).toDateString(),
                                    image: items.classProfileImage !== null ? items.classProfileImage : null,
                                    language: items.language,
                                    country: items.country,
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }

                            this.setState({
                                list2: list,
                                loading: false
                            })
                        }
                    } else {
                        this.setState({loading: false});
                        Toast.show(response.data.message)
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'OFFLINE') {
            this.setState({role: 'offline'})
            axios.get(SubUrl.get_all_book_physical_history_of_user + userId + '/booked/history/physical?page=' + page + '&size=5')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {
                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((items) => {
                                list.push({
                                    id: items.id,
                                    name: items.className,
                                    rating: items.classRating,
                                    count: items.ratingCount,
                                    startTime: Moment(new Date(items.dateAndTime), 'hh:mm').format('LT'),
                                    endTime: Moment(new Date(items.endDateAndTime), 'hh:mm').format('LT'),
                                    date: new Date(items.dateAndTime).toDateString(),
                                    image: items.classProfileImage !== null ? items.classProfileImage : null,
                                    language: items.language,
                                    country: items.country,
                                    location: items.location.city,
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }

                            this.setState({
                                list2: list,
                                loading: false
                            })
                        }
                    } else {
                        this.setState({loading: false});
                        Toast.show(response.data.message)
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'CLASS_MEMBERSHIP') {

            axios.get(SubUrl.get_inactive_purchased_physical_class_memberships + userId + '?page=' + page + '&size=10')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {

                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((item) => {
                                list.push({
                                    id: item.classId,
                                    name: item.className,
                                    membershipBooked: false,
                                    memberships: item.memberships
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }
                            this.setState({
                                list2: list,
                                loading: false
                            });

                        }
                    } else {
                        this.setState({loading: false});
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'ONLINE_CLASS_MEMBERSHIP') {

            axios.get(SubUrl.get_inactive_purchased_online_class_memberships + userId + '?page=' + page + '&size=10')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {

                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((item) => {
                                list.push({
                                    id: item.classId,
                                    name: item.className,
                                    membershipBooked: false,
                                    memberships: item.memberships
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }
                            this.setState({
                                list2: list,
                                loading: false
                            });

                        }
                    } else {
                        this.setState({loading: false});
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'CORPORATE_MEMBERSHIP') {
            axios.get(SubUrl.get_inactive_purchased_corporative_membership + userId + '?page=' + page + '&size=10')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {

                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((item) => {
                                list.push({
                                    id: item.classId,
                                    name: item.className,
                                    memberships: item.memberships,
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }
                            this.setState({
                                list2: list,
                                loading: false
                            });

                        }
                    } else {
                        this.setState({loading: false});
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'GYM_MEMBERSHIP') {
            axios.get(SubUrl.get_inactive_purchased_gym_memberships + userId + '?page=' + page + '&size=10')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {

                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((item) => {
                                list.push({
                                    id: item.gymId,
                                    name: item.gymName,
                                    memberships: [item.membership],
                                    publicUserMembershipId: item.publicUserMembershipId
                                })
                            })

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }
                            this.setState({
                                list2: list,
                                loading: false
                            });

                        }
                    } else {
                        this.setState({loading: false});
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else if (this.state.type.value === 'DAY_PASS') {
            axios.get(SubUrl.get_inactive_day_passes + userId + '?page=' + page + '&size=5')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {
                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((items) => {
                                list.push({
                                    id: items.gymId,
                                    name: items.gymName,
                                    rating: items.gymRating,
                                    count: items.gymRatingCount,
                                    date: new Date().toDateString(),
                                    image: items.gymImage !== null ? items.gymImage : null,
                                    location: items.location.city,
                                    price: items.membership.discountedPrice
                                })
                            });

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }

                            this.setState({
                                list2: list,
                                loading: false
                            })
                        }


                    } else {
                        this.setState({loading: false});
                        Toast.show(response.data.message)
                    }

                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        } else {
            axios.get(SubUrl.get_inactive_purchased_online_coaching + userId + '/subscribed/history?page=' + page + '&size=5')
                .then(async response => {
                    if (response.data.success) {
                        const data = response.data.body;
                        if (data.empty && data.pageable.pageNumber === 0) {
                            this.setState({empty: true})
                        }
                        if (data.last && data.empty) {
                            this.setState({finished: true, loading: false});
                        } else {
                            let list;
                            if (scroll !== 'scroll') {
                                list = [];
                            } else {
                                list = this.state.list2
                            }

                            data.content.map((items) => {
                                list.push({
                                    id: items.instructor.id,
                                    firstName: items.instructor.firstName,
                                    lastName: items.instructor.lastName,
                                    types: items.instructor.packageTypes,
                                    country: App.getCountryCodeByName(items.instructor.country),
                                    image: items.instructor.image !== null ? items.instructor.image : null,
                                    description: items.instructor.description !== null ? items.instructor.description : null,
                                    rating: items.rating,
                                    ratingCount: items.ratingCount
                                })
                            });

                            if (data.last) {
                                this.setState({finished: true, loading: false});
                            }

                            this.setState({
                                list2: list,
                                loading: false
                            })
                        }


                    } else {
                        this.setState({loading: false});
                        Toast.show(response.data.message)
                    }
                })
                .catch(error => {
                    this.setState({loading: false});
                    AppToast.networkErrorToast();
                })
        }

    };

    checkMembershipType(type) {
        switch (type) {
            case 'GYM':
                return {role: 'gymMember'}
            case 'ONLINE_CLASS':
                return {role: 'classMember'}
            case 'PHYSICAL_CLASS':
                return {role: 'classMember'}
            case 'CORPORATE':
                return {role: 'classMember'}
        }
    }

    /**
     * button press action handler
     * @param type
     * @param item
     */
    onButtonClick = async (type, item) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'class':
                navigate('SelectedDetails', {
                    sessionId: item.id,
                    role: this.state.role,
                    refresh: true
                });
                break;
            case 'membership':
                navigate('MembershipDetailsForm', {
                    id: item.publicUserMembershipId,
                    role: this.checkMembershipType(item.type).role,
                    membershipType: item.type
                });
                break;
            case 'dayPass':
                navigate('GymProfileForm', {
                    gymId: item.id,
                    gymName: item.name,
                    refresh: true
                });
                break;
            case 'coaching':
                navigate('InstructorForm', {
                    trainerId: item.id,
                    refresh: true,
                    trainerType: 'coachTrainer'
                });
                break;
            default:
                break;
        }

    };

    head(item, index, isExpanded) {
        return (
            <View style={styles.mainTitleContainer}>
                <Text style={styles.mainTitle}>{item.name}</Text>
                <View style={{width: 22, height: 22}}>
                    <Image source={isExpanded ? UpArrow : DownArrow} style={{width: '100%', height: '100%'}}
                           resizeMode={'contain'}/>
                </View>
            </View>
        )

    };

    body(items) {

        const list = items.memberships.map((item, i) => (
            item.type !== 'CORPORATE' ? (
                <MembershipCard
                    status={'BOOKED'}
                    role={item.type === 'GYM' ? 'gymMember' : 'classMember'}
                    duration={item.duration}
                    name={item.name}
                    slotCount={item.slotCount}
                    discount={item.discount}
                    price={item.price}
                    discountedPrice={item.discountedPrice}
                    type={item.type}
                    onPress={() => this.onButtonClick('membership', item)}
                    key={i}
                />
            ) : (
                <CorporateComponent
                    status={'BOOKED'}
                    duration={item.duration}
                    name={item.name}
                    description={item.description}
                    slotCount={item.slotCount}
                    onPress={() => this.onButtonClick('membership', item)}
                    key={i}
                />
            )

        ))

        return (

            <View style={{width: '100%', alignItems: 'center'}}>
                {list}
            </View>
        )
    }

    dropDownChecker = (onlineVisible, corporateState, groupClassOnly) => {
        if (onlineVisible) {
            if (corporateState) {
                if (groupClassOnly) {
                    return [
                        {label: 'Fitness Classes', value: 'OFFLINE'},
                        {label: 'Online Fitness Classes', value: 'GROUP'},
                        {label: 'Fitness Class Memberships', value: 'CLASS_MEMBERSHIP'},
                        {label: 'Corporate Memberships', value: 'CORPORATE_MEMBERSHIP'},
                        {label: 'Gym Memberships', value: 'GYM_MEMBERSHIP'},
                        {label: 'Gym Day Passes', value: 'DAY_PASS'},
                        {label: 'Online Coaching', value: 'COACHING'}
                    ]
                } else {
                    return [
                        {label: 'Fitness Classes', value: 'OFFLINE'},
                        {label: 'Online Group Classes', value: 'GROUP'},
                        {label: 'Online One-To-One Classes', value: 'PERSONAL'},
                        {label: 'Fitness Class Memberships', value: 'CLASS_MEMBERSHIP'},
                        {label: 'Corporate Memberships', value: 'CORPORATE_MEMBERSHIP'},
                        {label: 'Gym Memberships', value: 'GYM_MEMBERSHIP'},
                        {label: 'Gym Day Passes', value: 'DAY_PASS'},
                        {label: 'Online Coaching', value: 'COACHING'}
                    ]
                }
            } else {
                if (groupClassOnly) {
                    return [
                        {label: 'Fitness Classes', value: 'OFFLINE'},
                        {label: 'Online Fitness Classes', value: 'GROUP'},
                        {label: 'Fitness Class Memberships', value: 'CLASS_MEMBERSHIP'},
                        // {label: 'Online Class Memberships', value: 'ONLINE_CLASS_MEMBERSHIP'},
                        {label: 'Gym Memberships', value: 'GYM_MEMBERSHIP'},
                        {label: 'Gym Day Passes', value: 'DAY_PASS'},
                        {label: 'Online Coaching', value: 'COACHING'}
                    ]
                } else {
                    return [
                        {label: 'Fitness Classes', value: 'OFFLINE'},
                        {label: 'Online Group Classes', value: 'GROUP'},
                        {label: 'Online One-To-One Classes', value: 'PERSONAL'},
                        {label: 'Fitness Class Memberships', value: 'CLASS_MEMBERSHIP'},
                        // {label: 'Online Class Memberships', value: 'ONLINE_CLASS_MEMBERSHIP'},
                        {label: 'Gym Memberships', value: 'GYM_MEMBERSHIP'},
                        {label: 'Gym Day Passes', value: 'DAY_PASS'},
                        {label: 'Online Coaching', value: 'COACHING'}
                    ]
                }
            }

        } else {
            return [
                {label: 'Fitness Classes', value: 'OFFLINE'},
                {label: 'Fitness Class Memberships', value: 'CLASS_MEMBERSHIP'},
                {label: 'Gym Memberships', value: 'GYM_MEMBERSHIP'},
                {label: 'Gym Day Passes', value: 'DAY_PASS'},
            ]
        }
    }

    render() {
        const buttons = ['Active', 'Past'];
        const {selectedIndex} = this.state;

        let listUpCommingClass;
        if (this.state.type.value === 'OFFLINE' || this.state.type.value === 'GROUP' || this.state.type.value === 'PERSONAL') {
            listUpCommingClass = this.state.list.map((item, i) => (
                <TouchableOpacity style={styles.listContainer} key={i}
                                  onPress={() => this.onButtonClick('class', item)}>
                    <View style={styles.imageContainer}>
                        <Image source={item.image !== null ? {uri: item.image} : PlaceholderIMG} style={styles.image}
                               resizeMode={'cover'}/>
                        <Image source={Filter} style={{...styles.image, zIndex: 2}}
                               resizeMode={'stretch'}/>
                        <View style={styles.imageBottomLiner}>
                            <Text style={styles.titleContent}>{item.name}</Text>
                            <View style={{flexDirection: 'row', marginLeft: 14, alignItems: 'center'}}>
                                <RatingModal
                                    rating={item.rating}
                                    count={item.count}
                                    color={Color.white}
                                    tintColor={'rgba(52, 52, 52, 3.9)'}
                                    fontSize={14}
                                />
                                <Text style={styles.dotStyle}>●</Text>
                                {this.state.role !== 'online' ? (
                                    <View style={{width: 10, height: 10, marginLeft: 5}}>
                                        <Image source={LocationImg} style={{width: '100%', height: '100%'}}
                                               resizeMode={'contain'}/>
                                    </View>
                                ) : null}
                                <Text style={{
                                    ...styles.ratingCount,
                                }}>{this.state.role === 'online' ? item.language : item.location}</Text>
                                {this.state.role === 'online' ? (<Text style={styles.dotStyle}>●</Text>) : null}
                                {this.state.role === 'online' ? (
                                    <Flag
                                        code={App.getCountryCodeByName(item.country)}
                                        size={24}
                                    />
                                ) : null}
                            </View>
                        </View>

                    </View>
                    <View style={{...styles.imageBottomLiner, flexDirection: 'row', paddingTop: 5}}>
                        <View style={styles.subImageHolder}>
                            <Image source={Calander} style={{width: '100%', height: '100%'}} resizeMode={'cover'}/>
                        </View>
                        <View style={{flexDirection: 'column', marginLeft: 5}}>
                            <Text style={styles.time}>{item.date}</Text>
                            <Text style={{
                                ...styles.time,
                                color: '#C9C9C9',
                                fontSize: 11
                            }}>{item.startTime}-{item.endTime}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ));
        } else if (this.state.type.value === 'CLASS_MEMBERSHIP' || this.state.type.value === 'ONLINE_CLASS_MEMBERSHIP') {
            listUpCommingClass = this.state.list.map((item, i) => (
                i === 0 ? (
                    <View style={{width: '100%', alignItems: 'center'}} key={i}>
                        <AccordionList
                            list={this.state.list}
                            header={(item, index, isExpanded) => this.head(item, index, isExpanded)}
                            body={(item) => this.body(item)}
                            expandedIndex={0}
                        />
                    </View>

                ) : null

            ));
        } else if (this.state.type.value === 'CORPORATE_MEMBERSHIP') {
            listUpCommingClass = this.state.list.map((item, i) => (
                i === 0 ? (
                    <View style={{width: '100%', alignItems: 'center'}} key={i}>
                        <AccordionList
                            list={this.state.list}
                            header={(item, index, isExpanded) => this.head(item, index, isExpanded)}
                            body={(item) => this.body(item)}
                            expandedKey={0}
                        />
                    </View>

                ) : null


            ));
        } else if (this.state.type.value === 'GYM_MEMBERSHIP') {
            listUpCommingClass = this.state.list.map((item, i) => (
                i === 0 ? (
                    <View style={{width: '100%', alignItems: 'center'}} key={i}>
                        <AccordionList
                            list={this.state.list}
                            header={(item, index, isExpanded) => this.head(item, index, isExpanded)}
                            body={(item) => this.body(item)}
                            expandedKey={0}
                        />
                    </View>

                ) : null


            ));
        } else if (this.state.type.value === 'DAY_PASS') {
            listUpCommingClass = this.state.list.map((item, i) => (
                <TouchableOpacity style={styles.listContainer} key={i}
                                  onPress={() => this.onButtonClick('dayPass', item)}>
                    <View style={styles.imageContainer}>
                        <Image source={item.image !== null ? {uri: item.image} : PlaceholderIMG} style={styles.image}
                               resizeMode={'cover'}/>
                        <Image source={Filter} style={{...styles.image, zIndex: 2}}
                               resizeMode={'stretch'}/>
                        <View style={styles.imageBottomLiner}>
                            <Text style={styles.titleContent}>{item.name}</Text>
                            <View style={{flexDirection: 'row', marginLeft: 14, alignItems: 'center'}}>
                                <RatingModal
                                    rating={item.rating}
                                    count={item.count}
                                    color={Color.white}
                                    tintColor={'rgba(52, 52, 52, 3.9)'}
                                    fontSize={14}
                                />
                                <Text style={styles.dotStyle}>●</Text>
                                <View style={{width: 10, height: 10, marginLeft: 5}}>
                                    <Image source={LocationImg} style={{width: '100%', height: '100%'}}
                                           resizeMode={'contain'}/>
                                </View>
                                <Text style={{
                                    ...styles.ratingCount,
                                }}>{item.location}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{...styles.imageBottomLiner, flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.subImageHolder}>
                            <Image source={Calander} style={{width: '100%', height: '100%'}} resizeMode={'cover'}/>
                        </View>
                        <View style={{flexDirection: 'column', marginLeft: 5}}>
                            <Text style={styles.time}>{item.date}</Text>
                        </View>
                        <View style={styles.amountContainer2}>
                            <Text style={styles.amountText2}>{this.numberFormat(item.price)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ));
        } else {
            listUpCommingClass = this.state.list.map((item, i) => (
                <CoachTabComponent
                    onPress={() => this.onButtonClick('coaching', item)}
                    image={item.image}
                    name={item.firstName + ' ' + item.lastName}
                    description={item.description}
                    country={item.country}
                    classTypes={item.types}
                    rating={item.rating}
                    ratingCount={item.ratingCount}
                    key={i}
                />
            ));

        }

        let listPassClass;

        if (this.state.type.value === 'OFFLINE' || this.state.type.value === 'GROUP' || this.state.type.value === 'PERSONAL') {
            listPassClass = this.state.list2.map((item, i) => (
                <TouchableOpacity style={styles.listContainer} key={i}
                                  onPress={() => this.onButtonClick('class', item)}>
                    <View style={styles.imageContainer}>
                        <Image source={item.image !== null ? {uri: item.image} : PlaceholderIMG} style={styles.image}
                               resizeMode={'cover'}/>
                        <Image source={Filter} style={{...styles.image, zIndex: 2}}
                               resizeMode={'stretch'}/>
                        <View style={styles.imageBottomLiner}>
                            <Text style={styles.titleContent}>{item.name}</Text>
                            <View style={{flexDirection: 'row', marginLeft: 14, alignItems: 'center'}}>
                                <RatingModal
                                    rating={item.rating}
                                    count={item.count}
                                    color={Color.white}
                                    tintColor={'rgba(52, 52, 52, 3.9)'}
                                    fontSize={14}
                                />
                                <Text style={styles.dotStyle}>●</Text>
                                {this.state.role !== 'online' ? (
                                    <View style={{width: 10, height: 10, marginLeft: 5}}>
                                        <Image source={LocationImg} style={{width: '100%', height: '100%'}}
                                               resizeMode={'contain'}/>
                                    </View>
                                ) : null}
                                <Text style={{
                                    ...styles.ratingCount,
                                }}>{this.state.role === 'online' ? item.language : item.location}</Text>
                                {this.state.role === 'online' ? (<Text style={styles.dotStyle}>●</Text>) : null}
                                {this.state.role === 'online' ? (
                                    <Flag
                                        code={App.getCountryCodeByName(item.country)}
                                        size={24}
                                    />
                                ) : null}
                            </View>
                        </View>

                    </View>
                    <View style={{...styles.imageBottomLiner, flexDirection: 'row', paddingTop: 5}}>
                        <View style={styles.subImageHolder}>
                            <Image source={Calander} style={{width: '100%', height: '100%'}} resizeMode={'cover'}/>
                        </View>
                        <View style={{flexDirection: 'column', marginLeft: 5}}>
                            <Text style={styles.time}>{item.date}</Text>
                            <Text style={{
                                ...styles.time,
                                color: '#C9C9C9',
                                fontSize: 11
                            }}>{item.startTime}-{item.endTime}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ));
        } else if (this.state.type.value === 'CLASS_MEMBERSHIP' || this.state.type.value === 'ONLINE_CLASS_MEMBERSHIP') {
            listPassClass = this.state.list2.map((item, i) => (
                i === 0 ? (
                    <View style={{width: '100%', alignItems: 'center'}} key={i}>
                        <AccordionList
                            list={this.state.list2}
                            header={(item, index, isExpanded) => this.head(item, index, isExpanded)}
                            body={(item) => this.body(item)}
                            expandedKey={0}
                        />
                    </View>

                ) : null
            ));
        } else if (this.state.type.value === 'CORPORATE_MEMBERSHIP') {
            listPassClass = this.state.list2.map((item, i) => (
                i === 0 ? (
                    <View style={{width: '100%', alignItems: 'center'}} key={i}>
                        <AccordionList
                            list={this.state.list2}
                            header={(item, index, isExpanded) => this.head(item, index, isExpanded)}
                            body={(item) => this.body(item)}
                            expandedKey={0}
                        />
                    </View>

                ) : null


            ));
        } else if (this.state.type.value === 'GYM_MEMBERSHIP') {
            listPassClass = this.state.list2.map((item, i) => (
                i === 0 ? (
                    <View style={{width: '100%', alignItems: 'center'}} key={i}>
                        <AccordionList
                            list={this.state.list2}
                            header={(item, index, isExpanded) => this.head(item, index, isExpanded)}
                            body={(item) => this.body(item)}
                            expandedKey={0}
                        />
                    </View>

                ) : null
            ));
        } else if (this.state.type.value === 'DAY_PASS') {
            listPassClass = this.state.list2.map((item, i) => (
                <TouchableOpacity style={styles.listContainer} key={i}
                                  onPress={() => this.onButtonClick('dayPass', item)}>
                    <View style={styles.imageContainer}>
                        <Image source={item.image !== null ? {uri: item.image} : PlaceholderIMG} style={styles.image}
                               resizeMode={'cover'}/>
                        <Image source={Filter} style={{...styles.image, zIndex: 2}}
                               resizeMode={'stretch'}/>
                        <View style={styles.imageBottomLiner}>
                            <Text style={styles.titleContent}>{item.name}</Text>
                            <View style={{flexDirection: 'row', marginLeft: 14, alignItems: 'center'}}>
                                <RatingModal
                                    rating={item.rating}
                                    count={item.count}
                                    color={Color.white}
                                    tintColor={'rgba(52, 52, 52, 3.9)'}
                                    fontSize={14}
                                />
                                <Text style={styles.dotStyle}>●</Text>
                                <View style={{width: 10, height: 10, marginLeft: 5}}>
                                    <Image source={LocationImg} style={{width: '100%', height: '100%'}}
                                           resizeMode={'contain'}/>
                                </View>
                                <Text style={{
                                    ...styles.ratingCount,
                                }}>{item.location}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{...styles.imageBottomLiner, flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.subImageHolder}>
                            <Image source={Calander} style={{width: '100%', height: '100%'}} resizeMode={'cover'}/>
                        </View>
                        <View style={{flexDirection: 'column', marginLeft: 5}}>
                            <Text style={styles.time}>{item.date}</Text>
                        </View>
                        <View style={styles.amountContainer2}>
                            <Text style={styles.amountText2}>{this.numberFormat(item.price)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ));
        } else {
            listPassClass = this.state.list2.map((item, i) => (
                <CoachTabComponent
                    onPress={() => this.onButtonClick('coaching', item)}
                    image={item.image}
                    name={item.firstName + ' ' + item.lastName}
                    description={item.description}
                    country={item.country}
                    classTypes={item.types}
                    rating={item.rating}
                    ratingCount={item.ratingCount}
                    key={i}
                />
            ));

        }


        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{width: '100%'}}
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (!this.state.finished) {
                                this.setState({
                                    pageNumber: this.state.pageNumber + 1,
                                    loading: !this.state.loading
                                });
                                if (this.state.selectedIndex === 0) {
                                    this.getAllUpCommingList('scroll');
                                } else {
                                    this.getAllPastList('scroll');
                                }
                            }
                        }
                    }}
                >
                    <View style={{width: '100%', alignItems: 'center', height: screenHeight / 100 * 5, marginTop: 10}}>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: Font.SemiBold,
                        }}>Purchases</Text>

                    </View>
                    <View style={styles.AuthHolder}>
                        <ButtonGroup
                            buttons={buttons}
                            onPress={this.updateIndex}
                            selectedIndex={selectedIndex}
                            containerStyle={styles.containerStyle}
                            selectedButtonStyle={{
                                backgroundColor: Color.white,
                                borderBottomColor: Color.softLightBlue,
                                borderBottomWidth: 2,
                            }}
                            selectedTextStyle={{color: Color.black}}
                            innerBorderStyle={{color: 'transparent',}}
                            textStyle={{
                                fontSize: 17,
                                fontFamily: Font.Regular,
                                lineHeight: 22,
                                color: Color.softLightBrown
                            }}
                            buttonStyle={{width: '75%', marginHorizontal: '12%'}}
                        />

                        <CustomPicker
                            items={this.dropDownChecker(this.props.visible, this.props.corporateState, GROUP_CLASS_ONLY)}
                            selectedValue={this.state.type.value}
                            onChangeItem={(item) => {
                                this.onPicker('type', item.value);
                            }}
                        />

                        <View style={{marginTop: 20, zIndex: 0}}>
                            {this.state.empty ? (
                                <EmptyAlert navigation={this.props.navigation}/>
                            ) : this.state.selectedIndex !== 0 ? listPassClass : listUpCommingClass}

                        </View>

                    </View>
                    {
                        this.state.loading ?
                            <View style={styles.gifHolder}>
                                <Image source={gif} style={styles.gif}/>
                            </View>
                            : null
                    }

                </ScrollView>


            </SafeAreaView>
        )
    }
}


const mapStateToProps = (state) => ({
    visible: state.user.visible,
    corporateState: state.user.corporateState,
});

const mapDispatchToProps = dispatch => {
    return {
        changeNotificationHolder: notificationCount => dispatch(actionTypes.changeNotificationHolder(notificationCount)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
