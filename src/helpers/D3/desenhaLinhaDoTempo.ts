import { select } from "d3-selection";
import { axisBottom } from "d3-axis";
import { scaleLinear } from "d3-scale";

export default function desenhaLinhaDoTempo(rootElement: HTMLDivElement, windowSize: { width: number; height: number }, timelineEvents: { color: string; ts: number; title: string; }[]) {
    const { width, height } = windowSize!;

    const PADDING = width / 10;
    const scale = scaleLinear()
        .domain([
            timelineEvents[0].ts,
            timelineEvents[timelineEvents.length - 1].ts,
        ])
        .range([0 + PADDING, width - PADDING])
        .nice();
    const axis = (axisBottom(scale) as any).ticks().tickFormat((d: any) => {
        // console.log("d", d);
        const date = new Date(d);
        return `${date.toLocaleDateString()}`;
    });

    select(rootElement)
        .select("svg")
        .append("g")
        .attr("class", "x-axis")
        .attr("width", width)
        .attr("transform", `translate(${0}, ${height * (1 / 2)})`)
        .call(axis)
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "16px")
        .attr("dx", "-2em")
        .attr("dy", "1em")
        .attr("transform", "rotate(-65)");
};