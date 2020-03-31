export default $axios => resource => ({
  getAll () {
    return $axios.get(resource)
  },
  get (id) {
    return $axios.get(`${resource}/${id}`)
  },
  create (data) {
    return $axios.post(resource, data)
  },
  update (id, data) {
    return $axios.put(`${resource}/${id}`, data)
  },
  delete (id) {
    return $axios.delete(`${resource}/${id}`)
  }
})
