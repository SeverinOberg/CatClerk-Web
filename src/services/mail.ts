import http from "../http-common"

class Mail {
    create(email: string) {
        return http.post(`forgotten-password/${email}`)
    }
}

export default new Mail();