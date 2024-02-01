import React from 'react';
import {
    View,
    BackHandler,
    Image,
    StatusBar,
    Platform
} from 'react-native';
import ImageSlider from './ImageSlider/ImageSlider';
import { Color } from "../../../constance/Colors";
import logo from "../../../assets/Auth/fitNexusLogo.png";

class App extends React.Component {
    state = {
        page: ''
    };

    componentDidMount() {
        this.didFocusSubscription = this.props.navigation.addListener('didFocus', async () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        })

    }


    componentWillUnmount() {
        if (this.didFocusSubscription) {
            this.didFocusSubscription.remove();
        }

    }

    /**
     * app exit handler
     * @returns {boolean}
     */
    handleBackButtonClick = () => {
        BackHandler.exitApp();
        return true;
    };

    /**
     * button press event handler
     */
    onButtonClick() {
        const { navigate } = this.props.navigation;
        navigate('LandingForm');
    }

    render() {
        return (

            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white} />

                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    height: 35,
                    marginTop: Platform.OS !== 'ios' ? '10%' : '15%',
                    justifyContent: 'center',
                }}>
                    <View style={{ width: 180, height: 200 }}>
                        <Image source={logo} style={{ width: '100%', height: '100%' }} resizeMode={'contain'} />
                    </View>
                </View>

                <View style={{ width: '100%', alignItems: 'center' }}>
                    <ImageSlider onPress={() => this.onButtonClick()} />
                </View>



            </View>

        )
    }
}

export default App;
