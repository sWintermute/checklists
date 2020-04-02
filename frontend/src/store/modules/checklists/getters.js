export default {
  namesLists: state => state.lists.map(checklist => checklist.id),
  nameOfList: (state, survey) => state.lists.filter(checklist => checklist.id === survey),
}
