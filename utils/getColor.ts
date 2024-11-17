export default function getColor(
  percentage: number,
  low: number,
  high: number
) {
  switch (true) {
    case percentage < low:
      return "#90EE90"; // Light Green
      break;
    case percentage >= low && percentage <= high:
      return "#FFFFE0"; // Light Yellow
      break;
    case percentage > high:
      return "#FFA07A"; // Light Red
      break;
    default:
      return "#FFFFFF"; // Default color (white)
  }
}
