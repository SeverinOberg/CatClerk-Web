import axios from 'axios'
import { createStore } from 'vuex'

export const store = createStore({
    state: { 
        count: 0,
        posts: [],
    },
    getters: {
        Hello() {
            console.log("getters hello")
        }
    },
    mutations: {
        increment(state: any) {
            state.count++
        },
        SET_POSTS(state: {posts: []}, posts: []) {
            state.posts = posts;
        }
    },
    actions: {
      getPosts({commit}) {
          axios.get('https://jsonplaceholder.typicode.com/posts')
          .then(r => {
              commit('SET_POSTS', r.data)
          })
      } 
    }
  });