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
  
  startX = idealX = currentX = windowWidth/6;
  startY = idealY = currentY = windowHeight/4+20;
  distance = windowWidth*2/3;
  
  actionGap = 0;
  valueGap = 0;
  stepSize = 1; //how many pixels to move ideal right with each step
  
  // initilize sliders
  valuesX = windowWidth/10 + 1 * windowWidth/6;
  actionX = windowWidth/10 + 1 * windowWidth/6;
  
  start = 0;
}

function draw() {
  background(160);
 
  // bg rect 
  fill(255);
  rect(0,windowHeight/4,windowWidth,windowHeight/2);
  
  // start rect
  fill(120);
  rect(windowWidth/10 - 120, (windowHeight/30*5), 100, windowHeight/30+20);
  fill(35);
  textSize(24);
  text("START", windowWidth/10 - 107, (windowHeight/30*5)+ 18);  
  
  // slider rects
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
  //var xDif = (sq(stepSize) + sq(stepSize*(1-actionGap)) - sq(valueGap))/(2*stepSize);
  //var yDif = sqrt(sq(stepSize*(1-actionGap)) - sq(xDif));
  var angle = asin(valueGap);
  var yDif = sin(angle) * (stepSize * (1-actionGap));
  var xDif = cos(angle) * (stepSize * (1-actionGap));
  
  if (start>0) {
    // update until "life" is over ;)
    if(idealX < windowWidth * 5/6){
      idealX+=1;
      currentX = currentX + xDif;
      currentY = currentY + yDif;
    }
  }
  
  // meta ideal
  //line
  stroke(56, 141, 217);
  strokeWeight(2);
  line(startX,startY,idealX,idealY);
  stroke(80);
  line(startX,startY,currentX,currentY);
  stroke(245, 86, 86);
  line(currentX,currentY,idealX,idealY);
  noStroke();
  // start/ideal/current circles
  fill(100);
  ellipse(startX,startY,24,24); // start
  fill(128, 195, 255);
  ellipse(idealX,idealY,24,24); // ideal
  happyFace(currentX,currentY,24); // current
  
  
  
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
  if (mouseX > windowWidth/10 && mouseX < windowWidth/10 + windowWidth/6 && mouseY > (windowHeight/30*6) && mouseY < (windowHeight/30*6) + 20) {
    actionX = mouseX;
    actionGap = ((windowWidth/6 + windowWidth/10) - actionX) / (windowWidth/6);
  }
  if (mouseX > windowWidth/10 - 200 && mouseX < windowWidth/10 - 20 && mouseY > (windowHeight/30*5) && mouseY < (windowHeight/30*6) + 20) {
    if (start===0){
      start = 1;
    }
    else{
      start = 0;
      startX = idealX = currentX = windowWidth/6;
      startY = idealY = currentY = windowHeight/4+20;
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
