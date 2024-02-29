import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Filter from "../../assets/Sample/Filter.png";
import { Rating } from "react-native-elements";
import { Color } from "../../constance/Colors";
import { Font } from "../../constance/AppFonts";
import RatingModal from "./RatingModal";
import PlaceholderIMG from '../../assets/Sample/placeholderIMG.jpg';


const screenHeight = Math.round(Dimensions.get('window').height);

class App extends React.Component {
    state = {
        imageLoad: true
    };
    render() {
        return (
            <TouchableOpacity style={{ width: 160, marginBottom: 20 }}
                onPress={this.props.onPress}>
                <View style={{ ...styles.categoryContent, height: 120, width: '95%' }}>
                    <View style={{overflow: 'hidden',borderRadius:10}}>
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
                        <Image source={this.props.image !== null ? { uri: this.props.image } : PlaceholderIMG}
                               style={styles.imageHolder} resizeMode={'cover'}
                               onLoadStart={() => this.setState({ imageLoad: true })}
                               onLoadEnd={() => this.setState({ imageLoad: false })}
                        />
                        <Image source={Filter} style={styles.imageHolder2} resizeMode={'stretch'} />
                    </View>

                </View>

                <Text style={{ ...styles.categoryTitle, fontFamily: Font.SemiBold }}>{this.props.name}</Text>

                <Text style={{
                    ...styles.time,
                    fontSize: 12,
                    color: Color.softLightGray1
                }}>{this.props.city}</Text>

                {this.props.distance !== null ? (
                    <Text style={{
                        ...styles.time,
                        fontSize: 12,
                        color: Color.softLightGray1
                    }}>({this.props.distance} km away)</Text>
                ) : null}


                <RatingModal
                    rating={Number(this.props.staringValue)}
                    count={this.props.count}
                    color={'#4B6883'}
                    fontSize={10}
                    tintColor={Color.white}
                />
            </TouchableOpacity>
        )
    }
}

export const styles = StyleSheet.create({
    categoryContent: {
        width: '100%',
        height: '65%',
        backgroundColor: Color.white,
        borderRadius: 10,
        elevation: 10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        marginVertical: '5%',
    },
    categoryTitle: {
        fontSize: 14,
        fontFamily: Font.Medium,
        lineHeight: 22,
        width: '95%'
    },
    time: {
        fontFamily: Font.SemiBold,
        fontSize: 12,
        lineHeight: 22,
        color: '#4B6883'
    },
    imageHolder: {
        width: '100%',
        height: '100%',
        zIndex: 1,

    },
    imageHolder2: {
        width: '100%',
        height: '100%',
        zIndex: 2,
        position: 'absolute'
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        height: screenHeight / 100 * 25,
        alignItems: 'center',
    },
    imageHolders: {
        width: '40%',
        height: '95%',
        marginLeft: 10,
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
        overflow: 'hidden'
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        overflow: "hidden",
        // borderRadius:50
    },
});

export default App;
