import http from "../http-common"

class Settings {
    getNotification(username: string) {
        return http.get(`accounts/${username}/settings/notifications`)
    }
    toggleNotification(username: string) {
        return http.patch(`accounts/${username}/settings/notifications`)
    }
}

export default new Settings();