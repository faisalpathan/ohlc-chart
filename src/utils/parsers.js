
import dayjs from 'dayjs'


export const splitAndMapDataPoints = (dataPointStr) => {
    const currentDataPointSplit = dataPointStr.split(',')
    return {
        date: +currentDataPointSplit[0],
        open: +currentDataPointSplit[1] || 0,
        high: +currentDataPointSplit[2] || 0,
        low: +currentDataPointSplit[3] || 0,
        close: +currentDataPointSplit[4] || 0,
        volume: +currentDataPointSplit[5] || 0,
    }
}

export const parseResponse = (currentDataPoints) => {
    return currentDataPoints.map(currentDataPoint => splitAndMapDataPoints(currentDataPoint))
}

export const sortByTimeStamp = (parsedStockData) => {
    return parsedStockData.sort((current, next) => current.date - next.date)
}

export const convertEpochToDateObject = (stockData) => {
    return stockData.map(currentStockData => ({
        ...currentStockData,
        date: new Date(currentStockData.date)
    }))
}

export const getFormattedDate = (timestamp) => {
    if (timestamp) {
        return dayjs(timestamp).format('DD-MM-YY HH:mm:ss')
    }
    return null
}

export const removeRedundantTimestamp = (sortedStockData) => {
    const filteredDataBasedUponTimestamp = []
    const sortedStockDataLength = sortedStockData.length
    for (let i = 0; i < sortedStockDataLength; i += 1) {
        if (i === 0) {
            filteredDataBasedUponTimestamp.push({
                ...sortedStockData[0],
                date: new Date(sortedStockData[0].date)
            })
        } else {
            const prevTimestamp = sortedStockData[i - 1].date
            const currentTimestamp = sortedStockData[i].date

            const parsedCurrentTimeStamp = getFormattedDate(currentTimestamp)
            const parsedPrevTimeStamp = getFormattedDate(prevTimestamp)

            if (parsedCurrentTimeStamp > parsedPrevTimeStamp) {
                filteredDataBasedUponTimestamp.push({
                    ...sortedStockData[i],
                    date: new Date(currentTimestamp)
                })
            }
        }
    }
    return filteredDataBasedUponTimestamp
}
