import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import {styles} from '../styles';
import {Color} from "../../../constance/Colors";
import axios from '../../../axios/axios';
import {SubUrl} from "../../../axios/server_url";
import gif from '../../../assets/Home/loading.gif';
import TrainerContainer from '../../../component/UIElement/TrainerContainer';
import SessionContainer from "../../../component/UIElement/SessionComponent";
import {AppToast} from "../../../constance/AppToast";
import PageLoading from '../../../component/Loading/PageLoading';
import {CurrencyType} from "../../../constance/AppCurrency";
import PlaceholderIMG from '../../../assets/Sample/placeholderIMG.jpg';
import {connect} from 'react-redux';
import RatingModal from "../../../component/UIElement/RatingModal";
import {AppEventsLogger} from "react-native-fbsdk";
import analytics from "@react-native-firebase/analytics";
import {GROUP_CLASS_ONLY} from "../../../constance/Const";

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};


class App extends React.Component {
    state = {
        listClass: [],
        listPhysicalClasses: [],
        listTrainer: [],
        name: '',
        image: {
            uri: null,
            valid: true
        },
        description: '',
        mobileNumber: '',
        mobileNumber2: '',
        address: '',
        pageNumber: 0,
        finished: false,
        loading: false,
        pageNumber1: 0,
        finished1: false,
        loading1: false,
        ratingCount: 0,
        rating: 0,
        classTypes: [],
        loading3: false,
        branchName: '',
        listImages: [],
        pageNumber2: 0,
        loading2: false,
        finished2: false,
        pageNumber4: 0,
        loading4: false,
        finished4: false,
        listPersonalClass: [],
        businessId: '',
        membershipCount: '',
        averageClassesPerWeek: '',
        imageLoad: true,
        role: '',
        classCategory: ''
    };

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            const paramName = this.props.navigation.getParam('businessName');
            this.props.navigation.setParams({
                BusinessName: paramName,
            });

            if (this.props.navigation.getParam('refresh') || this.props.offlineFetch || this.props.onlineFetch) {
                const role = this.props.navigation.getParam('navigateState');
                const classCategory = this.props.navigation.getParam('classCategory');
                this.setState({
                    loading3: !this.state.loading3,
                    listTrainer: [],
                    classTypes: [],
                    listPersonalClass: [],
                    listClass: [],
                    listPhysicalClasses: [],
                    role: role,
                    classCategory: classCategory
                });

                this.getAllBusinessDetails(role);
                this.props.navigation.setParams({
                    refresh: false,
                });
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
     * get business details by id api
     * @returns {Promise<void>}
     */
    getAllBusinessDetails = async (role) => {
        const {navigation} = this.props;
        const businessId = navigation.getParam('businessId');
        this.setState({businessId: businessId});
        axios.get(SubUrl.get_business_profile_by_id + businessId)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    const name = data.businessName;
                    const description = data.description;
                    const image = data.profileImage !== null ? data.profileImage : PlaceholderIMG;
                    const rating = data.rating;
                    const ratingCount = data.ratingCount;
                    const branchName = data.addresses[0].country !== null ? data.addresses[0].country : null;

                    let membershipCount;
                    let averageClassesPerWeek;
                    membershipCount = role !== 'online' ? data.physicalClassMembershipCount : data.onlineClassMembershipCount !== null ? role !== 'online' ? data.physicalClassMembershipCount : data.onlineClassMembershipCount : 0;
                    averageClassesPerWeek = this.state.role !== 'online' ? data.averagePhysicalClassesPerWeek : data.averageOnlineClassesPerWeek;

                    const list = [];

                    for (let value of data.types) {
                        list.push({
                            name: value
                        })
                    }

                    const listImages = [];

                    for (let val of data.images) {
                        list.push({
                            image: val !== null ? val : null
                        })
                    }

                    this.setState({
                        name: name,
                        description: description,
                        image: {uri: image, valid: true},
                        ratingCount: ratingCount,
                        rating: rating,
                        classTypes: list,
                        loading3: false,
                        branchName: branchName,
                        listImages: listImages,
                        membershipCount: membershipCount,
                        averageClassesPerWeek: averageClassesPerWeek
                    })

                    this.getPhysicalClassDetails();

                    this.getAllTraines();

                    this.googleAnalyticsBusiness();


                } else {
                    this.setState({loading3: false});
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({loading3: false});
                AppToast.networkErrorToast();
            })

    };

    /**
     * google analytics for business profile
     */
    googleAnalyticsBusiness = async () => {
        await analytics().logScreenView({
            screen_class: 'Studio Profile',
            screen_name: this.state.name,
        });
    }


    /**
     * get trainers by business id api
     * @returns {Promise<void>}
     */
    getAllTraines = async () => {
        const {navigation} = this.props;
        const businessId = navigation.getParam('businessId');
        const page = this.state.pageNumber1;
        this.setState({loading1: true});
        axios.get(SubUrl.get_business_profile_by_id + businessId + '/coaches' + '?page=' + page + '&size=5')
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.last && data.empty) {
                        this.setState({finished1: true, loading1: false});
                    } else {
                        const list = this.state.listTrainer
                        const data = response.data.body;
                        data.content.map((items) => {
                            list.push({
                                firstName: items.firstName,
                                lastName: items.lastName,
                                image: items.image,
                                id: items.id,
                                staringValue: items.rating,
                                ratingCount: items.ratingCount,
                            })
                        })
                        if (data.last) {
                            this.setState({finished1: true, loading1: false});
                        }
                        this.setState({
                            listTrainer: list
                        })
                    }
                }
            })
            .catch(error => {
                this.setState({loading1: false});
                AppToast.networkErrorToast();
            })

    };

    /**
     * get physical class by business id api
     */
    getPhysicalClassDetails = async (page) => {
        if (page === undefined) {
            page = 0
        }
        const {navigation} = this.props;
        const businessId = navigation.getParam('businessId');
        this.setState({loading2: true});
        axios.get(SubUrl.get_physical_classes_by_business_profile + businessId + '/classes/physical?page=' + page + '&size=5')
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.last && data.empty) {
                        this.setState({finished2: true, loading2: false});
                    } else {
                        const list = this.state.listPhysicalClasses;
                        const data = response.data.body;
                        data.content.map((items) => {
                            list.push({
                                id: items.id,
                                name: items.name,
                                staringValue: items.rating,
                                count: items.ratingCount,
                                image: items.profileImage !== null ? items.profileImage : PlaceholderIMG,
                                price: items.startingFrom !== null ? items.startingFrom : 0,
                                calorie: items.calorieBurnOut,
                                sessionPerWeek: items.averageSessionsPerWeek,
                                buttonStatus: items.buttonStatus,
                                sessionsUpcoming: items.sessionsUpcoming
                            })
                        })
                        if (data.last) {
                            this.setState({finished2: true, loading2: false});
                        }
                        this.setState({
                            listPhysicalClasses: list
                        })
                    }
                }
            })
            .catch(error => {
                this.setState({loading2: false});
                AppToast.networkErrorToast();
            })
    };


    /**
     * button click event handler
     * @param type
     * @param item
     * @param role
     */
    onButtonClick = async (type, item, role) => {
        const {navigate} = this.props.navigation;
        const {push} = this.props.navigation;
        switch (type) {
            case 'class':
                push('ClassesDetailsForm', {
                    classId: item.id,
                    role: role,
                    refresh: true
                });
                break;
            case 'trainer':
                push('InstructorForm', {
                    trainerId: item.id,
                    refresh: true,
                    trainerType: this.state.role !== 'online' ? 'fitnessTrainer' : 'onlineTrainer'
                });
                break;
            case 'membership':
                navigate('BusinessMembershipsForm', {
                    businessId: this.state.businessId,
                    businessName: 'Pricing of ' + this.state.name,
                    path: {
                        page: 'BusinessProfile',
                        pageId: this.state.classId,
                        classType: this.state.role !== 'online' ? 'offlineClass' : 'onlineClass',
                    },
                    role: this.state.role
                });
                break;
            case 'schedule':
                navigate('ScheduleForm', {
                    businessName: 'Schedule of ' + this.state.name,
                    id: this.state.businessId,
                    role: this.state.role,
                    classCategory: this.state.classCategory
                })
                break;
            default:
                break;
        }
    };

    getBottomButtonState(membershipCount, sessionCount) {
        if (membershipCount === 0 && sessionCount === 0) {
            return {
                btn1_visible: false,
                btn2_visible: false,
                contentVisible: false,
                margin: 0,
                btn1_width: 0,
                btn2_width: 0
            }
        } else if (membershipCount !== 0 && sessionCount === 0) {
            return {
                btn1_visible: true,
                btn2_visible: false,
                contentVisible: this.state.role !== 'online',
                margin: 0,
                btn1_width: '95%',
                btn2_width: 0
            }
        } else {
            return {
                btn1_visible: this.state.role !== 'online',
                btn2_visible: true,
                contentVisible: true,
                margin: this.state.role !== 'online' ? 10 : 0,
                btn1_width: this.state.role !== 'online' ? '45%' : 0,
                btn2_width: this.state.role !== 'online' ? '45%' : '95%'
            }
        }
        // if (membershipCount === 0 && sessionCount === 0) {
        //     return { btn1_visible: false, btn2_visible: false, contentVisible: false, margin: 0, btn1_width: 0, btn2_width: 0 }
        // } else if (membershipCount !== 0 && sessionCount === 0) {
        //     return { btn1_visible: true, btn2_visible: false, contentVisible: true, margin: 0, btn1_width: '95%', btn2_width: 0 }
        // } else {
        //     return { btn1_visible: true, btn2_visible: true, contentVisible: true, margin: 10, btn1_width: '45%', btn2_width: '45%' }
        // }

    }

    render() {

        const listImages = this.state.listImages.map((item, i) => (
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


        const physicalClassList = this.state.listPhysicalClasses.map((item, i) => (
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

        const trainerList = this.state.listTrainer.map((item, i) => (

            <TrainerContainer
                onPress={() => this.onButtonClick('trainer', item)}
                image={item.image}
                firstName={item.firstName}
                lastName={item.lastName}
                staringValue={item.staringValue}
                count={item.ratingCount}
                key={i}
            />

        ));

        const classTypes = this.state.classTypes.map((item, i) => (
            <View style={styles.tagOuter} key={i}>
                <Text style={styles.headerTitle}>{item.name}</Text>
            </View>
        ))


        return (
            !this.state.loading3 ? (
                <View
                    style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                    <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}
                                >
                        <View style={styles.headerContainer}>
                            <View style={styles.imageHolders}>
                                <Image source={this.state.image.uri !== null ? this.state.image : PlaceholderIMG}
                                       style={styles.imageHolder}
                                       resizeMode={'cover'}/>
                            </View>
                            <View style={{flex: 1, marginLeft: 10, justifyContent: 'center'}}>
                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                                    {classTypes}
                                </ScrollView>
                                <Text style={styles.weeks}>Offers {this.state.averageClassesPerWeek} Classes per
                                    week</Text>
                                <RatingModal
                                    rating={this.state.rating}
                                    count={this.state.ratingCount}
                                    color={Color.ratingTextColor}
                                    tintColor={Color.white}
                                    fontSize={15}
                                />
                                <Text style={styles.weeks}>{this.state.branchName}</Text>
                            </View>


                        </View>

                        <ScrollView style={styles.horizontalImageHolder} horizontal={true}
                                    showsHorizontalScrollIndicator={false}>
                            {listImages}
                        </ScrollView>

                        <Text style={{...styles.headline, marginTop: 20}}>Description about {this.state.name}</Text>
                        <View style={{marginHorizontal: 10, marginVertical: 10}}>
                            <Text style={styles.pharagraph}>{this.state.description}</Text>
                        </View>

                        <SafeAreaView>
                            {this.state.listPhysicalClasses.length !== 0 ? (
                                <Text style={styles.headline}>Fitness Classes offered
                                    at {this.state.name}</Text>
                            ) : null}
                            <ScrollView
                                onScroll={({nativeEvent}) => {
                                    if (isCloseToBottom(nativeEvent)) {
                                        if (!this.state.finished) {
                                            this.setState({
                                                pageNumber2: this.state.pageNumber2 + 1,
                                                loading2: !this.state.loading2
                                            });
                                            const page = this.state.pageNumber2 + 1
                                            this.getPhysicalClassDetails(page);
                                        }
                                    }
                                }}
                                style={{width: '95%', marginLeft: 10}} showsHorizontalScrollIndicator={false}
                                horizontal={true}>
                                {physicalClassList}
                                {
                                    this.state.loading2 ?
                                        <View style={styles.gifHolder}>
                                            <Image source={gif} style={styles.gif}/>
                                        </View>
                                        : null
                                }
                            </ScrollView>

                        </SafeAreaView>



                        <View style={{marginBottom: 5}}>
                            {this.state.listTrainer.length !== 0 ? (
                                <Text style={{...styles.mainTitle, marginLeft: 10}}>Trainers at {this.state.name}</Text>
                            ) : null}
                            <ScrollView
                                onScroll={({nativeEvent}) => {
                                    if (isCloseToBottom(nativeEvent)) {
                                        if (!this.state.finished1) {
                                            this.setState({
                                                pageNumber: this.state.pageNumber1 + 1,
                                                loading: !this.state.loading1
                                            });
                                            this.getAllTraines();
                                        }
                                    }
                                }}
                                style={{width: '95%', marginLeft: 10}} showsHorizontalScrollIndicator={false}
                                horizontal={true}>
                                {trainerList}
                                {
                                    this.state.loading1 ?
                                        <View style={styles.gifHolder}>
                                            <Image source={gif} style={styles.gif}/>
                                        </View>
                                        : null
                                }
                            </ScrollView>

                        </View>

                        {/*/!*   please add && this.state.role !== 'online' for after subscription dev*!/*/}
                        {/*{this.state.membershipCount !== 0  && this.state.role !== 'online'? (*/}
                        {/*    <View style={styles.membershipContainer}>*/}
                        {/*        <Text style={{...styles.pharagraph, color: Color.white, marginLeft: 10}}>Choose from*/}
                        {/*            {' ' + this.state.membershipCount + ' '}*/}
                        {/*            Memberships</Text>*/}
                        {/*        <TouchableOpacity style={styles.viewAllBtn}*/}
                        {/*                          onPress={() => this.onButtonClick('membership')}>*/}
                        {/*            <Text style={{...styles.pharagraph, color: Color.white}}>View all</Text>*/}
                        {/*        </TouchableOpacity>*/}
                        {/*    </View>*/}
                        {/*) : null}*/}


                    </ScrollView>

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
    visible: state.user.visible,
    onlineFetch: state.user.onlineFetch,
    offlineFetch: state.user.offlineFetch,
});


const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
