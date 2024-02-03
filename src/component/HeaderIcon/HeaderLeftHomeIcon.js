import React,{Component} from "react";
import {Icon} from "react-native-elements";
import {Dimensions, StyleSheet, View,TouchableOpacity} from 'react-native';
import {BackHandler} from "react-native";
import {HardwareBackAction} from "../Actions/HardwareBackAction";
import {connect} from "react-redux";
import {NavigationActions, StackActions} from "react-navigation";

const screenWidth = Math.round(Dimensions.get('window').width);

class App extends Component {

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.props.navigation.addListener('willFocus', this.load);
    }

    load = () => {
        HardwareBackAction.setBackAction(() => {
            if (this.props.homeBack){
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: 'BottomNavigation'})],
                });
                this.props.navigation.dispatch(resetAction);
            }else {
                this.props.navigation.goBack();
            }
        });
    };

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackPress = async () => {
        if (this.props.homeBack){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'BottomNavigation'})],
            });
            this.props.navigation.dispatch(resetAction);
        }else {
            this.props.navigation.goBack();
        }
        return true;
    };

    render() {
        return (
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this.handleBackPress}>
                <Icon
                    containerStyle={styles.toggleButton}
                    name='chevron-left'
                    type='FontAwesome'
                    size={screenWidth===800?40:30}
                    color={'black'}
                />
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    toggleButton: {
        marginLeft: 20,
    },
});


const mapStateToProps = (state) => ({
    homeBack: state.user.homeBack,
    asGuestUser: state.user.asGuestUser
});

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
