import moment from 'moment'

export const fromNowForHuman = (date) => {
  return moment(date).fromNow()
}