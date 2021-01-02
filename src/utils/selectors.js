
import { fetchHistoricalData } from '../services/rest'
import { sortByTimeStamp, convertEpochToDateObject, parseResponse, splitAndMapDataPoints, removeRedundantTimestamp } from './parsers'
import { throttle } from './helpers'
import socket from '../services/sockets'

export const fetchAndParsedHistoricalOHLCData = async () => {
    const historicalData = await fetchHistoricalData()
    if (historicalData && historicalData.length) {
        const parsedData = parseResponse(historicalData)
        const sortedDataByTimeStamp = sortByTimeStamp(parsedData)
        const filteredDataBasedUponTimestamp = removeRedundantTimestamp(sortedDataByTimeStamp)
        const convertedStockDataForData = convertEpochToDateObject(filteredDataBasedUponTimestamp)
        return convertedStockDataForData
    } else {
        return []
    }
}

export const subscribeToLiveOHLCData = (callback) => {
    socket.subscribe(callback)
}

export const unSubscribeToLiveOHLCData = () => {
    socket.unsubscribe()
}

export const parsedAndSetDataPoints = (dataPoint) => {
    const dataPointObj = splitAndMapDataPoints(dataPoint)
    dataPointObj.date = new Date(dataPointObj.date)
    return dataPointObj
}

export const throttledSendLiveOHLCData = throttle(parsedAndSetDataPoints, 1000)


