import React, { Component } from 'react';
import {AsyncStorage, Image, TouchableOpacity,View,Text} from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './SliderEntry.style';
import {ENTRIES1} from './Entries';

export default class SliderEntry extends Component {
    state={
        title:'lkdmfklmlsdmlmlskmlmdslfmlm'
    }

    get image () {
        const { data: { illustration,title }, parallax, parallaxProps, even } = this.props;


        return (
            <ParallaxImage
                source={ illustration }
                containerStyle={styles.imageContainer}
                style={styles.imagess}
                parallaxFactor={0.35}
                showSpinner={true}
                spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
                {...parallaxProps}
            />

        );
    }


    render () {

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.slideInnerContainer}
            >
                { this.image }
            </TouchableOpacity>
        );
    }
}
