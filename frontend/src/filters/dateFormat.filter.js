import format from 'date-fns'

export default (value) => {
    if (value) {
        return format(new Date(String(value) + ' 00:00:00'), "dd-MM-yyyy'T'hh:mm")
    }
    return '(n/a)'
}
