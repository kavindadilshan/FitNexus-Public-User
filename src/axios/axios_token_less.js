import axios from 'axios';
import * as axiosPublic from './server_url';

const instance=axios.create({
    baseURL:axiosPublic.PUBLIC_URL
});
instance.defaults.headers.post['Content-Type']='application/json';

export default instance;
