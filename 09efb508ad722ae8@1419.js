import define1 from "./b5cb6febc00bdfdb@116.js";
import define2 from "./25091beb60cd303a@78.js";
import define3 from "./98d4df2f99b1a751@411.js";

function _1(md){return(
md`# Gestagrama
## Paisagem da desigualdade
`
)}

async function* _vizWindow(htl,$0,Promises,viz)
{
  const container = htl.html`<div>`;
  Object.assign(container.style, {
    background: "black",
    width: "100%",
    aspectRatio: 16 / 9,
    tabIndex: -1,
    userSelect: "none"
  });
  yield container;

  while ($0.value.length == 0) await Promises.delay(100);

  let vizWindow = null;
  function setContainer(width, height) {
    Object.assign(container.style, {
      width: width + "px",
      height: height + "px",
      padding: 0,
      margin: 0
    });
    if (vizWindow) vizWindow.remove();
    vizWindow = viz({ width, height, nWeeks: 41 });
    container.update = vizWindow.update;
    container.newseries = vizWindow.newseries;
    container.codigo = vizWindow.codigo;
    container.series = vizWindow.series;
    container.append(vizWindow);
  }

  function onresize() {
    let fs = document.webkitFullscreenElement || document.mozFullscreenElement;
    if (fs == container) {
      setContainer(window.innerWidth, window.innerHeight, 0);
    } else {
      setContainer(800, (800 / 16) * 9);
    }
  }
  onresize();

  window.addEventListener("resize", onresize, false);

  function fullScreen(element) {
    if (element.requestFullScreen) {
      element.requestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    }
  }

  container.onclick = function () {
    fullScreen(container);
  };
  //return container;
}


function _pause(Inputs){return(
Inputs.toggle({ label: "Pause", value: false })
)}

async function* _mainLoop(vizWindow,pause,Promises)
{
  const run = false;
  const cycle = 15;
  const nWeeks = 41;
  const maxWeek = 328;
  for (;;) {
    if (!vizWindow.update || pause) {
      await Promises.delay(1000);
      continue;
    }
    const start = ~~(Math.random() * (maxWeek - nWeeks - cycle));
    for (let wk = start; wk < start + cycle && !pause; wk++) {
      await vizWindow.update(wk);
      yield { wk, n: cycle - (wk - start), series: vizWindow.series };
    }
    if (!pause) vizWindow.newseries();
  }
}


function _codigoSelecionado(){return(
315460
)}

function _viz(htl,$0,getOtherSeries,ballSimulation,d3,babyCanvas,displayMunicipios,makeChartDisplay,addDays,arcplot,drawBaby,Promises){return(
function viz(options = {}) {
  const { nWeeks = 41, width = 1024, height = 800 } = options;

  //
  // Layout constants
  //
  const topHeight = height * 0.6;
  const munWidth = 200;
  const arcplotWidth = width * 0.6;
  const arcplotHeight = height * 0.7;
  const arcPlotY = height * 0.02;
  const arcPlotX = (width - arcplotWidth - munWidth) / 2;
  const bottomHeight = height - topHeight;

  //
  // Main window where the visualization will be put
  //
  const mainWindow = htl.html`<div>`;
  Object.assign(mainWindow.style, {
    position: "relative",
    width: width + "px",
    height: height + "px",
    margin: 0,
    padding: 0
  });

  //
  // The data series we will be using
  //
  let series;
  let getSeriesData;
  let codigo;
  let poluicaoMap;
  function loadNextSeries() {
    const n = $0.value.length;
    for (let i = n - 1; i >= 0; i--) {
      if ($0.value[i].codigo != codigo || i == 0) {
        [codigo, series] = [
          $0.value[i].codigo,
          $0.value[i].series
        ];
        getSeriesData = getOtherSeries(series);
        const poluicao = series[series.length - 1]; // The last table in series
        poluicaoMap = new Map(
          poluicao.map(({ Semana, MediaPoluicao }) => [Semana, MediaPoluicao])
        );
        mainWindow.series = series;
        mainWindow.poluicao = poluicao;
        mainWindow.codigo = codigo;
        return;
      }
    }
    throw "No series in cache";
  }
  loadNextSeries();

  //
  // The main svg
  //
  const container = htl.html`<svg width=${width} height=${height} style ="background:black;">
    <defs>
     <linearGradient id="pagegrad" gradientTransform="rotate(90)">
       <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="80%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="88%" stop-color="rgba(0,0,0,0.3)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,1.)"/>
    </linearGradient>
    <filter id="blurFilter">
     <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
    </filter>
   </defs>`;
  Object.assign(container.style, {
    background: `linear-gradient(0deg, rgba(232,106,0,1) 0%, rgba(232,106,0,1) 30%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)`,
    margin: 0,
    padding: 0
  });

  //
  // The balls pollution simulation
  //
  const maxBalls = 400;
  const ballDisplay = ballSimulation({
    width: width - munWidth,
    height: topHeight * 1.3,
    maxBalls
  });
  const poluicaoBallScale = d3
    .scaleLinear()
    .domain([0, 150])
    .range([2, maxBalls]);

  //
  // A gradient to cover the bottom of the window
  //
  const pagegradient = htl.svg`<rect width=${width} height=${height} fill="url(#pagegrad)" />`;

  //
  // Fixed titles
  //
  const titles = htl.svg`
    <text x=${
      (width - munWidth) / 2
    } y=1.5em text-anchor="middle" font-size="13pt" fill="white" 
    >Que característica da mãe diminui o peso dos recém nascidos?</text>
    <text x=1em y=${topHeight + 20} font-size="13pt" fill="white" 
    >Peso médio de todos os nascidos vivos</text>
    <text x=1em y=${height - 20} font-size="13pt" fill="white" 
    >Peso médio de nascidos de mães com poucos exames pré-natais</text>
  `;

  //
  // The baby animation shown at the center of the window
  //
  const babySize = babyCanvas.width;
  const targetSize = height * 0.4;
  const targetScale = targetSize / babySize;
  const babyX = (width - munWidth - targetSize) / 2;
  const babyY = arcPlotY + (arcplotHeight - targetSize) / 2;
  const baby = htl.svg`<g transform="translate(${babyX},${babyY})"  >
    <foreignObject x=0 y=0 width=${babySize} height=${babySize} transform="scale(${targetScale},${targetScale})">
    ${babyCanvas}
    </foreignObject>
    </g>`;

  //
  // The municipality list display
  //
  const munDisplay = displayMunicipios({ width: munWidth, height });
  Object.assign(munDisplay.style, {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 0,
    margin: 0
  });

  //
  // A group for the area plot at the bottom of the viz
  //
  const chartGroup = htl.svg`<g class=chartgroup transform=translate(0,${topHeight}) >`;

  container.append(ballDisplay, chartGroup, pagegradient, titles, baby);
  mainWindow.append(container, munDisplay);

  //
  // The area plot
  let chart;
  function createChart() {
    chart = makeChartDisplay({
      series1: series[0],
      series2: series[1],
      width: width - munWidth,
      height: bottomHeight,
      nWeeks
    });
    const chartGroupSel = d3.select(container).select("g.chartgroup");
    chartGroupSel.selectAll("svg").remove();
    chartGroupSel.node().append(chart);
  }
  createChart();

  //
  // The text describing the current week
  //
  const displayWeekSel = d3
    .select(container)
    .append("g")
    .attr("transform", "translate(20,20)");
  const displayWeek = () => {
    displayWeekSel.selectAll("text").remove();
    let time = chart.highlightDay.split("/");
    if (time.length != 3) return;
    let [day, month, year] = time;
    let lastday = addDays(year, month, day, 6)[2];

    displayWeekSel
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 40)
      .attr("y", "1em")
      .style("font-size", "18pt")
      .attr("fill", "white")
      .text(`${day}-${lastday}`);
    displayWeekSel
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 40)
      .attr("y", "2.2em")
      .style("font-size", "18pt")
      .attr("fill", "white")
      .text(
        [
          "JAN",
          "FEV",
          "MAR",
          "ABR",
          "MAI",
          "JUN",
          "JUL",
          "AGO",
          "SET",
          "OUT",
          "NOV",
          "DEZ"
        ][+month - 1]
      );
    displayWeekSel
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 40)
      .attr("y", "4.8em")
      .style("font-size", "12pt")
      .attr("fill", "white")
      .text(year);
  };
  displayWeek();

  //
  // The arc plot
  //
  const displayArcplotSel = d3
    .select(container)
    .append("g")
    .attr("transform", `translate(${arcPlotX},${arcPlotY})`);
  const displayArcplot = () => {
    displayArcplotSel.selectAll("svg").remove();
    const data = getSeriesData(chart.highlightWeek);
    displayArcplotSel.node().append(
      arcplot(data, {
        extent: [0, 25],
        textColor: "white",
        fontSize: 12,
        width: arcplotWidth,
        height: arcplotHeight,
        minRadius: arcplotHeight * 0.25,
        maxRadius: arcplotHeight * 0.4,
        units: "%"
      })
    );
  };
  displayArcplot();

  async function update(wk) {
    // for (;;) {
    //   for (let wk = 0; wk + nWeeks < 325; wk++) {
    munDisplay.highlight(codigo);
    const nballs = ~~poluicaoBallScale(poluicaoMap.get(chart.highlightWeek));
    //
    ballDisplay.setBalls(nballs);
    displayArcplot();
    let highlightWeek = chart.highlightWeek;
    for (let delta = 0; delta < 1; delta += 1 / 20) {
      if (chart.highlightWeek != highlightWeek) {
        const nballs = ~~poluicaoBallScale(
          poluicaoMap.get(chart.highlightWeek)
        );
        ballDisplay.setBalls(nballs);
        displayWeek();
        displayArcplot();
        highlightWeek = chart.highlightWeek;
      }
      chart.setMinTime(wk + delta);
      drawBaby();
      await Promises.delay(50);
    }
  }
  mainWindow.newseries = () => {
    loadNextSeries();
    createChart();
  };
  mainWindow.update = update;
  return mainWindow;
}
)}

function _currentSeries(){return(
0
)}

function _getSeries(){return(
function getSeries(s1, s2, startWeek, nWeeks = 41) {
  const endWeek = startWeek + nWeeks;
  const weekInRange = (obj) => obj.Semana >= startWeek && obj.Semana < endWeek;
  const series1 = s1.filter(weekInRange);
  const series2 = s2.filter(weekInRange);
  return { series1, series2 };
}
)}

function _addDays(){return(
function addDays(yy, mm, dd, days) {
  var result = new Date(yy, mm, dd);
  result.setDate(+dd + days);
  return [result.getFullYear(), result.getMonth(), result.getDate()];
}
)}

function _seriesCache(){return(
[]
)}

function _weirdCodes(){return(
[]
)}

async function _fillCache($0,$1,currentSeriesSet,$2,Promises,CodigosValidos)
{
  $0.value.push({
    codigo: $1.value,
    series: currentSeriesSet
  });
  if (currentSeriesSet[0].length < 200 || currentSeriesSet[0][0].Semana != 0) {
    $2.value.push($1.value);
  }
  if ($0.value.length > 10) {
    $0.value.shift();
  }
  //mutable seriesCache = mutable seriesCache; // Reactive touch
  await Promises.delay(50000); // Await 5 seconds for the next fetch
  const cod = CodigosValidos.pop();
  CodigosValidos.unshift(cod);
  $1.value = +cod.CodMunicipio;
}


function _currentSeriesSet(pesoMedioTotal,pesoMedioPoucasConsultas,pesoMedioIdadeNaoIdeal,pesoMedioEscolaridadeBaixa,pesoMedioPretas,pesoMedioNaoCasadas,poluicao){return(
[
  pesoMedioTotal,
  pesoMedioPoucasConsultas,
  pesoMedioIdadeNaoIdeal,
  pesoMedioEscolaridadeBaixa,
  pesoMedioPretas,
  pesoMedioNaoCasadas,
  poluicao
]
)}

function _seriesTitles(){return(
[
  "total",
  "3 ou menos exames pré-natais",
  "Idade < 13 ou > 40 anos",
  "Fundamental incompleto ou sem estudo",
  "Pretas",
  "Sem vínculo conjugal"
]
)}

function _makeChartDisplay(htl,Plot){return(
function makeChartDisplay(options = {}) {
  const {
    width = 1000,
    dwidth = 100,
    height = 300,
    nWeeks = 41,
    firstWeek = 0,
    strokeColor = "black",
    fillColor = "white",
    domain = [2500, 3600],
    series1 = [],
    series2 = []
  } = options;
  const div = htl.html`<svg width = ${width} height=${height} >`;
  // div.style.background =
  //   "linear-gradient(0deg, rgba(232,106,0,1) 0%, rgba(232,106,0,1) 80%, rgba(0,0,0,1) 100%)";

  const maxVariation = (series1, series2, weekMin, weekMax) => {
    const series2Map = new Map(
      series2.map((obj) => [obj.Semana, obj.MediaPeso])
    );
    let diff = -Infinity;
    let week = -1;
    let day = "";
    let varPeso = -Infinity;
    let s1Peso, s2Peso;
    for (let { Semana, MediaPeso, Dia } of series1) {
      if (Semana < weekMin || Semana > weekMax) continue;
      if (series2Map.has(Semana)) {
        let MediaPeso2 = series2Map.get(Semana);
        let diff = MediaPeso - MediaPeso2;
        if (diff > varPeso)
          [week, varPeso, s1Peso, s2Peso, day] = [
            Semana,
            diff,
            MediaPeso,
            MediaPeso2,
            Dia
          ];
      }
    }
    return { week, s1Peso, s2Peso, day };
  };

  div.highlightWeek = 0;
  div.highlightDay = "";
  const makeMainChart = (startWeek, weeks) => {
    const endWeek = startWeek + weeks;
    const weekInRange = (obj) =>
      obj.Semana >= startWeek && obj.Semana < endWeek;
    const s1 = series1.filter(weekInRange);
    const s2 = series2.filter(weekInRange);

    //const { series1, series2 } = getSeries(startWeek, weeks);

    const spec = {
      width: width + dwidth,
      height,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      y: { domain, clamp: true, label: null },
      marks: [
        Plot.areaY(s1, {
          x: "Semana",
          y: "MediaPeso",
          curve: "catmull-rom",
          fill: "black"
        }),
        Plot.areaY(s2, {
          x: "Semana",
          y: "MediaPeso",
          curve: "catmull-rom",
          fill: "lightgray"
        })
      ]
    };

    const { week, s1Peso, s2Peso, day } = maxVariation(
      s1,
      s2,
      startWeek + weeks * 0.45,
      startWeek + weeks * 0.55
    );
    //console.assert(s1Peso !== undefined && s2Peso !== undefined);
    div.highlightWeek = week;
    div.highlightDay = day;
    if (s1Peso && s2Peso) {
      const percent = (((s1Peso - s2Peso) / s1Peso) * 100).toFixed(1) + "%";
      spec.marks.push(
        Plot.text([[week, s1Peso]], {
          text: () => s1Peso.toFixed(0) + "g",
          lineAnchor: "bottom",
          dy: -10,
          fill: fillColor,
          stroke: strokeColor,
          fontSize: 15
        }),
        Plot.text([[week, s2Peso]], {
          text: () => s2Peso.toFixed(0) + "g",
          lineAnchor: "top",
          dy: 10,
          fill: fillColor,
          stroke: strokeColor,
          fontSize: 15
        }),
        Plot.text([[week, (s1Peso + s2Peso) / 2]], {
          text: () => percent,
          textAnchor: "start",
          dx: 10,
          fill: fillColor,
          stroke: strokeColor,
          fontSize: 15
        }),
        Plot.line(
          [
            [week, s1Peso],
            [week, s2Peso]
          ],
          {
            stroke: "white",
            strokeDasharray: [3, 3]
          }
        )
      );
    }
    return Plot.plot(spec);
  };
  let startWeek = firstWeek;
  let mainChart = makeMainChart(startWeek, nWeeks);
  div.append(mainChart);
  function setMinTime(week) {
    let xscale = mainChart.scale("x");
    let offset;
    if (week >= startWeek && xscale.apply(week) < dwidth) {
      offset = -xscale.apply(week);
    } else {
      startWeek = ~~week;
      mainChart.remove();
      mainChart = makeMainChart(startWeek, nWeeks);
      div.append(mainChart);
      xscale = mainChart.scale("x");
      offset = -xscale.apply(week);
    }
    mainChart.setAttribute("x", offset);
  }
  div.setMinTime = setMinTime;
  return div;
}
)}

function _getOtherSeries(seriesTitles){return(
function (series) {
  const maps = [];
  const palette = [
    "rgba(255,255,255, 0.6)",
    "rgba(255,255,255, 0.6)", // 1
    "rgba(147,255,255, 0.5)", // 2
    "rgba(106,255,115, 0.5)", // 3
    "rgba(0,165,240, 0.5)",
    "rgba(37,69,208, 0.4)"
  ];
  for (let s of series) {
    maps.push(new Map(s.map((obj) => [obj.Semana, obj.MediaPeso])));
  }
  return function (semana) {
    const data = [];
    const total = maps[0].get(semana);
    for (let i = 1; i < 6; i++) {
      let obj = {
        name: seriesTitles[i],
        value: ((total - maps[i].get(semana)) / total) * 100 || 0,
        color: palette[i]
      };
      data.push(obj);
    }
    return data;
  };
}
)}

function _ballSimulation(d3,htl,forceBoundary,createSimplexNoise){return(
function (options = {}) {
  const { width = 800, height = 600, maxBalls = 200 } = options;
  const avgDist = Math.sqrt((width * height) / maxBalls);

  const points = d3
    .range(maxBalls)
    .map(() => [Math.random() * width, Math.random() * height]);
  const display = htl.html`<svg width=${width} height=${height} style="background:black;">
    <defs>
     <radialGradient id="grad">
       <stop offset="0%" stop-color="rgba(232,227,0,0.9)"/>
	    <stop offset="40%" stop-color="rgba(232,227,0,0.7)"/>
      <stop offset="60%" stop-color="rgba(232,227,0,0.5)"/>
      <stop offset="100%" stop-color="rgba(223,227,0,0)"/>
    </radialGradient>
   </defs>
  <svg>`;

  const nodes = points.map(([x, y]) => ({ x, y }));
  const r = avgDist / 2;
  const rdisplay = r / 2;
  const svg = d3.select(display);
  let balls = svg
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", rdisplay)
    .attr("fill", "url(#grad)");
  const update = () => balls.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  update();
  let simulation,
    simulationIdle = null;

  function setBalls(nballs) {
    const nodesSubset = nodes.slice(0, nballs);
    const fb = forceBoundary(
        -width * 0.1,
        -height * 0.1,
        width * 1.1,
        height * 1.1
      ).strength(0.005),
      fmb = d3.forceManyBody().strength(-10),
      fcol = d3.forceCollide(r * 1.5).iterations(1),
      fcen = d3.forceCenter(width / 2, height / 2).strength(1.2);
    if (simulationIdle) {
      clearInterval(simulationIdle);
      // simulationIdle.stop();
      simulationIdle = null;
    }
    let noisex, noisey;
    const makeNoise = () => {
      noisex = createSimplexNoise({
        xScaleLog: -7,
        yScaleLog: -7,
        octaves: 3,
        rand: d3.randomLcg(Math.random())
      });
      noisey = createSimplexNoise({
        xScaleLog: -7,
        yScaleLog: -7,
        octaves: 3,
        rand: d3.randomLcg(Math.random())
      });
    };
    const makeIdleSim = () => {
      makeNoise();
      simulationIdle = setInterval(() => {
        for (let node of nodesSubset) {
          let { x, y } = node;
          let dx = noisex(x, y);
          let dy = noisey(x, y);
          node.x += dx;
          node.y += dy;
        }
        makeNoise();
        update();
      }, 50);
    };
    simulation = d3
      .forceSimulation(nodesSubset)
      .alphaDecay(1 - Math.pow(0.001, 1 / 400))
      .force("boundary", fb)
      .force("manybody", fmb)
      .force("collide", fcol)
      .force("center", fcen)
      .on("tick", update)
      .on("end", () => {
        makeIdleSim();
      })
      .restart();
    balls = svg
      .selectAll("circle")
      .data(nodesSubset)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("opacity", 0)
            .transition()
            .duration(2000)
            .attr("opacity", 1),
        (update) => update,
        (exit) =>
          exit
            .transition()
            .duration(2000)
            .attr("opacity", 0)
            .on("end", () => exit.remove())
      )
      .attr("r", r)
      .attr("fill", "url(#grad)");
  }
  display.setBalls = setBalls;
  return display;
}
)}

async function _UF(FileAttachment)
{
  const cod_uf = await FileAttachment("uf.csv").csv();
  let cod_to_uf = new Map(cod_uf.map(({ Codigo, UF }) => [+Codigo, UF]));
  return (cod) => cod_to_uf.get(~~(+cod / 10000));
}


function _21(UF){return(
UF(353340)
)}

function _displayMunicipios(htl,MunicipiosPorPoluicao,UF){return(
function displayMunicipios(options = {}) {
  let { width = 200, height = 600, municipio = 353440 } = options;
  const container = htl.html`<div>`;
  Object.assign(container.style, {
    width: `${width}px`,
    height: `${height}px`,
    background: "gray",
    overflow: "hidden"
    //margin: "10px"
  });
  const div = htl.html`<div class=tabela >`;
  Object.assign(div.style, {
    width: `${width - 20}px`,
    height: `${height - 20}px`,
    background: "black",
    overflow: "hidden",
    margin: 0,
    padding: "10px"
  });
  container.append(div);
  const title = htl.html`<div>MUNICÍPIOS BRASILEIROS ORDENADOS POR ÍNDICE DE POLUIÇÃO ATMOSFÉRICA`;
  Object.assign(title.style, {
    fontSize: "13px",
    height: "70px"
  });
  const divTabela = htl.html`<div>`;
  Object.assign(divTabela.style, {
    height: `calc(100% - 70px)`,
    maxHeight: `calc(100% - 70px)`,
    overflowX: "hidden",
    overflowY: "hidden"
  });
  const contents = htl.html`<table class="municipios">`;
  divTabela.append(contents);
  Object.assign(contents.style, {
    fontSize: "9pt"
  });
  let i = 0;
  for (let { CodMunicipio, NomeMunicipio } of MunicipiosPorPoluicao) {
    contents.append(
      htl.html`<tr><td>${++i}</td><td>${NomeMunicipio} (${UF(
        CodMunicipio
      )})</td></tr>`
    );
  }

  div.append(title, divTabela);
  const highlight = (cod) => {
    let i = 0;
    for (let { CodMunicipio } of MunicipiosPorPoluicao) {
      if (CodMunicipio == municipio)
        contents.children[i].setAttribute("class", null);
      if (CodMunicipio == cod) {
        contents.children[i].scrollIntoView({ block: "center" });
        contents.children[i].setAttribute("class", "highlight");
      }
      i++;
    }
    municipio = cod;
  };
  container.highlight = highlight;
  return container;
}
)}

async function _styles(htl,FileAttachment){return(
htl.html`
<style> 
@font-face {
    font-family: mainFont;
    src: url(${await FileAttachment("Andale Mono.ttf").url()});
}
svg, div.tabela, table.municipios {
    color: #FCFFC4;
    font-family: mainFont;
}
div.tabela {
  background: black
}
table.municipios tr , table.municipios tr td{ 
    border:0;
    border-bottom:0;
    font-family: mainFont;
    color: #FCFFC4;
}
table.municipios tr.highlight {
  font-size: 15pt;
}
`
)}

function _25(md){return(
md`## Data`
)}

function _pesoMedioTotal(codigoSelecionado,__query,db,invalidation){return(
__query.sql(db,invalidation,"db")`select avg(Peso) as MediaPeso, floor(date_diff('day', DATE '2013-01-01', cast (Data as Date)) / 7) as Semana,  strftime(DATE '2013-01-01' + cast(Semana*7 as INTEGER), '%d/%m/%Y') as Dia  from sinasc where CodMunicipio = ${codigoSelecionado} group by Semana order by Semana 
-- select CodMunicipio, cast(Data as Date) as Data, strftime('%Y-%W', cast(Data as Date)) as AnoSemana, Peso, Sexo, RacaCorMae, EscolaridadeMae, IdadeMae, Consultas from sinasc`
)}

function _pesoMedioPoucasConsultas(codigoSelecionado,__query,db,invalidation){return(
__query.sql(db,invalidation,"db")`select avg(Peso) as MediaPeso, floor(date_diff('day', DATE '2013-01-01', cast (Data as Date)) / 7) as Semana from sinasc where CodMunicipio = ${codigoSelecionado} and Consultas <= 3 group by Semana order by Semana `
)}

function _pesoMedioPretas(codigoSelecionado,__query,db,invalidation){return(
__query.sql(db,invalidation,"db")`select avg(Peso) as MediaPeso, floor(date_diff('day', DATE '2013-01-01', cast (Data as Date)) / 7) as Semana from sinasc where CodMunicipio = ${codigoSelecionado} and RacaCorMae = 2 group by Semana order by Semana `
)}

function _pesoMedioEscolaridadeBaixa(codigoSelecionado,__query,db,invalidation){return(
__query.sql(db,invalidation,"db")`select avg(Peso) as MediaPeso, floor(date_diff('day', DATE '2013-01-01', cast (Data as Date)) / 7) as Semana from sinasc where CodMunicipio = ${codigoSelecionado} and EscolaridadeMae <= 2 group by Semana order by Semana `
)}

function _pesoMedioIdadeNaoIdeal(codigoSelecionado,__query,db,invalidation){return(
__query.sql(db,invalidation,"db")`select avg(Peso) as MediaPeso, floor(date_diff('day', DATE '2013-01-01', cast (Data as Date)) / 7) as Semana from sinasc where CodMunicipio = ${codigoSelecionado} and (IdadeMae < 14 or IdadeMae > 40) group by Semana order by Semana `
)}

function _pesoMedioNaoCasadas(codigoSelecionado,__query,db,invalidation){return(
__query.sql(db,invalidation,"db")`select avg(Peso) as MediaPeso, floor(date_diff('day', DATE '2013-01-01', cast (Data as Date)) / 7) as Semana from sinasc where CodMunicipio = ${codigoSelecionado} and (EstadoCivilMae != 2) group by Semana order by Semana `
)}

function _poluicao(codigoSelecionado,__query,db,invalidation){return(
__query.sql(db,invalidation,"db")`select floor(date_diff('day', DATE '2013-01-01', cast (Data as Date)) / 7) as Semana , avg(Value) as MediaPoluicao from pm25 where CodMunicipio = ${codigoSelecionado} group by Semana order by Semana`
)}

function _db(DuckDBClient,FileAttachment){return(
DuckDBClient.of({
  pm25: FileAttachment("pm25@1.parquet"),
  sinasc:FileAttachment("sinasc-20240303.parquet"),
  municipios:FileAttachment("municipios.csv")
})
)}

function _34(md){return(
md`### These queries were saved as csv attachments`
)}

async function _CodigosValidos(FileAttachment,d3)
{
  let cv = await FileAttachment("CodigosValidos@1.csv").csv();
  let codigos = [];
  const weird = new Set([150020, 211280, 310160, 352930, 150020]);
  let n = 100;
  for (let { CodMunicipio } of cv) {
    if (!weird.has(CodMunicipio)) {
      codigos.push({ CodMunicipio });
      n--;
      if (n == 0) break;
    }
  }
  d3.shuffle(codigos);
  return codigos;
}


function _MunicipiosPorPoluicao(__query,FileAttachment,invalidation){return(
__query(FileAttachment("MunicipiosPorPoluicao.csv"),{from:{table:"MunicipiosPorPoluicao"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _queryToArray(){return(
function queryToArray(queryResult) {
  return queryResult.map((row) => Object.assign({}, row));
}
)}

function _debug(){return(
0
)}

function _42(md){return(
md`## Imports`
)}

function _forceBoundary(require){return(
require("d3-force-boundary")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["pm25@1.parquet", {url: new URL("./files/15a5026c5dd9fecea969cdf93e3ba5deab1ee8f8579bbc46efbad10d1cf214996678acf8ce1461abf29f56f2416c220cc73e315b25443c62b0053598940207ee.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["municipios.csv", {url: new URL("./files/8ac31fea26119fddbb9068943859cc1d46801e11bab6be92b3f8bbb4e02539a02f6a08d73ab0fd85d9d27a125fad1eb694a9e938960ec9077892c0951bef944f.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["Andale Mono.ttf", {url: new URL("./files/dff5fea983d57ae0258c3e79d7f5a7760b09b7024182c09ff101da032db73723c67c73727e88882550daea1c9dd11fc513c65a688d967da9c35d96818e86de79.ttf", import.meta.url), mimeType: "font/ttf", toString}],
    ["sinasc-20240303.parquet", {url: new URL("./files/aa004875534401996879a853a57b7d041a9f8d0e197df8e2b77fe1cc6ed604a568fde83a83e2fd89353b17769b51d9b8b30855e1d7a87d51f435fe5c88f03800.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["MunicipiosPorPoluicao.csv", {url: new URL("./files/032523d52059d6e646392bf084b99b385ee06ba3ebe49db6b3d743090745799aefb6b07400c1e7526e2666c469e2856d7a01b3210075e1af1c3981b4bc289419.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["CodigosValidos@1.csv", {url: new URL("./files/790908123c6f42f4e579da83c232805737dc0fb251a16edda0a7f565660b790c74b9498a91d8b6abf4e33b541a3d6e8dc5b07a7122a30da97c09b35fc99a1c76.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["uf.csv", {url: new URL("./files/cfaada522ed65c8760177304b7fdcb95a622acc2b973ae1a124a2d7fc4a41004ce9d9aadb05839e020517f4032b965ed62e2fb962a0ed0f0a5896f77528d8211.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("vizWindow")).define("vizWindow", ["htl","mutable seriesCache","Promises","viz"], _vizWindow);
  main.variable(observer("viewof pause")).define("viewof pause", ["Inputs"], _pause);
  main.variable(observer("pause")).define("pause", ["Generators", "viewof pause"], (G, _) => G.input(_));
  main.variable(observer("mainLoop")).define("mainLoop", ["vizWindow","pause","Promises"], _mainLoop);
  main.define("initial codigoSelecionado", _codigoSelecionado);
  main.variable(observer("mutable codigoSelecionado")).define("mutable codigoSelecionado", ["Mutable", "initial codigoSelecionado"], (M, _) => new M(_));
  main.variable(observer("codigoSelecionado")).define("codigoSelecionado", ["mutable codigoSelecionado"], _ => _.generator);
  main.variable(observer("viz")).define("viz", ["htl","mutable seriesCache","getOtherSeries","ballSimulation","d3","babyCanvas","displayMunicipios","makeChartDisplay","addDays","arcplot","drawBaby","Promises"], _viz);
  main.variable(observer("currentSeries")).define("currentSeries", _currentSeries);
  main.variable(observer("getSeries")).define("getSeries", _getSeries);
  main.variable(observer("addDays")).define("addDays", _addDays);
  main.define("initial seriesCache", _seriesCache);
  main.variable(observer("mutable seriesCache")).define("mutable seriesCache", ["Mutable", "initial seriesCache"], (M, _) => new M(_));
  main.variable(observer("seriesCache")).define("seriesCache", ["mutable seriesCache"], _ => _.generator);
  main.define("initial weirdCodes", _weirdCodes);
  main.variable(observer("mutable weirdCodes")).define("mutable weirdCodes", ["Mutable", "initial weirdCodes"], (M, _) => new M(_));
  main.variable(observer("weirdCodes")).define("weirdCodes", ["mutable weirdCodes"], _ => _.generator);
  main.variable(observer("fillCache")).define("fillCache", ["mutable seriesCache","mutable codigoSelecionado","currentSeriesSet","mutable weirdCodes","Promises","CodigosValidos"], _fillCache);
  main.variable(observer("currentSeriesSet")).define("currentSeriesSet", ["pesoMedioTotal","pesoMedioPoucasConsultas","pesoMedioIdadeNaoIdeal","pesoMedioEscolaridadeBaixa","pesoMedioPretas","pesoMedioNaoCasadas","poluicao"], _currentSeriesSet);
  main.variable(observer("seriesTitles")).define("seriesTitles", _seriesTitles);
  main.variable(observer("makeChartDisplay")).define("makeChartDisplay", ["htl","Plot"], _makeChartDisplay);
  main.variable(observer("getOtherSeries")).define("getOtherSeries", ["seriesTitles"], _getOtherSeries);
  main.variable(observer("ballSimulation")).define("ballSimulation", ["d3","htl","forceBoundary","createSimplexNoise"], _ballSimulation);
  main.variable(observer("UF")).define("UF", ["FileAttachment"], _UF);
  main.variable(observer()).define(["UF"], _21);
  main.variable(observer("displayMunicipios")).define("displayMunicipios", ["htl","MunicipiosPorPoluicao","UF"], _displayMunicipios);
  main.variable(observer("styles")).define("styles", ["htl","FileAttachment"], _styles);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("pesoMedioTotal")).define("pesoMedioTotal", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioTotal);
  main.variable(observer("pesoMedioPoucasConsultas")).define("pesoMedioPoucasConsultas", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioPoucasConsultas);
  main.variable(observer("pesoMedioPretas")).define("pesoMedioPretas", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioPretas);
  main.variable(observer("pesoMedioEscolaridadeBaixa")).define("pesoMedioEscolaridadeBaixa", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioEscolaridadeBaixa);
  main.variable(observer("pesoMedioIdadeNaoIdeal")).define("pesoMedioIdadeNaoIdeal", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioIdadeNaoIdeal);
  main.variable(observer("pesoMedioNaoCasadas")).define("pesoMedioNaoCasadas", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioNaoCasadas);
  main.variable(observer("poluicao")).define("poluicao", ["codigoSelecionado","__query","db","invalidation"], _poluicao);
  main.variable(observer("db")).define("db", ["DuckDBClient","FileAttachment"], _db);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer("CodigosValidos")).define("CodigosValidos", ["FileAttachment","d3"], _CodigosValidos);
  main.variable(observer("MunicipiosPorPoluicao")).define("MunicipiosPorPoluicao", ["__query","FileAttachment","invalidation"], _MunicipiosPorPoluicao);
  main.variable(observer("queryToArray")).define("queryToArray", _queryToArray);
  main.define("initial debug", _debug);
  main.variable(observer("mutable debug")).define("mutable debug", ["Mutable", "initial debug"], (M, _) => new M(_));
  main.variable(observer("debug")).define("debug", ["mutable debug"], _ => _.generator);
  main.variable(observer()).define(["md"], _42);
  const child1 = runtime.module(define1);
  main.import("createSimplexNoise", child1);
  main.variable(observer("forceBoundary")).define("forceBoundary", ["require"], _forceBoundary);
  const child2 = runtime.module(define2);
  main.import("arcplot", child2);
  const child3 = runtime.module(define3);
  main.import("babyCanvas", child3);
  main.import("drawBaby", child3);
  return main;
}
