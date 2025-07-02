export const READ_PREFIX = "read-";

export const COLORS = [
  "#F04848",
  "#FFAF04",
  "#3A84CD",
  "#66CDAA",
  "#FFD700",
  "#7D5FFF",
  "#FF7B54",
  "#33C1FF",
  ...Array.from(
    { length: 27 },
    () =>
      `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`,
  ),
];
