import Vue from 'vue';
import router from '@/router';
import ApiService from '@/services/api.js';

export default {
  async SEND_CHECKLIST ({ commit, state }, { fileList, userProfile, listId }) {
    try {
      this.commit('SET_LOADING_STATUS', true);
      state.list.id = parseInt(listId);
      state.list.created = new Date();
      state.list.updated = new Date();
      state.list.survey = parseInt(listId);
      state.list.user = userProfile.id;
      state.list.photo = fileList;
      state.list.answers = [];
      for (const [key, value] of Object.entries(state.answers)) {
        state.list.questions.forEach((question) => {
          if (question.id == key) {
            state.list.answers.push({ question, body: value });
          }
        })
      }
      ApiService.setHeader();
      await ApiService.post('/api/v1/response', state.list);
      router.push('/');
      Vue.$toast.open({
        message: 'Чеклист успешно создан!',
        type: 'success',
      });
      this.commit('SET_LOADING_STATUS', false);
    } catch (error) {
      Vue.$toast.open({
        message: [
          'Невозможно создать чеклист'
        ].join('.'),
        type: 'error',
      });
      console.log(error.response);
      this.commit('SET_LOADING_STATUS', false);
      router.push('/');
    }
  },
  FETCH_CHECKLIST ({ commit }, listId) {
    return new Promise((resolve, reject) => {
      this.commit('SET_LOADING_STATUS', true);
      ApiService.setHeader();
      ApiService.get('api/v1/lists', listId)
        .then(response => {
          let list = response.data;
          list.questions = list.questions.sort((question, prevQuestion) => { if (question.order < prevQuestion.order) return -1 })
          commit('SET_LIST', list);
          this.commit('SET_LOADING_STATUS', false);
          resolve(response);
        })
        .catch(error => {
          this.commit('SET_LOADING_STATUS', false);
          console.log(error.response);
          reject(error);
        });
    });
  },
  FETCH_CHECKLISTS ({ commit }) {
    return new Promise((resolve, reject) => {
      this.commit('SET_LOADING_STATUS', true);
      ApiService.setHeader();
      ApiService.get('api/v1/lists')
        .then(response => {
          const lists = response.data;
          commit('SET_LISTS', lists);
          this.commit('SET_LOADING_STATUS', false);
          resolve(response);
        })
        .catch(error => {
          this.commit('SET_LOADING_STATUS', false);
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
          commit('SET_ENTRIES', response.data.suggestions);
          resolve(response);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },
};
