import controlP5.*;
import java.util.Map;


ControlP5 cp5;
int momentSlider = 0;

PImage map;
PImage moment;
PImage rainIcon, co2Icon, tempIcon;

Table table;

StringList locations;  // https://processing.org/reference/StringList.html
StringList dates;
StringList captions;
FloatList temps;
FloatList lats;
FloatList lons;
FloatList co2s;
FloatList rains;
IntList moments;

color t1,t2,r1,r2,c1,c2;
color tempColor;
float tempRange = 48.91; 
float maxRain = 69.52;
float maxCo2 = 11183.911862;
float xTemp, xRain, xCo2;

int frame = 0;
int counter = 0;

final IntDict locationCount = new IntDict();

PFont rubik300;
PFont rubik400;

void setup() {
  size(1200,800);
  noStroke();
  cp5 = new ControlP5(this);
  
  rubik300 = createFont("Rubik-Light.ttf", 20);
  rubik400 = createFont("Rubik-Regular.ttf", 40);
  
  // preload images
  map = loadImage("assets/equiRectEarth.jpg");  // NASA image, from https://visibleearth.nasa.gov/images/73909/december-blue-marble-next-generation-w-topography-and-bathymetry/73911l
  map = loadImage("assets/outlineEquirectangular.png");  
  rainIcon = loadImage("assets/rainIcon.png");
  co2Icon = loadImage("assets/co2Icon.png");
  tempIcon = loadImage("assets/tempIcon.png");
  
  // load dataframe from Python
  table = loadTable("assets/minutiae_w_captions.csv", "header");
  
  // set colors for gradient
  t1 = color(66,167,245);
  t2 = color(240,98,98);
  r1 = color(186,231,245);
  r2 = color(0,45,89);
  c1 = color(235,235,235);
  c2 = color(59,59,59);
  
  println(table.getRowCount() + " total rows in table");
  
  // initialize arrays
  locations = new StringList();
  dates = new StringList();
  captions = new StringList();
  temps = new FloatList();
  lats = new FloatList();
  lons = new FloatList();
  co2s = new FloatList();
  rains = new FloatList();
  moments = new IntList();
  
  // fill arrays
  for (TableRow row : table.rows()) {
    
    // tweak location to just get city
    String location = row.getString("location");
    int comma = location.indexOf(",");  //location of comma in string
    
    locations.append(row.getString("location").substring(0,comma)); //substring without country name
    dates.append(row.getString("date").substring(0,10));
    captions.append(row.getString("captions_1"));
    temps.append(row.getFloat("temp_2m"));
    lats.append(row.getFloat("lat"));
    lons.append(row.getFloat("lng"));
    rains.append(row.getFloat("precipitation"));
    co2s.append(row.getFloat("carbon_footprint"));
    moments.append(row.getInt("moment"));
    
  }
  // font for slider
  PFont pfont = createFont("Arial",20,true); // use true/false for smooth/no-smooth
  ControlFont font = new ControlFont(pfont,24);
  
  // moment slider
  cp5.addSlider("momentSlider")
     .setPosition(0,map.height)
     .setSize(width,30)
     .setRange(0,table.getRowCount()-1)
     .setCaptionLabel("Moment")
     .setFont(font)
     ;
  // cp5.getController("momentSlider").getCaptionLabel().align(ControlP5.RIGHT, ControlP5.BOTTOM_OUTSIDE).setPaddingX(0);
  

  //for (String s : locations)  locationCount.increment(s); 
  //print(locationCount);
  //String[] theKeys = locationCount.keyArray();
  //print(theKeys);
  
  //locationCount.clear();
  
  //String[] subset = subset(locations.array(), 0, 10);
  //for (String s : subset)  locationCount.increment(s); 
  //print(locationCount);
  
  //// subset of all locations up to current
  //String[] subset = subset(locations.array(), momentSlider, 10);
  //// location counts based on subset
  //for (String s : subset)  locationCount.increment(s);
  //// get count based on location
  //String[] theKeys = locationCount.keyArray();
  
  //for (int i = 0; i<theKeys.length; i+=1){
    
  //}
  
}

void draw() {
  background(200);
  textFont(rubik300);
  
  //rect w/temp
  float tempProp = (temps.get(momentSlider)+17.26)/tempRange;
  tempColor = lerpColor(t1,t2, tempProp);
  fill(tempColor, 120);
  rect(0,0,width/2,map.height);
  
  image(map, -150, 0);
  
  // lat/lon lines
  if (momentSlider>0){
    for (int i=1; i<=momentSlider; i+=1){
      mapLine(lats.get(i-1), lons.get(i-1), lats.get(i), lons.get(i), width, height);
    }
  }
  noStroke();
  
  // lat/lon points
  mapPoint(lats.get(momentSlider), lons.get(momentSlider), width, height);
  
  // MANUAL VERSION
  // counter
  // momentSlider = counter;
  
  // image
  moment = loadImage("assets/" + moments.get(momentSlider) + ".jpeg");
  image(moment, width/2, 0, 600,600);
  
  // carbon
  float co2Prop = (co2s.get(momentSlider))/maxCo2;
  tempColor = lerpColor(c1,c2, co2Prop);
  fill(tempColor);
  xCo2 = lerp(xCo2, co2Prop*width, 0.1);
  rect(0, map.height+30, xCo2, 170/3);
  image(co2Icon, 10, map.height+45, 35,35);
  textSize(20);
  fill(255);
  text(round(co2s.get(momentSlider)), co2Prop*width-30, map.height+30+35);
  
  // rain
  float rainProp = (rains.get(momentSlider))/maxRain;
  tempColor = lerpColor(r1,r2, rainProp);
  fill(tempColor);
  xRain = lerp(xRain, rainProp*width, 0.3);
  rect(0, map.height+30+(170/3), xRain, 170/3);
  image(rainIcon, 10, map.height+100, 35,35);
  textSize(20);
  fill(255);
  text(round(rains.get(momentSlider)), rainProp*width-15, map.height+30+90);
  
  // temp
  tempProp = (temps.get(momentSlider)+17.26)/tempRange;
  tempColor = lerpColor(t1,t2, tempProp);
  fill(tempColor);
  // interpolate
  xTemp = lerp(xTemp, tempProp*width, 0.3);
  rect(0, map.height+30+(170/3)*2, xTemp, height);
  image(tempIcon, 10, map.height+160, 35,35);
  textSize(20);
  fill(255);
  text(round(temps.get(momentSlider)), tempProp*width-15, map.height+30+150);
  
  // mean temp
  if (momentSlider>0) {
    int totalTemp =0;
    for (int i = 0; i<=momentSlider; i+=1){
      totalTemp += temps.get(i);
    }
    stroke(0);
    strokeWeight(3);
    line((((totalTemp/momentSlider)+17.26)/tempRange)*width,map.height+30+(170/3)*2,(((totalTemp/momentSlider)+17.26)/tempRange)*width,height);
    noStroke();
  }
  // bottom overlay
  fill(35,200);
  rect(0, map.height-100, width, 100); 
  
  // text
  fill(255);
  textAlign(CENTER);
  // Location + Date
  textFont(rubik400);
  textSize(40);
  fill(4,172,252);
  text(locations.get(momentSlider).toUpperCase(), width/4, map.height-50);
  textFont(rubik300);
  textSize(24);
  fill(235);
  text(dates.get(momentSlider), width/4, map.height-20);
  // ML Caption
  textSize(18);
  text(captions.get(momentSlider), (width/4)*3, map.height-40);
  
  // persistent dots
  
  // growing dots
  
  // AUTO VERSION
  //for (int i = 0; i < 80; i+=1) {
  //  //moment = loadImage("assets/" + moments[i] + ".jpeg");
  //} 
}

void mapPoint(float lat, float lon, float width, float height) {
  float x = map(lon, -180, 180, 0, map.width);
  float y = map(lat, 90, -90, 0, map.height);
  fill(4,172,252);
  ellipse(x-150, y, 10, 10);
  //for (String s : locations)  locationCount.increment(s); 
  //print(locationCount);
}

void mapLine(float lat1, float lon1, float lat2, float lon2, float width, float height){
  float x1 = map(lon1, -180, 180, 0, map.width);
  float y1 = map(lat1, 90, -90, 0, map.height);
  float x2 = map(lon2, -180, 180, 0, map.width);
  float y2 = map(lat2, 90, -90, 0, map.height);
  strokeWeight(2);
  stroke(230);
  line(x1-150,y1,x2-150,y2); //150 is the offset of the map...should be a variable
}


void keyPressed() {
  if (key == CODED) {
    if (keyCode == RIGHT) {
      if (counter<809){
        counter+=1;
      }
        } else if (keyCode == LEFT) {
      if (counter>0){
      counter-=1;
      }
    } 
  }
}
 
void mouseReleased() {  
  zeroCounters();
}
 
void zeroCounters(){
  counter=0;
}
