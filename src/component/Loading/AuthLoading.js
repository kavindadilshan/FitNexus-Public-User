import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import { View } from "react-native";

const Loading = (props) => {

    return (
        <View style={props.isVisible ? { height: '100%', zIndex: 3 } : { height: '100%' }}>
            <AwesomeAlert
                show={props.isVisible}
                showProgress={true}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                message="Loading"
            />
        </View>
    );

};

export default Loading;