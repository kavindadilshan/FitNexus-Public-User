import PayHere from "@payhere/payhere-mobilesdk-reactnative";
import {PayHereChargeAPI} from "../../constance/AppServerUrl";
import {encryption} from "../Encryption/Encrypt&Decrypt";
import AsyncStorage from "@react-native-community/async-storage";
import {StorageStrings} from "../../constance/StorageStrings";
import {PAYHERE_MERCHANT_ID, PAYHERE_SANDBOX_STATUS} from "../../constance/Const";


export const createPayHereObj = async (data, itemType, paymentType) => {
    const firstName = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.FIRST_NAME));
    const lastName = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.LAST_NAME));
    const email = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.EMAIL));
    const country = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.COUNTRY));
    const mobileNumber = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.MOBILE_NUMBER));

    return {
        "sandbox": PAYHERE_SANDBOX_STATUS,                // true if using Sandbox Merchant ID
        "merchant_id": PAYHERE_MERCHANT_ID,       // Replace your Merchant ID
        'preapprove': paymentType === "yes",
        "notify_url": data.notifyUrl,
        "order_id": data.orderId,
        "items": itemType,
        "currency": data.currency,
        "amount": data.amount,
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "phone": mobileNumber,
        "hash": data.hash,
        "address": "No.1, Galle Road",
        "city": "Colombo",
        "country": country,
        "custom_1": "mobile",
    };
}

export const payHerePaymentUtil = async (data, itemType) => {
    const firstName = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.FIRST_NAME));
    const lastName = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.LAST_NAME));
    const email = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.EMAIL));
    const country = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.COUNTRY));
    const mobileNumber = encryption.decrypt(await AsyncStorage.getItem(StorageStrings.MOBILE_NUMBER));

    const paymentObject = {
        "sandbox": PAYHERE_SANDBOX_STATUS,                 // true if using Sandbox Merchant ID
        "merchant_id": PAYHERE_MERCHANT_ID,       // Replace your Merchant ID
        "notify_url": data.notifyUrl,
        "order_id": data.orderId,
        "items": itemType,
        "currency": data.currency,
        "amount": data.amount,
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "phone": mobileNumber,
        "hash": data.hash,
        "address": "No.1, Galle Road",
        "city": "Colombo",
        "country": country,
    };
    let result;

    await PayHere.startPayment(
        paymentObject,
        async (paymentId) => {
            console.log("Payment Completed", paymentId);
            result = await {
                success: true,
                status: 1,
                message: "Payment Completed"
            };
        },
        async (errorData) => {
            console.log("PayHere Error", errorData);
            result = await {
                success: false,
                status: 0,
                message: "PayHere Error"
            };
        },
        async () => {
            console.log("Payment Dismissed");
            result = await {
                success: false,
                status: 0,
                message: "Payment Dismissed"
            };
        }
    );
    return result;
}

export const payBySavedPayHereCard = async (data, itemType) => {
    let result;
    const obj = {
        type: "PAYMENT",
        order_id: data.orderId,
        items: itemType,
        currency: data.currency,
        amount: data.amount,
        customer_token: data.customerToken,
        notify_url: data.notifyUrl
    }

    const options = {
        method: 'POST',
        url: PayHereChargeAPI,
        headers: {
            Accept: 'application/json',
            "Authorization": `Bearer ${data.accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    };

    await fetch(PayHereChargeAPI, options)
        .then(response => response.json())
        .then(async response => {

            if (response.data) {
                if (response.data.status_code === 2) {
                    result = await {
                        ...response.data,
                        success: true,
                        status: response.data.status_code,
                        message: response.msg
                    };
                } else {
                    result = await {
                        success: false,
                        status: response.data.status_code,
                        message: response.msg
                    };
                }
            } else {
                console.log('error', response)
                result = await {
                    success: false,
                    status: 0,
                    message: response.error
                };
            }

        })
        .catch(async err => {
            result = await {
                success: false,
                status: 0,
                message: "Something went wrong!"
            };
        });

    return result;
}

export default {payBySavedPayHereCard, payHerePaymentUtil, createPayHereObj}
