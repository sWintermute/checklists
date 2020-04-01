export default $axios => resource => ({
  getAll () {
    return $axios.get(`${resource}/`)
  },
  get (id) {
    console.log({$axios})
    return $axios.get(`${id}`)
  },
  create (data) {
    return $axios.post(`${resource}/`, data)
  },
  update (id, data) {
    return $axios.put(`${resource}/${id}`, data)
  },
  delete (id) {
    return $axios.delete(`${resource}/${id}`)
  }
})
