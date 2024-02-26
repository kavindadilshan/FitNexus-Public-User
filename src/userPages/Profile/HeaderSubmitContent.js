import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView, StatusBar, StyleSheet
} from 'react-native';
import { Color } from "../../constance/Colors";
import axios from '../../axios/axios';
import { StorageStrings } from "../../constance/StorageStrings";
import { SubUrl } from "../../axios/server_url";
import { Font } from "../../constance/AppFonts";
import { AppToast } from "../../constance/AppToast";
import Loading from "../../component/Loading/Loading";
import ActionButton from "../../component/Actions/ActionButton";


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class App extends React.Component {
    state = {
        description: {
            value: '',
            valid: true
        },
        loading: false,
    };

    sendQuestions = () => {
        const data = {
            title: "FitNexus Support Q&A",
            message: this.state.description.value
        }
        axios.post(SubUrl.send_questions, data)
            .then(async response => {
                if (response.data.success) {
                    this.setState({ loading: false });
                    const { navigate } = this.props.navigation;
                    navigate('HelpAndSupportForm');
                } else {
                    this.setState({ loading: false });
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                AppToast.networkErrorToast();
            })
    }



    /**
     * button click event
     */

    onButtonClick = () => {
        this.setState({ loading: true });
        this.sendQuestions();
    };

    /**
     * change state of input text fields
     * @param name
     * @returns {Function}
     */
    onTextChange = (name) => val => {
        const item = this.state[name];
        item.value = val;
        this.setState({
            [name]: item,
        });
    };


    render() {
        return (

            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white} />
                <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center' }}>

                        <View style={styles.reviewComment}>
                            <TextInput
                                style={styles.body}
                                containerStyle={{ ...styles.inputContainerStyle }}
                                inputContainerStyle={styles.inputStyle}
                                onChangeText={this.onTextChange('description')}
                                inputStyle={styles.inputTextStyle}
                                placeholder={'Your Question'}
                                placeholderTextColor={Color.lightGray}
                                autoCapitalize='none'
                                multiline={true}
                                numberOfLines={500}
                                value={this.state.description.value}
                                maxLength={1000}

                            />
                        </View>

                    </View>

                </ScrollView>
                <View style={{width:'100%',alignItems:'center'}}>
                    <ActionButton
                        bgColor={ Color.themeColor}
                        onPress={() => this.onButtonClick()}
                        btnContent={'Send'}
                    />
                </View>

                <Loading isVisible={this.state.loading} />
            </SafeAreaView>


        );
    }
}

export const styles = StyleSheet.create({
    main: {
        fontFamily: Font.SemiBold,
        lineHeight: 22,
        fontSize: 15,
        color: '#2C2C2C',
        marginVertical: 10
    },
    reviewComment: {
        width: '94%',
        height: screenHeight / 100 * 55,
        backgroundColor: Color.softLightGray,
        marginTop: 10,
        borderRadius: 10,
        marginBottom: 30,
    },
    inputContainerStyle: {
        margin: 10,
        width: '90%',
    },
    inputStyle: {
        backgroundColor: Color.softlightGray,
    },
    inputTextStyle: {
        paddingHorizontal: 10,
        color: '#858585',
    },
    body: {
        width: '100%',
        backgroundColor: Color.softLightGray,
        borderRadius: 10,
        paddingLeft: '3%',
        paddingTop: '3%',
        paddingBottom: 20,
        fontFamily: Font.Medium,
        textAlignVertical: 'top',
        fontSize: screenHeight / 100 * 2.5,
        color: '#858585'
    },
    button: {
        width: '95%',
        height: 55,
        margin: 10,
        position: 'absolute',
        bottom: 0,
        backgroundColor: Color.lightGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    gifHolder2: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif2: {
        width: 60,
        height: 60,
    },
});

export default App;
