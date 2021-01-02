
import dayjs from 'dayjs'
import { ema } from "react-stockcharts/lib/indicator";

export const throttle = function (func, wait) {
    let prevTime = 0
    return function executedFunction(...args) {
        let currentTime = new Date().getTime()
        if (currentTime - prevTime > wait) {
            prevTime = currentTime
            return func(...args)
        }
    }
}

export const tooltipContent = () => {
    return ({ currentItem }) => {
        const { open = '', high = '', close = '', low = '', date = '' } = currentItem || {}
        return {
            x: date ? dayjs(date).format('ddd, MMM D, YYYY h:mm:ss A') : '',
            y: [
                {
                    label: "open",
                    value: open ? open.toFixed(2) : 0
                },
                {
                    label: "high",
                    value: high ? high.toFixed(2) : 0
                },
                {
                    label: "low",
                    value: low ? low.toFixed(2) : 0
                },
                {
                    label: "close",
                    value: close ? low.toFixed(2) : 0
                }
            ].filter(line => line.value)
        };
    };
}

export const exponentialMovingAverage = (windowSize) => {
    const id = windowSize === 20 ? 0 : 2
    return ema()
        .id(id)
        .options({ windowSize })
        .merge((d, c) => {
            if (windowSize === 20) {
                d.ema20 = c;
            } else {
                d.ema50 = c;
            }
        })
        .accessor((d) => windowSize === 20 ? d.ema20 : d.ema50);
}


export const getXAndYGrid = (margin, height, width, showGrid) => {

    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;

    const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
    const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};

    return [xGrid, yGrid]
}
