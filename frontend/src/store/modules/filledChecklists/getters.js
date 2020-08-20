import { getField } from 'vuex-map-fields'

export default {
  getField,
  getFilledChecklists: state => state.filledLists,
  getPhoto: state => state.filledLists.photo
}
