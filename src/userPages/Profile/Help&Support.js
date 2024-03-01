import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image,
    TextInput, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from './styles';
import {StorageStrings} from "../../constance/StorageStrings";
import {Color} from "../../constance/Colors";
import SearchBtn from "../../assets/Sample/search.png";
import DownArrow from '../../assets/Home/downArrow.png';
import {AccordionList} from 'accordion-collapse-react-native';
import {Font} from "../../constance/AppFonts";
import {encryption} from "../../component/Encryption/Encrypt&Decrypt";
import ActionButton from "../../component/Actions/ActionButton";


const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component {
    state = {
        showAlert: false,
        loading: false,
        searchKey: {
            value: '',
            valid: true
        },
        listModel: [
            {
                name: 'Data Protection & Confidentiality',
                description:'FitNexus does not provide your data to any 3rd party under the FitNexus Data protection policy. We may use your data to showcase relevant workout options, brands, accessories on the app.  '
            },
            {
                name: 'Purchases on FitNexus',
                description: 'Purchases on FitNexus are non-refundable. In the event of a cancellation of a session, you will be able to reschedule the missed lesson.'
            },
        ],
    };

    async componentWillMount() {
        this.setState({
            email: {
                value: encryption.decrypt(await AsyncStorage.getItem(StorageStrings.EMAIL)),
                valid: true
            },
        })
    }

    /**
     * state changer in text fields
     * @param name
     * @param length
     * @returns {Function}
     */
    onTextChange = (name, length) => val => {
        const item = this.state[name];
        item.value = val;
        item.valid = true;
        this.setState({
            [name]: item,
        });
    };

    /**
     * header title of colspan
     * @param item
     * @returns {*}
     */
    head(item) {
        return (
            <View style={styles.subContainer}>
                <Text style={styles.textStyle}>{item.name}</Text>
                <Image source={DownArrow} style={styles.image2}/>
            </View>
        );
    }

    /**
     * body container of colspan
     * @param item
     * @returns {*}
     */
    body(item){
        return(
            <View style={styles.colspanContainer}>
                <Text style={{fontSize:18,fontFamily:Font.Medium,color:Color.softDarkGray3,lineHeight:22}}>{item.description}</Text>
            </View>

        )
    }

    render() {
        return (
            <View style={{...styles.container, alignItems: 'flex-start',backgroundColor:Color.white}}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                    <Text style={styles.headlineTitle1}>Help & Support</Text>
                    {/* <Text style={{...styles.title, marginLeft: 20}}>Any questions?</Text>

                    <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <View style={styles.searchOuter}>
                            <TextInput
                                placeholder={'Search help'}
                                placeholderTextColor={Color.softlightGray}
                                style={styles.searchTitle}
                                onChangeText={this.onTextChange('searchKey')}
                                value={this.state.searchKey.value}
                                onSubmitEditing={() => {
                                    this.onButtonClick('search')
                                }}
                            />
                            <TouchableOpacity style={styles.searchIcon}>
                                <Image source={SearchBtn} style={{width: 20, height: 20}}/>
                            </TouchableOpacity>
                        </View>
                    </View> */}

                    <View style={{...styles.bodyContainer, alignItems: 'center',marginTop:'-10%'}}>
                        <View style={{alignItems: 'center', width: '100%', marginVertical: '8%'}}>
                            <Text style={{
                                ...styles.headlineTitle,
                                width: '100%',
                                marginTop: 5,
                                marginLeft: '10%'
                            }}>FAQ</Text>
                            <View style={{width: '100%', marginTop: '5%',marginVertical:'10%'}}>
                                <AccordionList
                                    list={this.state.listModel}
                                    header={this.head}
                                    body={(item)=>this.body(item)}
                                />
                            </View>


                        </View>

                    </View>
                </ScrollView>

            </View>
        )
    }
}

export default App;
