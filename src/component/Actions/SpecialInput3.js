import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Color} from '../../constance/Colors';
import {Input} from 'react-native-elements';
import {Font} from "../../constance/AppFonts";

class App extends React.Component {
    render() {
        return (
            <View style={this.props.errorMessage === null ? styles.picker : {
                ...styles.picker,
                borderColor: 'red',
                borderWidth: 1,
                marginBottom:this.props.custom?0:'5%'
            }}>
                <Input
                    ref={this.props.refer}
                    containerStyle={styles.inputContainerStyle}
                    inputContainerStyle={styles.inputStyle}
                    inputStyle={!this.props.promo ? styles.inputTextStyle : styles.inputTextStyle2}
                    placeholder={this.props.placeholder}
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    placeholderTextColor="#c0c0c0"
                    autoCapitalize='none'
                    keyboardType={this.props.keyboardType}
                    returnKeyType={this.props.returnKeyType === undefined ? 'done' : this.props.returnKeyType}
                    onSubmitEditing={this.props.onSubmitEditing}
                    errorMessage={this.props.errorMessage}
                    onTouchStart={this.props.onKeyPress}
                    secureTextEntry={this.props.secureTextEntry}
                    editable={this.props.editable}
                    style={styles.input}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    picker: {
        height: 55,
        width: '95%',
        backgroundColor: Color.inputBackground,
        borderRadius: 10,
        marginVertical: '5%',
        justifyContent: 'center',
    },
    inputContainerStyle: {
        width: '100%',
    },
    inputStyle: {
        borderColor: Color.inputBorderColor,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
        height: '80%',
        marginTop: 5
    },
    inputTextStyle: {
        fontSize: 16,
        height: 40,
        color: Color.black,
        fontFamily: Font.Medium,
    },
    inputTextStyle2: {
        fontSize: 18,
        height: 40,
        color: Color.gray,
        fontFamily: Font.Bold,
        lineHeight: 20
    },
    input: {
        marginLeft: 10,
        fontSize: 16,
    }

})

export default App;
