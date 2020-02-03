import moment from 'moment'

export default (value) => {
    if (value) {
        return moment(String(value)).format('MM/DD/YYYY hh:mm')
    }
    return '(n/a)'
}
