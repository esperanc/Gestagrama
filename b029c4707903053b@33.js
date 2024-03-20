function _1(md){return(
md`# Radial node garden`
)}

function* _2(nodeGarden)
{
  const ng = nodeGarden({ color: "rgba(255,255,255,0.5)" });
  for (;;) {
    yield ng;
    ng.draw();
  }
}


function _nodeGarden(DOM){return(
function nodeGarden(options = {}) {
  const {
    w = 500,
    h = 500,
    margin = 15,
    minDist = 40,
    maxDist = 60,
    nodeNum = 100,
    minRadius = 0.5,
    maxRadius = 3,
    color = "white"
  } = options;
  const nodes = [];
  const canvas = DOM.canvas(w, h);
  const ctx = canvas.getContext("2d");
  canvas.style.background = "black";
  const random = (a, b) =>
    b === undefined
      ? a === undefined
        ? Math.random()
        : Math.random() * a
      : Math.random() * (b - a) + a;
  for (let i = 0; i < nodeNum; i++) {
    let r = random(40, h / 2 - margin);
    let ang = random(0, Math.PI * 2);
    let vel = random(-1 / r, 1 / r);
    nodes.push([r, ang, vel]);
  }
  canvas.draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    let pos = [];
    for (let i = 0; i < nodeNum; i++) {
      let [r, ang, vel] = nodes[i];
      ang += vel;
      pos[i] = [w / 2 + r * Math.cos(ang), h / 2 + r * Math.sin(ang)];
      nodes[i][1] = ang;
    }
    // draw lines
    let edgeCount = [];
    for (let i = 0; i < nodeNum; i++) edgeCount.push(0);
    for (let i = 0; i < nodeNum - 1; i++) {
      let [x0, y0] = pos[i];
      for (let j = i + 1; j < nodeNum; j++) {
        let [x1, y1] = pos[j];
        let d = Math.hypot(x1 - x0, y1 - y0);
        if (d >= minDist && d <= maxDist) {
          ctx.lineWidth = 1 - (d - minDist) / (maxDist - minDist);
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
          edgeCount[i]++;
          edgeCount[j]++;
        }
      }
    }
    // draw nodes
    const maxEdges = Math.max(...edgeCount);
    for (let i = 0; i < nodeNum; i++) {
      const r = minRadius + ((maxRadius - minRadius) * edgeCount[i]) / maxEdges;
      ctx.beginPath();
      ctx.arc(...pos[i], r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  return canvas;
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["nodeGarden"], _2);
  main.variable(observer("nodeGarden")).define("nodeGarden", ["DOM"], _nodeGarden);
  return main;
}
