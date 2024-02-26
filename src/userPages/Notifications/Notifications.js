import React from 'react';
import {View, Text, ScrollView, Image, Dimensions, StatusBar, TouchableOpacity, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from "./styles";
import TimeAgo from "react-native-timeago";
import axios from '../../axios/axios';
import {StorageStrings} from "../../constance/StorageStrings";
import {SubUrl} from "../../axios/server_url";
import Moment from 'moment';
import gif from "../../assets/Home/loading.gif";
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";
import {AppToast} from "../../constance/AppToast";
import EmptyAlert from "../../component/UIElement/EmptyAlert";
import {HardwareBackAction} from "../../component/Actions/HardwareBackAction";
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import PlaceholderIMG from "../../assets/Sample/placeholderIMG.jpg";

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

const screenHeight = Math.round(Dimensions.get('window').height);

class App extends React.Component {
    state = {
        list: [],
        newList: [],
        pageNumber: 0,
        finished: false,
        loading: false,
        empty: false,
        imageLoad: true,
    };

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            this.getAllNotifications();
            this.getNotificationCounts();
            this.setState({
                list: [],
                newList: [],
                pageNumber: 0,
                finished: false,
                empty: false,
                loading: !this.state.loading,
            });
        })
    }

    async componentDidMount(): void {
        this.props.navigation.addListener('willFocus', this.load);
    }

    /**
     * device back button event handler
     * */
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
     * */
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
     * get all notification of user api
     * */
    getAllNotifications = async () => {
        const userId = await AsyncStorage.getItem(StorageStrings.USER_ID);
        const pageNumber = this.state.pageNumber;
        axios.get(SubUrl.get_all_notifications_of_user + userId + '/notifications?page=' + pageNumber + '&size=10')
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body.content;
                    if (response.data.body.empty && response.data.body.pageable.pageNumber === 0) {
                        this.setState({empty: true, loading: false})
                    }
                    if (response.data.body.last && response.data.body.empty) {
                        this.setState({finished: true, loading: false});
                    } else {
                        const list = this.state.list;
                        for (let i = 0; i < data.length; i++) {
                            if (new Date(data[i].dateTime).getFullYear()=== 2024){
                                list.push({
                                    id: data[i].id,
                                    message: data[i].message,
                                    type: data[i].type,
                                    typeId: data[i].typeId,
                                    seen: data[i].seen,
                                    image: data[i].image !== null ? data[i].image : null,
                                    pastTime: data[i].dateTime,
                                    notifyDate: new Date(data[i].dateTime).toDateString(),
                                    sessionName: data[i].classSession !== null ? data[i].classSession.className : data[i].title,
                                })
                            }

                        }
                        this.setState({
                            list: list
                        });
                        this.groupBy();

                        this.setState({finished: true, loading: false});

                    }
                }
            })
            .catch(error => {
                this.setState({loading: false});
                AppToast.networkErrorToast();
            })

    }

    /**
     * group notification by date
     * */
    groupBy = () => {

        // this gives an object with dates as keys
        const groups = this.state.list.reduce((groups, game) => {
            const date = game.pastTime.split('T')[0];
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(game);
            return groups;
        }, {});

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((date) => {
            return {
                date,
                subList: groups[date]
            };
        });

        this.setState({
            newList: groupArrays
        })

        console.log(groupArrays);
    };


    /**
     * button click event handler
     * */
    onButtonClick(id, type) {
        const {navigate} = this.props.navigation;
        switch (type) {
            case 'PHYSICAL_SESSION':
                navigate('SelectedDetails', {
                    sessionId: id,
                    role: 'offline',
                });
                break;
            case 'SESSION':
                navigate('SelectedDetails', {
                    sessionId: id,
                    role: 'online'
                });
                break;
            case 'INSTRUCTOR_PACKAGE_REMINDER':
                navigate('PackagesForm', {
                    trainerId: id,
                    fetch: true
                });
                break;
            case 'INSTRUCTOR_PACKAGE':
                navigate('InstructorForm', {
                    trainerId: id,
                    refresh: true,
                    trainerType: 'coachTrainer'
                });
                break;
            case 'GYM_MEMBERSHIP':
                navigate('MembershipDetailsForm', {
                    id: id,
                    role: 'gymMember',
                    membershipType: 'GYM'
                });
                break;
            case 'PHYSICAL_CLASS_MEMBERSHIP':
                navigate('MembershipDetailsForm', {
                    id: id,
                    role: 'classMember',
                    membershipType: 'PHYSICAL_CLASS'
                });
                break;
            case 'ONLINE_CLASS_MEMBERSHIP':
                navigate('MembershipDetailsForm', {
                    id: id,
                    role: 'classMember',
                    membershipType: 'ONLINE_CLASS'
                });
                break;
            case 'SUBSCRIPTION_PACKAGE':
                navigate('SubscriptionDetails', {
                    subscriptionId:id
                });
                break;
            default:
                break;
        }
    }


    render() {
        let date = new Date();
        date.setDate(date.getDate() - 1);


        const List = this.state.newList.map((item, i) => (
            <View key={i} style={{width: '100%', alignItems: 'center'}}>
                <Text
                    style={styles.dateFormat}>{item.date === new Date().toISOString().split('T')[0] ? 'Today' : item.date === date.toISOString().split('T')[0] ? 'Yesterday' : item.date}</Text>
                {item.subList.map((items, i) => (
                    <TouchableOpacity style={styles.listContainer} key={i}
                                      onPress={() => this.onButtonClick(items.typeId, items.type)}>
                                <View style={styles.imageOuter}>
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
                                    <Image source={items.image !== null ? {uri: items.image} : PlaceholderIMG}
                                           reziseMode={'stretch'}
                                           style={{width: '100%', height: '100%'}}
                                           onLoadStart={() => this.setState({imageLoad: true})}
                                           onLoadEnd={() => this.setState({imageLoad: false})}
                                    />
                                </View>
                                <View style={{flexDirection: 'column', flex: 1}}>
                                    <Text style={styles.containerTitle} numberOfLines={2}>{items.sessionName}</Text>
                                    <View style={{paddingRight: 10}}>
                                        <Text style={styles.bodyTitle}>{items.message}</Text>
                                    </View>

                                </View>

                                {new Date(items.pastTime).toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? (
                                    <TimeAgo
                                        time={items.pastTime}
                                        style={styles.timeStamp}
                                    />
                                ) : (
                                    <Text
                                        style={styles.timeStamp}>{Moment(new Date(items.pastTime), 'hh:mm').format('LT')}</Text>
                                )}

                    </TouchableOpacity>
                ))}
            </View>

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
                                })
                                this.getAllNotifications();
                            }
                        }
                    }}
                >
                    <View style={{
                        width: '100%',
                        alignItems: 'center',
                        height: screenHeight / 100 * 10,
                        flex: 1,
                        backgroundColor: Color.white
                    }}>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: Font.SemiBold,
                            position: 'absolute',
                            bottom: 0,
                        }}>Notifications</Text>
                    </View>
                    <View style={{marginTop: '2%'}}>
                        {this.state.empty  ? (
                            <EmptyAlert navigation={this.props.navigation}/>
                        ) : List}
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return {
        changeNotificationHolder: notificationCount => dispatch(actionTypes.changeNotificationHolder(notificationCount)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
