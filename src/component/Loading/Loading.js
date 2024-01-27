import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';

const Loading = (props) => {

    return (

        <AwesomeAlert
            show={props.isVisible}
            showProgress={true}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            message="Loading"
        />

    );

};

export default Loading;
