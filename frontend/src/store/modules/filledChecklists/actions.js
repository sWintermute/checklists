import ApiService from '@/services/api.js'
import download from 'downloadjs'
import router from '@/router'
import Vue from 'vue'

export default {
  resetFilledChecklistsState ({ commit }) {
    commit('resetState')
  },
  async FETCH_FILLED_CHECKLIST ({ commit }, { id }) {
    try {
      ApiService.setHeader()
      const data = (await Promise.all([
        await ApiService.get('api/v1/response', id),
        new Promise(resolve => setTimeout(() => resolve(), 500))
      ]))[0]
      await this.dispatch('checklists/FETCH_CHECKLIST', data.survey)
      const { questions } = this.getters['checklists/currentList']
      const answers = {}

      for (const { question } of questions) {
        if (question.type !== 'select-image') {
          const answer = data.answers.find(answer => question.id === answer.question.id)
          if (answer) {
            answers[question.id] = {
              body: answer.body,
              question
            }
          } else {
            answers[question.id] = {
              body: '',
              question
            }
          }
        }
      }
      const response = Object.assign({}, data, { answers: Object.keys(answers).map(id => answers[id]) })
      commit('SET_FILLED_LIST', response)
    } catch (error) {
      console.log(error)
    }
  },
  async FETCH_FILLED_CHECKLISTS ({ commit, dispatch }, { pagination, currentUserPage }) {
    try {
      if (!currentUserPage) router.replace('/responses?page=1')
      dispatch('resetFilledChecklistsState')
      ApiService.setHeader()
      const data = (await Promise.all([
        await Vue.axios.get(`api/v1/responses/?page=${pagination.page || 1}`),
        await this.dispatch('checklists/FETCH_CHECKLISTS'),
        await new Promise(resolve => setTimeout(() => resolve(), 500))
      ]))[0]
      router.replace(`/responses?page=${pagination.page}`)
      commit('SET_FILLED_LISTS', data)
    } catch (error) {
      console.log(error)
    }
  },
  async CREATE_EXCEL (context, { excelData }) {
    try {
      ApiService.setHeader()
      const data = await ApiService.get('api/v1/excel', '', {
        params: {
          from: excelData.date_from || '',
          to: excelData.date_to || ''
        },
        responseType: 'blob'
      })
      download(data, `${excelData.date_from}-${excelData.date_to}.xlsx`)
    } catch (error) {
      console.log(error)
    }
  },
  async FETCH_MAP ({ commit }) {
    ApiService.setHeader()
    try {
      const data = await ApiService.get('api/v1/maps')
      const handler = {
        get: function (target, name) {
          return target.hasOwnProperty(name) ? target[name] : []
        }
      }
      const proxyPoints = new Proxy({}, handler)
      for (const point of data) {
        const key = `${point.lat}-${point.lon}`
        proxyPoints[key] = proxyPoints[key].concat(point)
      }
      const points = Object.assign({}, proxyPoints)
      const mappedPoints = Object.keys(points).map(i => {
        const [lat, lon] = i.split('-')
        return { lat, lon, points: points[i] }
      })
      commit('SET_MAP', mappedPoints)
    } catch (error) {
      console.log(error)
    }
  },
  async UPDATE_FILLED_CHECKLIST ({ dispatch, state }) {
    ApiService.setHeader()
    try {
      const { id, survey, answers, photo } = state.filledList
      await ApiService.put('api/v1/response', id, {
        survey,
        answers,
        photo
      })
      dispatch('FETCH_FILLED_CHECKLIST', { id })
    } catch (error) {
      console.log(error)
    }
  },
  async DELETE_FILLED_CHECKLIST ({ dispatch }, { responseId }) {
    ApiService.setHeader()
    try {
      await ApiService.delete('api/v1/response', responseId)
      await dispatch('FETCH_FILLED_CHECKLISTS')
    } catch (error) {
      console.log(error)
    }
  }
}
