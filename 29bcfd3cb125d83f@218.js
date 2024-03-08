function _1(md){return(
md`# Floating baby`
)}

function _babyCanvas(html){return(
html`<canvas width=500 height=500>`
)}

function _drawBaby(mat4,glmatrix,regl,drawBkg,drawFaces,drawPoints,drawClouds)
{
  let modelview = mat4.identity([]);
  const vec3 = glmatrix.vec3;
  let now = Date.now();
  return function () {
    regl.clear({
      color: [0, 0, 0, 0],
      depth: 1
    });
    const axis = vec3.normalize(
      [],
      [Math.random() - 0.5, Math.random(), Math.random() - 0.5]
    );
    let iTime = (Date.now() - now) / 1000;
    mat4.rotate(modelview, modelview, 0.004, axis);
    drawBkg();
    drawFaces({ modelview, time: iTime });
    drawPoints({ modelview, time: iTime });
    drawClouds({ iTime });
  };
}


function* _draw(drawBaby)
{
  for (;;) {
    drawBaby();
    yield;
  }
}


function _drawPoints(boundingBox,babyObj,regl)
{
  let scale = 1.8 / Math.max(...boundingBox.size);
  let [cx, cy, cz] = boundingBox.center;
  let points = babyObj.pos.map(([x, y, z]) => [
    (x - cx) * scale,
    (y - cy) * scale,
    (z - cz) * scale
  ]);
  let normals = babyObj.avgVertexNormals; //.normal.slice(0, points.length);
  return regl({
    frag: `
  precision mediump float;
  varying vec3 vnormal;
  void main () {
    //if (vnormal.z < 0.) discard;
    vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
    if(dot(circCoord, circCoord) > 1.0){
        discard;
    }
    gl_FragColor = vec4(1.,1.,1.,1.);
  }`,
    vert: `
  attribute vec3 position;
  attribute vec3 normal;
  uniform float time;
  uniform mat4 modelview;
  varying vec3 vnormal;
  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}
  void main () {
    gl_PointSize = 3.+sin(noise(position)*1000.+time*5.)*2.;
    gl_Position = modelview * vec4(position, 1.0);
    vnormal = (modelview * vec4 (normal, 0.0)).xyz;
  }`,

    // These are the vertex attributes that will be passed
    // on to the vertex shader
    attributes: {
      position: points,
      normal: normals
    },

    uniforms: {
      modelview: regl.prop("modelview"),
      time: regl.prop("time")
    },

    // The depth buffer
    depth: {
      enable: true,
      mask: false
    },
    offset: 0,
    count: babyObj.pos.length,

    // Indices of vertices to be fed into the pipeline
    primitive: "points"
  });
}


function _drawFaces(boundingBox,babyObj,regl)
{
  let scale = 1.8 / Math.max(...boundingBox.size);
  let [cx, cy, cz] = boundingBox.center;
  let points = babyObj.pos.map(([x, y, z]) => [
    (x - cx) * scale,
    (y - cy) * scale,
    (z - cz) * scale
  ]);
  let normals = babyObj.avgVertexNormals;
  let faces = babyObj.faces;
  return regl({
    frag: `
  precision mediump float;
  varying vec3 vnormal;
  void main () {
    // float color = 0.1 + clamp(-vnormal.z,0.,1.);
    // gl_FragColor = vec4(color,color,color,1.);
    gl_FragColor = vec4(0.1,0.,0.,1.);
  }`,
    vert: `
  attribute vec3 position;
  attribute vec3 normal;
  uniform float time;
  uniform mat4 modelview;
  varying vec3 vnormal;
  
  void main () {
    gl_Position = modelview * vec4(position, 1.0);
    gl_Position.z += 0.01;
    vnormal = (modelview * vec4 (normal, 0.0)).xyz;
  }`,

    // These are the vertex attributes that will be passed
    // on to the vertex shader
    attributes: {
      position: points,
      normal: normals
    },

    uniforms: {
      modelview: regl.prop("modelview"),
      time: regl.prop("time")
    },

    // The depth buffer
    // depth: {
    //   enable: false,
    //   mask: false
    // },

    elements: faces
  });
}


function _drawBkg(regl,babyCanvas)
{
  return regl({
    frag: `
      precision mediump float;
      uniform vec2 iResolution;
      void main () {
        vec2 p = gl_FragCoord.xy;
        p = (2.0*p-iResolution.xy)/iResolution.y;
        if (length(p) > 1.) discard;
        gl_FragColor = vec4(0.,0.,0.,smoothstep(1.,0.8,length(p)));
      }`,
    vert: `
      attribute vec2 position;
      void main () {
        gl_Position = vec4(position, 0., 1.0);
      }`,

    // These are the vertex attributes that will be passed
    // on to the vertex shader
    attributes: {
      position: [
        [-1, -1],
        [1, -1],
        [1, 1],
        [1, 1],
        [-1, 1],
        [-1, -1]
      ]
    },

    uniforms: {
      iResolution: [babyCanvas.width, babyCanvas.height]
    },

    // The depth buffer
    depth: {
      enable: false,
      mask: false
    },
    count: 6
  });
}


function _drawClouds(regl,babyCanvas)
{
  return regl({
    frag: `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;

      const float cloudscale = 1.5;
      const float speed = 0.01;
      const float clouddark = 0.5;
      const float cloudlight = 0.3;
      const float cloudcover = 0.2;
      const float cloudalpha = 8.0;
      const float skytint = 0.5;
      const vec3 skycolour1 = vec3(0.2, 0.4, 0.6);
      const vec3 skycolour2 = vec3(0.4, 0.7, 1.0);
      
      const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
      
      vec2 hash( vec2 p ) {
      	p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
      	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
      }
      
      float noise( in vec2 p ) {
          const float K1 = 0.366025404; // (sqrt(3)-1)/2;
          const float K2 = 0.211324865; // (3-sqrt(3))/6;
      	vec2 i = floor(p + (p.x+p.y)*K1);	
          vec2 a = p - i + (i.x+i.y)*K2;
          vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
          vec2 b = a - o + K2;
      	vec2 c = a - 1.0 + 2.0*K2;
          vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
      	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
          return dot(n, vec3(70.0));	
      }
      
      float fbm(vec2 n) {
      	float total = 0.0, amplitude = 0.1;
      	for (int i = 0; i < 7; i++) {
      		total += noise(n) * amplitude;
      		n = m * n;
      		amplitude *= 0.4;
      	}
      	return total;
      }
      
      void main( ) {
          vec2 p = gl_FragCoord.xy / iResolution.xy;

        if (length(p-vec2(0.5,0.5)) > 0.5) discard;

      	  vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);    
          float time = iTime * speed;
          float q = fbm(uv * cloudscale * 0.5);
          
          //ridged noise shape
      	float r = 0.0;
      	uv *= cloudscale;
          uv -= q - time;
          float weight = 0.8;
          for (int i=0; i<8; i++){
      		r += abs(weight*noise( uv ));
              uv = m*uv + time;
      		weight *= 0.7;
          }
          
          //noise shape
      	float f = 0.0;
          uv = p*vec2(iResolution.x/iResolution.y,1.0);
      	uv *= cloudscale;
          uv -= q - time;
          weight = 0.7;
          for (int i=0; i<8; i++){
      		f += weight*noise( uv );
              uv = m*uv + time;
      		weight *= 0.6;
          }
          
          f *= r + f;
          
          //noise colour
          float c = 0.0;
          time = iTime * speed * 2.0;
          uv = p*vec2(iResolution.x/iResolution.y,1.0);
      	uv *= cloudscale*2.0;
          uv -= q - time;
          weight = 0.4;
          for (int i=0; i<7; i++){
      		c += weight*noise( uv );
              uv = m*uv + time;
      		weight *= 0.6;
          }
          
          //noise ridge colour
          float c1 = 0.0;
          time = iTime * speed * 3.0;
          uv = p*vec2(iResolution.x/iResolution.y,1.0);
      	uv *= cloudscale*3.0;
          uv -= q - time;
          weight = 0.4;
          for (int i=0; i<7; i++){
      		c1 += abs(weight*noise( uv ));
              uv = m*uv + time;
      		weight *= 0.6;
          }
      	
          c += c1;
          
          //vec3 skycolour = mix(skycolour2, skycolour1, p.y);
          //vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight*c), 0.0, 1.0);
         
          f = cloudcover + cloudalpha*f*r;
          
          //vec3 result = mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.));
          
      	gl_FragColor = vec4(vec3(0.), clamp(f + c, 0., 0.6));
      }
    `,
    vert: `
      attribute vec2 position;
      void main () {
        gl_Position = vec4(position, 0., 1.0);
      }`,

    // These are the vertex attributes that will be passed
    // on to the vertex shader
    attributes: {
      position: [
        [-1, -1],
        [1, -1],
        [1, 1],
        [1, 1],
        [-1, 1],
        [-1, -1]
      ]
    },

    uniforms: {
      iResolution: [babyCanvas.width, babyCanvas.height],
      iTime: regl.prop("iTime")
    },

    blend: {
      enable: true,
      func: {
        src: "src alpha",
        dst: "one minus src alpha"
      }
    },

    // The depth buffer
    depth: {
      enable: false,
      mask: false
    },
    count: 6
  });
}


function _regl(createRegl,babyCanvas){return(
createRegl(babyCanvas)
)}

async function _babyObj(parseObj,FileAttachment){return(
parseObj(await FileAttachment("babymedium.obj").text())
)}

function _boundingBox(babyObj)
{
  let min = [Infinity, Infinity, Infinity],
    max = [-Infinity, -Infinity, -Infinity];
  for (let p of babyObj.pos) {
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], p[i]);
      max[i] = Math.max(max[i], p[i]);
    }
  }
  let center = [],
    size = [];
  for (let i = 0; i < 3; i++) {
    size[i] = max[i] - min[i];
    center[i] = (max[i] + min[i]) / 2;
  }

  return { min, max, size, center };
}


function _parseObj(){return(
function (source) {
  let pos = [],
    normal = [],
    faceNormals = [],
    avgVertexNormals = [],
    faces = [];
  function addVertexNormal(vindex, nindex) {
    // if (avgVertexNormals.length > vindex && avgVertexNormals[vindex])
    //   avgVertexNormals[vindex].push(nindex);
    // else avgVertexNormals[vindex] = [nindex];
    avgVertexNormals[vindex] = normal[nindex];
  }
  let a, b, c;
  for (let line of source.split("\n")) {
    let split = line.split(/ +/);
    //if (split.length != 4) continue;
    let letter = split[0],
      coords = split.slice(1);
    switch (letter) {
      case "v":
        pos.push(coords.map(parseFloat));
        break;
      case "vn":
        normal.push(coords.map(parseFloat));
        break;
      case "f":
        coords = coords.map((c) => c.split("/"));
        let [i, j, k] = [0, 1, 2];
        while (k < coords.length) {
          let triangle = [coords[i], coords[j], coords[k]];
          let [x, y, z] = triangle.map((c) => parseInt(c[0]));
          let [xn, yn, zn] = triangle.map((c) => parseInt(c[2]));
          j++;
          k++;
          addVertexNormal(x - 1, xn - 1);
          addVertexNormal(y - 1, yn - 1);
          addVertexNormal(z - 1, zn - 1);
          faces.push([x - 1, y - 1, z - 1]);
          faceNormals.push([xn - 1, yn - 1, zn - 1]);
        }
        break;
    }
  }
  let i = 0;
  for (let vn of avgVertexNormals) {
    if (!vn || vn.length != 3) {
      console.log(`no normal for vertex ${i}`);
      avgVertexNormals[i] = [0, 0, 0];
    }
    i++;
  }
  return { pos, normal, faces, faceNormals, avgVertexNormals };
}
)}

function _createRegl(require){return(
require("regl@1.4.2/dist/regl.js")
)}

async function _glmatrix(require){return(
await require("https://bundle.run/gl-matrix@3.3.0")
)}

function _mat4(glmatrix){return(
glmatrix.mat4
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["babymedium.obj", {url: new URL("./files/cfc390ff36b0c9744b9a6cc04f3f576d9f62cf9abe44ec540be219065216184ffbd57b763575197d901b7e31cd1edc718d375a74c1b7cfb309450c8e34c1eaed.bin", import.meta.url), mimeType: "application/octet-stream", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("babyCanvas")).define("babyCanvas", ["html"], _babyCanvas);
  main.variable(observer("drawBaby")).define("drawBaby", ["mat4","glmatrix","regl","drawBkg","drawFaces","drawPoints","drawClouds"], _drawBaby);
  main.variable(observer("draw")).define("draw", ["drawBaby"], _draw);
  main.variable(observer("drawPoints")).define("drawPoints", ["boundingBox","babyObj","regl"], _drawPoints);
  main.variable(observer("drawFaces")).define("drawFaces", ["boundingBox","babyObj","regl"], _drawFaces);
  main.variable(observer("drawBkg")).define("drawBkg", ["regl","babyCanvas"], _drawBkg);
  main.variable(observer("drawClouds")).define("drawClouds", ["regl","babyCanvas"], _drawClouds);
  main.variable(observer("regl")).define("regl", ["createRegl","babyCanvas"], _regl);
  main.variable(observer("babyObj")).define("babyObj", ["parseObj","FileAttachment"], _babyObj);
  main.variable(observer("boundingBox")).define("boundingBox", ["babyObj"], _boundingBox);
  main.variable(observer("parseObj")).define("parseObj", _parseObj);
  main.variable(observer("createRegl")).define("createRegl", ["require"], _createRegl);
  main.variable(observer("glmatrix")).define("glmatrix", ["require"], _glmatrix);
  main.variable(observer("mat4")).define("mat4", ["glmatrix"], _mat4);
  return main;
}
