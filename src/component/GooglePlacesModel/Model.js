import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Font} from "../../constance/AppFonts";
import {Color} from "../../constance/Colors";
import SearchBtn from '../../assets/Home/search.png';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import LocationIMG from '../../assets/Home/location.png';
import CurrentLocationIMG from '../../assets/Home/currentLocation.png';
import AsyncStorage from "@react-native-community/async-storage";
import {StorageStrings} from "../../constance/StorageStrings";
import {AppEventsLogger} from "react-native-fbsdk";

navigator.geolocation = require('@react-native-community/geolocation');

class App extends Component {

    state={
        countryCode:''
    };

    componentWillMount(){
        this.getCountryCodeByName()
    }

    getCountryCodeByName = async () => {
        const countryName = await AsyncStorage.getItem(StorageStrings.COUNTRY);
        const countries = require('../../component/json/countries');

        for (const c of countries) {
            if (c.name === countryName) {
                this.setState({
                    countryCode: c.alpha2Code.toLowerCase()
                })
            }
        }

        return null;
    }


    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.closeModal()}>
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    minLength={2} // minimum length of text to search
                    autoFocus={true}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                    listViewDisplayed={'auto'}
                    fetchDetails={true}
                    renderDescription={row => row.description || row.formatted_address || row.name}
                    onPress={(data, details = null) => {
                        const lat = details.geometry.location.lat;
                        const lng = details.geometry.location.lng;

                        this.props.changeLatitude(lat);
                        this.props.changeLongitude(lng);
                        this.props.toggleModal();
                        this.props.fetchEndpoint(true);

                        AppEventsLogger.logEvent('FindLocation')
                    }
                    }

                    // textInputProps={{onBlur:()=>{}}}

                    getDefaultValue={() => ''}

                    query={{
                        key: 'AIzaSyCybc-cG_46YC0A_soN72NfO4sQoMkEVOM',
                        language: 'en', // language of the results
                        types: 'geocode',
                        // components: 'country:'+this.state.countryCode,
                    }}

                    styles={{
                        textInputContainer: {
                            width: '95%',
                            backgroundColor: Color.white,
                            marginTop: 50,
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            alignItems: 'center'
                        },
                        description: {
                            fontFamily: Font.Medium,
                            color: Color.black1,
                            fontSize: 16,
                            lineHeight: 22
                        },
                        textInput: {
                            fontFamily: Font.Medium,
                            color: Color.black1,
                            fontSize: 16,
                            lineHeight: 22,
                            marginVertical: 10, height: '90%'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb'
                        },
                        poweredContainer: {
                            backgroundColor: Color.white,
                            position: 'absolute',
                            bottom: 0
                        },
                        row: {
                            backgroundColor: Color.white,
                        },
                        container: {
                            width: '100%',
                            alignItems: 'center'
                        },
                        listView: {
                            width: '95%',
                            borderBottomRightRadius: 10,
                            borderBottomLeftRadius: 10,
                        },
                        loader: {
                            position: 'absolute',
                            right: '10%',
                            bottom:13
                        }
                    }}

                    renderRow={row => <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 18, height: 18, marginRight: 10}}>
                            <Image
                                source={row.description === 'Select Current Location' ? CurrentLocationIMG : LocationIMG}
                                style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
                        </View>

                        <Text style={row.description === 'Select Current Location' ? {
                            ...styles.rowResult,
                            color: Color.softGreen
                        } : styles.rowResult}>{row.description || row.formatted_address || row.name}</Text>
                    </View>}
                    enableHighAccuracyLocation={false}
                    currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel="Select Current Location"
                    nearbyPlacesAPI='GoogleReverseGeocoding' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={{
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }}
                    GooglePlacesSearchQuery={{
                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                        rankby: 'distance',
                    }}

                    GooglePlacesDetailsQuery={{
                        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                        fields: 'geometry',
                    }}

                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    // predefinedPlaces={[homePlace, workPlace]}

                    debounce={1000} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    renderLeftButton={() => <Image source={SearchBtn} style={{width: 18, height: 18, marginLeft: 10}}/>}
                    enablePoweredByContainer={false}
                    predefinedPlacesAlwaysVisible={true}

                />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    rowResult: {
        fontFamily: Font.Medium,
        color: Color.black1,
        fontSize: 16,
        lineHeight: 22,
        width:'85%',
    }
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return {
        changeLatitude: latitude => dispatch(actionTypes.changeLatitude(latitude)),
        changeLongitude: longitude => dispatch(actionTypes.changeLongitude(longitude)),
        fetchEndpoint:fetch=>dispatch(actionTypes.fetchEndpoint(fetch))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
