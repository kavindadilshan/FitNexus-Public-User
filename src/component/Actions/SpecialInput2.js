import React from 'react';
import {View, Text, TextInput,StyleSheet} from 'react-native';
import {Color} from '../../constance/Colors';
import {Input} from 'react-native-elements';
import {Font} from "../../constance/AppFonts";

class App extends React.Component{
    render(){
        return(
            <View style={this.props.errorMessage===null?styles.picker:{...styles.picker, borderColor: 'red',borderWidth:1}}>
                <Input
                    ref={this.props.refer}
                    containerStyle={styles.inputContainerStyle}
                    inputContainerStyle={styles.inputStyle}
                    inputStyle={styles.inputTextStyle}
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

const styles= StyleSheet.create({
    picker: {
        width: '85%',
        backgroundColor:Color.inputBackground,
        justifyContent:'center',
        alignItems:'center'
    },
    inputContainerStyle: {
        width: '100%',
    },
    inputStyle: {
        borderColor: Color.inputBorderColor,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
    },
    inputTextStyle: {
        fontSize: 16,
        height: 40,
        color:Color.black,
        fontFamily: Font.Medium,
    },
    input:{
        marginLeft:10,
        fontSize:16,
        // fontFamily:'Gilory-Medium'
    }

})

export default App;
