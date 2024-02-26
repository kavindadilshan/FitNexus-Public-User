import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Color } from "../../../constance/Colors";
import Line from '../../../assets/Sample/Line.png'
import axios from '../../../axios/axios';
import { SubUrl } from "../../../axios/server_url";
import TimeAgo from 'react-native-timeago';
import { Font } from "../../../constance/AppFonts";
import { AppToast } from "../../../constance/AppToast";
import RatingModal from "../../../component/UIElement/RatingModal";
import EmptyAlert from "../../../component/UIElement/EmptyAlert";
import PlaceHolderIMG from '../../../assets/Sample/placeholderIMG.jpg';
import gif from "../../../assets/Home/loading.gif";

const screenHeight = Math.round(Dimensions.get('window').height);

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

class App extends React.Component {
    state = {
        list: [],
        pageNumber: 0,
        finished: false,
        loading: false,
        role: '',
        roleId: '',
        empty: false,
        classType: '',
        name: ''
    }

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            this.setState({ list: [], empty: false, loading: !this.state.loading });
            this.getAllReviews();
        });
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    /**
     * get user review endpoints,
     * review for classes,sessions,trainers
     * */
    getAllReviews = async (pageNumber) => {

        const { navigation } = this.props;
        const roleId = navigation.getParam('roleId');
        const role = navigation.getParam('role');
        const classType = navigation.getParam('classType');
        const name = navigation.getParam('name');
        console.log(role)

        this.setState({
            roleId: roleId,
            role: role,
            classType: classType,
            name: name
        });

        if (pageNumber === undefined) {
            pageNumber = 0;
        }

        axios.get(role === 'classes' ? classType !== 'online' ? SubUrl.get_all_review_by_physical_class + roleId + '/ratings' + '?page=' + pageNumber + '&size=5' :
            SubUrl.get_all_review_by_class + roleId + '/ratings' + '?page=' + pageNumber + '&size=5' :
            role === 'instructor' ? SubUrl.get_trainer_reviews_by_instructor + roleId + '/ratings' + '?page=' + pageNumber + '&size=5' :
                role === 'gym' ? SubUrl.get_all_review_by_gyms + roleId + '/ratings' + '?page=' + pageNumber + '&size=5' :
                    role === 'fitnessTrainer' ? SubUrl.get_physical_coach_rating_for_trainer + roleId + '/ratings' + '?page=' + pageNumber + '&size=5' :
                        SubUrl.get_all_review_by_trainer + roleId + '/ratings' + '?page=' + pageNumber + '&size=5')
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.empty && data.pageable.pageNumber === 0) {
                        this.setState({ empty: true })
                    }
                    if (data.last && data.empty) {
                        this.setState({ finished: true, loading: false });
                    } else {
                        const list = this.state.list;
                        data.content.map((items) => {
                            if (new Date(items.dateTime).getFullYear()===2024){
                                list.push({
                                    id: items.id,
                                    comment: items.comment,
                                    dateAndTime: items.dateTime,
                                    name: items.name,
                                    rating: items.rating,
                                    image: items.image !== null ? items.image : null
                                })
                            }

                        })

                        this.setState({
                            list: list
                        })

                        if (data.last) {
                            this.setState({ finished: true, loading: false });
                        }
                    }
                } else {
                    this.setState({ loading: false, empty: true });
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                AppToast.networkErrorToast();
            })
    };

    /**
     * button press action handler
     * */
    onButtonClick = () => {
        const { navigate } = this.props.navigation;
        navigate('RateForm', {
            roleId: this.state.roleId,
            role: this.state.role,
            classType: this.state.classType,
            name:this.state.name
        });
    };

    render() {
        const list = this.state.list.map((items, i) => (
            <View style={styles.subContainer} key={i}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.imageHolder}>
                        <Image source={items.image !== null ? { uri: items.image } : PlaceHolderIMG}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={'cover'} />
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.nameStyle}>{items.name}</Text>
                        {/*<Text style={styles.timeStyle}>{items.dateAndTime}</Text>*/}
                        <TimeAgo
                            time={items.dateAndTime}
                            style={styles.timeStyle}
                        />
                    </View>
                </View>

                <Image source={Line} style={{ width: '100%' }} />

                <View style={{ marginLeft: 10, marginTop: 10 }}>
                    <RatingModal
                        rating={Number(items.rating)}
                        count={null}
                        color={Color.softOrange}
                        fontSize={14}
                    />
                </View>

                <Text style={styles.pharagraph}>{items.comment}</Text>

            </View>
        ));
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (!this.state.finished) {
                                this.setState({
                                    pageNumber: this.state.pageNumber + 1,
                                    loading: !this.state.loading
                                })
                                const pageNumber = this.state.pageNumber + 1
                                this.getAllReviews(pageNumber);
                            }
                        }
                    }}

                    style={{ width: '100%' }}>
                    {this.state.empty ? (
                        <EmptyAlert message={'No reviews yet for ' + this.state.name + '.Be first review ' + this.state.name} />
                    ) : (
                            <View style={{ alignItems: 'center' }}>
                                {list}
                            </View>
                        )}

                    {
                        this.state.loading ?
                            <View style={styles.gifHolder}>
                                <Image source={gif} style={styles.gif} />
                            </View>
                            : null
                    }

                </ScrollView>
                <TouchableOpacity style={styles.bottomBtnHolder} onPress={() => this.onButtonClick()}>
                    <Text style={styles.bottomButtonTxt}>Write a review</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subContainer: {
        width: '95%',
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
        marginVertical: 10,
        paddingBottom: 25
    },
    imageHolder: {
        width: 55,
        height: 55,
        borderRadius: 10,
        margin: 10,
        overflow: 'hidden',
    },
    nameStyle: {
        fontFamily: Font.SemiBold,
        fontSize: 15,
        lineHeight: 22,
        color: Color.black,
        marginTop: 20
    },
    timeStyle: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22,
        color: '#ACACAC',
    },
    pharagraph: {
        fontSize: 12,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: '#ACACAC',
        marginHorizontal: 10
    },
    bottomBtnHolder: {
        position: 'absolute',
        right: 10,
        bottom: 20,
        width: '30%',
        height: 45,
        backgroundColor: Color.themeColor,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    bottomButtonTxt: {
        color: Color.white,
        fontFamily: Font.SemiBold,
        fontSize: 12
    },
    bottomBtn: {
        width: screenHeight / 100 * 14,
        height: screenHeight / 100 * 14
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
