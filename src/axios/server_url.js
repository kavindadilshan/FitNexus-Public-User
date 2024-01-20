import {ServerUrl} from "../constance/AppServerUrl";

export const PUBLIC_URL=ServerUrl.url;

export const SubUrl={
    auth: 'oauth/token',
    requestOtp:'/users/register/otp/request',
    verifyOtp:'/users/register/otp/verify',
    register_mobile_user:'/users/register/account',
    update_push_notification_token_of_user:'users/profile/notification/token/mobile',
    check_social_details:'users/register/social/check',
    register_social_account:'users/register/social/account',
};
