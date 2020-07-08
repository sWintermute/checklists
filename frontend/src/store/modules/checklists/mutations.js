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
