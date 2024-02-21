import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    SafeAreaView, StatusBar
} from 'react-native';
import {Color} from "../../../../constance/Colors";
import axios from '../../../../axios/axios';
import {SubUrl} from "../../../../axios/server_url";
import {connect} from 'react-redux';
import {Font} from "../../../../constance/AppFonts";
import {AppToast} from "../../../../constance/AppToast";
import gif from "../../../../assets/Home/loading.gif";

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class App extends React.Component {
    state = {
        list: [],
        btnVisible: false,
        selectedList: [],
        applyBtnVisible: false,
        loading: false,
        category: '',
        redirectPage: ''
    };

    componentWillMount() {
        const {navigation} = this.props;
        const selectedList = navigation.getParam('selectedList');
        const category = navigation.getParam('category');
        const redirectPage = navigation.getParam('redirectPage')
        this.setState({
            selectedList: selectedList,
            category: category,
            redirectPage: redirectPage
        })

        this.getAllClassTypes(redirectPage);
    }

    /**
     * get All session api
     */
    getAllClassTypes = async (asGroupExplore) => {
        this.setState({loading: true})
        axios.get(SubUrl.get_all_class_types)
            .then(async response => {
                if (response.data.success) {
                    const data = response.data.body;
                    const list = this.state.list;
                    for (let i = asGroupExplore !== 'GroupClassExplore' ? 3 : 0; i < data.length; i++) {
                        list.push({
                            id: data[i].id,
                            name: data[i].typeName,
                            image: data[i].image,
                        })
                    }
                    this.setState({
                        list: list,
                        loading: false
                    })
                } else {
                    this.setState({loading: false})
                    AppToast.serverErrorToast();
                }
            })
            .catch(error => {
                this.setState({loading: false})
                AppToast.networkErrorToast();
            })
    };

    isItemSelected = (item) => {
        for (let i = 0; i < this.state.selectedList.length; i++) {
            if (item === this.state.selectedList[i]) {
                return i;
            }
        }
        return -1;

    }

    onButtonClick = (item) => {
        const selectedList = this.state.selectedList;
        const number = this.isItemSelected(item);
        if (number === -1) {
            selectedList.push(item);
        } else {
            selectedList.splice(number, 1);
        }

        this.setState({
            selectedList: selectedList
        });

        console.log(this.state.selectedList)
    };

    async onApplyClick() {
        const list = this.state.list;
        const selectedList = this.state.selectedList;
        for (let i = 0; i < list.length; i++) {
            if (list[i].visible === true) {
                selectedList.push(list[i].id)
            }
        }
        const {navigate} = this.props.navigation;
        navigate(this.state.redirectPage, {
            selectedList: this.state.selectedList
        });

    };

    render() {
        const list = this.state.list.map((item, i) => (
            <View style={styles.subContainer} key={i}>
                <TouchableOpacity style={this.isItemSelected(item.id) > -1 ? {
                    ...styles.itemContainer,
                    backgroundColor: Color.white,
                    borderColor: Color.themeColor
                } : styles.itemContainer} onPress={() => this.onButtonClick(item.id)}>
                    <Image source={{uri: item.image}} resizeMode={'center'} style={{width: '70%', height: '70%'}}/>
                </TouchableOpacity>
                <Text style={styles.textStyle}>{item.name}</Text>
            </View>
        ))
        return (
            !this.state.loading ? (
                <SafeAreaView style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                    <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}
                                contentContainerStyle={{paddingBottom: '15%'}}>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', width: '95%', flexWrap: 'wrap', alignItems: 'center'}}>
                                {list}
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onApplyClick()}>
                        <Text style={styles.buttonTitle}>Apply</Text>
                    </TouchableOpacity>


                </SafeAreaView>
            ) : (
                <View style={styles.gifHolder}>
                    <Image source={gif} style={styles.gif}/>
                </View>
            )

        )
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    subContainer: {
        width: screenWidth / 100 * 28,
        height: screenHeight / 100 * 22,
        alignItems: 'center',
        margin: 5,
        marginBottom: 10
    },
    itemContainer: {
        width: '100%',
        height: '75%',
        backgroundColor: '#F7F7F7',
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent'
    },
    textStyle: {
        fontSize: 15,
        lineHeight: 22,
        fontFamily: Font.SemiBold,
        color: '#A4A4A4',
        marginTop: 10
    },
    buttonContainer: {
        width: '100%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: Color.themeColor,
        height: 81.2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTitle: {
        color: Color.white,
        fontFamily: Font.Bold,
        fontSize: 18,
        lineHeight: 22
    },
    gifHolder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: 90,
        height: 90,
    },
});

const mapStateToProps = (state) => ({
    activeRoute: state.user.activeRoute,
});

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
