import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import axios from '../../../../axios/axios';
import { StorageStrings } from "../../../../constance/StorageStrings";
import { SubUrl } from "../../../../axios/server_url";
import Calandar2 from "../../../../assets/Home/calanderWhite.png";
import Calandar from "../../../../assets/Home/calandarOrange.png";
import { Color } from "../../../../constance/Colors";
import Moment from 'moment';
import { Font } from "../../../../constance/AppFonts";
import { AppToast } from "../../../../constance/AppToast";
import gif from "../../../../assets/Home/loading.gif";
import LocationWhite from '../../../../assets/Home/whiteLocation.png';
import LocationBlack from '../../../../assets/Home/bleckLocation.png';
import { connect } from 'react-redux';
import AsyncStorage from "@react-native-community/async-storage";

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

class App extends React.Component {
    state = {
        listClasses: [],
        name: '',
        pageNumber: 0,
        finished: false,
        loading: false,
        empty: false,
        role: ''
    };

    componentWillMount() {

        const { navigation } = this.props;
        const name = navigation.getParam('name');

        const role = navigation.getParam('role');

            this.getallPhysicalClassDetails(0);

        this.setState({
            loading: !this.state.loading,
            name: name,
            role: role
        })


    }

    /**
     * get all physical classes api
     * @param page
     * @returns {Promise<void>}
     */
    getallPhysicalClassDetails = async (page) => {
        const { navigation } = this.props;
        const classId = navigation.getParam('classId');
        const dateTime = new Date().toISOString().split('.')[0] + "Z";
        const latitude = this.props.latitude !== 0 ? this.props.latitude : Number(await AsyncStorage.getItem(StorageStrings.LATITUDE));
        const longitude = this.props.longitude !== 0 ? this.props.longitude : Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE));
        axios.get(SubUrl.get_sessions_by_physical_class + classId + '/sessions?page=' + page + '&size=10&longitude=' + longitude + '&latitude=' + latitude + '&dateTime=' + dateTime)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body.content;
                    if (response.data.body.empty && response.data.body.pageable.pageNumber === 0) {
                        this.setState({ empty: true, loading: false })
                    }
                    if (response.data.body.last && response.data.body.empty) {
                        this.setState({ finished: true, loading: false });
                    } else {
                        const list = this.state.listClasses;
                        data.map((item) => {
                            list.push({
                                id: item.id,
                                date: new Date(item.dateAndTime).toDateString(),
                                startTime: Moment(new Date(item.dateAndTime), 'hh:mm').format('LT'),
                                endTime: Moment(new Date(item.endDateAndTime), 'hh:mm').format('LT'),
                                location: item.location.addressLine1 + ', ' + (item.location.addressLine2 !== '' ? item.location.addressLine2 + ',' : '') + item.location.city

                            })
                        });

                        this.setState({
                            listClasses: list,
                        });

                        if (response.data.body.last) {
                            this.setState({ finished: true, loading: false });
                        }
                    }
                } else {
                    this.setState({ loading: false });
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({ loading: false });
                AppToast.networkErrorToast();
            })
    };

    /**
     * button press action handler
     * @param type
     * @returns {Promise<void>}
     */
    onButtonClick = async (type) => {
        const { navigate } = this.props.navigation;
        const { push } = this.props.navigation;
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

                push('SelectedDetails', {
                    sessionId: type.id,
                    role: this.state.role
                });

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


    render() {
        const listClasses = this.state.listClasses.map((item, i) => (
            <TouchableOpacity style={item.visible ? {
                ...styles.classesListContainer,
                backgroundColor: Color.themeColor
            } : styles.classesListContainer} key={i} onPress={() => this.onButtonClick(item)}>
                <Image source={item.visible ? Calandar2 : Calandar} style={{ width: 40, height: 40, marginLeft: 10 }} />
                <View style={{ flexDirection: 'column' }}>
                    <Text style={item.visible ? { ...styles.title, color: Color.white } : styles.title}>{item.date}</Text>
                    <Text style={item.visible ? {
                        ...styles.title,
                        color: Color.white,
                    } : {
                            ...styles.title,
                            color: Color.softDarkGray,
                        }}> {item.startTime} - {item.endTime}</Text>
                    {this.state.role !== 'online' ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '88%' }}>
                            <View style={{ width: 10, height: 10, marginLeft: 10 }}>
                                <Image source={item.visible ? LocationWhite : LocationBlack} style={{ width: '100%', height: '100%' }} resizeMode={'contain'} />
                            </View>
                            <Text style={item.visible ? {
                                ...styles.titleAddress,
                                color: Color.white,
                            } : {
                                    ...styles.titleAddress,
                                    color: Color.softDarkGray,
                                }} numberOfLines={1}> {item.location}</Text>
                        </View>
                    ) : null}

                </View>
            </TouchableOpacity>
        ));
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ width: '100%' }}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (!this.state.finished) {
                                this.setState({
                                    loading: !this.state.loading,
                                    pageNumber: this.state.pageNumber + 1,
                                });
                                const page = this.state.pageNumber + 1;

                                    this.getallPhysicalClassDetails(page);


                            }
                        }
                    }}
                >
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ width: '95%', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                            <Text style={styles.name}>{this.state.name}</Text>
                        </View>
                        {listClasses}
                    </View>

                    {
                        this.state.loading ?
                            <View style={styles.gifHolder}>
                                <Image source={gif} style={styles.gif} />
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
    classesListContainer: {
        width: '95%',
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
        marginBottom: 10,
        alignItems: 'center',
        // justifyContent:'center',
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 10
    },
    title: {
        fontFamily: Font.Medium,
        fontSize: 15,
        lineHeight: 22,
        color: Color.darkGray,
        marginLeft: 10
    },
    titleAddress: {
        fontFamily: Font.Medium,
        fontSize: 13,
        lineHeight: 19,
        color: Color.darkGray,
    },
    imageHolder2: {
        width: '100%',
        height: '100%',
        zIndex: 2,
        position: 'absolute'
    },
    name: {
        fontFamily: Font.SemiBold,
        fontSize: 20,
        lineHeight: 22,
        color: Color.darkblue,
        marginVertical: 10,
    },
    gifHolder: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 90,
        height: 90,
    },
})

const mapStateToProps = (state) => ({
    latitude: state.user.latitude,
    longitude: state.user.longitude
});


const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
