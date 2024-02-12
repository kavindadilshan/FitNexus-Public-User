import Toast from 'react-native-simple-toast';

export class AppToast {
    static networkErrorToast(){
        Toast.show('Something went wrong. Please check your connection')
    }
    static serverErrorToast(){
        Toast.show('Server failure. Please try again in a while')
    }
    static userNotFoundToast(){
        Toast.show('User not found.Please SignUp First!')
    }
    static loginCancelToast(){
        Toast.show("Login cancelled");
    }
    static loginFailedToast(){
        Toast.show("Login failed");
    }
    static alreadyAccountToast(){
        Toast.show('You have already account')
    }
    static mobileNumberAlreadyToast(){
        Toast.show('Mobile number already exists')
    }
    static otpRerequestToast(){
        Toast.show('Please wait 30 seconds from the last OTP')
    }
    static userNotFoundToast2(){
        Toast.show('User not found')
    }
    static copyMsgToast(){
        Toast.show('Copied to Clipboard!')
    }
    static errorToast(msg){
        Toast.show(msg)
    }
    static successToast(msg){
        Toast.show(msg)
    }
}
