const Datamatrix = require('tualo-datamatrix').Datamatrix;

const tabChars = {
  '1111': ' ',
  '1110': '▗',
  '1101': '▖',
  '1100': '▄',
  '1011': '▝',
  '1010': '▐',
  '1001': '▞',
  '1000': '▟',
  '0111': '▘',
  '0110': '▚',
  '0101': '▌',
  '0100': '▙',
  '0011': '▀',
  '0010': '▜',
  '0001': '▛',
  '0000': '█',
};

//Remove first and last line, and every first and last character from the ascii lines array
function removeBorders(lines) {
  var newlines=[];
  for(var i=1;i<lines.length-1;i++) {
    var newline = "";
    var line = lines[i];
    for(var j=1;j<line.length-1;j++){
      newline+=line[j];
    }
    newlines.push(newline);
  }
  return newlines;
}

module.exports = function(data, opts) {

  let defaults = {
    square: true,
    small: true,
    border: true
  };
  opts = { ...defaults, ...(opts || {}) }

  let dm = new Datamatrix();
  let ascii = dm.getDigit(data,false).split('\n');

  //Removing borders (clean zone) around barcode?
  if(!opts.border) {
    ascii = removeBorders(ascii);
  }

  //Double pixel width to achieve squarish aspect ratio?
  let todo = (opts.square) ?
    ascii.map((line)=>{
      newline = "";
      for(var i=0;i<line.length;i++) {
        newline+=line[i];
        newline+=line[i];
      }
      return newline;
    })
  : ascii;

  //calculating input bitmap height and width
  let height = todo.length;
  let width = todo[0].length;

  //generating bitmap from tualo-datamatrix ascii bits
  let bmp=[];
  for(var y1=0;y1<todo.length;y1++) {
    var line=todo[y1];
    for(var x1=0;x1<line.length;x1++) {
      bmp.push(parseInt(line[x1]));
    }
  }

  //if not small then convert and return bitmap to full chars
  if(!opts.small) {
    let fulltxt="";
    for(var y=0;y<height;y++) {
      for(var x=0;x<width;x++) {
        var bit = bmp[x+(y*width)];
        var char = bit?' ' : '\u2588';
        fulltxt+=char;
      }
      fulltxt+='\n';
    }
    return fulltxt;
  }

  //downsizing with quarter chars
  let smallbmp = [];
  let smallindex=0;
  for(let y=0;y<height;y+=2) {
    for(let x=0;x<width;x+=2) {
      let bits = [];
      bits.push(bmp[x+(y*width)]);
      bits.push(bmp[(x+1)+(y*width)]);
      bits.push(bmp[x+((y+1)*width)]);
      bits.push(bmp[(x+1)+((y+1)*width)]);
      //Get the corresponding unicode char
      let outputChar = tabChars[bits.join("")];
      smallbmp[smallindex]=outputChar;
      smallindex++;
    }
  }

  //converting resized bitmap and return unicode quarter chars
  let smalltxt="";
  for(let y=0;y<height/2;y++) {
    for(let x=0;x<width/2;x++) {
      let char = smallbmp[x+(y*(width/2))];
      smalltxt+=char;
    }
    smalltxt+='\n';
  }
  return smalltxt;
}