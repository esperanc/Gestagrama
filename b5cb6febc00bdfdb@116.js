import define1 from "./316b246fa1642db4@285.js";

function _1(md){return(
md`# Simplex noise exerciser

In the words of [wikipedia](https://en.wikipedia.org/wiki/Simplex_noise)
>Simplex noise is the result of an n-dimensional noise function comparable to [Perlin](https://en.wikipedia.org/wiki/Perlin_noise) noise ("classic" noise) but with fewer directional artifacts and, in higher dimensions, a lower computational overhead.

This notebook uses [Jonas Wagner's](https://www.npmjs.com/~jonas) [simple-noise](https://www.npmjs.com/package/simplex-noise) package. I only added a visualization and some parameters to explore the noise space. Enjoy.
`
)}

function _params(Inputs){return(
Inputs.form({
  xScaleLog: Inputs.range([-8, 0], {
    label: "x scale (log2)",
    step: 0.1,
    value: -5
  }),
  yScaleLog: Inputs.range([-8, 0], {
    label: "y scale (log2)",
    step: 0.1,
    value: -5
  }),
  octaves: Inputs.range([1, 8], { label: "octaves", step: 1, value: 4 })
})
)}

function _scaleParms(Inputs,scales){return(
Inputs.form({
  scaleName: Inputs.select(Object.keys(scales), {
    label: "color scale",
    value: "Greys"
  }),
  thresholds: Inputs.range([0, 10], {
    label: "thresholding",
    value: 0,
    step: 1
  })
})
)}

function _randomize(Inputs){return(
Inputs.button("Randomize")
)}

function _5(noiseImage,createSimplexNoise,rand,params,scaleParms){return(
noiseImage(createSimplexNoise(Object.assign({ rand }, params)), {
  scale: scaleParms.scaleName,
  thresholds: scaleParms.thresholds,
  width: 800,
  height: 600
})
)}

function _snoiseModule(){return(
import(
  "https://unpkg.com/simplex-noise@4.0.1/dist/esm/simplex-noise.js?module"
)
)}

function _randomSeed(){return(
0
)}

function _9(randomize,$0)
{
  randomize;
  $0.value++;
}


function _rand(d3,randomSeed){return(
d3.randomLcg(randomSeed)
)}

function _createSimplexNoise(rand,octave,snoiseModule){return(
function createSimplexNoise(options = {}) {
  const {
    xScaleLog = -5,
    yScaleLog = -5,
    octaves = 3,
    random = rand
  } = options;
  const xScale = 2 ** xScaleLog;
  const yScale = 2 ** yScaleLog;
  const noise = octave(snoiseModule.createNoise2D(random), octaves);
  return (x, y) => noise(x * xScale, y * yScale);
}
)}

function _scales(d3)
{
  let obj = {};
  for (let name of [...Object.keys(d3)].filter((s) => {
    if (s.slice(0, 11) != "interpolate") return false;
    try {
      const result = d3[s](0);
      if (result.slice(0, 3) == "rgb" || result[0] == "#") return true;
    } catch (e) {}
    return false;
  })) {
    obj[name.slice(11)] = d3[name];
  }
  return obj;
}


function _makeThresholdScale(d3){return(
function makeThresholdScale(scale, thresholdCount = 2) {
  const delta = 1 / (thresholdCount + 1);
  const domain = d3.range(thresholdCount).map((i) => (i + 1) * delta);
  const range = d3
    .range(thresholdCount + 1)
    .map((i) => scale((i + 0.5) * delta));
  return d3.scaleThreshold(domain, range);
}
)}

function _14(makeThresholdScale,scales){return(
makeThresholdScale(scales.Greys, 3)
)}

function _makeColorArray(d3){return(
function makeColorArray(scale) {
  let array = new Uint8Array(3 * 256);
  for (let i = 0; i < 256; i++) {
    let color = d3.color(scale(i / 255));
    array[i * 3] = color.r;
    array[i * 3 + 1] = color.g;
    array[i * 3 + 2] = color.b;
  }
  return array;
}
)}

function _noiseImage(d3,scales,makeThresholdScale,makeColorArray,DOM){return(
function noiseImage(noise, options = {}) {
  const {
    height = 400,
    width = 400,
    scale = "Greys",
    thresholds = 0
  } = options;
  let scaleFunction = d3.scaleSequential(scales[scale]).domain([0, 1]);
  if (thresholds > 0)
    scaleFunction = makeThresholdScale(scaleFunction, thresholds);
  const colorArray = makeColorArray(scaleFunction);
  const context = DOM.context2d(width, height, 1);
  const image = context.createImageData(width, height);
  for (let y = 0, i = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x, i += 4) {
      const j = ~~Math.max(0, Math.min(255, (noise(x, y) + 1) * 128)) * 3;
      image.data[i] = colorArray[j];
      image.data[i + 1] = colorArray[j + 1];
      image.data[i + 2] = colorArray[j + 2];
      image.data[i + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return context.canvas;
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof params")).define("viewof params", ["Inputs"], _params);
  main.variable(observer("params")).define("params", ["Generators", "viewof params"], (G, _) => G.input(_));
  main.variable(observer("viewof scaleParms")).define("viewof scaleParms", ["Inputs","scales"], _scaleParms);
  main.variable(observer("scaleParms")).define("scaleParms", ["Generators", "viewof scaleParms"], (G, _) => G.input(_));
  main.variable(observer("viewof randomize")).define("viewof randomize", ["Inputs"], _randomize);
  main.variable(observer("randomize")).define("randomize", ["Generators", "viewof randomize"], (G, _) => G.input(_));
  main.variable(observer()).define(["noiseImage","createSimplexNoise","rand","params","scaleParms"], _5);
  main.variable(observer("snoiseModule")).define("snoiseModule", _snoiseModule);
  const child1 = runtime.module(define1);
  main.import("perlin2", child1);
  main.import("perlin3", child1);
  main.import("octave", child1);
  main.define("initial randomSeed", _randomSeed);
  main.variable(observer("mutable randomSeed")).define("mutable randomSeed", ["Mutable", "initial randomSeed"], (M, _) => new M(_));
  main.variable(observer("randomSeed")).define("randomSeed", ["mutable randomSeed"], _ => _.generator);
  main.variable(observer()).define(["randomize","mutable randomSeed"], _9);
  main.variable(observer("rand")).define("rand", ["d3","randomSeed"], _rand);
  main.variable(observer("createSimplexNoise")).define("createSimplexNoise", ["rand","octave","snoiseModule"], _createSimplexNoise);
  main.variable(observer("scales")).define("scales", ["d3"], _scales);
  main.variable(observer("makeThresholdScale")).define("makeThresholdScale", ["d3"], _makeThresholdScale);
  main.variable(observer()).define(["makeThresholdScale","scales"], _14);
  main.variable(observer("makeColorArray")).define("makeColorArray", ["d3"], _makeColorArray);
  main.variable(observer("noiseImage")).define("noiseImage", ["d3","scales","makeThresholdScale","makeColorArray","DOM"], _noiseImage);
  return main;
}
