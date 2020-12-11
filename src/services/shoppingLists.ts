import http from "../http-common"

class ShoppingLists {
    share(username: string, shoppingListID: number) {
        return http.post(`accounts/${username}/shopping-lists/${shoppingListID}/share/${username}`)
    }
    removeShare(username: string, shoppingListID: number) {
        return http.delete(`accounts/${username}/shopping-lists/${shoppingListID}/share/${username}`)
    }
    getOwner(username: string, shoppingListID: number, owner: string) {
        return http.get(`accounts/${username}/shopping-lists/${shoppingListID}/owner/${owner}`)
    }
    create(username: string, data: any) {
        return http.post(`accounts/${username}/shopping-lists`, data)
    }
    getAll(username: string) {
        return http.get(`accounts/${username}/shopping-lists`)
    }
    getCount(username: string) {
        return http.get(`accounts/${username}/shopping-lists/count`)
    }
    patchTitle(username: string, shoppingListID: number, title: string) {
        return http.patch(`accounts/${username}/shopping-lists/${shoppingListID}/title/${title}`)
    }
    delete(username: string, shoppingListID: number) {
        return http.delete(`accounts/${username}/shopping-lists/${shoppingListID}`)
    }
}

export default new ShoppingLists();