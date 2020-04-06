import ApiService from '@/services/api.js'
import types from '@/store/types'
import { format } from 'date-fns'
import download from 'downloadjs'
import XLSX from 'xlsx'

export default {
  async [types.FETCH_FILLED_CHECKLIST](state, { id }) {
    state.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      const response = await ApiService.get(`api/v1/response/${id}`)
      state.commit('SET_FILLED_LIST', response["data"])
      state.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      state.commit('SET_LOADING_STATUS', false)
      console.log(error.response)
    }
  },
  async [types.FETCH_FILLED_CHECKLISTS](state) {
    try {
      state.commit('SET_LOADING_STATUS', true)
      ApiService.setHeader()
      const response = (await Promise.all([
        ApiService.get('api/v1/responses'),
        await new Promise(resolve => setTimeout(() => resolve(), 500))
      ]))[0]
      state.commit('SET_FILLED_LISTS', response["data"])
      state.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      state.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  },
  async [types.CREATE_EXCEL](store, { excelData }) {
    try {
      store.commit('SET_LOADING_STATUS', true)
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
      XLSX.utils.book_append_sheet(wb, wsData, 'test')
      const str = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
      download(str, `${currentChecklist.name}.xlsx`, 'application/vnd.ms-excel')
      store.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      store.commit('SET_LOADING_STATUS', false)
      console.log(error)
    }
  },
  async [types.FETCH_MAP](state) {
    state.commit('SET_LOADING_STATUS', true)
    ApiService.setHeader()
    try {
      const response = await ApiService.get('api/v1/responses')
      state.commit('SET_FILLED_LISTS', response["data"])
      this.state.filledChecklists.filledLists.reduce(async (acc, currentValue, index, array) => {
        // Получение заполненных чеклистов по id чеклиста
        const foo = await ApiService.get(`api/v1/response/${currentValue.id}`)
        // Получение обьекта с адресом из answer заполненного чеклиста
        const bar = await foo["data"].answers.filter(item => item.question === 65)[0]
        let lat, lon
        if (bar) {
          // Подстановка токена для dadata
          ApiService.setHeader(process.env.VUE_APP_DADATA_KEY)
          // Запрос на получение lat && lon от dadata
          try {
            const address = await ApiService.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
              count: 1,
              query: "Кемеровская область - Кузбасс," + bar["body"],
              locations_boost: [{ kladr_id: "4200001200000" }]
            })

            lat = address["data"]["suggestions"][0]["data"]["geo_lat"]
            lon = address["data"]["suggestions"][0]["data"]["geo_lon"]

            state.commit('SET_ADDRESS', [lat, lon])
          } catch { }
          return this.state.filledChecklists.address
        }
      }, [])
      state.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      state.commit('SET_LOADING_STATUS', false)
      console.log(error.response)
    }
  },
  async [types.CREATE_FILLED_CHECKLISTS]({ commit }) { }
}
