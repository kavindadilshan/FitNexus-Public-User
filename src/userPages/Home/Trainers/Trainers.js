import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    StatusBar, Modal
} from 'react-native';
import {styles} from "../Classes/ClassesDetails/styles";
import {Color} from "../../../constance/Colors";
import SearchBtn from "../../../assets/Sample/search.png";
import axios from '../../../axios/axios';
import {SubUrl} from "../../../axios/server_url";
import gif from '../../../assets/Home/loading.gif';
import {connect} from 'react-redux';
import * as actionTypes from '../../../store/actions';
import {AppToast} from "../../../constance/AppToast";
import PlaceholderIMG from "../../../assets/Sample/placeholderIMG.jpg";
import RatingModal from "../../../component/UIElement/RatingModal";
import EmptyAlert from "../../../component/UIElement/EmptyAlert";
import CoachTabComponent from '../../../component/UIElement/CoachTabComponent';
import ButtonGroup from '../../../component/Actions/ButtonGroup';
import {CurrencyType} from "../../../constance/AppCurrency";
import Model from "../../../component/UIElement/ModalInfo";
import ActiveLOGO from '../../../assets/Home/activeLabel.png'
import AlertMassage from "../../../component/Actions/AlertMassage";
import {AppEventsLogger} from "react-native-fbsdk";
import analytics from "@react-native-firebase/analytics";
import AsyncStorage from "@react-native-community/async-storage";


const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

let prev = 0;

class App extends React.Component {
    state = {
        selectedIndex: 0,
        searchKey: {
            value: '',
            valid: true
        },
        listBusiness: [],
        listTrainers: [],
        pageNumber: 0,
        finished: false,
        loading: false,
        nameSearch: false,
        typeSearch: false,
        empty: false,
        listCategory: [],
        selectedList: [],
        loading2: false,
        modalVisible: false,
        nameList: [],
        changed: false
    };

    componentWillMount() {
        this.updateIndex = this.updateIndex.bind(this);
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            let selectVal = this.props.navigation.getParam('selectedIndex');
            let selectedIndex = selectVal !== undefined && !this.state.changed ? selectVal : this.state.selectedIndex;

            const visible = this.props.modalVisible;
            this.setState({
                modalVisible: visible,
                listTrainers: [],
                pageNumber: 0,
                listBusiness: [],
                searchKey: {
                    value: '',
                    valid: true
                },
                empty: false,
                finished: false,
                selectedIndex: selectedIndex
            });
            this.getCategory();
            if (selectedIndex === 0) {
                this.getAllTrainers();
            } else {
                this.getAllBusiness();
            }
        })

    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    /**
     * button group action handler
     * @param selectedIndex
     */
    updateIndex(selectedIndex) {
        if (selectedIndex !== this.state.selectedIndex) {
            this.setState({
                selectedIndex,
                searchKey: {
                    value: '',
                    valid: true
                },
                listBusiness: [],
                listTrainers: [],
                pageNumber: 0,
                finished: false,
                loading: false,
                nameSearch: false,
                typeSearch: false,
                empty: false,
                selectedList: [],
                nameList: [],
                changed:true
            });
            if (selectedIndex === 0) {
                this.getAllTrainers(0, 'click', '');
            } else {
                this.getAllBusiness(0, 'click', '');

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


    timePeriodConverter = (days) => {
        if (days >= 365) {
            return (days / 365).toFixed(0) + ' Year'
        } else if (days >= 30) {
            return (days / 30).toFixed(0) + ' Month'
        } else {
            return days + ' Day'
        }
    };

    /**
     * call countryCode by countries json
     * */
    static getCountryCodeByName(countryName): string {
        const countries = require('../../../component/json/countries');
        for (const c of countries) {
            if (c.name === countryName) {
                return c.alpha2Code;
            }
        }
        return null;
    }

    /**
     * get all trainer endpoint
     * @param page
     * @param click
     * @returns {Promise<void>}
     */
    getAllTrainers = async (page, click, searchKey) => {
        if (page === undefined) {
            page = 0
        }
        const name = searchKey !== '' ? this.state.searchKey.value : '';
        let filterString = '';

        if (click !== 'click') {
            for (const selectedElm of this.state.nameList) {
                filterString += selectedElm + ',';
            }
            filterString = filterString.substring(0, filterString.length - 1);
        }

        console.log(filterString)
        console.log(this.state.nameList)

        this.setState({loading: true});
        axios.get(SubUrl.get_popular_online_personal_trainer + '?page=' + page + '&size=5' + '&name=' + name + '&types=' + filterString)
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
                            list = this.state.listTrainers;
                        } else {
                            list = [];
                        }
                        data.content.map((items) => {
                            list.push({
                                id: items.userId,
                                firstName: items.firstName,
                                lastName: items.lastName,
                                image: items.image !== null ? items.image : null,
                                description: items.description !== null ? items.description : null,
                                country: App.getCountryCodeByName(items.country),
                                types: items.packageTypes,
                                coachRoles: items.coachRoles,
                                rating: items.rating,
                                ratingCount: items.ratingCount
                            })
                        });
                        if (data.last) {
                            this.setState({finished: true, loading: false});
                        }

                        this.setState({
                            listTrainers: list
                        })
                    }
                } else {
                    this.setState({loading: false, empty: true});
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({loading: false});
                AppToast.networkErrorToast();
            })
    };

    /**
     * get all business profile endpoint
     * @param page
     * @param click
     * @returns {Promise<void>}
     */
    getAllBusiness = async (page, click, searchKey) => {

        if (page === undefined) {
            page = 0
        }

        let filterString = '';
        if (click !== 'click') {
            for (const selectedElm of this.state.selectedList) {
                filterString += selectedElm + ',';
            }
            filterString = filterString.substring(0, filterString.length - 1);
        }

        const name = searchKey !== '' ? this.state.searchKey.value : '';
        this.setState({loading: true});
        axios.get(SubUrl.get_all_online_coach_packages + '?page=' + page + '&size=10' + '&packageName=' + name + '&packageTypes=' + filterString)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    console.log(data)
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
                                id: items.instructorPackageId,
                                name: items.packageName,
                                price: items.price,
                                rating: items.rating,
                                ratingCount: items.ratingCount,
                                purchaseCount: items.enrollCount,
                                duration: this.timePeriodConverter(items.timePeriod),
                                isSubscribed: items.alreadyEnrolled,
                                trainerId: items.instructorId,
                                thisEnrolled: items.thisEnrolled,
                                description: items.description,
                                trainerName: items.instructor.firstName + ' ' + items.instructor.lastName,
                                authUserId: items.instructor.userId
                            })
                        })
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
    };

    /**
     * get class category endpoint
     * @returns {Promise<void>}
     */
    getCategory = async () => {
        this.setState({loading2: true});
        axios.get(SubUrl.get_instructor_package_types)
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
    };

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
            listBusiness: [],
            listTrainers: [],
            pageNumber: 0,
            finished: false,
            loading: false,
            nameSearch: false,
            classType: '',
            typeSearch: false,
            empty: false
        });

        setTimeout(() => {
            let now = new Date().getTime();
            if (now - prev >= 1000) {
                prev = now;

                if (this.state.selectedIndex === 0) {
                    this.facebookAnalytics('Online Coaches')
                    this.getAllTrainers();
                } else {
                    this.facebookAnalytics('Online Coaching Packages')
                    this.getAllBusiness();

                }
                this.googleAnalytics();
            }
        }, 1000)


    };

    /**
     * check selectable category
     * @param item
     * @returns {number}
     */
    isItemSelected = (item) => {
        for (let i = 0; i < this.state.selectedList.length; i++) {
            if (item === this.state.selectedList[i]) {
                return i;
            }
        }
        return -1;
    };

    /**
     * class category press handler
     * @param item
     */
    onCategoryClick = (item, name) => {
        const selectedList = this.state.selectedList;
        const nameList = this.state.nameList;
        const number = this.isItemSelected(item);
        const nameString = this.isItemSelected(name)
        if (number === -1) {
            selectedList.push(item);
            nameList.push(name);
        } else {
            selectedList.splice(number, 1);
            nameList.splice(nameString, 1);
        }

        this.setState({
            selectedList: selectedList,
            nameList: nameList,
            listTrainers: [],
            listBusiness: [],
            pageNumber: 0,
            empty: false,
            typeSelect: true,
            finished: false,
            loading: !this.state.loading,
        });
        if (this.state.selectedIndex === 0) {
            this.getAllTrainers();
        } else {
            this.getAllBusiness();
        }

    };

    closeModal = async () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
        this.props.modalVisibility(false);
    };

    async hideAlert2(type) {
        const {push} = this.props.navigation;
        const data = {
            page: 'TrainersForm',
            parameters: {
                selectedIndex: 1
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

    /**
     * facebook analytics
     * @param type
     */
    facebookAnalytics = (type) => {
        AppEventsLogger.logEvent("fb_mobile_search", {
            'fb_content_type': type,
            'fb_search_string': this.state.searchKey.value,
            'fb_success': true
        })
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
     * button press handler
     * @param type
     * @param item
     * @returns {Promise<void>}
     */
    onButtonClick = async (type, item) => {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'fitness':
                this.setState({
                    nameSelect: false,
                    typeSelect: false
                });
                navigate('InstructorTypesForm', {
                    selectedList: this.state.selectedList,
                    nameList: this.state.nameList,
                    category: 'trainer',
                    redirectPage: 'TrainersForm'
                });
                break;
            case 'search':
                if (this.state.selectedIndex === 0) {
                    this.facebookAnalytics("Online Coaches")
                    this.setState({
                        nameSelect: true,
                        empty: false,
                        listTrainers: [],
                        loading: !this.state.loading,
                        categoryId: ''
                    });
                    this.getAllTrainers(0, 'click');

                } else {
                    this.facebookAnalytics("Online Coaching Packages")
                    this.setState({nameSelect: true, listBusiness: [], empty: false, loading: !this.state.loading});
                    this.getAllBusiness(0, 'click');
                }
                this.googleAnalytics();
                break;
            case 'trainer':
                navigate('InstructorForm', {
                    trainerId: item.id,
                    coachRoles: item.coachRoles,
                    refresh: true,
                    trainerType: 'coachTrainer'
                });
                this.setState({
                    searchKey: {
                        value: '',
                        valid: true
                    },
                    selectedList: [],
                    nameList: []
                })
                break;
            case 'coach':
                navigate('CheckOutForm', {
                    trainerId: item.trainerId,
                    name: this.state.name,
                    object: {
                        id: item.id,
                        price: item.price,
                        packageName: item.name,
                        timePeriod: item.description,
                        thisEnrolled: item.thisEnrolled,
                        promoCodeId: item.authUserId,
                        promoCodeType: 'ONLINE_COACHING'
                    },
                    isSubscribed: item.isSubscribed,
                    role: 'instructor',
                    redirectForm: 'TrainersForm',

                });
                this.setState({
                    searchKey: {
                        value: '',
                        valid: true
                    },
                    selectedList: [],
                    nameList: []
                })
                break;
            default:
                break;
        }
    };

    render() {
        const buttons = ['Coaches', 'Packages'];
        const {selectedIndex} = this.state;
        const listBusiness = this.state.listBusiness.map((item, i) => (
            <TouchableOpacity
                style={{...styles.businessContainer, paddingVertical: 0}}
                onPress={() => this.props.asGuestUser ? this.setState({guestAlert: true}) : this.onButtonClick('coach', item)}
                key={i}
            >
                {item.thisEnrolled ? (
                    <View style={styles.activeLabel}>
                        <Image source={ActiveLOGO} style={styles.labelTag} resizeMode={'contain'}/>
                    </View>
                ) : null}

                <View style={{flexDirection: 'row', marginBottom: 5, marginTop: item.thisEnrolled ? -15 : 7}}>
                    <View style={{flexDirection: 'column', marginLeft: 15, maxWidth: '70%'}}>
                        <Text style={{
                            ...styles.containerTitle,
                            marginTop: 0
                        }}>{item.name + ' by ' + item.trainerName}</Text>
                        <Text style={{...styles.address, marginVertical: 5}}>{item.purchaseCount} people have
                            purchased</Text>
                        <RatingModal
                            rating={item.rating}
                            count={item.ratingCount}
                            color={'#4B6883'}
                            fontSize={14}
                            tintColor={Color.white}
                        />
                        {/*<Text style={styles.address} numberOfLines={1}>{item.country}</Text>*/}
                    </View>
                    <View style={styles.timeDurationContent}>
                        <Text style={styles.timeDuration}>{item.duration} Plan</Text>
                    </View>
                    <Text style={styles.price}>{this.numberFormat(item.price)}</Text>


                </View>

            </TouchableOpacity>
        ));
        const listTrainers = this.state.listTrainers.map((item, i) => (
            <CoachTabComponent
                onPress={() => this.onButtonClick('trainer', item)}
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

        const categoyList = this.state.listCategory.map((item, i) => (
            <TouchableOpacity
                style={this.isItemSelected(item.id) > -1 ? {
                    ...styles.categoryBtn,
                    backgroundColor: Color.darkOrange,
                    borderWidth: 0
                } : styles.categoryBtn}
                key={i}
                onPress={() => this.onCategoryClick(item.id, item.name)}>
                <Text style={this.isItemSelected(item.id) > -1 ? {
                    ...styles.categoryTitle,
                    color: Color.white
                } : styles.categoryTitle} numberOfLines={1}>{item.name}</Text>
            </TouchableOpacity>
        ))
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (!this.state.finished) {
                                this.setState({
                                    pageNumber: this.state.pageNumber + 1,
                                    loading: !this.state.loading,
                                });
                                if (this.state.selectedIndex === 0) {
                                    const page = this.state.pageNumber + 1
                                    this.getAllTrainers(page);
                                } else {
                                    const page = this.state.pageNumber + 1
                                    this.getAllBusiness(page);
                                }
                            }
                        }
                    }}

                    style={{width: '100%'}}>
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <View style={styles.searchOuter}>
                            <TextInput
                                placeholder={this.state.selectedIndex === 0 ? 'Search for any trainers' : 'Search for any packages'}
                                placeholderTextColor={Color.softlightGray}
                                style={styles.searchTitle}
                                onChangeText={this.onTextChange('searchKey')}
                                value={this.state.searchKey.value}
                                onSubmitEditing={() => {
                                    this.onButtonClick('search')
                                }}
                            />
                            <TouchableOpacity style={styles.searchIcon}
                                              onPress={() => this.onButtonClick('search')}>
                                <Image source={SearchBtn} style={{width: 20, height: 20}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.AuthHolder}>
                        <ButtonGroup
                            buttons={buttons}
                            onPress={this.updateIndex}
                            selectedIndex={selectedIndex}
                            bgColor={Color.blueGray}
                        />
                        <View style={styles.categoryHolder}>
                            <Text style={styles.filterTitle}>Filter by coach type</Text>
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
                                        <Text style={{...styles.categoryTitle, fontSize: 13, color: Color.darkOrange,}}>More
                                            Filters</Text>
                                    </TouchableOpacity>
                                </View>
                            )}


                        </View>
                    </View>

                    {this.state.selectedIndex !== 0 ? (
                        <View style={{width: '100%', alignItems: 'center', marginVertical: 10}}>
                            {this.state.empty ? (
                                <EmptyAlert message={'There is no packages under given types'}/>
                            ) : null}
                            {listBusiness}
                        </View>
                    ) : (
                        <View style={{width: '100%', alignItems: 'center', marginVertical: 10}}>
                            {this.state.empty ? (
                                <EmptyAlert message={'There is no coaches under given types'}/>
                            ) : null}
                            {listTrainers}
                        </View>
                    )}

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
                    visible={this.props.modalVisible}
                >
                    <Model
                        toggleModal={() => this.toggleModal()}
                        closeModal={() => this.closeModal()}
                    />
                </Modal>

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
        )
    }
}

const mapStateToProps = (state) => ({
    modalVisible: state.user.modalVisible,
    asGuestUser: state.user.asGuestUser
});

const mapDispatchToProps = dispatch => {
    return {
        updateActiveRoute: activeRoute => dispatch(actionTypes.updateActiveRoute(activeRoute)),
        modalVisibility: activeRoute => dispatch(actionTypes.modalVisibility(activeRoute)),
        getGuestNavigationParams: navigationParams => dispatch(actionTypes.getGuestNavigationParams(navigationParams))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
