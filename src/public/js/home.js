var wrapper,
  width,
  height,
  canvas,
  ctx,
  planet1,
  planet2,
  initialSelect = 0,
  speedFactor,
  speedScaling = 4,
  orbitalScalingFactor,
  tau = Math.PI * 2,
  PI180 = Math.PI / 180,
  system;
const mcos = Math.cos,
  msin = Math.sin;

var optionList = [
    { value: "3,2,0.000002,200", text: "Earth & Venus" },
    { value: "3,1,0.000002,200", text: "Earth & Mercury" },
    { value: "3,4,0.0000015,250", text: "Earth & Mars" },
    { value: "3,5,0.0000005,1000", text: "Earth & Jupiter" },
    { value: "5,6,0.0000004,10000", text: "Jupiter & Saturn" },
    { value: "6,7,0.00000015,80000", text: "Saturn & Uranus" },
  ],
  currentSelectValue = optionList[initialSelect].value.split(","),
  planet1 = currentSelectValue[0],
  planet2 = currentSelectValue[1],
  orbitalScalingFactor = currentSelectValue[2],
  speedFactor = currentSelectValue[3] * speedScaling;

function createList() {
  let myDiv = document.getElementById("selectList"),
    selectList = document.createElement("select");
  selectList.id = "mySelect";
  myDiv.appendChild(selectList);
  for (let i = 0; i < optionList.length; i++) {
    let option = document.createElement("option");
    option.value = optionList[i].value;
    option.text = optionList[i].text;
    selectList.appendChild(option);
  }
  selectList.addEventListener("change", handleSelect);
}
function handleSelect(evt) {
  currentSelectValue = evt.target.value.split(",");
  planet1 = currentSelectValue[0];
  planet2 = currentSelectValue[1];
  orbitalScalingFactor = currentSelectValue[2];
  speedFactor = currentSelectValue[3] * speedScaling;
  for (let loop = system.numBodies, j = 0; j < loop; j += 1) {
    system.allBodies[j].setorbitalRadius();
    system.allBodies[j].setSpeedFactor(speedFactor);
  }
  clearCanvas();
}

const PlanetarySystem = function () {
  Object.defineProperty(this, "x", { value: 0, writable: true });
  Object.defineProperty(this, "y", { value: 0, writable: true });
  Object.defineProperty(this, "allBodies", { value: [], writable: true });
  Object.defineProperty(this, "allBodiesLookup", { value: {}, writable: true });
  Object.defineProperty(this, "numBodies", { value: 0, writable: true });
};
PlanetarySystem.prototype.addBody = function (vo) {
  vo.parentSystem = this;
  vo.parentBody =
    vo.parentBody === null ? this : this.allBodiesLookup[vo.parentBody];
  let body = new PlanetaryBody(vo);
  body.update();
  this.allBodies.push(body);
  this.allBodiesLookup[vo.id] = body;
  this.numBodies += 1;
};
PlanetarySystem.prototype.setSpeedFactor = function (value) {
  for (let body, i = 0; i < this.numBodies; i++) {
    body = this.allBodies[i];
    body.setSpeedFactor(value);
  }
};
PlanetarySystem.prototype.update = function () {
  for (let body, i = 0; i < this.numBodies; i++) {
    body = this.allBodies[i];
    body.update();
  }
};

const PlanetaryBody = function (vo) {
  Object.defineProperty(this, "id", { value: vo.id, writable: true });
  Object.defineProperty(this, "x", { value: 0, writable: true });
  Object.defineProperty(this, "y", { value: 0, writable: true });
  Object.defineProperty(this, "vx", { value: 0, writable: true });
  Object.defineProperty(this, "vy", { value: 0, writable: true });
  Object.defineProperty(this, "degrees", { value: 0, writable: true });
  Object.defineProperty(this, "speedBase", { value: vo.speed, writable: true });
  Object.defineProperty(this, "speedFactor", { value: 0, writable: true });
  Object.defineProperty(this, "speed", { value: 0, writable: true });
  Object.defineProperty(this, "orbitalRadiusBase", {
    value: vo.orbitalRadius,
    writable: true,
  });
  Object.defineProperty(this, "orbitalRadius", {
    value: vo.orbitalRadius,
    writable: true,
  });
  Object.defineProperty(this, "parentSystem", {
    value: vo.parentSystem,
    writable: true,
  });
  Object.defineProperty(this, "parentBody", {
    value: vo.parentBody,
    writable: true,
  });
  this.setSpeedFactor(speedFactor);
  this.orbitalRadius = vo.orbitalRadius * orbitalScalingFactor;
  return this;
};
PlanetaryBody.prototype.setorbitalRadius = function () {
  this.orbitalRadius = this.orbitalRadiusBase * orbitalScalingFactor;
};
PlanetaryBody.prototype.setSpeedFactor = function (value) {
  this.speedFactor = value;
  this.speed = this.speedFactor / this.speedBase;
};
PlanetaryBody.prototype.update = function () {
  let angle = this.degrees * PI180;
  this.degrees += this.speed;
  this.vx = this.orbitalRadius * mcos(angle);
  this.vy = this.orbitalRadius * msin(angle);
  if (this.parentBody != null) {
    this.x = this.vx + this.parentBody.x;
    this.y = this.vy + this.parentBody.y;
  }
};

function createCanvas(id, w, h) {
  var tCanvas = document.createElement("canvas");
  tCanvas.width = w;
  tCanvas.height = h;
  tCanvas.id = id;
  return tCanvas;
}

function init() {
  wrapper = document.getElementById("stage");
  canvas = createCanvas("canvas", width, height);
  wrapper.appendChild(canvas);
  ctx = canvas.getContext("2d");
  createList();

  /* Define new PlanetarySystem and set values */
  let year = 365.26;
  system = new PlanetarySystem();
  system.x = width * 0.5;
  system.y = height * 0.5;
  system.addBody({ id: "sun", speed: 1, orbitalRadius: 0, parentBody: null });
  system.addBody({
    id: "mercury",
    speed: 87.97,
    orbitalRadius: 57950000,
    parentBody: "sun",
  });
  system.addBody({
    id: "venus",
    speed: 224.7,
    orbitalRadius: 108110000,
    parentBody: "sun",
  });
  system.addBody({
    id: "earth",
    speed: year,
    orbitalRadius: 149570000,
    parentBody: "sun",
  });
  system.addBody({
    id: "mars",
    speed: year * 1.88,
    orbitalRadius: 227840000,
    parentBody: "sun",
  });
  system.addBody({
    id: "jupiter",
    speed: year * 11.86,
    orbitalRadius: 778140000,
    parentBody: "sun",
  });
  system.addBody({
    id: "saturn",
    speed: year * 29.46,
    orbitalRadius: 1427000000,
    parentBody: "sun",
  });
  system.addBody({
    id: "uranus",
    speed: year * 84.01,
    orbitalRadius: 2870300000,
    parentBody: "sun",
  });

  setupEvents();
  resizeCanvas();
}

function setupEvents() {
  window.onresize = resizeCanvas;
}

function resizeCanvas() {
  let rect = wrapper.getBoundingClientRect();
  width = window.innerWidth;
  height = window.innerHeight - rect.top - 12;
  canvas.width = width;
  canvas.height = height;
  system.x = width * 0.5;
  system.y = height * 0.5;

  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#bd5";
  ctx.lineWidth = 0.1;
  clearCanvas();
}
function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}
function drawconnections() {
  ctx.beginPath();
  ctx.moveTo(system.allBodies[planet1].x, system.allBodies[planet1].y);
  ctx.lineTo(system.allBodies[planet2].x, system.allBodies[planet2].y);
  ctx.stroke();
}
function animate() {
  system.update();
  drawconnections();
  requestAnimationFrame(animate);
}
init();
animate();
