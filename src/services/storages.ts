import http from "../http-common"

class Storages {
    share(username: string, storageID: number) {
        return http.post(`accounts/${username}/storages/${storageID}/share/${username}`)
    }
    removeShare(username: string, storageID: number) {
        return http.delete(`accounts/${username}/storages/${storageID}/share/${username}`)
    }
    getOwner(username: string, storageID: number, owner: string) {
        return http.get(`accounts/${username}/storages/${storageID}/owner/${owner}`)
    }
    create(username: string, data: any) {
        return http.post(`accounts/${username}/storages`, data)
    }
    get(username: string) {
        return http.get(`accounts/${username}/storages`)
    }
    getCount(username: string) {
        return http.get(`accounts/${username}/storages/count`)
    }
    update(username: string, storageID: number, data: string) {
        return http.put(`accounts/${username}/storages/${storageID}`, data)
    }
    delete(username: string, storageID: number) {
        return http.delete(`accounts/${username}/storages/${storageID}`)
    }
}

export default new Storages();