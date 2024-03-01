import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";
import StarRating from 'react-native-star-rating';

class App extends React.Component {
    render() {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <StarRating
                    type={'custom'}
                    maxStars={5}
                    rating={Number(this.props.rating)}
                    starSize={15}
                    fullStarColor={Color.ratingStarColor}
                    disabled={true}
                    starStyle={{marginRight: 5}}
                />
                <Text style={{
                    ...styles.ratingCount,
                    color: this.props.color,
                    fontSize: this.props.fontSize
                }}>{Number(this.props.rating).toFixed(1)}</Text>
                {this.props.count !== null ? (
                    <Text style={{
                        ...styles.ratingCount,
                        color: this.props.color,
                        fontSize: this.props.fontSize
                    }}>({this.props.count})</Text>
                ) : null}

            </View>
        )
    }
}

export const styles = StyleSheet.create({
    ratingCount: {
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        marginLeft: 7,
        fontSize: 14,
        color: Color.white
    },
})

export default App;
