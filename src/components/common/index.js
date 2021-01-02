import { useRef, useLayoutEffect, useState, useCallback, Fragment } from 'react';

import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { tooltipContent, exponentialMovingAverage } from '../../utils/helpers'

const ema20 = exponentialMovingAverage(20)
const ema50 = exponentialMovingAverage(50)

export const ChartHoverToolTip = () => {
    return (
        <HoverTooltip
            yAccessor={ema50.accessor()}
            tooltipContent={tooltipContent([
                {
                    label: `${ema20.type()}(${ema20.options().windowSize})`,
                    value: (d) => (ema20.accessor()(d)).toFixed(2),
                    stroke: ema20.stroke()
                },
                {
                    label: `${ema50.type()}(${ema50.options().windowSize})`,
                    value: (d) => (ema50.accessor()(d)).toFixed(2),
                    stroke: ema50.stroke()
                }
            ])}
            fontSize={15}
        />
    )
}

export const Axises = ({ xGrid, yGrid }) => {
    return (
        <Fragment>
            <XAxis axisAt="bottom" orient="bottom" zoomEnabled={true} {...xGrid} />
            <YAxis axisAt="left" orient="left" ticks={5} zoomEnabled={true} {...yGrid} />
        </Fragment>
    )
}

export const useResizeObserver = () => {
    const [observerEntry, setObserverEntry] = useState({});
    const [node, setNode] = useState(null);
    const observer = useRef(null);

    const disconnect = useCallback(() => observer.current?.disconnect(), []);

    const observe = useCallback(() => {
        observer.current = new ResizeObserver(([entry]) => setObserverEntry(entry));
        if (node) observer.current.observe(node);
    }, [node]);

    useLayoutEffect(() => {
        observe();
        return () => disconnect();
    }, [disconnect, observe]);

    return [setNode, observerEntry];
};

