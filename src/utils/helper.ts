import moment from 'moment'

export const getUptime = () => {
  const uptimeSeconds = process.uptime()
  const duration = moment.duration(uptimeSeconds, 'seconds')
  const days = duration.days()
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()

  let uptimeString = ''

  if (days > 0) {
    uptimeString += `${days} day${days > 1 ? 's' : ''}, `
  }
  if (hours > 0) {
    uptimeString += `${hours} hour${hours > 1 ? 's' : ''}, `
  }
  if (minutes > 0) {
    uptimeString += `${minutes} minute${minutes > 1 ? 's' : ''}, `
  }
  uptimeString += `${seconds} second${seconds > 1 ? 's' : ''}`

  return uptimeString
}
