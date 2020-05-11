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
      if (state.autocomplete) {
        state.list.answers.push({
          question: state.autocompleteId,
          body: state.autocomplete.value,
        });
      }
      for (const [key, value] of Object.entries(state.answers)) {
        state.list.questions.forEach((question) => {
          if (question.id == key) {
            state.list.answers.push({ question, body: value });
          }
        })
      }
      ApiService.setHeader();
      const response = await ApiService.post('/api/v1/response', state.list);
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
          const list = response.data;
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
  CHECKLIST_AUTOCOMPLETE_FIELD ({ commit }, { search, count }) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader('519fbd1afac8c2380f617046c95a6789a39fa021');
      ApiService.post(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        {
          count: count,
          query: search,
        },
      )
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
