import {BackHandler} from "react-native";

export class HardwareBackAction {

    static setBackAction(action) {
        BackHandler.removeEventListener("hardwareBackPress");
        BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                action();
                return true;
            }
        );
    }

    static exitApp() {
        BackHandler.exitApp();
    }

}
