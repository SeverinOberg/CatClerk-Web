import http from "../http-common"

class Accounts {
    create(data: any) {
        return http.post(`sign-up`, data)
    }
    getEmail(username: string,) {
        return http.get(`accounts/${username}/email`)
    }
    updateEmail(username: string, newEmail: string) {
        return http.patch(`accounts/${username}/email/${newEmail}`)
    }
    updateUsername(username: string, newUsername: string) {
        return http.patch(`accounts/${username}/username/${newUsername}`)
    }
    updatePassword(username: string, payload: any) {
        return http.patch(`accounts/${username}/password`, payload)
    }
}

export default new Accounts();