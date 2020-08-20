export const getDefaultState = () => {
  return {
    filledList: {
      answers: [],
      photo: []
    },
    filledLists: [],
    address: [],
    excel: []
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
