import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    Modal, SafeAreaView,
} from 'react-native';
import { styles } from "../Classes/ClassesDetails/styles";
import { Color } from "../../../constance/Colors";
import SearchBtn from "../../../assets/Sample/search.png";
import axios from '../../../axios/axios';
import { SubUrl } from "../../../axios/server_url";
import gif from '../../../assets/Home/loading.gif';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';
import { AppToast } from "../../../constance/AppToast";
import PlaceholderIMG from "../../../assets/Sample/placeholderIMG.jpg";
import RatingModal from "../../../component/UIElement/RatingModal";
import EmptyAlert from "../../../component/UIElement/EmptyAlert";
import Location from '../../../assets/Home/locationGray.png';
import AsyncStorage from "@react-native-community/async-storage";
import { StorageStrings } from "../../../constance/StorageStrings";
import DiscountLabel from "../../../assets/Home/discountLabel.png";
import { CurrencyType } from "../../../constance/AppCurrency";
import Geocoder from 'react-native-geocoding';
import Model from '../../../component/GooglePlacesModel/Model';
import LocationChanger from '../../../component/UIElement/LocationChanger';
import ButtonGroup from '../../../component/Actions/ButtonGroup';
import {AppEventsLogger} from "react-native-fbsdk";
import analytics from "@react-native-firebase/analytics";
import HeaderSearchBar from "../../../component/UIElement/HeaderSearchBar";

Geocoder.init("AIzaSyA13UKUzwBBk-EcOqbj8pwRUyCBBcdwuAQ");

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 0;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

let prev = 0;

class App extends React.Component {
    state = {
        searchKey: {
            value: '',
            valid: true
        },
        listDayPass: [],
        listMembership: [],
        pageNumber: 0,
        finished: false,
        loading: false,
        nameSearch: false,
        typeSearch: false,
        empty: false,
        selectedIndex: 0,
        latitude: '',
        longitude: '',
        locationName: '',
        modalVisible: false,
        loadLocation: false,
    };

    async componentWillMount() {
        this.updateIndex = this.updateIndex.bind(this);
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', async () => {
            this.setState({
                pageNumber: 0,
                listDayPass: [],
                listMembership: [],
                searchKey: {
                    value: '',
                    valid: true
                },
                empty: false,
                finished: false,
            });



            if (this.state.selectedIndex !== 0) {
                this.getAllGymsforDayPass();
            } else {
                this.getAllGymsforMemberships();
            }

        });
        this.setState({
            loadLocation: !this.state.loadLocation,
            latitude: this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LATITUDE)) : this.props.latitude,
            longitude: this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE)) : this.props.longitude,
        })
        this.getLocationAddress();

    }

    // componentWillUnmount() {
    //     if (this.willFocusSubscription) {
    //         this.willFocusSubscription.remove();
    //     }
    // }

    /**
     * button group press handler
     * @param selectedIndex
     */
    updateIndex(selectedIndex) {
        if (selectedIndex !== this.state.selectedIndex) {
            this.setState({
                selectedIndex,
                pageNumber: 0,
                listDayPass: [],
                listMembership: [],
                searchKey: {
                    value: '',
                    valid: true
                },
                empty: false,
                finished: false,
            });

            if (selectedIndex === 0) {
                this.getAllGymsforMemberships(0, 'first', '')
            } else {
                this.getAllGymsforDayPass(0, 'first', '')
            }
        }
    }

    /**
     * set currency type
     * @param value
     * @returns {*}
     */
    numberFormat = (value) =>
        new Intl.NumberFormat(CurrencyType.locales, {
            style: 'currency',
            currency: CurrencyType.currency
        }).format(value).replace(/\.00/g, '');

    /**
     * preview location nearest city name
     */
    async getLocationAddress() {

        const latitude = this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LATITUDE)) : this.props.latitude;
        const longitude = this.props.latitude === 0 ? Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE)) : this.props.longitude;

        Geocoder.from(latitude, longitude)
            .then(json => {
                console.log(json)
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
     * get all gym memberships endpoint
     * @param page
     * @param click
     * @param searchName
     * @returns {Promise<void>}
     */
    getAllGymsforMemberships = async (page, click, searchName) => {

        if (page === undefined) {
            page = 0
        }

        const name = searchName !== '' ? this.state.searchKey.value : '';
        this.setState({ loading: true });
        const latitude = this.props.latitude !== 0 ? this.props.latitude : Number(await AsyncStorage.getItem(StorageStrings.LATITUDE));
        const longitude = this.props.longitude !== 0 ? this.props.longitude : Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE));

        axios.get(SubUrl.get_all_gyms_has_memberships + '?page=' + page + '&size=10' + '&name=' + name + '&longitude=' + longitude + '&latitude=' + latitude)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.empty && data.pageable.pageNumber === 0) {
                        this.setState({ empty: true })
                    }
                    if (data.last && data.empty) {
                        this.setState({ finished: true, loading: false });
                    } else {
                        let list = '';
                        if (click !== 'click') {
                            list = this.state.listMembership;
                        } else {
                            list = [];
                        }
                        data.content.map((items) => {
                            list.push({
                                id: items.gymId,
                                name: items.gymName,
                                image: items.gymImage !== null ? items.gymImage : null,
                                rating: items.gymRating,
                                ratingCount: items.gymRatingCount,
                                location: items.location.city,
                                distance: items.distance.toFixed(1),
                                price: items.price,
                                discountedPrice: items.discountedPrice,
                                discount: items.discount
                            })
                        })
                        if (data.last) {
                            this.setState({ finished: true, loading: false });
                        }
                        this.setState({
                            listDayPass: list,
                            nameSelect: false,
                        });
                    }
                } else {
                    this.setState({ loading: false, empty: true });
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({ loading: !this.state.loading });
                AppToast.networkErrorToast();
            })
    };

    /**
     * get all day pass membership endpoint
     * @param page
     * @param click
     * @param searchName
     * @returns {Promise<void>}
     */
    getAllGymsforDayPass = async (page, click, searchName) => {

        if (page === undefined) {
            page = 0
        }

        const name = searchName !== '' ? this.state.searchKey.value : '';
        this.setState({ loading: true });
        const latitude = this.props.latitude !== 0 ? this.props.latitude : Number(await AsyncStorage.getItem(StorageStrings.LATITUDE));
        const longitude = this.props.longitude !== 0 ? this.props.longitude : Number(await AsyncStorage.getItem(StorageStrings.LONGITUDE));

        axios.get(SubUrl.get_all_gyms_has_dayPass + '?page=' + page + '&size=10' + '&name=' + name + '&longitude=' + longitude + '&latitude=' + latitude)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    if (data.empty && data.pageable.pageNumber === 0) {
                        this.setState({ empty: true })
                    }
                    if (data.last && data.empty) {
                        this.setState({ finished: true, loading: false });
                    } else {
                        let list = '';
                        if (click !== 'click') {
                            list = this.state.listDayPass;
                        } else {
                            list = [];
                        }
                        data.content.map((items) => {
                            list.push({
                                id: items.gymId,
                                name: items.gymName,
                                image: items.gymImage !== null ? items.gymImage : null,
                                rating: items.gymRating,
                                ratingCount: items.gymRatingCount,
                                location: items.location.city,
                                distance: items.distance.toFixed(1),
                                price: items.price,
                                discountedPrice: items.discountedPrice,
                                discount: items.discount
                            })
                        })
                        if (data.last) {
                            this.setState({ finished: true, loading: false });
                        }
                        this.setState({
                            listMembership: list,
                            nameSelect: false,
                        });
                    }
                } else {
                    this.setState({ loading: false, empty: true });
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({ loading: !this.state.loading });
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
            listDayPass: [],
            listMembership: [],
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
                    this.facebookAnalytics('Gym Memberships')
                    this.getAllGymsforMemberships();
                } else {
                    this.facebookAnalytics('Single Entry')
                    this.getAllGymsforDayPass();
                }
                this.googleAnalytics();
            }
        }, 1000)



    };

    /**
     * location search visibility handler
     * @returns {Promise<void>}
     */
    toggleModal = async () => {
        this.setState({
            searchKey: {
                value: '',
                valid: true
            },
            listDayPass: [],
            listMembership: [],
            pageNumber: 0,
            finished: false,
            loading: false,
            nameSearch: false,
            typeSearch: false,
            empty: false,
            modalVisible: !this.state.modalVisible,
            loadLocation: !this.state.loadLocation,
            latitude: this.props.latitude,
            longitude: this.props.longitude,
        });

        this.getLocationAddress();
        if (this.state.selectedIndex === 0) {
            this.getAllGymsforMemberships();
        } else {
            this.getAllGymsforDayPass();
        }
    };

    closeModal = async () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    /**
     * facebook analytics
     * @param type
     */
    facebookAnalytics=(type)=>{
        AppEventsLogger.logEvent("fb_mobile_search",{
            'fb_content_type':type,
            'fb_search_string':this.state.searchKey.value,
            'fb_success':true})
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
     * button press event handler
     * @param type
     * @param item
     * @returns {Promise<void>}
     */
    onButtonClick = async (type, item) => {
        const { navigate } = this.props.navigation;
        switch (type) {
            case 'search':
                if (this.state.selectedIndex !== 0) {
                    this.facebookAnalytics('Single Entry')
                    this.setState({ nameSelect: true, listDayPass: [], empty: false, loading: !this.state.loading });
                    this.getAllGymsforDayPass();
                } else {
                    this.facebookAnalytics('Gym Memberships')
                    this.setState({ nameSelect: true, listMembership: [], empty: false, loading: !this.state.loading });
                    this.getAllGymsforMemberships();
                }
                this.googleAnalytics()
                break;
            case 'gym':
                navigate('GymProfileForm', {
                    gymId: item.id,
                    gymName: item.name,
                    refresh: true
                });
                this.setState({
                    searchKey: { value: '', valid: true },
                });
                break;
            case 'modal':
                this.setState({ modalVisible: true });
                break;
            default:
                break;
        }
    };

    render() {

        const buttons = ['Memberships', 'Single Entry'];
        const { selectedIndex } = this.state;

        const listDaypass = this.state.listDayPass.map((item, i) => (
            <TouchableOpacity
                style={styles.businessContainer} key={i}
                onPress={() => this.onButtonClick('gym', item)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.imageOuter2}>
                        <Image source={item.image !== null ? { uri: item.image } : PlaceholderIMG} reziseMode={'stretch'}
                            style={styles.imageStyle} />
                    </View>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text style={{ ...styles.containerTitle, marginTop: 0 }}>{item.name}</Text>
                        <RatingModal
                            rating={item.rating}
                            count={item.ratingCount}
                            color={'#4B6883'}
                            fontSize={14}
                            tintColor={Color.white}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, marginRight: 5 }}>
                                <Image source={Location} style={{ width: '100%', height: '100%' }}
                                    resizeMode={'contain'} />
                            </View>
                            <Text style={styles.address}>{item.location + ' (' + item.distance + ' Km Away)'}</Text>
                        </View>

                        {item.discount !== 0 ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    ...styles.address,
                                    fontSize: 10,
                                    color: Color.whiteGray,
                                    textDecorationLine: 'line-through'
                                }}>{this.numberFormat(item.price)}</Text>
                                <View style={styles.labelContainer}>
                                    <Image source={DiscountLabel} style={styles.labelImage}
                                        resizeMode={'stretch'} />
                                    <Text style={{
                                        ...styles.address,
                                        fontSize: 11.5,
                                        color: Color.white,
                                        zIndex: 1
                                    }}>{item.discount}%
                                        OFF</Text>
                                </View>
                            </View>
                        ) : null}


                        <Text style={styles.currency}>{this.numberFormat(item.discountedPrice)}</Text>
                    </View>

                </View>

            </TouchableOpacity>
        ));

        const listMembership = this.state.listMembership.map((item, i) => (
            <TouchableOpacity
                style={{ ...styles.businessContainer, paddingVertical: 10 }} key={i}
                onPress={() => this.onButtonClick('gym', item)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.imageOuter2}>
                        <Image source={item.image !== null ? { uri: item.image } : PlaceholderIMG} reziseMode={'stretch'}
                            style={styles.imageStyle} />
                    </View>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text style={{ ...styles.containerTitle, marginTop: 0 }}>{item.name}</Text>
                        <RatingModal
                            rating={item.rating}
                            count={item.ratingCount}
                            color={'#4B6883'}
                            fontSize={14}
                            tintColor={Color.white}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, marginRight: 5 }}>
                                <Image source={Location} style={{ width: '100%', height: '100%' }}
                                    resizeMode={'contain'} />
                            </View>
                            <Text style={styles.address}>{item.location + ' (' + item.distance + ' Km Away)'}</Text>
                        </View>

                        {item.discount !== 0 ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    ...styles.address,
                                    fontSize: 10,
                                    color: Color.whiteGray,
                                    textDecorationLine: 'line-through'
                                }}>{this.numberFormat(item.price)}</Text>
                                <View style={styles.labelContainer}>
                                    <Image source={DiscountLabel} style={styles.labelImage}
                                        resizeMode={'stretch'} />
                                    <Text style={{
                                        ...styles.address,
                                        fontSize: 11.5,
                                        color: Color.white,
                                        zIndex: 1
                                    }}>{item.discount}%
                                        OFF</Text>
                                </View>
                            </View>
                        ) : null}

                        <Text style={styles.currency}>{this.numberFormat(item.discountedPrice)}</Text>
                    </View>

                </View>

            </TouchableOpacity>
        ));


        return (
            <SafeAreaView style={styles.container}>
                <HeaderSearchBar
                    value={this.state.searchKey.value}
                    onTextChange={this.onTextChange('searchKey')}
                    navigation={this.props.navigation}
                    headerTitle={'Gyms around you'}
                    searchBtnPlaceholder={'Search for any gym'}
                />
                <StatusBar barStyle="dark-content" backgroundColor={Color.white} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (!this.state.finished) {
                                this.setState({
                                    pageNumber: this.state.pageNumber + 1,
                                    loading: !this.state.loading,
                                });
                                if (this.state.selectedIndex === 0) {
                                    const page = this.state.pageNumber + 1;
                                    this.getAllGymsforMemberships(page);
                                } else {
                                    const page = this.state.pageNumber + 1;
                                    this.getAllGymsforDayPass(page);
                                }
                            }
                        }
                    }}

                    style={{ width: '100%' }}>

                    <LocationChanger
                        loadLocation={this.state.loadLocation}
                        locationName={this.state.locationName}
                        onPress={() => this.onButtonClick('modal')}
                    />

                    {/*<View style={{ width: '100%', alignItems: 'center' }}>*/}
                    {/*    <View style={styles.searchOuter}>*/}
                    {/*        <TextInput*/}
                    {/*            placeholder={'Search for any gym'}*/}
                    {/*            placeholderTextColor={Color.softlightGray}*/}
                    {/*            style={styles.searchTitle}*/}
                    {/*            onChangeText={this.onTextChange('searchKey')}*/}
                    {/*            value={this.state.searchKey.value}*/}
                    {/*        // onSubmitEditing={() => {*/}
                    {/*        //     this.onButtonClick('search')*/}
                    {/*        // }}*/}
                    {/*        />*/}
                    {/*        <TouchableOpacity style={styles.searchIcon}*/}
                    {/*            onPress={() => this.onButtonClick('search')}>*/}
                    {/*            <Image source={SearchBtn} style={{ width: 20, height: 20 }} />*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    </View>*/}
                    {/*</View>*/}

                    <View style={styles.AuthHolder}>
                        <ButtonGroup
                            buttons={buttons}
                            onPress={this.updateIndex}
                            selectedIndex={selectedIndex}
                            bgColor={Color.softLightRed}
                        />

                        {this.state.selectedIndex !== 0 ? (
                            <View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
                                {this.state.empty ? (
                                    <EmptyAlert message={'There is no gyms under given types'} />
                                ) : null}
                                {listDaypass}
                            </View>
                        ) : (
                                <View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
                                    {this.state.empty ? (
                                        <EmptyAlert message={'There is no gyms under given types'} />
                                    ) : null}
                                    {listMembership}
                                </View>
                            )}


                    </View>
                    {
                        this.state.loading ?
                            <View style={styles.gifHolder}>
                                <Image source={gif} style={styles.gif} />
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
