import React from 'react';
import {View, StyleSheet, Image, ScrollView, Dimensions, StatusBar} from 'react-native';
import {Color} from "../../../constance/Colors";
import gif from "../../../assets/Home/loading.gif";
import EmptyAlert from "../../../component/UIElement/EmptyAlert";
import MembershipCard from '../../../component/UIElement/MembershipCard';
import AlertMassage from "../../../component/Actions/AlertMassage";
import {connect} from "react-redux";
import {AppEventsLogger} from "react-native-fbsdk";
import {CurrencyType} from "../../../constance/AppCurrency";
import * as actionTypes from "../../../store/actions";
import AsyncStorage from "@react-native-community/async-storage";


const screenHeight = Math.round(Dimensions.get('window').height);

class App extends React.Component {

    state = {
        list: [],
        name: '',
        loading: false,
        role: '',
        path: '',
        membershipBooked: '',
        guestAlert:false
    };

    componentWillMount() {
        this.setState({loading: true});
        const {navigation} = this.props;
        const role = navigation.getParam('role');
        const list = navigation.getParam('list');
        const path = navigation.getParam('path');
        const membershipBooked = navigation.getParam('membershipBooked');
        this.setState({role: role, loading: false, list: list, path: path, membershipBooked: membershipBooked});

    }

    async hideAlert2(type) {
        const { push } = this.props.navigation;
        const data = {
            page: 'MembershipForm',
            parameters:{
                role: this.state.role,
                list: this.state.list,
                path: this.state.path,
                membershipBooked: this.state.membershipBooked
            }
        }
        this.props.getGuestNavigationParams(data);
        // await AsyncStorage.clear();
        switch (type) {
            case 'yes':
                push('AuthForm');
                break;
            case 'no':
                this.setState({ guestAlert: false });
                push('SignOutForm');
                break;
            default:
                break;
        }
    }

    /**
     * facebook analytics using FBSDK
     */
    fbAnalytics = (id,role,price,type) => {
        AppEventsLogger.logEvent('fb_mobile_add_to_cart', price, {
            'fb_content_type': type==='GYM'?
                'gym memberships':role !== 'classMember' ? 'physical memberships' : 'online memberships' ,
            'fb_content_id': id,
            'fb_currency': CurrencyType.currency
        })
    }

    /**
     * button press action handler
     * @param item
     */
    onButtonClick(item) {
        const {navigate} = this.props.navigation;
        if (item.status === 'BOOKED' || item.status === 'PENDING') {
            navigate('MembershipDetailsForm', {
                id: item.publicUserMembershipId,
                role: item.type === 'GYM' ? 'gymMember' : 'classMember',
                membershipType: item.type
            });
        } else {
            // this.fbAnalytics(item.membershipId,this.state.role,item.price,item.type);
            navigate('MembershipCheckOutForm', {
                roleId: item.membershipId,
                role: this.state.role,
                path: this.state.path,
                membershipBooked: this.state.membershipBooked,
                membershipType: item.type
            })
        }

    }

    render() {

        const list = this.state.list.map((item, i) => (
            <MembershipCard
                status={item.status}
                role={this.state.role}
                duration={item.duration}
                name={item.name}
                slotCount={item.slotCount}
                discount={item.discount}
                price={item.price}
                discountedPrice={item.discountedPrice}
                type={item.type}
                onPress={() => this.props.asGuestUser ? this.setState({guestAlert: true}) : this.onButtonClick(item)}
                key={i}
            />
        ));

        return (
            !this.state.loading ? (
                <View style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                    <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            {this.state.list.length !== 0 ? list : (
                                <EmptyAlert navigation={this.props.navigation}/>
                            )}
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.gifHolder}>
                    <Image source={gif} style={styles.gif}/>
                </View>
            )

        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gifHolder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -screenHeight / 100 * 10,
        backgroundColor: Color.white
    },
    gif: {
        width: 90,
        height: 90,
    },
});

const mapStateToProps = (state) => ({
    asGuestUser: state.user.asGuestUser
});

const mapDispatchToProps = dispatch => {
    return {
        getGuestNavigationParams: navigationParams => dispatch(actionTypes.getGuestNavigationParams(navigationParams))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
