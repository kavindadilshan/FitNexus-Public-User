import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";
import {Text, View} from "react-native";

const CustomPicker = (props) => {
  /*
    Item Pattern
    ============
    [
      {label: 'Item 1', value: 'item1'},
      {label: 'Item 2', value: 'item2'},
    ]
   */
  return (
    <>
      <DropDownPicker
        items={props.items}
        defaultValue={props.selectedValue ? props.selectedValue : null}
        style={{
          borderWidth: 1,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderColor: props.errorMessage ? 'red' : Color.softlightGray,
        }}
        dropDownMaxHeight={300}
        dropDownStyle={{
            // zIndex: 9999999,
        }}
        containerStyle={{
          height: 55,
          width: '95%',
          marginTop: '5%',
        }}
        labelStyle={{
          fontSize: 16,
          color: '#000',
          flex: 1,
          fontFamily: Font.Medium,
        }}
        placeholderStyle={{
          color: '#c0c0c0',
        }}
        placeholder={'Gender *'}
        onChangeItem={item => props.onChangeItem(item)}
        // max={10}
      />
      {
        props.errorMessage
          ? <View style={{alignItems:'flex-start',width:'100%', marginTop: 5}}>
            <Text style={{color:'red',marginLeft:25,fontSize:12}}>Please select the gender</Text>
          </View>
          : null
      }
    </>
  );

};

export default CustomPicker;
