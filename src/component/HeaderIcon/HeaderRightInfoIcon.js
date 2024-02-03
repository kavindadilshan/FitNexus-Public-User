import React, {Component} from "react";
import {BackHandler, StyleSheet, Image, TouchableOpacity} from 'react-native';
import InfoIMG from '../../assets/Home/info.png';
import * as actionTypes from "../../store/actions";
import {connect} from 'react-redux';


class App extends Component {

    handleBackPress = async () => {
        this.props.modalVisibility(true);
        console.log(this.props.modalVisible);
        // const resetAction = StackActions.reset({
        //     index: 1,
        //     actions: [
        //         NavigationActions.navigate({ routeName: 'Profile' }),
        //         NavigationActions.navigate({ routeName: 'Settings' }),
        //     ],
        // });
        // this.props.navigation.dispatch(resetAction);
    };

    render() {
        return (
            <TouchableOpacity onPress={this.handleBackPress}>
                <Image
                    source={InfoIMG}
                    style={styles.toggleButton}
                />
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    toggleButton: {
        marginVertical: 20,
        marginHorizontal: 10,
        width: 40,
        height: 40
    },
});


const mapStateToProps = (state) => ({
    modalVisible: state.user.modalVisible
});

const mapDispatchToProps = dispatch => {
    return {
        modalVisibility: activeRoute => dispatch(actionTypes.modalVisibility(activeRoute)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

