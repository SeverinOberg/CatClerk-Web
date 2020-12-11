import http from "../http-common"

class StorageItems {
    create(username: string, storageID: number, data: any) {
        return http.post(`accounts/${username}/storages/${storageID}/items`, data)
    }
    getAll(username: string, storageID: number) {
        return http.get(`accounts/${username}/storages/${storageID}/items`)
    }
    get(username: string, storageID: number, itemID: number) {
        return http.get(`accounts/${username}/storages/${storageID}/items/${itemID}`)
    }
    getCount(username: string) {
        return http.get(`accounts/${username}/storages/items/count`)
    }
    update(username: string, storageID: number, itemID: number, data: any) {
        return http.put(`accounts/${username}/storages/${storageID}/items/${itemID}`, data)
    }
    decrementQuantity(username: string, storageID: number, itemID: number) {
        return http.patch(`accounts/${username}/storages/${storageID}/items/${itemID}/quantity/decrement`)
    }
    incrementQuantity(username: string, storageID: number, itemID: number) {
        return http.patch(`accounts/${username}/storages/${storageID}/items/${itemID}/quantity/increment`)
    }
    delete(username: string, storageID: number, itemID: number) {
        return http.delete(`accounts/${username}/storages/${storageID}/items/${itemID}`)
    }
}

export default new StorageItems();