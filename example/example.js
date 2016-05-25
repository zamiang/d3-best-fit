import bestFit from '../dist/dist.js';

const numberDots = 50;
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
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; });

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
    };

    // left
    for (let index = 0; index < resolution; ++index) {
      dots.push({
        x: 0,
        y: heightIncrement * (index + 1)
      });
    };

    // right
    for (let index = 0; index < resolution; ++index) {
      dots.push({
        x: width,
        y: heightIncrement * index
      });
    };

    // bottom
    for (let index = 0; index < resolution; ++index) {
      dots.push({
        x: widthIncrement * (index + 1),
        y: height
      });
    };

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
  findLineByLeastSquares(values_x, values_y) {
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let count = 0;

    let x = 0;
    let y = 0;
    let values_length = values_x.length;

    if (values_length != values_y.length) {
      throw new Error('The parameters values_x and values_y need to have same size!');
    }

    // return if no values
    if (values_length === 0) {
      return [ [], [] ];
    }

    //  Calculate the sum for each of the parts necessary.
    for (let v = 0; v < values_length; v++) {
      x = values_x[v];
      y = values_y[v];
      sum_x += x;
      sum_y += y;
      sum_xx += x*x;
      sum_xy += x*y;
      count++;
    }

    /*
     * Calculate m and b for the formula:
     * y = x * m + b
     */
    let m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    let b = (sum_y/count) - (m*sum_x)/count;

    // We will make the x and y result line now
    let result_values_x = [];
    let result_values_y = [];

    for (let v = 0; v < values_length; v++) {
      x = values_x[v];
      y = x * m + b;
      result_values_x.push(x);
      result_values_y.push(y);
    }

    // format results
    let results = [];
    for (let i = 0; i < values_length; i++) {
      results.push({
        x: result_values_x[i],
        y: result_values_y[i]
      });
    }
    return results;
  }
}

new Main();
