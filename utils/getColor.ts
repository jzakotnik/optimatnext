export default function getColor(
  percentage: number,
  low: number,
  high: number,
  inverted: boolean = false
) {
  switch (true) {
    case percentage < low:
      return inverted ? "#FFA07A" : "#90EE90"; // Light Green
      break;
    case percentage >= low && percentage <= high:
      return "#FFFFE0"; // Light Yellow
      break;
    case percentage > high:
      return inverted ? "#90EE90" : "#FFA07A"; // Light Red
      break;
    default:
      return "#FFFFFF"; // Default color (white)
  }
}
