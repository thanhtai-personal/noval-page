export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

const NAMES = [
  "Nô lệ"
]

export const getLevelName = (level: number = 0) => {

  return NAMES[level-1]
}
