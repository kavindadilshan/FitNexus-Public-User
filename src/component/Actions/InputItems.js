import React from 'react';
import {View, Text, TextInput, StyleSheet, Dimensions} from 'react-native';
import {Color} from '../../constance/Colors';
import {Input} from 'react-native-elements';
import {Font} from "../../constance/AppFonts";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component{
    render(){
        return(
          <>
              <View style={this.props.errorMessage===null?styles.picker:{...styles.picker, borderColor: 'red',}}>
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
                    onTouchStart={this.props.onKeyPress}
                    secureTextEntry={this.props.secureTextEntry}
                    editable={this.props.editable}
                    style={styles.input}
                  />
              </View>
              {
                  this.props.errorMessage
                    ? <View style={{
                        textAlign: 'left',
                        width: '95%',
                        marginTop: 5
                    }}>
                        <Text style={{
                            fontSize: 12,
                            marginLeft: 16,
                            color: 'red'
                        }}>{this.props.errorMessage}</Text>
                    </View>
                    : null
              }
          </>
        )
    }
}

const styles= StyleSheet.create({
    picker: {
        height: 55,
        width: '95%',
        backgroundColor: Color.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color.softlightGray,
        marginTop:'2%',
        justifyContent:'center'
    },
    inputContainerStyle: {
        width: '100%',
        justifyContent:'center',
    },
    inputStyle: {
        borderColor: Color.inputBorderColor,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
        // height: '100%'
        fontSize: 16,
        height: 40,
        color:Color.black,
        fontFamily: Font.Medium,
    },
    inputTextStyle: {
        color: Color.black,
        fontSize:16,
        fontFamily: Font.Medium,
    },
    input:{
        marginLeft:10,
    }

})

export default App;
