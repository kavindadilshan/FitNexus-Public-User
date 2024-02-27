import React from 'react';
import {Linking, ScrollView, StatusBar, Text, View} from 'react-native';
import {styles} from './styles';
import {Color} from "../../constance/Colors";
import {Font} from "../../constance/AppFonts";

class App extends React.Component {
    state = {
        showAlert: false,
        loading: false,
        providers: [
            {name: 'Google Play Services'},
            {name: 'Firebase Analytics'},
            {name: 'Facebook'},
        ],
        reasons: [
            {name: 'To facilitate our Service;'},
            {name: 'To provide the Service on our behalf;'},
            {name: 'To perform Service-related services; or'},
            {name: 'To assist us in analyzing how our Service is used.'}
        ]

    };

    render() {
        const providers = this.state.providers.map((item, i) => (
            <View style={{flexDirection: 'row'}} key={i}>
                <Text style={styles.dotStyle}>●</Text>
                <Text style={styles.textPrivacy}>{item.name}</Text>
            </View>
        ));

        const reasons = this.state.reasons.map((item, i) => (
            <View style={{flexDirection: 'row'}} key={i}>
                <Text style={styles.dotStyle}>●</Text>
                <Text style={styles.textPrivacy}>{item.name}</Text>
            </View>
        ))

        return (
            <View style={{...styles.container, alignItems: 'flex-start', backgroundColor: Color.white}}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.white}/>
                <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                    <Text style={styles.headlineTitle1}>Privacy Policy</Text>

                    <View style={{...styles.bodyContainer, alignItems: 'center', marginTop: '-10%'}}>
                        <View style={{alignItems: 'center', width: '100%', marginVertical: '5%'}}>
                            <View style={{width: '93%'}}>
                                <Text style={styles.textPrivacy}>
                                    FitNexus (Pvt) Ltd built the FitNexus app as a Free app. This SERVICE is provided by
                                    FitNexus (Pvt) Ltd at no cost and is intended for use as is.{"\n\n"}
                                    This page is used to inform visitors regarding our policies with the collection,
                                    use, and disclosure of Personal Information if anyone decided to use our
                                    Service.{"\n\n"}
                                    The terms used in this Privacy Policy have the same meanings as in our Terms and
                                    Conditions, which is accessible at FitNexus unless otherwise defined in this Privacy
                                    Policy.
                                </Text>
                                <Text style={styles.textPrivacyTitle}>Information Collection and Use</Text>
                                <Text style={styles.textPrivacy}>
                                    For a better experience, while using our Service, we may require you to provide us
                                    with certain personally identifiable information, including but not limited to First
                                    name and last name, Email address, Phone number , Birthday , Gender , Country,
                                    Height, Weight. The information that we request will be retained by us and used as
                                    described in this privacy policy.{"\n\n"}
                                    The app does use third party services that may collect information used to identify
                                    you.{"\n\n"}
                                    Link to privacy policy of third party service providers used by the app
                                </Text>
                                {providers}
                                <Text style={styles.textPrivacyTitle}>Log Data</Text>
                                <Text style={styles.textPrivacy}>
                                    we want to inform you that whenever you use our Service, in a case of an error in
                                    the app we collect data and information (through third party products) on your phone
                                    called Log Data. This Log Data may include information such as your device Internet
                                    Protocol (“IP”) address, device name, operating system version, the configuration of
                                    the app when utilizing our Service, the time and date of your use of the Service,
                                    and other statistics.
                                </Text>
                                <Text style={styles.textPrivacyTitle}>Cookies</Text>
                                <Text style={styles.textPrivacy}>
                                    Cookies are files with a small amount of data that are commonly used as anonymous
                                    unique identifiers. These are sent to your browser from the websites that you visit
                                    and are stored on your device's internal memory.{"\n\n"}
                                    This Service does not use these “cookies” explicitly. However, the app may use third
                                    party code and libraries that use “cookies” to collect information and improve their
                                    services. You have the option to either accept or refuse these cookies and know when
                                    a cookie is being sent to your device. If you choose to refuse our cookies, you may
                                    not be able to use some portions of this Service.
                                </Text>
                                <Text style={styles.textPrivacyTitle}>Service Providers</Text>
                                <Text style={styles.textPrivacy}>we may employ third-party companies and individuals due
                                    to the following reasons:
                                </Text>
                                {reasons}
                                <Text style={styles.textPrivacy}>
                                    we want to inform users of this Service that these third parties have access to your
                                    Personal Information. The reason is to perform the tasks assigned to them on our
                                    behalf. However, they are obligated not to disclose or use the information for any
                                    other purpose.
                                </Text>
                                <Text style={styles.textPrivacyTitle}>Security</Text>
                                <Text style={styles.textPrivacy}>
                                    we value your trust in providing us your Personal Information, thus we are striving
                                    to use commercially acceptable means of protecting it. But remember that no method
                                    of transmission over the internet, or method of electronic storage is 100% secure
                                    and reliable, and we cannot guarantee its absolute security.
                                </Text>
                                <Text style={styles.textPrivacyTitle}>Links to Other Sites</Text>
                                <Text style={styles.textPrivacy}>
                                    This Service may contain links to other sites. If you click on a third-party link,
                                    you will be directed to that site. Note that these external sites are not operated
                                    by us. Therefore, we strongly advise you to review the Privacy Policy of these
                                    websites. we have no control over and assume no responsibility for the content,
                                    privacy policies, or practices of any third-party sites or services.
                                </Text>
                                <Text style={styles.textPrivacyTitle}>Children’s Privacy</Text>
                                <Text style={styles.textPrivacy}>
                                    These Services do not address anyone under the age of 13. we do not knowingly
                                    collect personally identifiable information from children under 13. In the case we
                                    discover that a child under 13 has provided us with personal information, we
                                    immediately delete this from our servers. If you are a parent or guardian and you
                                    are aware that your child has provided us with personal information, please contact
                                    us so that we will be able to do necessary actions.
                                </Text>
                                <Text style={styles.textPrivacyTitle}>Changes to This Privacy Policy</Text>
                                <Text style={styles.textPrivacy}>
                                    we may update our Privacy Policy from time to time. Thus, you are advised to review
                                    this page periodically for any changes. we will notify you of any changes by posting
                                    the new Privacy Policy on this page. These changes are effective immediately after
                                    they are posted on this page.
                                </Text>
                                <Text style={styles.textPrivacyTitle}>Contact Us</Text>
                                <Text style={styles.textPrivacy}>
                                    If you have any questions or suggestions about our Privacy Policy, do not hesitate
                                    to contact us.{"\n\n"}
                                    By email : {' '}
                                    <Text
                                        style={{
                                            ...styles.textPrivacy,
                                            color: Color.softDarkBlue,
                                            textDecorationLine: 'underline',
                                            fontFamily:Font.Bold
                                        }}
                                        onPress={() => Linking.openURL('mailto:info@fitnexus.com')}
                                    >
                                        info@fitnexus.com
                                    </Text>
                                </Text>

                            </View>


                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }
}

export default App;
