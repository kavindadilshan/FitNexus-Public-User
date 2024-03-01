export const textFieldValidator = (value,length)=>{
    if (value.trim()===''){
        return false;
    }else return value.length >= length
};

export const genderValidator=(value)=>{
    return value !== 'Gender';
};

export const numberValidation =(value)=>{
    return typeof value === 'number';
};

export const imageValidator=(value)=>{
    return value !== 'https://cdn1.iconfinder.com/data/icons/image-manipulations/100/13-512.png';
};

export const specialPwValidator=(value)=>{
    const regex = /^(?!.* )(?=.*([A-Z])+)(?=.*[!@#$&*]+)(?=.*[0-9]+)(?=.*[a-z]+).{8,100}$/;
    return value.match(regex)
}

export const emailValidator = (value) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return value.match(emailRegex)
};
export const nicValidator = (value) => {
    const emailRegex = /^([0-9]{9}[V|v]|[0-9]{12})$/;
    return value.match(emailRegex)
};
export const mobileNumberValidator = (value) => {
    const mobileRegex = /^(9477)[0-9]{7}$|^(9476)[0-9]{7}$|^(9475)[0-9]{7}$|^(9471)[0-9]{7}$|^(9472)[0-9]{7}$|^(9470)[0-9]{7}$|^(9478)[0-9]{7}$|^(9474)[0-9]{7}$/;
    return value.match(mobileRegex)
};
export const contactNumberValidator = (value) => {
    const mobileRegex = /^(77)[0-9]{7}$|^(76)[0-9]{7}$|^(75)[0-9]{7}$|^(71)[0-9]{7}$|^(72)[0-9]{7}$|^(70)[0-9]{7}$|^(78)[0-9]{7}$/;
    return value.match(mobileRegex)
};
export const birthdayValidator = (value) => {
    const mobileRegex = /^(0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](19|20)\\d\\d$/;
    return value.match(mobileRegex)
};
export const YoutubeVideoIdValidator =(value)=>{
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = value.match(regExp);
    return ((match && match[7].length === 11) ? match[7] : false);
}
