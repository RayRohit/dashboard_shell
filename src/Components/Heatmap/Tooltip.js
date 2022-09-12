export const Tooltip = (props) => {
  const { hoveredCell, width, height } = props;

  if (!hoveredCell) {
    return null;
  }

  return (
    <div
      style={{
        width,
        height,
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: hoveredCell.xPos,
          top: hoveredCell.yPos,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          border: "black",
          borderRadius: "4px",
          color: "white",
          fontSize: 16,
          padding: 4,
          marginLeft: 4,
        }}
      >
        <TooltipRow
          label={"temperature"}
          value={String(hoveredCell.value.toFixed(2))}
        />
      </div>
    </div>
  );
};

const TooltipRow = (props) => {
  const { label, value } = props;
  return (
    <div>
      <div>
        {/* <b>{label}</b> */}
        {/* <span>: </span> */}
        <span>
          {value}&nbsp;<sup>0</sup>&nbsp;C
        </span>
      </div>
    </div>
  );
};
