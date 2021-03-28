let font,
fontsize = 32;

let startX, startY;
let idealX, idealY;
let currentX, currentY;

let distance;
let actionGap, valueGap, stepSize;

// sliders
let valuesX, actionX;

let start;

// for trace
let xTrace = [];
let yTrace = [];

let prevAngle;
let gapFromTop;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('assets/Hasklig-Light.otf');
}

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');

  // Set text characteristics
  textFont(font);
  textSize(fontsize);
  textAlign(LEFT, CENTER);
  noStroke();
  angleMode(DEGREES);
  
  gapFromTop = 60;
  
  startX = idealX = currentX = windowWidth/6;
  startY = idealY = currentY = windowHeight/4+gapFromTop;
  distance = windowWidth*2/3;
  
  actionGap = 0;
  valueGap = 0;
  stepSize = 1; //how many pixels to move ideal right with each step
  
  // initilize sliders
  valuesX = windowWidth/10 + 1 * windowWidth/6;
  actionX = windowWidth/10 + 1 * windowWidth/6;
  
  start = 0;
  
  xTrace.push(windowWidth/6);
  yTrace.push(windowHeight/4+gapFromTop);
  
  prevAngle = 0;
  
}

function draw() {
  background(160);
 
  // bg rect
  //////////////////
  fill(255);
  rect(0,windowHeight/4,windowWidth,windowHeight/2);
  
  // start rect
  //////////////////
  fill(120);
  rect(windowWidth/10 - 120, (windowHeight/30*5), 100, windowHeight/30+20);
  fill(35);
  textSize(24);
  text("START", windowWidth/10 - 107, (windowHeight/30*5)+ 18);  
  
  // slider rects
  //////////////////
  //stroke(50);
  rect(windowWidth/10, (windowHeight/30*4.5), windowWidth/6, 20, 20);
  rect(windowWidth/10, (windowHeight/30*6), windowWidth/6, 20, 20);
  fill(100);
  rect(windowWidth/10, (windowHeight/30*4.5), valuesX-windowWidth/10, 20, 20);
  rect(windowWidth/10, (windowHeight/30*6), actionX-windowWidth/10, 20, 20);
  textSize(16);
  fill(35);
  text("value gap", windowWidth/10, (windowHeight/30*4.5) -12);
  text("action gap", windowWidth/10, (windowHeight/30*6) -12);
  text(str(int(valueGap*100)) + '%', windowWidth/10 + windowWidth/6 + 5, (windowHeight/30*4.5)+8);
  text(str(int(actionGap*100)) + '%', windowWidth/10 + windowWidth/6 + 5, (windowHeight/30*6)+8);
  
  // Current position calculations
  //////////////////

  var actionNoise = randomGaussian(0, 0.3);
  var valueNoise = randomGaussian(0,0.8);
  
  var angle = asin(constrain(valueGap+valueNoise, -1,1)); // has to be between these values
  var avgAngle = (angle + prevAngle)/2;
  prevAngle = angle;
  var yDif = sin(avgAngle) * (stepSize * (1-actionGap + actionNoise));
  var xDif = cos(avgAngle) * (stepSize * (1-actionGap + actionNoise));
  
  // Check to see if 'start' has been pushed
  if (start===1) {
    // update until "life" is over ;)
    if(idealX < windowWidth * 5/6){
      idealX+=1;
      currentX = currentX + xDif;
      currentY = currentY + yDif;
      // append to array
      xTrace.push(currentX);
      yTrace.push(currentY);
    }
  }
  
  if (start===0){
    xTrace = [];
    yTrace = [];
    startX = idealX = currentX = windowWidth/6;
    startY = idealY = currentY = windowHeight/4+gapFromTop;
  }
  
  // loop through array and draw
  for(let i = 0; i < xTrace.length-1; i++) {
    stroke(0);
    line(xTrace[i], yTrace[i], xTrace[i+1], yTrace[i+1]);
  }
  
  // draw ellipse
  var years = floor(xTrace.length/(distance/60));
  for(let j = 0; j<=years; j++){
    var fade = 255 - (years - j) * (255/30);
    noStroke();
    fill(0,fade);
    ellipse(xTrace[j*floor(distance/60)], yTrace[j*floor(distance/60)], 15-(years-j)*1/4, 15-(years-j)*1/4);
  }

  // meta ideal
  //line
  stroke(56, 141, 217);
  strokeWeight(2);
  line(startX,startY,idealX,idealY);
  stroke(245, 86, 86);
  line(currentX,currentY,idealX,idealY);
  noStroke();
  // start/ideal/current circles
  fill(100);
  ellipse(startX,startY,24,24); // start
  fill(128, 195, 255);
  ellipse(idealX,idealY,24,24); // ideal
  happyFace(currentX,currentY,24); // current
  
  print('Current y:' + str(currentY));
  print('Start y:' + str(startY));
  print('ideal y:' + str(idealY));
  print('length of xtrace:' + str(xTrace.length));
  // Calculate Year
  var year = (idealX-startX)/distance * 60;
  // Calculate Total Gap
  var a = idealX - currentX;
  var b = currentY - idealY;
  var totalGap = sqrt(sq(a) + sq(b));
  var totalGapPercent =  (totalGap/(idealX-startX))*100;
  // Text
  fill(35);
  textSize(32);
  text('AGE|' + str(int(year)+15), windowWidth/2,windowHeight/25);
  text('META GAP|' + str(int(totalGapPercent)) + '%', windowWidth/2,(windowHeight/25)*2);
}

function mouseClicked() {
  // based on input
  // value gap
  if (mouseX > windowWidth/10 && mouseX < windowWidth/10 + windowWidth/6 && mouseY > (windowHeight/30*4.5) && mouseY < (windowHeight/30*4.5) + 20) {
    valuesX = mouseX;
    valueGap = ((windowWidth/6 + windowWidth/10) - valuesX) / (windowWidth/6);
  }
  // action gap
  if (mouseX > windowWidth/10 && mouseX < windowWidth/10 + windowWidth/6 && mouseY > (windowHeight/30*6) && mouseY < (windowHeight/30*6) + 20) {
    actionX = mouseX;
    actionGap = ((windowWidth/6 + windowWidth/10) - actionX) / (windowWidth/6);
  }
  // start
  if (mouseX > windowWidth/10 - 200 && mouseX < windowWidth/10 - 20 && mouseY > (windowHeight/30*5) && mouseY < (windowHeight/30*6) + 20) {
    if (start===0){
      start = 1;
      startX = idealX = currentX = windowWidth/6;
      startY = idealY = currentY = windowHeight/4+gapFromTop;
      xTrace = [];
      yTrace = [];
      xTrace.push(windowWidth/6);
      yTrace.push(windowHeight/4+gapFromTop);
    }
    else{
      start = 0;
      
    }
  }
}

function happyFace (x, y, diam) {
  // Face
  fill(255, 255, 0);
  stroke(0);
  strokeWeight(1);
  ellipse(x, y, diam, diam);
  
  // Smile
  var startAng = 0.1*PI;
  var endAng = 0.9*PI;
  var smileDiam = 0.6*diam;
  arc(x, y, smileDiam, smileDiam, startAng, endAng);
  
  // Eyes
  var offset = 0.2*diam;
  var eyeDiam = 0.1*diam;
  fill(0);
  ellipse(x-offset, y-offset, eyeDiam, eyeDiam);
  ellipse(x+offset, y-offset, eyeDiam, eyeDiam);
  noStroke();
}

function valueBar(winMouseX,winMouseY) {
  if (winMouseY > windowHeight/4 && winMouseY < windowHeight/2) {
    fill(128, 195, 255);
    rect(0,windowHeight/4,winMouseX,windowHeight/4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
