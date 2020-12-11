import axios from "axios";
import config from "./config/index"
import helpers from "./helpers"

function getToken() {
    if (helpers.getCookie("accessToken")) {
        return helpers.getCookie("accessToken")
    } else {
        return ""
    }
}
  
export default axios.create({
    baseURL: config.BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken(),
    },
});