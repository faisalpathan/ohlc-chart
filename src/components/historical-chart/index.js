import React, { useState, forwardRef, useRef } from 'react'
import PropTypes from "prop-types";
import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

import { ChartHoverToolTip, Axises } from '../common'
import { getXAndYGrid } from '../../utils/helpers'


const margin = { left: 70, right: 70, top: 20, bottom: 30 }

const xScaleProvider = discontinuousTimeScaleProvider
    .inputDateAccessor(d => d.date);

const HistoricalChart = forwardRef((props, ref) => {
    const [suffix, setSuffix] = useState(1)
    const { type, ratio, chartData, width, height, showGrid } = props;
    const xExtents = useRef([])
    const [xGrid, yGrid] = getXAndYGrid(margin, height, width, showGrid)

    if (!chartData.length) {
        return null
    }

    const {
        data,
        xScale,
        xAccessor,
        displayXAccessor,
    } = xScaleProvider(chartData);

    xExtents.current = [
        xAccessor(last(data)),
        xAccessor(data[data.length - 100])
    ]

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
            data={data}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
            xExtents={xExtents.current}
            mouseMoveEvent
            panEvent
            zoomEvent
            clamp={false}
        >
            <ChartHoverToolTip />
            <Chart id={1} yExtents={d => [d.high, d.low]}>
                <Axises xGrid={xGrid} yGrid={yGrid} />
                <ZoomButtons onReset={handleReset} />
                <CandlestickSeries />
            </Chart>
        </ChartCanvas>
    )
})

HistoricalChart.propTypes = {
    chartData: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

HistoricalChart.defaultProps = {
    type: "svg",
};

const ResponsiveHistoricalChart = fitWidth(HistoricalChart);

export default ResponsiveHistoricalChart;

