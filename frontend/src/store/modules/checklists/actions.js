import Vue from 'vue'
import router from '@/router'
import ApiService from '@/services/api.js'

export default {
  resetChecklistsState ({ commit }) {
    commit('resetState')
  },
  async SEND_CHECKLIST ({ commit, state, getters }, { fileList: photo }) {
    try {
      const currentList = getters.currentList
      const list = {
        survey: currentList.id,
        answers: currentList.questions,
        photo
      }
      ApiService.setHeader()
      await ApiService.post('/api/v1/response', list)
      router.push('/')
      Vue.$toast.open({
        message: 'Чеклист успешно создан!',
        type: 'success'
      })
    } catch (error) {
      Vue.$toast.open({
        message: [
          'Невозможно создать чеклист'
        ].join('.'),
        type: 'error'
      })
      console.log(error.response)
      router.push('/')
    }
  },
  async FETCH_CHECKLIST ({ commit }, listId) {
    try {
      ApiService.setHeader()
      const list = await ApiService.get('api/v1/lists', listId)
      list.questions = list.questions
        .sort((question, prevQuestion) => {
          if (question.order < prevQuestion.order) return -1
        })
        .map(question => {
          if (question.type === 'select-image') return { question, body: [] }
          return { question, body: '' }
        })
      commit('SET_LIST', list)
    } catch (error) {
      console.log(error.response)
    }
  },
  async FETCH_CHECKLISTS ({ commit, state }) {
    // { pagination, currentUserPage }
    try {
      // this.dispatch('checklists/resetChecklistsState')
      ApiService.setHeader()
      const data = await ApiService.get('api/v1/lists')
      commit('SET_LISTS', data)
      // const response = await Vue.axios.get(`api/v1/lists/?page=${pagination.page || 1}`)
      // if (!currentUserPage) router.replace('/?page=1')
    } catch (error) {
      console.log(error)
    }
  },
  async CHECKLIST_AUTOCOMPLETE_FIELD ({ commit }, { search }) {
    try {
      ApiService.setHeader(process.env.VUE_APP_DADATA_KEY)
      const response = await ApiService.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
        count: 5,
        query: 'Кемеровская область - Кузбасс,' + search,
        locations_boost: [
          { kladr_id: '4200001200000' }
        ]
      })
      commit('SET_ENTRIES', [search, ...response.suggestions])
    } catch (error) {
      console.log(error)
    }
  }
}
