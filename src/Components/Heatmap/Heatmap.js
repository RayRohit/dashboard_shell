import { useState } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";

export const Heatmap = (props) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const { width, height, data } = props;

  return (
    <div style={{ position: "relative" }}>
      <Renderer
        width={width}
        height={height}
        data={data}
        setHoveredCell={setHoveredCell}
      />
      <Tooltip hoveredCell={hoveredCell} width={width} height={height} />
    </div>
  );
};
