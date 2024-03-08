function _1(md){return(
md`# Arc plot study
`
)}

function _arcplot(d3){return(
function (data, options = {}) {
  const {
    width = 800,
    height = 800,
    minRadius = 200,
    maxRadius = 350,
    fontSize = 20,
    textColor = "black",
    gridColor = "gray",
    gridLineWidth = 1,
    units = ""
  } = options;
  const radius = Math.min(width, height) / 2;

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  const values = data.map((d) => d.value);
  const names = data.map((d) => d.name);
  const extent = options.extent || d3.extent(values);
  const arcScale = d3
    .scaleLinear()
    .domain(extent)
    .range([0, Math.PI * 1.5]);
  const radiusScale1 = d3
    .scaleBand(names, [minRadius, maxRadius])
    .paddingInner(0.1)
    .paddingOuter(0.05);
  const radiusScale2 = d3.scaleBand(names, [minRadius, maxRadius]).padding(0);
  function makeArc(datum) {
    const inner = radiusScale1(datum.name);
    const outer = inner + radiusScale1.bandwidth();
    return d3
      .arc()
      .innerRadius(inner)
      .outerRadius(outer)
      .startAngle(0)
      .endAngle(
        arcScale(Math.min(extent[1], Math.max(extent[0], datum.value)))
      )();
  }

  function makeArcFrameSegment(datum, segments) {
    const inner = radiusScale2(datum.name);
    const outer = inner + radiusScale2.bandwidth();
    return function (segNumber) {
      return d3
        .arc()
        .innerRadius(inner)
        .outerRadius(outer)
        .startAngle((segNumber * Math.PI * 1.5) / segments)
        .endAngle(((segNumber + 1) * Math.PI * 1.5) / segments)();
    };
  }

  function titlePos(datum) {
    const inner = radiusScale1(datum.name);
    const outer = inner + radiusScale1.bandwidth();
    return -(inner + outer) / 2 + fontSize * 0.3;
  }

  svg
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("fill", (d) => d.color || "gray")
    .attr("d", (d) => makeArc(d));

  svg
    .selectAll("g")
    .data(data)
    .join("g")
    .each(function (d) {
      const pathFunc = makeArcFrameSegment(d, 9);
      d3.select(this)
        .selectAll("path")
        .data(d3.range(9))
        .join("path")
        .attr("d", pathFunc)
        .attr("fill", "none")
        .attr("stroke-width", gridLineWidth)
        .attr("stroke", gridColor);
    });

  svg
    .selectAll("text")
    .data(data)
    .join("text")
    .text((d) => d.name)
    .attr("fill", textColor)
    .attr("text-anchor", "end")
    .attr("font-size", fontSize)
    .attr("x", "-1em")
    .attr("y", titlePos);

  svg
    .append("text")
    .text(extent[0] + units)
    .attr("fill", textColor)
    .attr("text-anchor", "middle")
    .attr("font-size", fontSize)
    .attr("x", 0)
    .attr("y", -maxRadius - 10);
  svg
    .append("text")
    .text(extent[1] + units)
    .attr("fill", textColor)
    .attr("text-anchor", "end")
    .attr("font-size", fontSize)
    .attr("x", -maxRadius - 10)
    .attr("y", 0);

  return svg.node();
}
)}

function _data(FileAttachment){return(
FileAttachment("untitled.json").json()
)}

function _4(arcplot,data){return(
arcplot(data, {
  extent: [2000, 3500],
  gridLineWidth: 2,
  textColor: "blue",
  units: "g"
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["untitled.json", {url: new URL("./files/36fc1bb8697e2683ff56e55de1fee0256b66da846901a8bcb669d65ef50ac47806fb096e0a98be41fe3ff0983556404ad7b5524b368cfe85ed098ed5425b86ac.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("arcplot")).define("arcplot", ["d3"], _arcplot);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer()).define(["arcplot","data"], _4);
  return main;
}
