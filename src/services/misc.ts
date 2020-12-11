import http from "../http-common"

class Misc {
  getFoods(username: string) {
    return http.get(`accounts/${username}/foods`)
  }
}

export default new Misc();