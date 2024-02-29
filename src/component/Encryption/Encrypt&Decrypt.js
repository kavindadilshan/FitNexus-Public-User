import CryptoJS from "crypto-js";

export class encryption {
    static encrypt(data) {
        return CryptoJS.AES.encrypt(data.toString(), 'pGW8a3fuv,_Mz[?287K#').toString()
    }

    static decrypt(data) {
        if (data !== null) {
            let bytes = CryptoJS.AES.decrypt(data, 'pGW8a3fuv,_Mz[?287K#');
            return bytes.toString(CryptoJS.enc.Utf8);
        } else {
            return null;
        }
    }

}
