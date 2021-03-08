let img;
let table;

//let totalR = 0;
//let totalG = 0;
//let totalB = 0;

function preload() {
  img = loadImage('assets/91.jpeg');
  table = loadTable('assets/minutiae_data_frame.csv', 'csv', 'header');
}
function setup() {
  // dataframe from Python
  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');

  print(table.getColumn('name'));

  //cycle through the table
  //for (let r = 0; r < table.getRowCount(); r++) {
  //  for (let c = 0; c < table.getColumnCount(); c++) {
  //    print(table.getString(r, c));
  //  }
  //}
  
  createCanvas(displayWidth, displayHeight);
  // Top-left corner of the img is at (0, 0)
  // Width and height are the img's original width and height
  image(img, 0, 0);
  
  //// AVERAGE Photo color
  //for(let x = 0; x < img.width; x++){
  //for(let y = 0; y < img.height; y++){
  //  let c = img.get(x,y);
  //  totalR += c[0];
  //  totalG += c[1];
  //  totalB += c[2];
  //  }
  //}
  
  //pixelTotal = img.width*img.height;
  //noStroke();
  //console.log(totalR/pixelTotal);
  //console.log(totalG/pixelTotal);
  //console.log(totalB/pixelTotal);
  
  //fill(totalR/pixelTotal, totalG/pixelTotal, totalB/pixelTotal);
  //rect(img.width, 0, 100, 100);
}
