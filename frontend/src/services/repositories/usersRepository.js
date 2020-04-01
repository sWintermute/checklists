export default $axios => resource => ({
    // getAll () {
    //   return $axios.get(resource)
    // },
    get () {
      return $axios.get(`${resource}/users/me/`)
    },
    // create (data) {
    //   return $axios.post(resource, data)
    // },
    // update (id, data) {
    //   return $axios.put(`${resource}/${id}`, data)
    // },
    // delete (id) {
    //   return $axios.delete(`${resource}/${id}`)
    // }
    login (payload) {
        return $axios.post(`${resource}/auth/token/login`, payload)
    },
    logout () {
        return $axios.post(`${resource}/auth/token/logout`)
    }
  })
  