import React, { ReactNode } from "react";
import "./SideLoading.css";

const SideLoading: React.FC<{
  label?: string | ReactNode;
}> = ({ label }: any) => {
  return (
    <div className={`side_loader`}>
      <div className="body">
        <div className="container">
          <div className="scene">
            {label && <span className="loading-label">{label}</span>}
            <Bar />
          </div>
        </div>
      </div>
    </div>
  );
};

const barStyle = {
  "--columns": "20% 0 10% 0 10% 0 10% 0 20% 0 10% 0 20%",
  "--total-length": 400,
} as React.CSSProperties;

const segments = [
  {
    name: "segment-1",
    delay: 0,
    length: 20,
    depth: 0,
    className: "bar__segment bar__segment--aligned",
  },
  {
    name: "segment-2",
    delay: 20,
    length: 30,
    depth: 0,
    className: "bar__segment bar__segment--front",
  },
  {
    name: "segment-3",
    delay: 50,
    length: 10,
    depth: 30,
    className: "bar__segment bar__segment--aligned",
  },
  {
    name: "segment-4",
    delay: 60,
    length: 50,
    depth: 30,
    className: "bar__segment bar__segment--back",
  },
  {
    name: "segment-5",
    delay: 110,
    length: 10,
    depth: -20,
    className: "bar__segment bar__segment--aligned",
  },
  {
    name: "segment-6",
    delay: 120,
    length: 60,
    depth: -20,
    className: "bar__segment bar__segment--front",
  },
  {
    name: "segment-7",
    delay: 180,
    length: 10,
    depth: 40,
    className: "bar__segment bar__segment--aligned",
  },
  {
    name: "segment-8",
    delay: 190,
    length: 70,
    depth: 40,
    className: "bar__segment bar__segment--back",
  },
  {
    name: "segment-9",
    delay: 260,
    length: 20,
    depth: -30,
    className: "bar__segment bar__segment--aligned",
  },
  {
    name: "segment-10",
    delay: 280,
    length: 50,
    depth: -30,
    className: "bar__segment bar__segment--front",
  },
  {
    name: "segment-11",
    delay: 330,
    length: 30,
    depth: 20,
    className: "bar__segment bar__segment--aligned",
  },
  {
    name: "segment-12",
    delay: 360,
    length: 20,
    depth: 20,
    className: "bar__segment bar__segment--back",
  },
  {
    name: "segment-13",
    delay: 380,
    length: 20,
    depth: 0,
    className: "bar__segment bar__segment--aligned",
  },
];

const Bar = () => (
  <div className="bar" style={barStyle}>
    {segments.map((seg, i) => (
      <div
        key={seg.name}
        className={seg.className}
        style={
          {
            "--name": seg.name,
            "--delay": seg.delay,
            "--length": seg.length,
            "--depth": seg.depth,
          } as React.CSSProperties
        }
      ></div>
    ))}
  </div>
);

export default SideLoading;
