import React from "react";
import "./SegmentedProgressBar.css";

interface Props {
  value: number; // percentage (0-100)
  segments?: number; // number of total lines, default 20
}

const SegmentedProgressBar: React.FC<Props> = ({ value, segments = 20 }) => {
  const filledCount = Math.round((value / 100) * segments);

  return (
    <div className="segmented-bar">
      {Array.from({ length: segments }).map((_, idx) => {
        let className = "segment";
        if (idx < filledCount) {
          if (value < 33) className += " low";
          else if (value < 66) className += " in-progress";
          else className += " filled";
        }
        return <div key={idx} className={className} />;
      })}
      <span className="segmented-label">{value}%</span>
    </div>
  );
};

export default SegmentedProgressBar;
