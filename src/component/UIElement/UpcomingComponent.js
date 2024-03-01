import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator} from 'react-native';
import Filter from "../../assets/Sample/Filter.png";
import {Rating} from "react-native-elements";
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";
import RatingModal from "./RatingModal";
import PlaceholderIMG from '../../assets/Sample/placeholderIMG.jpg';
import {styles} from "./ElementsCommenStyles/SessionStyles";
import {SINGLE_SESSION_PAYMENT} from "../../constance/Const";


const screenHeight = Math.round(Dimensions.get('window').height);

class App extends React.Component {
    state = {
        imageLoad: true
    };

    render() {
        let date = new Date();
        date.setDate(date.getDate() + 1);

        return (
            <TouchableOpacity style={{width: 160, marginBottom: 20}}
                              onPress={this.props.onPress}>
                <View style={{...styles.categoryContent, height: 120, width: '95%'}}>
                    <View style={{overflow: 'hidden', borderRadius: 10}}>
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
                        <Image source={this.props.image !== null ? {uri: this.props.image} : PlaceholderIMG}
                               style={styles.imageHolder} resizeMode={'cover'}
                               onLoadStart={() => this.setState({imageLoad: true})}
                               onLoadEnd={() => this.setState({imageLoad: false})}
                        />
                        <Image source={Filter} style={styles.imageHolder2} resizeMode={'stretch'}/>
                        {this.props.sessionsUpcoming && this.props.buttonStatus === 'FIRST_FREE' && SINGLE_SESSION_PAYMENT ? (
                            <View style={styles.freeLabel}>
                                <Text style={{...styles.price, fontSize: 12}}>First Class Free</Text>
                            </View>
                        ) : null}

                        {SINGLE_SESSION_PAYMENT && (
                            <View style={styles.priceHolder}>
                                <Text style={this.props.buttonStatus !== 'FIRST_FREE' ? styles.price : {
                                    ...styles.price,
                                    textDecorationLine: 'line-through'
                                }}>{this.props.price}</Text>
                            </View>
                        )}
                    </View>

                </View>

                <Text style={{...styles.categoryTitle, fontFamily: Font.SemiBold}}>{this.props.name}</Text>
                <Text
                    style={styles.date}>
                    {this.props.date === new Date().toISOString().split('T')[0] ?
                        'Today' : this.props.date === date.toISOString().split('T')[0] ?
                            'Tomorrow' :
                            new Date(this.props.date).toDateString().slice(4)
                    }
                </Text>
                <Text style={styles.time}>{this.props.startTime} - {this.props.endTime} </Text>
                <Text style={{
                    ...styles.time,
                    fontSize: 10,
                    color: Color.softLightGray1
                }}>{this.props.trainerName}</Text>
            </TouchableOpacity>
        )
    }
}

export default App;
