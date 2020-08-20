import { updateField } from 'vuex-map-fields'
import { getDefaultState } from '@/store/modules/checklists/state'

export default {
  updateField,
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_ANSWERS (state, payload) {
    state.answers = payload
  },
  SET_LIST (state, payload) {
    state.list = payload
  },
  SET_LIST_QUESTIONS (state, payload) {
    state.list.questions = payload
  },
  SET_LIST_QUESTION (state, { newQuestion, body }) {
    state.list.questions = state.list.questions.map(({ question }) => {
      if (question.id === newQuestion.id) return { question, body }
    })
  },
  SET_LISTS (state, payload) {
    state.lists = payload
  },
  SET_ENTRIES (state, payload) {
    state.entries = payload
  },
  SET_AUTOCOMPLETE (state, payload) {
    state.autocomplete = payload
  }
}
