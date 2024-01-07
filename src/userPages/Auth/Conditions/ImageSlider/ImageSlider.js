import React, { Component } from 'react';
import {View, ScrollView, Text, StatusBar, SafeAreaView, AsyncStorage,TouchableOpacity,Image} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './SliderEntry.style';
import SliderEntry from './SliderEntry';
import styles, { colors } from './index.style';
import { ENTRIES1 } from './Entries';
import {Color} from "../../../../constance/Colors";
import Skip from '../../../../assets/Auth/skip.png';

const SLIDER_1_FIRST_ITEM = 0;

export default class example extends Component {

    state = {
        slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        list:ENTRIES1
    };

    renderItemWithParallax = ({item, index}, parallaxProps) =>{
        return (
            <SliderEntry
                data={item}
                even={(index + 1) % 2 === 0}
                parallax={true}
                parallaxProps={parallaxProps}
            />
        );
    };


    mainExample () {
        const { slider1ActiveSlide ,list} = this.state;

        return (
            <View style={styles.exampleContainer}>
                <Carousel
                    ref={c => this._slider1Ref = c}
                    data={this.state.list}
                    renderItem={this.renderItemWithParallax}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    hasParallaxImages={true}
                    firstItem={SLIDER_1_FIRST_ITEM}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.2}
                    inactiveSlideShift={20}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    loop={true}
                    loopClonesPerSide={2}
                    autoplay={false}
                    onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                    layout={'tinder'}
                    layoutCardOffset={`9`}
                />
                <Pagination
                    dotsLength={this.state.list.length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={Color.themeColor}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={Color.softPink}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={1}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                />

                <View>
                    <Text style={{...styles.sliderTitle,marginVertical:'5%'}}> {this.state.list[slider1ActiveSlide].title}</Text>

                    <Text style={styles.sliderTitle}>{this.state.list[slider1ActiveSlide].subtitle}</Text>

                    {slider1ActiveSlide!==3?(
                        <TouchableOpacity style={styles.skipBtn} onPress={() => this.props.onPress()}>
                            <Image source={Skip} style={{width:50,height:25}} resizeMode={'contain'}/>
                        </TouchableOpacity>
                    ):(
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity style={styles.btnSignUp} onPress={() =>this.props.onPress()}>
                                <Text style={styles.btnContent}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </View>

            </View>
        );
    }


    render () {
        const example1 = this.mainExample();

        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <ScrollView
                        style={styles.scrollview}
                        scrollEventThrottle={200}
                        directionalLockEnabled={true}
                    >
                        { example1 }
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
