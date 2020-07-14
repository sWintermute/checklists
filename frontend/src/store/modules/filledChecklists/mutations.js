import { updateField } from 'vuex-map-fields'
import { getDefaultState } from '@/store/modules/filledChecklists/state'

export default {
  updateField,
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_FILLED_LIST (state, payload) {
    state.filledList = payload
  },
  SET_FILLED_LISTS (state, payload) {
    state.filledLists = payload
  },
  SET_ADDRESS (state, payload) {
    state.address.push(payload)
  },
  SET_EXCEL (state, payload) {
    state.excel = payload
  },
  SET_MAP (state, payload) {
    state.address = payload
  }
}
