import http from "../http-common"

class ShoppingListItems {
    create(username: string, shoppingListID: number, data: any) {
        return http.post(`accounts/${username}/shopping-lists/${shoppingListID}/items`, data)
    }
    getAll(username: string, shoppingListID: number) {
        return http.get(`accounts/${username}/shopping-lists/${shoppingListID}/items`)
    }
    get(username: string, shoppingListID: number, itemID: number) {
        return http.get(`accounts/${username}/shopping-lists/${shoppingListID}/items/${itemID}`)
    }
    getCount(username: string) {
        return http.get(`accounts/${username}/shopping-lists/items/count`)
    }
    update(username: string, shoppingListID: number, itemID: number, data: any) {
        return http.put(`accounts/${username}/shopping-lists/${shoppingListID}/items/${itemID}`, data)
    }
    patchTitle(username: string, shoppingListID: number, itemID: number, title: string) {
        return http.patch(`accounts/${username}/shopping-lists/${shoppingListID}/items/${itemID}/title/${title}`)
    }
    decrementQuantity(username: string, shoppingListID: number, itemID: number) {
        return http.patch(`accounts/${username}/shopping-lists/${shoppingListID}/items/${itemID}/quantity/decrement`)
    }
    incrementQuantity(username: string, shoppingListID: number, itemID: number) {
        return http.patch(`accounts/${username}/shopping-lists/${shoppingListID}/items/${itemID}/quantity/increment`)
    }
    delete(username: string, shoppingListID: number, itemID: number) {
        return http.delete(`accounts/${username}/shopping-lists/${shoppingListID}/items/${itemID}`)
    }
}

export default new ShoppingListItems();