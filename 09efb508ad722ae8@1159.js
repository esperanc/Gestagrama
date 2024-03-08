import define1 from "./b5cb6febc00bdfdb@116.js";
import define2 from "./25091beb60cd303a@78.js";
import define3 from "./29bcfd3cb125d83f@218.js";

function _1(md){return(
md`# Gestagrama
## Paisagem da desigualdade
`
)}

function _displayWindow(width,htl)
{
  const height = (width * 9) / 16;
  const mainWindow = htl.html`<div>`;
  Object.assign(mainWindow.style, {
    position: "relative",
    background: "lightgray",
    width: width + "px",
    height: height + "px",
    margin: 0,
    padding: 0
  });
  return mainWindow;
}


async function* _viz(width,htl,makeChartDisplay,ballSimulation,babyCanvas,displayMunicipios,poluicao,d3,addDays,getOtherSeries,arcplot,codigoSelecionado,drawBaby,Promises,$0)
{
  const nWeeks = 41;
  //const width = 1024;
  const height = (width * 9) / 16;
  const topHeight = height * 0.6;
  const munWidth = 200;
  const arcplotWidth = width * 0.6;
  const arcplotHeight = height * 0.7;
  const arcPlotY = height * 0.02;
  const arcPlotX = (width - arcplotWidth - munWidth) / 2;
  const bottomHeight = height - topHeight;
  const mainWindow = htl.html`<div>`;
  Object.assign(mainWindow.style, {
    position: "relative",
    width: width + "px",
    height: height + "px",
    margin: 0,
    padding: 0
  });
  yield mainWindow;
  const container = htl.html`<svg width=${width} height=${height} style ="background:black;">
    <defs>
     <linearGradient id="pagegrad" gradientTransform="rotate(90)">
       <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="90%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="93%" stop-color="rgba(0,0,0,0.1)"/> 
      <stop offset="97.5%" stop-color="rgba(0,0,0,0.4)"/> 
      <stop offset="100%" stop-color="rgba(0,0,0,0.8)"/>
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

  const chart = makeChartDisplay({ width, height: bottomHeight, nWeeks });
  chart.setAttribute("y", topHeight);

  const maxBalls = 500;
  const ballDisplay = ballSimulation({
    width,
    height: topHeight * 1.2,
    maxBalls
  });

  const pagegradient = htl.svg`<rect width=${width} height=${height} fill="url(#pagegrad)" />`;

  const titles = htl.svg`
    <text x=${
      (width - munWidth) / 2
    } y=1.5em text-anchor="middle" font-size="13pt" fill="white" 
    >Que característica da mãe diminui o peso dos recém nascidos?</text>
    <text x=1em y=${topHeight + 20} font-size="13pt" fill="white" 
    >Peso médio de todos os nascidos vivos</text>
    <text x=1em y=${height - 20} font-size="13pt" fill="white" 
    >Peso médio de nascidos de mães com 3 ou menos exames pré-natais</text>
  `;

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

  const munDisplay = displayMunicipios({ width: munWidth, height });

  Object.assign(munDisplay.style, {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 0,
    margin: 0
  });
  // const munDisplaySvg = htl.svg`<g transform="translate(${
  //   width - munWidth
  // },0)"  >
  // <rect x="-10" width="${munWidth}" height="${height}" fill="black"/>
  //   <foreignObject x=0 y=0 width=${munWidth} height=${height} >
  //   ${munDisplay}
  //   </foreignObject>

  //   </g>`;

  container.append(ballDisplay, chart, pagegradient, titles, baby);
  mainWindow.append(container, munDisplay);

  const poluicaoMap = new Map(
    poluicao.map(({ Semana, MediaPoluicao }) => [Semana, MediaPoluicao])
  );
  const poluicaoBallScale = d3
    .scaleLinear()
    .domain([0, 150])
    .range([2, maxBalls]);
  const displayWeekSel = d3
    .select(container)
    .append("g")
    .attr("transform", "translate(20,20)");
  const displayArcplotSel = d3
    .select(container)
    .append("g")
    .attr("transform", `translate(${arcPlotX},${arcPlotY})`);

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

  const displayArcplot = () => {
    displayArcplotSel.selectAll("svg").remove();
    const data = getOtherSeries(chart.highlightWeek);
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
  for (;;) {
    for (let wk = 0; wk + nWeeks < 325; wk++) {
      munDisplay.highlight(codigoSelecionado);
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
    $0.value++;
  }
}


function _loadingCounter(){return(
0
)}

async function _waitingScreen(htl,displayWindow,$0,Promises)
{
  let waiting = htl.html`<div>Carregando `;
  Object.assign(waiting.style, {
    position: "absolute",
    width: "150px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "10px"
  });
  displayWindow.append(waiting);
  let counter = 0;
  while ($0.value < 6) {
    counter = (counter + 1) % 4;
    const howmany = htl.html`<span>${"....".slice(0, counter + 1)}`;
    waiting.append(howmany);
    await Promises.delay(500);
    howmany.remove();
  }
}


function _mapVizToDisplay(waitingScreen,viz,displayWindow,invalidation)
{
  waitingScreen;
  const vizWindow = viz;
  displayWindow.append(vizWindow);
  invalidation.then(() => vizWindow.remove());
}


function _runs(){return(
0
)}

async function* _changeMunicipio(CodigosValidos,$0,$1,Promises)
{
  function pickMunicipio() {
    let n = ~~(CodigosValidos.length * Math.random());
    let codigo = +CodigosValidos[n].CodMunicipio;
    return codigo;
  }
  for (;;) {
    let k = $0.value;
    let codigo = pickMunicipio();
    $1.value = codigo;
    while ($0.value == k) {
      yield codigo;
      await Promises.delay(200);
    }
  }
}


function _codigoSelecionado(){return(
431720
)}

function _currentSeries(){return(
0
)}

function _getSeries(pesoMedioTotal,pesoMedioPoucasConsultas){return(
function getSeries(startWeek, nWeeks = 41) {
  const endWeek = startWeek + nWeeks;
  const weekInRange = (obj) => obj.Semana >= startWeek && obj.Semana < endWeek;
  const series1 = pesoMedioTotal.filter(weekInRange);
  const series2 = pesoMedioPoucasConsultas.filter(weekInRange);
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

function _series(pesoMedioTotal,pesoMedioPoucasConsultas,pesoMedioIdadeNaoIdeal,pesoMedioEscolaridadeBaixa,pesoMedioPretas,pesoMedioNaoCasadas){return(
[
  pesoMedioTotal,
  pesoMedioPoucasConsultas,
  pesoMedioIdadeNaoIdeal,
  pesoMedioEscolaridadeBaixa,
  pesoMedioPretas,
  pesoMedioNaoCasadas
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

function _makeChartDisplay(htl,getSeries,Plot){return(
function makeChartDisplay(options = {}) {
  const {
    width = 1000,
    dwidth = 100,
    height = 300,
    nWeeks = 41,
    firstWeek = 0,
    strokeColor = "black",
    fillColor = "white"
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
    const { series1, series2 } = getSeries(startWeek, weeks);

    const spec = {
      width: width + dwidth,
      height,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      y: { domain: [2500, 3600], clamp: true, label: null },
      marks: [
        Plot.areaY(series1, {
          x: "Semana",
          y: "MediaPeso",
          curve: "catmull-rom",
          fill: "black"
        }),
        Plot.areaY(series2, {
          x: "Semana",
          y: "MediaPeso",
          curve: "catmull-rom",
          fill: "lightgray"
        })
      ]
    };

    const { week, s1Peso, s2Peso, day } = maxVariation(
      series1,
      series2,
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
        // Plot.text([[week, 2900]], {
        //   text: () => day,
        //   lineAnchor: "bottom",
        //   dy: -5,
        //   fill: "black",
        //   stroke: "white",
        //   fontSize: 20
        // }),
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

function _getOtherSeries(series,seriesTitles)
{
  const maps = [];
  const palette = [
    "rgba(32,166,61, 0.8)",
    "rgba(42,119,98, 0.8)",
    "rgba(48,79,133, 0.8)",
    "rgba(54,48,161, 0.8)",
    "rgba(59,26,182, 0.8)"
  ];
  for (let s of series) {
    maps.push(new Map(s.map((obj) => [obj.Semana, obj.MediaPeso])));
  }
  return function (semana) {
    const data = [];
    const total = maps[0].get(semana);
    for (let i = 1; i < maps.length; i++) {
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
  const svg = d3.select(display);
  let balls = svg
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", r)
    .attr("fill", "url(#grad)");
  const update = () => balls.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  update();
  let simulation,
    simulationIdle = null;

  function setBalls(nballs) {
    const nodesSubset = nodes.slice(0, nballs);
    const fb = forceBoundary(
        -width * 0.2,
        -height * 0.2,
        width * 1.2,
        height * 1.2
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

function _displayMunicipios(htl,MunicipiosPorPoluicao,codigoSelecionado){return(
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
  for (let { NomeMunicipio } of MunicipiosPorPoluicao) {
    contents.append(
      htl.html`<tr><td>${++i}</td><td>${NomeMunicipio}</td></tr>`
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
  setTimeout(() => highlight(codigoSelecionado), 10);
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

function _21(md){return(
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

function _30(pesoMedioPretas,$0)
{
  pesoMedioPretas;
  $0.value++;
}


function _31(db,$0)
{
  db;
  $0.value++;
}


function _32(pesoMedioEscolaridadeBaixa,$0)
{
  pesoMedioEscolaridadeBaixa;
  $0.value++;
}


function _33(pesoMedioIdadeNaoIdeal,$0)
{
  pesoMedioIdadeNaoIdeal;
  $0.value++;
}


function _34(pesoMedioNaoCasadas,$0)
{
  pesoMedioNaoCasadas;
  $0.value++;
}


function _35(pesoMedioPoucasConsultas,$0)
{
  pesoMedioPoucasConsultas;
  $0.value++;
}


function _36(md){return(
md`### These queries were saved as csv attachments`
)}

function _CodigosValidos(__query,FileAttachment,invalidation){return(
__query(FileAttachment("CodigosValidos.csv"),{from:{table:"CodigosValidos"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

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

function _43(md){return(
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
    ["CodigosValidos.csv", {url: new URL("./files/0d8cef7cef2f8492fb63218b4a40bf1e8a13678df717a55b382af420cd92346b6410a09c2b61577c755ccb0984a2ed7304356859faab4d4336654b1d25d86ccb.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("displayWindow")).define("displayWindow", ["width","htl"], _displayWindow);
  main.variable(observer("viz")).define("viz", ["width","htl","makeChartDisplay","ballSimulation","babyCanvas","displayMunicipios","poluicao","d3","addDays","getOtherSeries","arcplot","codigoSelecionado","drawBaby","Promises","mutable runs"], _viz);
  main.define("initial loadingCounter", _loadingCounter);
  main.variable(observer("mutable loadingCounter")).define("mutable loadingCounter", ["Mutable", "initial loadingCounter"], (M, _) => new M(_));
  main.variable(observer("loadingCounter")).define("loadingCounter", ["mutable loadingCounter"], _ => _.generator);
  main.variable(observer("waitingScreen")).define("waitingScreen", ["htl","displayWindow","mutable loadingCounter","Promises"], _waitingScreen);
  main.variable(observer("mapVizToDisplay")).define("mapVizToDisplay", ["waitingScreen","viz","displayWindow","invalidation"], _mapVizToDisplay);
  main.define("initial runs", _runs);
  main.variable(observer("mutable runs")).define("mutable runs", ["Mutable", "initial runs"], (M, _) => new M(_));
  main.variable(observer("runs")).define("runs", ["mutable runs"], _ => _.generator);
  main.variable(observer("changeMunicipio")).define("changeMunicipio", ["CodigosValidos","mutable runs","mutable codigoSelecionado","Promises"], _changeMunicipio);
  main.define("initial codigoSelecionado", _codigoSelecionado);
  main.variable(observer("mutable codigoSelecionado")).define("mutable codigoSelecionado", ["Mutable", "initial codigoSelecionado"], (M, _) => new M(_));
  main.variable(observer("codigoSelecionado")).define("codigoSelecionado", ["mutable codigoSelecionado"], _ => _.generator);
  main.variable(observer("currentSeries")).define("currentSeries", _currentSeries);
  main.variable(observer("getSeries")).define("getSeries", ["pesoMedioTotal","pesoMedioPoucasConsultas"], _getSeries);
  main.variable(observer("addDays")).define("addDays", _addDays);
  main.variable(observer("series")).define("series", ["pesoMedioTotal","pesoMedioPoucasConsultas","pesoMedioIdadeNaoIdeal","pesoMedioEscolaridadeBaixa","pesoMedioPretas","pesoMedioNaoCasadas"], _series);
  main.variable(observer("seriesTitles")).define("seriesTitles", _seriesTitles);
  main.variable(observer("makeChartDisplay")).define("makeChartDisplay", ["htl","getSeries","Plot"], _makeChartDisplay);
  main.variable(observer("getOtherSeries")).define("getOtherSeries", ["series","seriesTitles"], _getOtherSeries);
  main.variable(observer("ballSimulation")).define("ballSimulation", ["d3","htl","forceBoundary","createSimplexNoise"], _ballSimulation);
  main.variable(observer("displayMunicipios")).define("displayMunicipios", ["htl","MunicipiosPorPoluicao","codigoSelecionado"], _displayMunicipios);
  main.variable(observer("styles")).define("styles", ["htl","FileAttachment"], _styles);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("pesoMedioTotal")).define("pesoMedioTotal", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioTotal);
  main.variable(observer("pesoMedioPoucasConsultas")).define("pesoMedioPoucasConsultas", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioPoucasConsultas);
  main.variable(observer("pesoMedioPretas")).define("pesoMedioPretas", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioPretas);
  main.variable(observer("pesoMedioEscolaridadeBaixa")).define("pesoMedioEscolaridadeBaixa", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioEscolaridadeBaixa);
  main.variable(observer("pesoMedioIdadeNaoIdeal")).define("pesoMedioIdadeNaoIdeal", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioIdadeNaoIdeal);
  main.variable(observer("pesoMedioNaoCasadas")).define("pesoMedioNaoCasadas", ["codigoSelecionado","__query","db","invalidation"], _pesoMedioNaoCasadas);
  main.variable(observer("poluicao")).define("poluicao", ["codigoSelecionado","__query","db","invalidation"], _poluicao);
  main.variable(observer("db")).define("db", ["DuckDBClient","FileAttachment"], _db);
  main.variable(observer()).define(["pesoMedioPretas","mutable loadingCounter"], _30);
  main.variable(observer()).define(["db","mutable loadingCounter"], _31);
  main.variable(observer()).define(["pesoMedioEscolaridadeBaixa","mutable loadingCounter"], _32);
  main.variable(observer()).define(["pesoMedioIdadeNaoIdeal","mutable loadingCounter"], _33);
  main.variable(observer()).define(["pesoMedioNaoCasadas","mutable loadingCounter"], _34);
  main.variable(observer()).define(["pesoMedioPoucasConsultas","mutable loadingCounter"], _35);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer("CodigosValidos")).define("CodigosValidos", ["__query","FileAttachment","invalidation"], _CodigosValidos);
  main.variable(observer("MunicipiosPorPoluicao")).define("MunicipiosPorPoluicao", ["__query","FileAttachment","invalidation"], _MunicipiosPorPoluicao);
  main.variable(observer("queryToArray")).define("queryToArray", _queryToArray);
  main.define("initial debug", _debug);
  main.variable(observer("mutable debug")).define("mutable debug", ["Mutable", "initial debug"], (M, _) => new M(_));
  main.variable(observer("debug")).define("debug", ["mutable debug"], _ => _.generator);
  main.variable(observer()).define(["md"], _43);
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
