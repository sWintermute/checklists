import Vue from 'vue'
import router from '@/router'
import ApiService from '@/services/api.js'
import types from '@/store/types'

export default {
  async [types.SEND_CHECKLIST] ({ commit, state }, { fileList, userProfile, listId }) {
    try {
      commit('SET_LOADING_STATUS', true)
      state.list.id = parseInt(listId)
      state.list.created = new Date()
      state.list.updated = new Date()
      state.list.survey = parseInt(listId)
      state.list.user = userProfile.id
      state.list.photo = fileList
      state.list.answers = []
      if (state.autocomplete) {
        state.list.answers.push({ question: state.autocompleteId, body: state.autocomplete.value })
      }
      for (const [key, value] of Object.entries(state.answers)) {
        state.list.answers.push({ question: key, body: value })
      }
      ApiService.setHeader()
      const response = await ApiService.post('/api/v1/response', state.list)
      router.push('/')
      Vue.$toast.open({
        message: 'Чеклист успешно создан!',
        type: 'success'
      })
      commit('SET_LOADING_STATUS', false)
    } catch (error) {
      Vue.$toast.open({
        message: [
          'Невозможно создать чеклист',
          'Статус: ' + error.response.status].join('.'),
        type: 'error'
      })
      console.log(error.response)
      commit('SET_LOADING_STATUS', false)
      router.push('/')
    }
  },
  async [types.FETCH_CHECKLIST] ({ commit }, listId) {
    try {
      commit('SET_LOADING_STATUS', true)
      const response = await ApiService.get('api/v1/lists', listId)
      const list = response.data
      commit('SET_LIST', list)
      commit('SET_LOADING_STATUS', false)
    } catch (error) {
      console.log(error.response)
    }
  },
  async [types.FETCH_CHECKLISTS] ({ commit }) {
    try {
      commit('SET_LOADING_STATUS', true)
      const { lists } = await ApiService.get('api/v1/lists')
      commit('SET_LISTS', lists)
      commit('SET_LOADING_STATUS', false)
    } catch (error) {
      console.log(error.response)
    }
  },
  async [types.CHECKLIST_AUTOCOMPLETE_FIELD]({ commit }, { search,count}) {
    try {
      ApiService.setHeader("519fbd1afac8c2380f617046c95a6789a39fa021");
      const response = await ApiService.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
          count: count,
          query: search
      })
      commit('SET_ENTRIES', response.data.suggestions);
    } catch (error) {
      console.log(error.response);
    }
  }
}
