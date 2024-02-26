import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AirbnbRating } from 'react-native-elements';
import { Color } from "../../../constance/Colors";
import Line from '../../../assets/Sample/Line.png';
import axios from '../../../axios/axios';
import { StorageStrings } from "../../../constance/StorageStrings";
import { SubUrl } from "../../../axios/server_url";
import { styles } from "./style";
import { Font } from "../../../constance/AppFonts";
import { AppToast } from "../../../constance/AppToast";
import Loading from "../../../component/Loading/Loading";
import gif from "../../../assets/Home/loading.gif";
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';
import {AppEventsLogger} from "react-native-fbsdk";

const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component {
    state = {
        name: '',
        description: '',
        ratingValue: {
            value: 0,
            valid: true,
        },
        ratingComment: {
            value: '',
            valid: true,
        },
        role: '',
        loading: false,
        loading2: false,
        classType: '',
        buttonVisible: true
    };

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            this.getReviewByUser();
        })
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription.remove();
        }
    }

    /**
     *get review by user
     * reviews for classes,trainers,sessions
     * @returns {Promise<void>}
     */
    getReviewByUser = async () => {
        const userId = await AsyncStorage.getItem(StorageStrings.USER_ID);
        const { navigation } = this.props;
        const roleId = navigation.getParam('roleId');
        const role = navigation.getParam('role');
        const classType = navigation.getParam('classType');
        this.setState({ loading2: true, classType: classType });
        axios.get(role === 'classes' ? classType !== 'online' ? SubUrl.get_physical_class_rating + roleId + '/user/' + userId + '/ratings' :
            SubUrl.get_class_ratings + roleId + '/user/' + userId + '/ratings' :
            role === 'gym' ? SubUrl.get_gym_ratings + roleId + '/user/' + userId + '/ratings' :
                role === 'fitnessTrainer' ? SubUrl.get_physical_trainer_rating_by_user + roleId + '/user/' + userId + '/ratings' :
                    role === 'instructor' || role === 'instructor_call' ? SubUrl.get_instructor_rating_by_user + roleId + '/user/' + userId + '/ratings' :
                        SubUrl.get_trainer_ratings + roleId + '/user/' + userId + '/ratings')
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    if (data !== null) {
                        const rating = data.rating;
                        const comment = data.comment;

                        if(rating!==0){
                            this.setState({buttonVisible:false})
                        }

                        this.setState({
                            loading2: false,
                            ratingValue: {
                                value: Number(rating),
                                valid: true
                            },
                            ratingComment: {
                                value: comment,
                                valid: true
                            },
                        })
                    } else {
                        this.setState({ loading2: false })
                    }

                } else {
                    this.setState({ loading2: false });
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({ loading2: false })
                AppToast.networkErrorToast();
            })
    };

    componentDidMount() {
        this.manageRatingCount = this.manageRatingCount.bind(this);
    }


    /**
     * Manage Rating Star Values
     * @param rating
     */

    manageRatingCount = (rating) => {
        this.setState({
            ratingValue: {
                value: rating,
                valid: true,
            },
            buttonVisible: false
        })
    };

    /**
     * save ratings endpoints
     * @returns {Promise<void>}
     */
    saveRating = async () => {
        const { navigation } = this.props;
        const roleId = navigation.getParam('roleId');
        const role = navigation.getParam('role');

        if (role === 'classes') {
            const data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                rating: this.state.ratingValue.value,
                comment: this.state.ratingComment.value,
                classId: roleId
            };
            axios.post(this.state.classType !== 'online' ? SubUrl.save_rating_physical_class : SubUrl.save_rating_class, data)
                .then(async response => {
                    if (response.data.success) {
                        this.setState({ loading: false });
                        this.props.reviewItem(true);
                        const { navigate } = this.props.navigation;
                        navigate('ReviewForm');
                    } else {
                        this.setState({ loading: false });
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({ loading: false });
                    AppToast.networkErrorToast();
                })
        } else if (role === 'instructor' || role === 'instructor_call') {
            const data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                rating: this.state.ratingValue.value,
                comment: this.state.ratingComment.value,
                instructorId: roleId
            };
            axios.post(SubUrl.save_rating_instructor, data)
                .then(async response => {
                    if (response.data.success) {
                        this.setState({ loading: false });
                        this.props.reviewItem(true);
                        if (role !== 'instructor_call') {
                            const { navigate } = this.props.navigation;
                            navigate('ReviewForm');
                        } else {
                            this.props.navigation.goBack();
                        }

                    } else {
                        this.setState({ loading: false });
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({ loading: false })
                    AppToast.networkErrorToast();
                })
        } else if (role === 'gym') {
            const data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                rating: this.state.ratingValue.value,
                comment: this.state.ratingComment.value,
                gymId: roleId
            };
            axios.post(SubUrl.save_rating_gym, data)
                .then(async response => {
                    if (response.data.success) {
                        this.setState({ loading: false });
                        this.props.reviewItem(true);
                        const { navigate } = this.props.navigation;
                        navigate('ReviewForm');
                    } else {
                        this.setState({ loading: false });
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({ loading: false })
                    AppToast.networkErrorToast();
                })
        } else if (role === 'fitnessTrainer') {
            const data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                rating: this.state.ratingValue.value,
                comment: this.state.ratingComment.value,
                trainerId: roleId
            };
            axios.post(SubUrl.rate_rating_for_physical_trainer, data)
                .then(async response => {
                    if (response.data.success) {
                        this.setState({ loading: false });
                        this.props.reviewItem(true);
                        const { navigate } = this.props.navigation;
                        navigate('ReviewForm');
                    } else {
                        this.setState({ loading: false });
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({ loading: false })
                    AppToast.networkErrorToast();
                })
        } else {
            const data = {
                userId: await AsyncStorage.getItem(StorageStrings.USER_ID),
                rating: this.state.ratingValue.value,
                comment: this.state.ratingComment.value,
                trainerId: roleId
            };
            axios.post(SubUrl.save_rating_trainer, data)
                .then(async response => {
                    if (response.data.success) {
                        this.setState({ loading: false });
                        this.props.reviewItem(true);
                        const { navigate } = this.props.navigation;
                        navigate('ReviewForm');
                    } else {
                        this.setState({ loading: false });
                        AppToast.serverErrorToast();
                    }
                })
                .catch(error => {
                    this.setState({ loading: false })
                    AppToast.networkErrorToast();
                })
        }

    }

    /**
     * button click event
     */

    onButtonClick = () => {
        this.setState({ loading: true });
        this.facebookAnalyticsForRate();
        this.saveRating();
    };

    /**
     * fb analytics for rate
     */
    facebookAnalyticsForRate=()=>{
        const { navigation } = this.props;
        const roleId = navigation.getParam('roleId');
        const role = navigation.getParam('role');
        const name = navigation.getParam('name')
        AppEventsLogger.logEvent("fb_mobile_rate",{
            "fb_content_type":role,
            "fb_content_id":roleId,
            "fb_content":name,
            "fb_max_rating_value":this.state.ratingValue.value
        })
    }

    /**
     * change state of input text fields
     * @param name
     * @returns {Function}
     */
    onTextChange = (name) => val => {
        const item = this.state[name];
        item.value = val;
        this.setState({
            [name]: item,
        });
    };


    render() {
        return (
            !this.state.loading2 ? (
                <SafeAreaView style={{ flex: 1, backgroundColor: Color.backgroundColor }}>
                    <StatusBar barStyle="dark-content" backgroundColor={Color.white} />
                    <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                        <View style={{ alignItems: 'center' }}>
                            <AirbnbRating
                                count={5}
                                showRating={false}
                                defaultRating={this.state.ratingValue.value}
                                starStyle={{ margin: 5, marginTop: 20 }}
                                onFinishRating={this.manageRatingCount}
                                size={screenWidth / 100 * 10}
                            />
                            <Text style={styles.main}>Tap a Star to Rate</Text>
                            <Image source={Line} style={{ width: '100%', marginVertical: 10 }} />

                            <View style={styles.reviewComment}>
                                <TextInput
                                    style={styles.body}
                                    containerStyle={{ ...styles.inputContainerStyle }}
                                    inputContainerStyle={styles.inputStyle}
                                    onChangeText={this.onTextChange('ratingComment')}
                                    inputStyle={styles.inputTextStyle}
                                    placeholder={'Review'}
                                    placeholderTextColor={Color.lightGray}
                                    autoCapitalize='none'
                                    multiline={true}
                                    numberOfLines={1000}
                                    value={this.state.ratingComment.value}

                                />
                            </View>

                        </View>

                    </ScrollView>
                    <TouchableOpacity
                        style={this.state.buttonVisible ? { ...styles.button, backgroundColor: Color.gray } : styles.button} onPress={() => this.onButtonClick()}
                        disabled={this.state.buttonVisible}
                    >
                        <Text style={{
                            fontFamily: Font.Medium,
                            color: Color.white,
                            fontSize: screenWidth === 800 ? 25 : 15,
                        }}>Submit</Text>
                    </TouchableOpacity>
                    <Loading isVisible={this.state.loading} />
                </SafeAreaView>
            ) : (
                    <View style={styles.gifHolder2}>
                        <Image source={gif} style={styles.gif2} />
                    </View>
                )

        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = dispatch => {
    return {
        reviewItem: review => dispatch(actionTypes.reviewItem(review)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
