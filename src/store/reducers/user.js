import * as actionTypes from "../actions/actionTypes";

const initialState = {
    activeRoute: '',
    notificationCount: 0,
    latitude: 0,
    longitude: 0,
    client: {},
    visible: true,
    init: true,
    status: false,
    userId: '',
    fetch: true,
    onlineFetch: true,
    offlineFetch: true,
    trainerFetch: true,
    review: false,
    change: false,
    modalVisible: false,
    payload: false,
    corporateState: false,
    corporateName: [],
    asGuestUser: false,
    subscriptionState: false,
    navigationParams: {},
    homeBack: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_ACTIVE_ROUTE:
            return {
                ...state,
                activeRoute: action.activeRoute
            };
        case actionTypes.CHANGE_NOTIFICATION_HOLDER:
            return {
                ...state,
                notificationCount: action.notificationCount
            };
        case actionTypes.CHANGE_LATITUDE:
            return {
                ...state,
                latitude: action.latitude
            };
        case actionTypes.CHANGE_LONGITUDE:
            return {
                ...state,
                longitude: action.longitude
            };
        case actionTypes.TWILLIO_CLIENT:
            return {
                ...state,
                client: action.client
            };
        case actionTypes.CHECK_ONLINE_CLASS_VISIBILITY:
            return {
                ...state,
                visible: action.visible
            };
        case actionTypes.SDK_INITIALIZE:
            return {
                ...state,
                init: action.init
            };
        case actionTypes.CHECK_ENROLL_STATUS:
            return {
                ...state,
                status: action.status
            };
        case actionTypes.CHANGE_ONESIGNAL_USERID:
            return {
                ...state,
                userId: action.userId
            };
        case actionTypes.FETCH_ENDPOINT:
            return {
                ...state,
                fetch: action.fetch
            };
        case actionTypes.FETCH_ONLINE_CLASSES:
            return {
                ...state,
                onlineFetch: action.onlineFetch
            };
        case actionTypes.FETCH_OFFLINE_CLASSES:
            return {
                ...state,
                offlineFetch: action.offlineFetch
            };
        case actionTypes.FETCH_TRAINER:
            return {
                ...state,
                trainerFetch: action.trainerFetch
            };
        case actionTypes.REVIEW_ITEM:
            return {
                ...state,
                review: action.review
            };
        case actionTypes.CHANGE_PLATFORM:
            return {
                ...state,
                change: action.change
            };
        case actionTypes.MODAL_VISIBILITY:
            return {
                ...state,
                modalVisible: action.modalVisible
            };
        case actionTypes.LOADING:
            return {
                ...state,
                payload: action.payload
            };
        case actionTypes.CHECK_CORPORATE_STATE:
            return {
                ...state,
                corporateState: action.corporateState
            }
        case actionTypes.SET_CORPORATE_NAME:
            return {
                ...state,
                corporateName: action.corporateName
            }
        case actionTypes.CHECK_GUEST_USER:
            return {
                ...state,
                asGuestUser: action.asGuestUser
            }
        case actionTypes.CHECK_SUBSCRIPTION_STATE:
            return {
                ...state,
                subscriptionState: action.subscriptionState
            }
        case actionTypes.GUEST_USER_NAVIGATION_PARAMS:
            return {
                ...state,
                navigationParams: action.navigationParams
            }
        case actionTypes.HOME_BACK_BUTTON:
            return {
                ...state,
                homeBack: action.homeBack
            }
        default:
            return state
    }
};

export default reducer;
