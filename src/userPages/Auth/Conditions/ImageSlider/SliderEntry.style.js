import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './index.style';
import {Color} from "../../../../constance/Colors";

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = viewportWidth*0.75;
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        width: slideWidth,
        height: slideHeight,
        // marginHorizontal: -50,
        // paddingBottom: 18 ,// needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : 10, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius:10,
        elevation:10,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 5,
        shadowRadius: 10,
    },
    imageContainerEven: {
        backgroundColor: Color.white
    },
    imagess: {
        // maxWidth: slideWidth,
        resizeMode: 'contain'
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: Color.white
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
    },
    textContainerEven: {
        backgroundColor: Color.white
    },
    title: {
        color: Color.white,
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});
