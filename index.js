'use strict';

const fs = require('fs');
const path = require('path');
const mapslice = require('mapslice');
const gm = require('gm').subClass({imageMagick: true});
const cp = require('child_process');

const sPathToSrc = 'myImage.jpg'; // fix
const sPathToOut = 'map/{z}/{y}_{x}.png'; // fix
const nTileSize = 256;

function sliceImage(sInPath, sOutPath, nZ) {
  // The parameters passed here are equal to the command-line parameters
  var mapSlicer = mapslice({
      file: sInPath,                     // (required) Huge image to slice
      output: sOutPath,                  // Output file pattern
      background: "rgba(255,255,255,0)", // (default: '#FFFFFFFF') Background color to be used for the tiles. More: http://ow.ly/rsluD
      minWidth: 200,                     // See explanation about Size detection below
      skipEmptyTiles: true,              // Skips all the empty tiles
      bitdepth: 8,                       // (optional) See http://aheckmann.github.io/gm/docs.html#dither
      dither: true,                      // (optional) See http://aheckmann.github.io/gm/docs.html#bitdepth
      colors: 128,                       // (optional) See http://aheckmann.github.io/gm/docs.html#colors
  });

  mapSlicer.on("start", function(files, options) {
      console.info("Starting to process "+files+" files.");
  });

  mapSlicer.on("error", function(err) {
      console.error(err);
  });

  mapSlicer.on("progress", function(progress, total, current, file) {
      console.info("Progress: "+Math.round(progress*100)+"%");
  });

  mapSlicer.on("end", function() {
      console.info("Finished processing slices.");
  });

  mapSlicer.start();
}

function resizeImage(sPath, sFileName, oParams) {
  if (path.extname(file) === jpgExt && !/__\d+.jpg/.test(file)) {
    const nZoomLevel = oParams.nZ;
    const nImgSize = nTileSize * nZoomLevel;
    const sSrcPath = path.join(sPath, file);
    const fileName = path.basename(file, jpgExt);
    console.log("Resize \""+sSrcPath+"\"");
    //const nSize = oParams.size;

    const sNewPath = path.join(sPath, path.parse(file).dir, fileName+"__"+nImgSize+".jpg");
     // console.log("Try to convert into \""+sNewPath+"\"");

    cp.exec(`magick "${sSrcPath}" -resize ${nImgSize} "${sNewPath}"`)


  }
}

function loopImages() {
  var aZ = [0,1,2,3,4,5,6,7];

  aZ.forEach(function(nZoom){
    resizeImage(sPath, sFileName, {nZ: nZoom});
    sliceImage(sInPath, sOutPath, nZoom);
    // when resizeImage than  sliceImage
  });

}


