import ApiService from '@/services/api.js'
import { format } from 'date-fns'
import download from 'downloadjs'
import XLSX from 'xlsx'

export default {
  async FETCH_FILLED_CHECKLIST (state, { id }) {
    this.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      const response = await ApiService.get(`api/v1/response/${id}`)
      state.commit('SET_FILLED_LIST', response.data)
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error.response)
    }
  },
  async FETCH_FILLED_CHECKLISTS (state) {
    try {
      this.commit('SET_LOADING_STATUS', true)
      ApiService.setHeader()
      const response = (await Promise.all([
        ApiService.get('api/v1/responses/?page=1'),
        await new Promise(resolve => setTimeout(() => resolve(), 500))
      ]))[0]
      state.commit('SET_FILLED_LISTS', response.data.results)
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  },
  async CREATE_EXCEL (store, { excelData }) {
    try {
      this.commit('SET_LOADING_STATUS', true)
      ApiService.setHeader()
      const { data: responses } = await ApiService.get('api/v1/responses', '', {
        params: {
          from: excelData.date_from,
          to: excelData.date_to,
          lists: excelData.checklists
        }
      })

      const wb = XLSX.utils.book_new()
      const currentChecklist = this.state.checklists.lists.filter((item) => {
        return item.id === excelData.checklists
      })[0]
      const headers = {
        'Номер ответа': [],
        'Дата создания': [],
        'Почта': []
      }
      const rows = []
      for (const response of responses) {
        const { id, created, answers, user_text } = response
        let answersHeadersList = ['Номер ответа', 'Дата создания', 'Почта']

        headers['Номер ответа'].push(id)
        headers['Дата создания'].push(format(new Date(created), "yyyy-MM-dd'T'hh:mm:ss"))
        headers['Почта'].push(user_text)

        for (let { question_text, body } of answers) {
          answersHeadersList.push(question_text)

          Array.isArray(headers[question_text])
          ? headers[question_text].push(body)
          : headers[question_text] = [body]
        }

        for (let header of Object.keys(headers)) {
          if (!answersHeadersList.includes(header)) {
            Array.isArray(headers[header])
            ? headers[header].push('')
            : headers[header] = ['']
          }
        }
      }

      rows.unshift(Object.keys(headers))

      let foo = Object.values(headers)[0]

      for (let i = 0; i < foo.length; i++) {
        let item = []
        for (let header of Object.keys(headers)) {
          if (headers[header].length < foo.length) {
            let bar = foo.length - headers[header].length
            for (let j = 0; j < bar; j++) {
              headers[header].unshift('')
            }
          }
          headers[header][i] ? item.push(headers[header][i]) : item.push('')
        }
        rows.push(item)
      }

      const wsData = XLSX.utils.json_to_sheet(rows, { skipHeader: true })
      XLSX.utils.book_append_sheet(wb, wsData, `${currentChecklist.name}`)
      const str = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
      download(str, `${currentChecklist.name}.xlsx`, 'application/vnd.ms-excel')
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  },
  async FETCH_MAP (state) {
    this.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      const response = await ApiService.get('api/v1/maps')
      state.commit('SET_MAP', response["data"])
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error.response)
    }
  },
  async UPDATE_FILLED_CHECKLIST ({ commit, state }) {
    this.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      const { id, survey, answers } = state.filledList
      const response = await ApiService.put('api/v1/response', id, {
        survey,
        answers
      })
      // state.commit('SET_FILLED_LIST', response["data"])
      this.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      this.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  }
}
