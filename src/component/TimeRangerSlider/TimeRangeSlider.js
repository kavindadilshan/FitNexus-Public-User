import RangeSlider from "rn-range-slider";
import {Color} from "../../constance/Colors";
import {Dimensions, Text, View} from "react-native";
import {styles} from "../../userPages/Home/Classes/ClassesDetails/styles";
import Moment from "moment";
import React from "react";

const screenWidth = Math.round(Dimensions.get('window').width);

const TimeRangeSlider=(props)=>{
    return(
        <>
            <RangeSlider
                valueType="time"
                ref={component => this._slider = component}
                gravity={'bottom'}
                labelStyle={'none'}
                style={{width: screenWidth * 90 / 100, height: 50}}
                min={props.min}
                max={props.max}
                selectionColor={Color.lightGreen}
                blankColor="#DCDCDC"
                step={3600000}
                textFormat="HH:mm"
                onTouchStart={props.onTouchStart}
                onTouchEnd={props.onTouchEnd}
                onValueChanged={props.onValueChanged}
                lineWidth={5}
                labelTextColor={Color.red}
                thumbColor={Color.white}
                labelBackgroundColor={Color.white}
                labelBorderColor={Color.black}
                thumbBorderWidth={1}
                initialLowValue={props.rangeLow}
                initialHighValue={props.rangeHigh}
            />
            <Text
                style={styles.timeMarker}>{Moment(props.rangeLow, 'hh:mm').format('LT')}</Text>
            <Text style={{
                ...styles.timeMarker,
                right: 0
            }}>{Moment(props.rangeHigh, 'hh:mm').format('LT')}</Text>
        </>
    )
}

export default TimeRangeSlider;
