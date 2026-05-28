/**
 * Generates points string for SVG <polyline> element from an array of numeric data.
 * Scales the data points to fit within the specified width and height bounding box.
 * 
 * @param data Array of numbers to plot
 * @param width Width of the SVG canvas
 * @param height Height of the SVG canvas
 */
export function generateSparklinePoints(data: number[], width = 120, height = 36): string {
  if (!data || data.length < 2) {
    return "";
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1; // Prevent division by zero if all values are identical

  return data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      // Invert Y axis since 0 is top in SVG coordinates.
      // Leave a 3px padding on the top and bottom bounds for better visual fit.
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
