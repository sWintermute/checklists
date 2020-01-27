export default {
  list: state => state.list,
  lists: state => state.lists,
  namesLists: state => state.lists.map((checklist) => (checklist.id))
}
