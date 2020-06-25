import ApiService from '@/services/api.js'
import { format } from 'date-fns'
import download from 'downloadjs'
import XLSX from 'xlsx'

export default {
  async FETCH_FILLED_CHECKLIST ({ commit }, { id }) {
    ApiService.setHeader()
    try {
      const { data } = (await Promise.all([
        ApiService.get('api/v1/response', id),
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
          }
        }
      }

      const response = Object.assign({}, data, { answers: Object.keys(answers).map(id => answers[id]) })

      commit('SET_FILLED_LIST', response)
    } catch (error) {
      console.log(error)
    }
  },
  async FETCH_FILLED_CHECKLISTS (state) {
    try {
      this.commit('SET_LOADING_STATUS', true)
      ApiService.setHeader()
      const response = (
        await Promise.all([
          ApiService.get('api/v1/responses'),
          await new Promise(resolve => setTimeout(() => resolve(), 500))
        ])
      )[0]
      state.commit('SET_FILLED_LISTS', response.data)
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  },
  async CREATE_EXCEL (context, { excelData }) {
    try {
      console.log(context, excelData)
      this.commit('SET_LOADING_STATUS', true)
      ApiService.setHeader()
      const { data: responses } = await ApiService.get('api/v1/responses', '', {
        params: {
          from: excelData.date_from || '',
          to: excelData.date_to || '',
          lists: excelData.checklists
        }
      })

      const wb = XLSX.utils.book_new()
      const currentChecklist = this.state.checklists.lists.filter(item => item.id === excelData.checklists)[0]
      const sortedResponses = {
        Ссылка: [],
        'Номер ответа': [],
        'Дата создания': [],
        Почта: []
      }

      for (const response of responses) {
        const { id, created, answers, user_text: userText } = response
        for (const { question } of answers) {
          const key = `${question.text}`
          sortedResponses[key] = []
        }
        sortedResponses['Ссылка'].push(XLSX.utils.decode_col(`http://checklist.landfinance.ru/response/${id}`)d)
        sortedResponses['Номер ответа'].push(XLSX.utils.decode_col(id))
        sortedResponses['Дата создания'].push(XLSX.utils.decode_col(format(new Date(created), "yyyy-MM-dd'T'hh:mm:ss")))
        sortedResponses['Почта'].push(XLSX.utils.decode_col(userText))
      }

      for (let index = 0; index < responses.length; index++) {
        const { answers } = responses[index]
        const answersHeadersList = ['Ссылка', 'Номер ответа', 'Дата создания', 'Почта']

        for (const header of Object.keys(sortedResponses)) {
          const test = answers.reduce(function (acc, answer) {
            acc[answer.question.text] = answer.body
            return acc
          }, {})
          if (!(answersHeadersList.includes(header))) {
            sortedResponses[header][index] = XLSX.utils.decode_col(test[header])
          }
        }
      }

      const rows = []
      const sortedResponsesValues = Object.values(sortedResponses)[0]

      for (let i = 0; i < sortedResponsesValues.length; i++) {
        const row = []
        for (const header of Object.keys(sortedResponses)) {
          row.push(sortedResponses[header][i])
        }
        rows.push(row)
      }

      const wsData = XLSX.utils.json_to_sheet([Object.keys(sortedResponses), ...rows], { skipHeader: true })
      XLSX.utils.book_append_sheet(wb, wsData, `${currentChecklist.name}`)
      const str = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
      download(str, `${currentChecklist.name}.xlsx`, 'application/vnd.ms-excel')
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  },
  async FETCH_MAP ({ commit }) {
    this.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      const { data } = await ApiService.get('api/v1/maps')
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
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  },
  async UPDATE_FILLED_CHECKLIST ({ dispatch, state }) {
    this.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      const { id, survey, answers, photo } = state.filledList
      await ApiService.put('api/v1/response', id, {
        survey,
        answers,
        photo
      })
      dispatch('FETCH_FILLED_CHECKLIST', { id })
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  },
  async DELETE_FILLED_CHECKLIST ({ dispatch }, { responseId }) {
    this.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      await ApiService.delete('api/v1/response', responseId)
      await dispatch('FETCH_FILLED_CHECKLISTS')
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  }
}
