import React, { useEffect, useState } from 'react'

import LiveChart from './components/live-chart'
import HistoricalChart from './components/historical-chart'
import { useResizeObserver } from './components/common'

import { fetchAndParsedHistoricalOHLCData, throttledSendLiveOHLCData, subscribeToLiveOHLCData, unSubscribeToLiveOHLCData } from './utils/selectors'
import { HISTORICAL_OHLC_CHART, LIVE_OHLC_CHART } from './constants'

import { Container, ChartWrapper, Tabs, Tab, LoaderWrapper, Loader } from './AppStyles'

const App = () => {
  const [chartType, setChartType] = useState(HISTORICAL_OHLC_CHART)
  const [ref, entry] = useResizeObserver();
  const [historicalData, setHistoricalData] = useState([])
  const [liveData, setLiveData] = useState([])

  const getHistoricalData = async () => {
    const historicalData = await fetchAndParsedHistoricalOHLCData()
    setHistoricalData(historicalData)
  }

  const handleCallbackOfDataPoints = (dataPoint) => {
    if (dataPoint) {
      const parsedDataPoint = throttledSendLiveOHLCData(dataPoint)
      if (parsedDataPoint) {
        setLiveData(liveData => [...liveData, parsedDataPoint])
      }
    }
  }

  const handleVisibilityChangeCallback = () => {
    if (document.visibilityState === 'visible') {
      subscribeToLiveOHLCData(handleCallbackOfDataPoints)
    } else {
      unSubscribeToLiveOHLCData()
    }
  }

  const handleOnlineCallback = () => {
    subscribeToLiveOHLCData(handleCallbackOfDataPoints)
  }

  useEffect(() => {
    window.addEventListener('online', handleOnlineCallback);
    document.addEventListener("visibilitychange", handleVisibilityChangeCallback);
    return () => {
      window.removeEventListener('online', handleOnlineCallback);
      document.removeEventListener("visibilitychange", handleVisibilityChangeCallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (chartType === HISTORICAL_OHLC_CHART) {
      getHistoricalData()
    } else {
      subscribeToLiveOHLCData(handleCallbackOfDataPoints)
    }
  }, [chartType])

  const toggleChartType = (type) => () => {
    if (chartType === type) {
      return
    }
    setChartType(type)
  }

  const renderLoader = () => {
    return <LoaderWrapper><Loader /></LoaderWrapper>
  }

  const renderLiveChart = () => {
    if (liveData.length > 1) {
      return (
        <LiveChart
          width={entry.contentRect ? entry.contentRect.width : window.innerWidth}
          ration={2}
          type='hybrid'
          chartData={liveData}
          height={entry.contentRect ? entry.contentRect.height : window.innerHeight}
          showGrid
        />
      )
    }
    return renderLoader()
  }

  const renderHistoricalChart = () => {
    if (historicalData.length) {
      return (
        <HistoricalChart
          width={entry.contentRect ? entry.contentRect.width : window.innerWidth}
          ration={2}
          type='hybrid'
          chartData={historicalData}
          height={entry.contentRect ? entry.contentRect.height : window.innerHeight}
          showGrid
        />
      )
    }
    return renderLoader()
  }

  const renderTabs = () => {
    return (
      <Tabs>
        <Tab onClick={toggleChartType(HISTORICAL_OHLC_CHART)} isActive={chartType === HISTORICAL_OHLC_CHART}>Historical Chart</Tab>
        <Tab onClick={toggleChartType(LIVE_OHLC_CHART)} isActive={chartType === LIVE_OHLC_CHART}>Live Chart</Tab>
      </Tabs>
    )
  }

  return (
    <Container>
      {renderTabs()}
      <ChartWrapper ref={ref}>
        {
          chartType === HISTORICAL_OHLC_CHART
            ? renderHistoricalChart()
            : renderLiveChart()
        }
      </ChartWrapper>
    </Container>
  );
}

export default App;
