import { getField, updateField } from "vuex-map-fields";

export default {
  getField,
  namesLists: state => state.lists.map(checklist => checklist.id),
  nameOfList: (state, survey) => state.lists.filter(checklist => checklist.id === survey),
  currentList: state => state.list
}
