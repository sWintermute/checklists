import { getField } from 'vuex-map-fields'

export default {
  getField,
  namesLists: state => state.lists.map(checklist => checklist.id),
  nameOfList: state => survey => {
    return state.lists.filter(checklist => checklist.id === survey)
  },
  currentList: state => state.list
}
