import React from 'react';
import {
    View,
    Text,
    Image,
    StatusBar
} from 'react-native';
import {Color} from "../../../constance/Colors";
import PlaceholderIMG from "../../../assets/Sample/placeholderIMG.jpg";
import RatingModal from "../../../component/UIElement/RatingModal";
import Location from "../../../assets/Home/locationGray.png";
import {CurrencyType} from "../../../constance/AppCurrency";
import {styles} from "../Membership/CheckOut/styles";


class App extends React.Component {

    state = {
        gymName: '',
        gymRating: 0,
        gymRatingCount: 0,
        gymLocation: '',
        gymImage: null,
        name: '',
        discount: 0,
        price: 0,
        discountPrice: 0,
    };

    async componentWillMount() {
        const {navigation} = this.props;
        const dayPass = navigation.getParam('dayPass');

        this.setState({
            gymName: dayPass.gymName,
            gymRating: dayPass.gymRating,
            gymRatingCount: dayPass.gymRatingCount,
            gymLocation: dayPass.city,
            gymImage: dayPass.gymImage,
            discount: dayPass.discount,
            price: dayPass.price,
            discountPrice: dayPass.discountedPrice,
        });

    };

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

    render() {

        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={styles.subContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.dotStyle}>●</Text>
                            <Text style={{
                                ...styles.mainTitle,
                                fontSize: 16
                            }}>
                                Gym Details</Text>
                        </View>

                        <View style={{width: '100%', alignItems: 'center'}}>

                            <View style={styles.businessContainer}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={styles.imageOuter}>
                                        <Image
                                            source={this.state.gymImage !== null ? {uri: this.state.gymImage} : PlaceholderIMG}
                                            reziseMode={'stretch'}
                                            style={styles.imageStyle}/>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 1}}>
                                        <Text
                                            style={{...styles.containerTitle, marginTop: 0}}>{this.state.gymName}</Text>
                                        <RatingModal
                                            rating={this.state.gymRating}
                                            count={this.state.gymRatingCount}
                                            color={'#4B6883'}
                                            fontSize={14}
                                            tintColor={Color.white}
                                        />

                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{width: 10, height: 10, marginRight: 5}}>
                                                <Image source={Location} style={{width: '100%', height: '100%'}}
                                                       resizeMode={'contain'}/>
                                            </View>
                                            <Text style={styles.address}>{this.state.gymLocation}</Text>
                                        </View>

                                    </View>

                                </View>

                            </View>

                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.dotStyle}>●</Text>
                                <Text style={{
                                    ...styles.mainTitle,
                                    fontSize: 16
                                }}>Duration</Text>
                            </View>
                            <Text style={{...styles.nameTitle, position: 'absolute', right: 0, fontSize: 16}}>
                                1 Day
                            </Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                            <Text style={styles.dotStyle}>●</Text>
                            <Text style={styles.title}>Gross Total:</Text>
                            <Text style={{
                                ...styles.currency,
                                color: Color.softlightGray
                            }}>{this.numberFormat(this.state.price)}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                            <Text style={styles.dotStyle}>●</Text>
                            <Text style={styles.title}>Discount<Text
                                style={{...styles.title, color: Color.red}}>({this.state.discount}%
                                OFF)</Text>:</Text>
                            <Text style={{
                                ...styles.currency,
                                color: Color.softlightGray
                            }}>-{this.numberFormat(this.state.price / 100 * this.state.discount)}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                            <Text style={styles.dotStyle}>●</Text>
                            <Text style={styles.title}>Discounted Price:</Text>
                            <Text style={styles.currency}>{this.numberFormat(this.state.discountPrice)}</Text>
                        </View>

                    </View>
                </View>

            </View>

        )
    }
}

export default App;
