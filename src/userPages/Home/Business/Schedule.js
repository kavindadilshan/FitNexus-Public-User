import React from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import CalendarStrip from '../../../component/Lib/react-native-calendar-strip';
import Moment from 'moment';
import { Font } from "../../../constance/AppFonts";
import { Color } from "../../../constance/Colors";
import rightArrow from '../../../assets/Home/rightArrow.png';
import leftArrow from '../../../assets/Home/leftArrow.png';
import StarRating from 'react-native-star-rating';
import axios from '../../../axios/axios';
import { SubUrl } from '../../../axios/server_url';
import { AppToast } from "../../../constance/AppToast";
import gif from '../../../assets/Home/loading.gif';
import EmptyAlert from '../../../component/UIElement/EmptyAlert';

const screenWidth = Math.round(Dimensions.get('window').width);

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

class App extends React.Component {
    state = {
        selectedDate: new Date(),
        date: Moment(new Date()).format('YYYY-MM-DD'),
        finished: false,
        list: [],
        pageNumber: 0,
        empty: false,
        loading: false,
        businessId: '',
        classCategory: '',
        role: ''
    }
    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            const paramName = this.props.navigation.getParam('businessName');
            this.props.navigation.setParams({
                BusinessName: paramName,
            });

            const businessId = this.props.navigation.getParam('id');
            const classCategory = this.props.navigation.getParam('classCategory');
            const role = this.props.navigation.getParam('role');

            this.setState({
                businessId: businessId,
                classCategory: classCategory,
                role: role
            })
            this.getScheduleDetails(0, 'click', this.state.date);
        })
    }
    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    getScheduleDetails(page, click, date) {
        if (page === undefined) {
            page = 0
        }
        this.setState({ loading: true });
        const businessId = this.props.navigation.getParam('id');
        axios.get( SubUrl.get_physical_class_schedule + businessId + '/physical?page=' + page + '&size=5&date=' + date)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.empty && data.pageable.pageNumber === 0) {
                        this.setState({ empty: true })
                    }
                    if (data.last && data.empty) {
                        this.setState({ finished: true, loading: false });
                    } else {
                        let list;
                        if (click !== 'click') {
                            list = this.state.list;
                        } else {
                            list = [];
                        }

                        data.content.map((items) => {
                            if (Date.parse(new Date()) <= Date.parse(new Date(items.endDateAndTime))) {
                                list.push({
                                    id: items.sessionId,
                                    name: items.className,
                                    startTime: Moment(new Date(items.dateTime), 'hh:mm').format('LT'),
                                    duration: items.duration,
                                    rating: items.classRating,
                                    ratingCount: items.ratingCount,
                                    classType: items.classType,
                                    trainerName: items.trainerName,
                                    buttonStatus: items.sessionStatus,

                                });
                            }
                        });

                        if (list.length === 0) {
                            this.setState({ empty: true })
                        }

                        if (data.last) {
                            this.setState({ finished: true, loading: false });
                        }
                        this.setState({
                            list: list,
                            nameSelect: false,
                        });
                    }
                } else {
                    this.setState({ loading: false, empty: true });
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                console.log(error);
                AppToast.networkErrorToast();
            })
    }

    getButtonStatus = (buttonStatus) => {
        switch (buttonStatus) {
            case 'FULL':
                return { text: 'Session Full', color: Color.gray, disbled: false };
            case 'CANCELLED':
                return { text: 'Cancelled', color: Color.softRed, disabled: false }
            default:
                return { text: '', color: 'transparent', disbled: true };
        }

    };

    onButtonPress(id) {
        const { navigate } = this.props.navigation;
        navigate('SelectedDetails', {
            sessionId: id,
            role: this.state.role
        });
    }

    render() {
        const list = this.state.list.map((item, i) => (
            <TouchableOpacity style={styles.subContainer} key={i} onPress={() => this.onButtonPress(item.id)}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column', width: '20%' }}>
                        <Text style={styles.mainTitle}>{item.startTime}</Text>
                        <Text style={styles.duration}>({item.duration} min)</Text>
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, width: '80%' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.typeContainer}>
                                <Text style={styles.typeTxt}>{item.classType}</Text>
                            </View>
                        </View>

                        <Text style={{ ...styles.mainTitle, fontSize: 15, marginBottom: 5, marginTop: 10 }}>{item.name}</Text>
                        <Text style={styles.duration}>{item.trainerName}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <StarRating
                                type={'custom'}
                                maxStars={5}
                                rating={Number(item.rating)}
                                starSize={15}
                                fullStarColor={Color.ratingStarColor}
                                disabled={true}
                                starStyle={{ marginRight: 5 }}
                            />
                            <Text style={styles.reviewCount}>{item.ratingCount} Reviews</Text>
                            {!this.getButtonStatus(item.buttonStatus).disabled ? (
                                <View style={{ ...styles.cancelBtn, backgroundColor: this.getButtonStatus(item.buttonStatus).color }}>
                                    <Text style={{ ...styles.typeTxt, color: Color.white }}>{this.getButtonStatus(item.buttonStatus).text}</Text>
                                </View>
                            ) : null}

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        ));

        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
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
                                pageNumber: 0,
                                empty: false,
                                loading: !this.state.loading
                            })
                            this.getScheduleDetails(0, 'click', Moment(date).format('YYYY-MM-DD'));

                        }}
                        highlightDateNumberStyle={{
                            top: 10,
                            lineHeight: 23,
                            backgroundColor: Color.pinkBlue,
                            width: 30,
                            height: 25,
                            borderRadius: 10,
                            overflow: 'hidden',
                            color: Color.white,
                            fontSize: 12,
                            fontFamily: Font.Regular
                        }}
                        calendarHeaderPosition={"above"}
                        style={{ height: 100, width: screenWidth / 100 * 95, marginTop: 15 }}
                        calendarHeaderStyle={{ color: Color.black, fontSize: 12, fontFamily: Font.Regular }}
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
                    <SafeAreaView style={{ width: '100%', alignItems: 'center' }}>
                        <ScrollView
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {

                                    if (!this.state.finished) {
                                        this.setState({
                                            pageNumber: this.state.pageNumber + 1,
                                            loading: !this.state.loading,
                                        });
                                        const page = this.state.pageNumber + 1;
                                        this.getScheduleDetails(page)
                                    }
                                }
                            }}
                            style={{ width: '100%' }}
                        >
                            <View style={{ width: '100%', alignItems: 'center', paddingTop: 5 }}>
                                {list}
                                {this.state.empty ? (
                                    <EmptyAlert message={'No Sessions'} />
                                ) : null}
                            </View>
                            {
                                this.state.loading ?
                                    <View style={styles.gifHolder}>
                                        <Image source={gif} style={styles.gif} />
                                    </View>
                                    : null
                            }

                        </ScrollView>

                    </SafeAreaView>

                </View>
            </View>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    subContainer: {
        width: '95%',
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 1,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        padding: 10,

    },
    typeContainer: {
        backgroundColor: Color.whiteBlue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    cancelBtn: {
        backgroundColor: Color.softRed,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        paddingHorizontal: 10,
        position: 'absolute',
        right: 10
    },
    mainTitle: {
        fontFamily: Font.Bold,
        fontSize: 13,
        lineHeight: 14,
        color: Color.black,
        marginBottom: 15,
        marginTop: 5
    },
    duration: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 13,
        color: Color.softLightGray1
    },
    typeTxt: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22,
        color: Color.pinkBlue
    },
    reviewCount: {
        fontFamily: Font.SemiBold,
        fontSize: 14,
        lineHeight: 22,
        color: Color.ratingTextColor
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

export default App;
