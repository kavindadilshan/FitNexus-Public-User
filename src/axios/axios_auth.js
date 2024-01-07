import axios from 'axios';
import * as axiosPublic from './server_url';

const instance=axios.create({
    baseURL:axiosPublic.PUBLIC_URL
});

instance.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded';
instance.defaults.headers.post['Authorization']='Basic cHVibGljX3VzZXI6';

export default instance;
