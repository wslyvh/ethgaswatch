import { Context, APIGatewayEvent } from 'aws-lambda'
import moment from 'moment';
import { Connect, GetHourlyAverage } from '../services/GasService';

Connect().then(() => console.log("GasService Connected"));

export async function handler(event: APIGatewayEvent, context: Context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const days = 7
  const hours = 24
  const total = days * hours
  const gasData = await GetHourlyAverage(total)
  const xDayOfTheWeek = new Array(days).fill(0).map((_, i) => moment().subtract(i, 'd').format('dddd')).reverse()
  const weekDays = xDayOfTheWeek.map((i) => moment().day(i).weekday())
  const yHoursInTheDay = new Array(hours).fill(0).map((_, i) => `${i}:00`)
  const hoursInTheDay = new Array(hours).fill(0).map((_, i) => i)

  // mongo days = 1-7 (starting at Sunday)
  // moment days = 0-6 (starting at Sunday)

  const current = moment()
  const data = hoursInTheDay
    .map((hourOfTheDay) => {
      return weekDays
        .map((weekDay) => {
          // timezones? GMT ?
          if (weekDay === current.weekday() && hourOfTheDay > current.hour() - 1) {
            return null
          }

          const value = gasData.find(i => i.day === (weekDay + 1) && i.hour === hourOfTheDay)
          return value ? Math.floor(value.avg) : undefined
        })
    }
  )

  const response = {
    x: xDayOfTheWeek,
    y: yHoursInTheDay,
    data
  }

  return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
  }
}