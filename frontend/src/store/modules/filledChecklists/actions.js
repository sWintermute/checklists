import ApiService from "@/services/api.js";
import types from "@/store/types"

export default {
  async [types.FETCH_FILLED_CHECKLIST] (state, { id }) {
    state.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      const response = await ApiService.get(`api/v1/response/${id}`)
      state.commit('SET_FILLED_LIST', response["data"])
      state.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      console.log(error.response)
    }
  },
  async [types.FETCH_FILLED_CHECKLISTS] (state) {
    state.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      const response = await ApiService.get('api/v1/responses')
      state.commit('SET_FILLED_LISTS', response["data"])
      response["data"]
        .reduce((accumulator, currentValue, i, arr) => {
          this.FETCH_FILLED_CHECKLIST(currentValue.id)
          accumulator.push()
        }, [])
      state.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      console.log(error.response)
    }
  },
  async [types.CREATE_FILLED_CHECKLISTS] ({ commit }) {}
}
