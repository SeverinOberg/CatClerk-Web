import http from "../http-common"

class ShareRequests {
    create(username: string, data: any) {
        return http.post(`accounts/${username}/share_requests`, data)
    }
    get(username: string) {
        return http.get(`accounts/${username}/share_requests`)
    }
    delete(username: string, shareID: number) {
        return http.delete(`accounts/${username}/share_requests/${shareID}`)
    }
}

export default new ShareRequests();