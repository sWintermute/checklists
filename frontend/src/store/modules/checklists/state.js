export const getDefaultState = () => {
  return {
    lists: []
  }
}

export default () => ({
  list: {
    questions: []
  },
  photo: [],
  lists: [],
  answers: {},
  entries: [],
  autocomplete: '',
  autocompleteId: 0
})
