import { format } from 'date-fns'

export default (value) => {
  if (value) {
    return format(new Date(value), 'dd-MM-yyyy\'T\'hh:mm')
  }
  return '(n/a)'
}
