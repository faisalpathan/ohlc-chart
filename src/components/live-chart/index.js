import React, { useState, useEffect, forwardRef, useRef } from 'react'
import PropTypes from "prop-types";
import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { utcSecond } from "d3-time";
import { scaleTime } from "d3-scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";

import { ChartHoverToolTip, Axises } from '../common'

import { unSubscribeToLiveOHLCData } from '../../utils/selectors';
import { getXAndYGrid } from '../../utils/helpers'

const xAccessor = currentDatapoint => currentDatapoint && currentDatapoint.date;

const margin = { left: 50, right: 20, top: 20, bottom: 30 };

const recordsTobeMaintained = {
    desktop: 30,
    mobile: 10
}

const LiveChart = forwardRef((props, ref) => {
    const [suffix, setSuffix] = useState(1)
    const [latestLiveChartData, setLatestLiveChartData] = useState(props.chartData)
    const { type, ratio, chartData, width, height, showGrid } = props;
    const [xGrid, yGrid] = getXAndYGrid(margin, height, width, showGrid)
    const xExtents = useRef([])

    useEffect(() => {
        let recordsTobeSliced = recordsTobeMaintained.desktop
        if (width < 486) {
            recordsTobeSliced = recordsTobeMaintained.mobile
        }
        const latestChartData = recordsTobeSliced ? chartData.slice(-recordsTobeSliced) : chartData;
        setLatestLiveChartData(latestChartData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartData.length])

    useEffect(() => {
        return () => unSubscribeToLiveOHLCData()
    }, [])

    xExtents.current = [
        xAccessor(last(latestLiveChartData)),
        xAccessor(latestLiveChartData[0])
    ];

    const handleReset = () => {
        setSuffix(currentSuffix => currentSuffix + 1)
    }

    return (
        <ChartCanvas
            ref={ref}
            height={height}
            ratio={ratio}
            width={width}
            margin={margin}
            type={type}
            seriesName={`MSFT_${suffix}`}
            data={latestLiveChartData}
            xScale={scaleTime()}
            xAccessor={xAccessor}
            displayXAccessor={xAccessor}
            xExtents={xExtents.current}
            mouseMoveEvent={true}
            panEvent={true}
            zoomEvent={true}
            clamp={false}
        >
            <ChartHoverToolTip />
            <Chart id={1} yExtents={d => [d.high, d.low]}>
                <Axises xGrid={xGrid} yGrid={yGrid} />
                <CandlestickSeries width={timeIntervalBarWidth(utcSecond)} />
                <ZoomButtons onReset={handleReset} />
            </Chart>
        </ChartCanvas>
    )
})

LiveChart.propTypes = {
    chartData: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    showGrid: PropTypes.bool,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

LiveChart.defaultProps = {
    type: "svg",
    showGrid: true
};

const ResponsiveLiveChart = fitWidth(LiveChart);

export default ResponsiveLiveChart;

