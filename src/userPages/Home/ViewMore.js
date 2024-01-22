import React from 'react';
import {View, StyleSheet, ScrollView, Image, StatusBar} from 'react-native';
import axios from "../../axios/axios";
import {SubUrl} from "../../axios/server_url";
import SessionContainer from "../../component/UIElement/SessionComponent";
import gif from "../../assets/Home/loading.gif";
import TrainerContainer from "../../component/UIElement/TrainerContainer";
import {AppToast} from "../../constance/AppToast";
import {connect} from 'react-redux';
import {CurrencyType} from "../../constance/AppCurrency";
import GymsComponent from "../../component/UIElement/GymsComponent";
import {Color} from "../../constance/Colors";
import AsyncStorage from "@react-native-community/async-storage";
import {StorageStrings} from "../../constance/StorageStrings";

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

class App extends React.Component {
    state = {
        list: [],
        pageNumber: 0,
        finished: false,
        loading: false,
        empty: false,
        role: '',
        country: ''
    }

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            if (this.props.navigation.getParam('refresh')) {
                this.setState({
                    loading: true,
                    list: [],
                    pageNumber: 0,
                    finished: false,
                    empty: false,
                    country: await AsyncStorage.getItem(StorageStrings.COUNTRY)
                });
                this.findUserRole();
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
     * check user role
     */
    findUserRole() {
        const {navigation} = this.props;
        const role = navigation.getParam('role');
        this.props.navigation.setParams({
            role: role
        });

        this.setState({
            role: role,
        });


        switch (role) {
            case 'Popular Fitness Trainers':
                this.getPopularPhysicalTrainers();
                break;
            case 'Popular Fitness Classes':
                this.getPopularPhysicalClass();
                break;

            default:
                break;

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
     * get all popular Physical trainers api
     * @param page
     */
    getPopularPhysicalTrainers = async (page) => {
        if (page === undefined) {
            page = 0
        }
        axios.get(SubUrl.get_popular_physical_class_trainer + '?page=' + page + '&size=10&country=' + this.state.country)
            .then(async response => {
                console.log(response.data);
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.last && data.empty) {
                        this.setState({finished: true, loading: false});
                    } else {
                        const list = this.state.list;
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
                                this.setState({finished: true, loading: false});
                            }

                            this.setState({
                                list: list
                            })
                        });
                    }
                }
            })
            .catch(error => {
                this.setState({loading: false});
                AppToast.networkErrorToast();
            })
    };

    /**
     * get popular physical class api
     * @param page
     */
    getPopularPhysicalClass = async (page) => {
        if (page === undefined) {
            page = 0
        }
        axios.get(SubUrl.get_popular_physical_classes + '?page=' + page + '&size=10&country=' + this.state.country)
            .then(async response => {
                this.setState({loading: !this.state.loading});
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.last && data.empty) {
                        this.setState({finished: true, loading: false});
                    } else {
                        const list = this.state.list;
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
                                sessionsUpcoming: items.sessionsUpcoming,
                                typeName: undefined
                            })
                        });
                        if (data.last) {
                            this.setState({finished: true, loading: false});
                        }

                        this.setState({list: list})
                    }
                }
            })
            .catch(error => {
                this.setState({loading: false});
                AppToast.networkErrorToast();
            })
    };




    /**
     * button click event handler
     * @param type
     * @param item
     * @returns {Promise<void>}
     */
    onButtonClick = async (type, item) => {

        const {navigate} = this.props.navigation;
        switch (type) {
            case 'class':
                navigate('ClassesDetailsForm', {
                    classId: item.id,
                    role: this.state.role !== 'Popular Fitness Classes' ? 'online' : 'offline',
                    refresh: true
                });
                break;
            case 'trainer':
                navigate('InstructorForm', {
                    trainerId: item.id,
                    refresh: true
                });
                break;

            default:
                break;
        }

    };


    render() {

        const classList = this.state.list.map((item, i) => (
            <SessionContainer
                onPress={() => this.onButtonClick('class', item)}
                image={item.image}
                price={this.numberFormat(item.price)}
                calorie={item.calorie + ' cal Burn Workout'}
                name={item.name}
                sessionPerWeek={item.sessionPerWeek}
                staringValue={item.staringValue}
                count={item.count}
                buttonStatus={item.buttonStatus}
                sessionsUpcoming={item.sessionsUpcoming}
                typeName={item.typeName}
                role={'offline'}
                key={i}
            />

        ));

        const trainerList = this.state.list.map((item, i) => (
            <TrainerContainer
                onPress={() => this.onButtonClick('trainer', item)}
                image={item.image}
                firstName={item.firstName}
                lastName={item.lastName}
                staringValue={item.staringValue}
                count={item.count}
                key={i}
            />
        ));



        return (
            <View style={styles.container}>
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
                                const page = this.state.pageNumber + 1;
                                switch (this.state.role) {

                                    case 'Popular Fitness Trainers':
                                        this.getPopularPhysicalTrainers(page);
                                        break;
                                    case 'Popular Fitness Classes':
                                        this.getPopularPhysicalClass(page);
                                        break;
                                    case 'Popular Gyms':
                                        this.getPopularGyms(page);
                                        break;
                                    default:
                                        break;

                                }
                            }
                        }
                    }}
                >
                    <View style={styles.mainContainer}>
                        <View style={styles.subContainer}>
                            {this.state.role === 'Popular Online Fitness Classes' || this.state.role === 'Popular Fitness Classes' ? classList :
                                this.state.role === 'Popular Online Class Trainers' || this.state.role === 'Popular Fitness Trainers' || this.state.role === 'Popular Online Coaches' ?
                                    trainerList : null
                            }
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

            </View>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    mainContainer: {
        width: '100%',
        alignItems: 'center',
        paddingLeft: '6%'
    },
    subContainer: {
        width: '95%',
        marginBottom: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'center',

    },
    gifHolder: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 60,
        height: 60,
    },
})

const mapStateToProps = (state) => ({
    latitude: state.user.latitude,
    longitude: state.user.longitude,
});

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
