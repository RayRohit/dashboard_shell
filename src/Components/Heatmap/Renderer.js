import { useMemo, useRef } from "react";
import * as d3 from "d3";
import {  colorSecSchema } from "./colorSchema";

const MARGIN = { top: 10, right: 10, bottom: 30, left: 30 };

export const Renderer = (props) => {
  // The bounds (=area inside the axis) is calculated by substracting the margins

  const { width, height, data, setHoveredCell } = props;

  const boundsWidth = width;
  const boundsHeight = height;


  // groups
  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.01);
  }, [data, height]);

  function tempSecMap(value) {
    if (value >= 0 && value < 40) return colorSecSchema["1"];
    else if (value >= 40 && value < 80) return colorSecSchema["2"];
    else if (value >= 80 && value < 120) return colorSecSchema["3"];
    else if (value >= 120 && value < 160) return colorSecSchema["4"];
    else if (value >= 160 && value < 200) return colorSecSchema["5"];
    else if (value >= 200 && value < 240) return colorSecSchema["6"];
    else if (value >= 240 && value < 280) return colorSecSchema["7"];
    else if (value >= 280 && value < 320) return colorSecSchema["8"];
    else if (value >= 320 && value < 360) return colorSecSchema["9"];
    else if (value >= 360 && value < 400) return colorSecSchema["10"];
    else if (value >= 400 && value < 440) return colorSecSchema["11"];
    else if (value >= 440 && value < 480) return colorSecSchema["12"];
    else if (value >= 480 && value < 520) return colorSecSchema["13"];
    else if (value >= 520 && value < 560) return colorSecSchema["14"];
    else if (value >= 560 && value < 600) return colorSecSchema["15"];
    else return "#222";
  }

  const allShapes = data.map((d, i) => {
    const color = tempSecMap(d.Temperature);
    if (d.value === null) {
      return;
    }
    return (
      <rect
        key={i}
        r={4}
        x={xScale(d.y)}
        y={yScale(d.x)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={1}
        fill={color}
        rx={5}
        onMouseEnter={(e) => {
          console.log(e)
          setHoveredCell({
            xLabel: d.x,
            yLabel: d.y,
            // xPos: xScale(d.x) + xScale.bandwidth() + MARGIN.left, // todo, is it the best way?
            // yPos: yScale(d.y) + xScale.bandwidth() / 2 + MARGIN.top,
            xPos:e.pageX - 1000, // todo, is it the best way?
            yPos: e.pageY -250,
            value: d.Temperature,
          });
        }}
        onMouseLeave={() => setHoveredCell(null)}
      />
    );
  });

  const xLabels = allXGroups.map((name, i) => {
    return (
      <text
        key={i}
        x={xScale(name) + xScale.bandwidth() / 2}
        y={boundsHeight + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
      >
        {name}
      </text>
    );
  });

  const yLabels = allYGroups.map((name, i) => (
    <text
      key={i}
      x={-5}
      y={yScale(name) + yScale.bandwidth() / 2}
      textAnchor="end"
      dominantBaseline="middle"
      fontSize={10}
    >
      {name}
    </text>
  ));



  return (
    <div style={{ transform: "rotateY(180deg)"}}>
      <svg width={width} height={height} transform="rotate(180)" style={{ boxShadow: '3px 3px 6px', borderRadius: '20px', padding: '5px' }}>
        <g
          width={boundsWidth}
          height={boundsHeight}
        >
          {allShapes}
        </g>
      </svg>
    </div>
  );
};
