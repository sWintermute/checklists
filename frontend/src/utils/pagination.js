const pageFromLink = (link) => {
  if (!link) return link
  return link
    .split('?')
    .pop()
    .split('&')
    .reduce((acc, item) => {
      const itemKey = item.split('=').shift()
      const itemValue = parseInt(item.split('=').pop())
      acc[itemKey] = itemValue
      return acc
    }, {}).page
}

const currentPage = (nextLink, previousLink) => {
  const nextPage = nextLink ? pageFromLink(nextLink) : NaN
  const previousPage = previousLink ? pageFromLink(previousLink) : NaN
  return (nextPage - 1) || (previousPage + 1)
}

export default {
  pageFromLink,
  currentPage
}
