import React from 'react';

const Fire1: React.FC<{ width: number; height: number; stopColor: string; strokeColor: string; fill1: string; fill2: string; }> = ({ width, height, stopColor, strokeColor, fill1, fill2 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: stopColor, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: strokeColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g>
        <path d="M50 0 C20 20, 20 80, 50 100 C80 80, 80 20, 50 0 Z" fill={fill1} />
        <path d="M50 10 C30 30, 30 70, 50 90 C70 70, 70 30, 50 10 Z" fill={fill2} />
      </g>
    </svg>
  );
};

export default Fire1;