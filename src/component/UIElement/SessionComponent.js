import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Filter from "../../assets/Sample/Filter.png";
import { Rating } from "react-native-elements";
import { Color } from "../../constance/Colors";
import { Font } from "../../constance/AppFonts";
import RatingModal from "./RatingModal";
import PlaceholderIMG from '../../assets/Sample/placeholderIMG.jpg';
import {styles} from "./ElementsCommenStyles/SessionStyles";
import {GROUP_CLASS_ONLY,SINGLE_SESSION_PAYMENT} from "../../constance/Const";


const screenHeight = Math.round(Dimensions.get('window').height);

class App extends React.Component {
    state = {
        imageLoad: true,
        priceLabelVisibility:true
    };
    componentWillMount() {
        if (this.props.role!=='offline'){
            this.setState({priceLabelVisibility:SINGLE_SESSION_PAYMENT})
        }
    }

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
                        {this.props.sessionsUpcoming && this.props.buttonStatus === 'FIRST_FREE' && this.state.priceLabelVisibility && (
                            <View style={styles.freeLabel}>
                                <Text style={{ ...styles.price, fontSize: 12 }}>First Class Free</Text>
                            </View>
                        )}

                        {this.props.typeName !== undefined && !GROUP_CLASS_ONLY?(
                            <View style={styles.typeHolder}>
                                <Text style={this.props.typeName ==='Group'?styles.classType:{...styles.classType,fontSize:10}}>{this.props.typeName}</Text>
                            </View>
                        ):null}


                        {this.state.priceLabelVisibility && (
                            <View style={styles.priceHolder}>
                                <Text style={this.props.buttonStatus !== 'FIRST_FREE' ? styles.price : {
                                    ...styles.price,
                                    textDecorationLine: 'line-through'
                                }}>{this.props.price}</Text>
                            </View>
                        )}
                    </View>



                </View>

                <Text style={{ ...styles.categoryTitle, fontFamily: Font.SemiBold }}>{this.props.name}</Text>
                <Text style={styles.time}>{this.props.calorie} </Text>
                {this.props.sessionPerWeek !== null ? (
                    <Text style={{
                        ...styles.time,
                        fontSize: 10,
                        color: Color.softLightGray1
                    }}>{this.props.sessionPerWeek} Session
                        per
                        week</Text>
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

export default App;
