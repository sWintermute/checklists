import Vue from 'vue';
import router from '@/router';
import ApiService from '@/services/api.js';

export default {
  async SEND_CHECKLIST ({ commit, state, getters }, { fileList: photo }) {
    try {
      const currentList = getters.currentList;
      const list = {
        survey: currentList.id,
        answers: currentList.questions,
        photo
      }

      ApiService.setHeader();
      await ApiService.post('/api/v1/response', list);
      router.push('/');
      Vue.$toast.open({
        message: 'Чеклист успешно создан!',
        type: 'success',
      });
    } catch (error) {
      Vue.$toast.open({
        message: [
          'Невозможно создать чеклист'
        ].join('.'),
        type: 'error',
      });
      console.log(error.response);
      router.push('/');
    }
  },
  async FETCH_CHECKLIST ({ commit }, listId) {
    try {
      ApiService.setHeader();
      const { data: list } = await ApiService.get('api/v1/lists', listId)
      list.questions = list.questions
                      .sort((question, prevQuestion) => {
                        if (question.order < prevQuestion.order) return -1
                      })
                      .map(question => ({ question, body: '' }))
      commit('SET_LIST', list);
    } catch (error) {
      console.log(error.response);
    }
  },
  FETCH_CHECKLISTS ({ commit }) {
    return new Promise((resolve, reject) => {
      // this.commit('SET_LOADING_STATUS', true);
      ApiService.setHeader();
      ApiService.get('api/v1/lists')
        .then(response => {
          const lists = response.data;
          commit('SET_LISTS', lists);
          // this.commit('SET_LOADING_STATUS', false);
          resolve(response);
        })
        .catch(error => {
          // this.commit('SET_LOADING_STATUS', false);
          console.log(error.response);
          reject(error);
        });
    });
  },
  CHECKLIST_AUTOCOMPLETE_FIELD ({ commit }, { search }) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader(process.env.VUE_APP_DADATA_KEY);
      ApiService.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
        count: 5,
        query: 'Кемеровская область - Кузбасс,' + search,
        locations_boost: [
          { kladr_id: '4200001200000' }
        ]
      })
        .then(response => {
          commit('SET_ENTRIES', [search, ...response.data.suggestions]);
          resolve(response);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },
};
