import ApiService from '@/services/api.js'
import types from '@/store/types'

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
      const qweqwe = []
      this.state.filledChecklists.filledLists
        .reduce(async (acc, currentValue, index, array) => {
          // Получение заполненных чеклистов по id чеклиста
          const foo = await ApiService.get(`api/v1/response/${currentValue.id}`)
          // Получение обьекта с адресом из answer заполненного чеклиста
          const bar = await foo["data"].answers.filter(item => item.question === 2)[0]
          let lat, lon
          if (bar) {
            console.log(bar)
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
            } catch {}
          return this.state.filledChecklists.address
          }
        }, [])
      state.commit('SET_LOADING_STATUS', false)
    } catch (error) {
      console.log(error.response)
    }
  },
  async [types.CREATE_FILLED_CHECKLISTS] ({ commit }) {}
}
