export const getDefaultState = () => {
  return {
    filledLists: []
  }
}

export default () => ({
  filledList: {
    answers: [],
    photo: []
  },
  filledLists: [],
  address: [],
  excel: []
})
