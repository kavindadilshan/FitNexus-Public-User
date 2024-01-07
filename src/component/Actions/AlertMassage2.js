import React from 'react';
import {Color} from "../../constance/Colors";
import AwesomeAlert from "react-native-awesome-alerts";
import {Font} from "../../constance/AppFonts";

class App extends React.Component {
    render() {
        return (
            <AwesomeAlert
                show={this.props.show}
                showProgress={false}
                message={this.props.message}
                closeOnTouchOutside={this.props.enableTouchOutside !== undefined ? this.props.enableTouchOutside : true}
                showCancelButton={true}
                showConfirmButton={false}
                cancelText="Okay"
                onCancelPressed={() => this.props.onCancelPressed()}
                messageStyle={{
                    fontSize: 17,
                    lineHeight: 22,
                    fontFamily: Font.Medium,
                    color: Color.black,
                    textAlign: "center",
                }}
                cancelButtonColor={Color.themeColor}
                contentStyle={{alignItems: 'center', justifyContent: 'center'}}
                contentContainerStyle={{borderRadius: 20}}
                cancelButtonStyle={{
                    width: 100,
                    height: 43,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10
                }}

            />
        )
    }
}

export default App;
