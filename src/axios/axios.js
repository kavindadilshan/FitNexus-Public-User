import axios from 'axios';
import axios2 from './axios_auth';
import * as axiosPublic from './server_url';
import {StorageStrings} from '../constance/StorageStrings';
import AsyncStorage from "@react-native-community/async-storage";
import {SubUrl} from './server_url';
import {AppToast} from "../constance/AppToast";

const instance = axios.create({
    baseURL: axiosPublic.PUBLIC_URL,
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem(StorageStrings.ACCESS_TOKEN);
        config.headers.Authorization = 'Bearer ' + token;
        return config;
    },
    error => Promise.reject(error),
);

instance.interceptors.request.use(
    async (config) => {
        const timeZone=new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
        config.headers.timeZone=timeZone;
        return config;
    },
    error => Promise.reject(error),
);

instance.interceptors.response.use(
    response => response,
    async (error) => {
        const status = error.response ? error.response.status : 0;
        if (status === 401) {
            const details = {
                'grant_type': 'refresh_token',
                'refresh_token': await AsyncStorage.getItem(StorageStrings.REFRESH_TOKEN),
                // 'access_token': await AsyncStorage.getItem(StorageStrings.ACCESS_TOKEN),
            };

            let formBody = [];
            for (const property in details) {
                const encodedKey = encodeURIComponent(property);
                const encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = formBody.join('&');

            axios2.post(SubUrl.auth, formBody)
                .then(async response => {
                    await AsyncStorage.setItem(StorageStrings.ACCESS_TOKEN, response.data.access_token);
                    await AsyncStorage.setItem(StorageStrings.REFRESH_TOKEN, response.data.refresh_token);
                })
                .catch(async error => {
                    AppToast.networkErrorToast();
                });
        }
    },
);
export default instance;
