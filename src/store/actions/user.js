import * as actionTypes from '../actions/actionTypes';

export const updateActiveRoute=(activeRoute)=>{
    return{
        type:actionTypes.UPDATE_ACTIVE_ROUTE,
        activeRoute:activeRoute
    };
};

export const changeNotificationHolder=(notificationCount)=>{
    return{
        type:actionTypes.CHANGE_NOTIFICATION_HOLDER,
        notificationCount:notificationCount
    }
};

export const changeLatitude=(latitude)=>{
    return{
        type:actionTypes.CHANGE_LATITUDE,
        latitude:latitude
    }
};

export const changeLongitude=(longitude)=>{
    return{
        type:actionTypes.CHANGE_LONGITUDE,
        longitude:longitude
    }
}

export const getTwillioClient = (client)=>{
    return{
        type:actionTypes.TWILLIO_CLIENT,
        client:client
    }
};

export const checkOnlineClassVisibility=(visible)=>{
    return{
        type:actionTypes.CHECK_ONLINE_CLASS_VISIBILITY,
        visible:visible
    }
};

export const sdkInitialized=(init)=>{
    return{
        type:actionTypes.SDK_INITIALIZE,
        init:init
    }
};

export const checkEnrollState=(status)=>{
    return{
        type:actionTypes.CHECK_ENROLL_STATUS,
        status:status
    }
};

export const changeOneSignalUserId=(userId)=>{
    return{
        type:actionTypes.CHANGE_ONESIGNAL_USERID,
        userId:userId
    }
};

export const fetchEndpoint=(fetch)=>{
    return{
        type:actionTypes.FETCH_ENDPOINT,
        fetch:fetch
    }
};

export const fetchOnlineClasses=(onlineFetch)=>{
    return{
        type:actionTypes.FETCH_ONLINE_CLASSES,
        onlineFetch:onlineFetch
    }
};

export const fetchOfflineClasses=(offlineFetch)=>{
    return{
        type:actionTypes.FETCH_OFFLINE_CLASSES,
        offlineFetch:offlineFetch
    }
};

export const fetchTrainer=(trainerFetch)=>{
    return{
        type:actionTypes.FETCH_TRAINER,
        trainerFetch:trainerFetch
    }
};

export const reviewItem=(review)=>{
    return{
        type:actionTypes.REVIEW_ITEM,
        review:review
    }
};

export const changePlatform=(change)=>{
    return{
        type:actionTypes.CHANGE_PLATFORM,
        change:change
    }
};

export const modalVisibility=(modalVisible)=>{
    return{
        type:actionTypes.MODAL_VISIBILITY,
        modalVisible:modalVisible
    }
};

export const setLoading = (payload)=>{
    return{
        type:actionTypes.LOADING,
        payload:payload
    }
};

export const checkCorporateState = (corporateState)=>{
    return{
        type:actionTypes.CHECK_CORPORATE_STATE,
        corporateState:corporateState
    }
};

export const setCorporateName = (corporateName)=>{
    return{
        type:actionTypes.SET_CORPORATE_NAME,
        corporateName:corporateName
    }
};

export const checkGuestUser = (asGuestUser)=>{
    return{
        type:actionTypes.CHECK_GUEST_USER,
        asGuestUser:asGuestUser
    }
};

export const checkSubscriptionState=(subscriptionState)=>{
    return{
        type:actionTypes.CHECK_SUBSCRIPTION_STATE,
        subscriptionState:subscriptionState
    }
};

export const getGuestNavigationParams=(navigationParams)=>{
    return{
        type:actionTypes.GUEST_USER_NAVIGATION_PARAMS,
        navigationParams:navigationParams
    }
}

export const checkHomeBack=(homeBack)=>{
    return{
        type:actionTypes.HOME_BACK_BUTTON,
        homeBack:homeBack
    }
}



