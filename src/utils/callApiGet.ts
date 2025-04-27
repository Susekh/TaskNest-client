import axios from "axios";

async function callApiGet(url : string) {
    const res = await axios.get(url, {
        withCredentials : true,
        headers : {'Content-Type' : 'application/json'},
    });
    return res.data;
}

export default callApiGet;