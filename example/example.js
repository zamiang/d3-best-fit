import bestFit from '../dist/dist.js';

const numberDots = 50;
const numberGroups = 4;
const width = 800;
const height = 500;
const lineResolution = 10; // make configureable

export default class Main {

  constructor(props) {
    this.render();
  }

  render() {
    this.svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

    this.svg.append("rect")
      .attr("width", width)
      .attr("height", height);

    this.dots = this.generateDots();
    this.renderDots(this.dots);

    this.boundingBoxDots = this.generateBoundingBoxDots(width, height, lineResolution);
    this.renderBoundingBoxDots(this.boundingBoxDots);

    let xList = this.dots.map((dot) => { return dot.x; });
    let yList = this.dots.map((dot) => { return dot.y; });
    this.line = this.findLineByLeastSquares(xList, yList);
    this.renderBestFitLine(this.line);
  }

  renderBestFitLine(lineData) {
    var line = d3.svg.line()
          .x((d) => { return d.x; })
          .y((d) => { return d.y; });

    this.svg.append("path")
      .datum(lineData)
      .attr("class", "line")
      .attr("d", line);
  }

  generateDots() {
    let data = [];

    for (let index = 0; index < numberDots; ++index) {
      data.push({
        val: Math.floor(Math.random() * 10),
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      });
    };
    return data;
  }

  // Generates dots in a square
  generateBoundingBoxDots(width, height, resolution) {
    let dots = [];
    let widthIncrement = width / lineResolution;
    let heightIncrement = height / lineResolution;

    // TOP
    for (let index = 0; index < resolution; ++index) {
      dots.push({
        x: widthIncrement * index,
        y: 0
      });

      // LEFT
      dots.push({
        x: 0,
        y: heightIncrement * (index + 1)
      });

      // RIGHT
      dots.push({
        x: width,
        y: heightIncrement * index
      });

      // BOTTOM
      dots.push({
        x: widthIncrement * (index + 1),
        y: height
      });
    }

    return dots;
  }

  // Renders using dots
  renderBoundingBoxDots(dots) {
    this.svg.selectAll("boundingBoxDots")
      .data(dots).enter()
      .append("circle")
      .attr("r", "4px")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("fill", "blue");
  }

  renderDots(dots) {
    this.svg.selectAll("dots")
      .data(dots).enter()
      .append("circle")
      .attr("r", "4px")
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; })
      .attr("fill", "red");
  }

  // based on https://dracoblue.net/dev/linear-least-squares-in-javascript/
  findLineByLeastSquares(valuesX, valuesY) {
    let sumX = 0;
    let sumY = 0;
    let sumXy = 0;
    let sumXx = 0;
    let count = 0;

    let x = 0;
    let y = 0;
    let valuesLength = valuesX.length;

    if (valuesLength != valuesY.length) {
      throw new Error('The parameters valuesX and valuesY need to have same size!');
    }

    // return if no values
    if (valuesLength === 0) {
      return [ [], [] ];
    }

    //  Calculate the sum for each of the parts necessary.
    for (let v = 0; v < valuesLength; v++) {
      x = valuesX[v];
      y = valuesY[v];
      sumX += x;
      sumY += y;
      sumXx += x*x;
      sumXy += x*y;
      count++;
    }

    /*
     * Calculate m and b for the formula:
     * y = m * x + b
     */
    let m = (count*sumXy - sumX*sumY) / (count*sumXx - sumX*sumX);
    let b = (sumY/count) - (m*sumX)/count;

    // make the x and y result line
    let results = [];
    for (let v = 0; v < valuesLength; v++) {
      x = valuesX[v];
      y = x * m + b;
      results.push({
        x: x,
        y: y
      });
    }
    return results;
  }
}

new Main();
