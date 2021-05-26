let srcData;
let image = {};
const compress = new Compress();
let result;
let loaded = true;
let id = "duotone";
let secondary =
  "hsl(" +
  document.getElementById("secondary_hue").value +
  "," +
  document.getElementById("secondary_saturation").value +
  "%," +
  document.getElementById("secondary_luminocity").value +
  "%)";
let primary =
  "hsl(" +
  document.getElementById("primary_hue").value +
  "," +
  document.getElementById("primary_saturation").value +
  "%," +
  document.getElementById("primary_luminocity").value +
  "%)";
let background = true;
let primary_blend = "multiply";
let secondary_blend = "overlay";

let primary_dark =
  "hsl(" +
  document.getElementById("primary_hue").value +
  "," +
  (document.getElementById("primary_saturation").value - 35) +
  "%," +
  (document.getElementById("primary_luminocity").value - 5) +
  "%)";
let primary_dark_hsla =
  "hsla(" +
  document.getElementById("primary_hue").value +
  "," +
  (document.getElementById("primary_saturation").value - 35) +
  "%," +
  (document.getElementById("primary_luminocity").value - 10) +
  "%, 0.5)";
document.getElementById("primary_color").style.background =
  "linear-gradient(180deg, " + primary + " 0%, " + primary_dark + " 100%)";
document.getElementById("primary_color").style["boxShadow"] =
  "0 6px 23px " +
  primary_dark_hsla +
  ", inset 0px 12px 12px hsla(100, 100%, 100%, 0.27)";

var secondary_dark =
  "hsl(" +
  document.getElementById("secondary_hue").value +
  "," +
  (document.getElementById("secondary_saturation").value - 35) +
  "%," +
  (document.getElementById("secondary_luminocity").value - 5) +
  "%)";
var secondary_dark_hsla =
  "hsla(" +
  document.getElementById("secondary_hue").value +
  "," +
  (document.getElementById("secondary_saturation").value - 35) +
  "%," +
  (document.getElementById("secondary_luminocity").value - 10) +
  "%, 0.5)";
document.getElementById("secondary_color").style.background =
  "linear-gradient(180deg, " + secondary + " 0%, " + secondary_dark + " 100%)";
document.getElementById("secondary_color").style["boxShadow"] =
  "0 6px 23px " +
  secondary_dark_hsla +
  ", inset 0px 12px 12px hsla(100, 100%, 100%, 0.27)";

/* document.getElementById("primarycolorrec").style.background = primary;
document.getElementById("secondarycolorrec").style.background = secondary;
document.getElementById("secondary_saturation").style.background = "linear-gradient(90deg, #808080 0%, hsl(" + document.getElementById("secondary_hue").value+",100%,50%) 100%)";
document.getElementById("secondary_luminocity").style.background = "linear-gradient(90deg, #000000 0%, hsl(" + document.getElementById("secondary_hue").value+",100%,50%) 50%, #FFFFFF 100%)";
document.getElementById("primary_saturation").style.background = "linear-gradient(90deg, #808080 0%, hsl(" + document.getElementById("primary_hue").value+",100%,50%) 100%)";
document.getElementById("primary_luminocity").style.background = "linear-gradient(90deg, #000000 0%, hsl(" + document.getElementById("primary_hue").value+",100%,50%) 50%, #FFFFFF 100%)";*/

function encodeImageFileAsURL() {
  var filesSelected = document.getElementById("uploadFile").files;
  let upload = document.getElementById("uploadFile");
  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];
    var fileReader = new FileReader();

    fileReader.readAsDataURL(fileToLoad);
    fileReader.onload = function (fileLoadedEvent) {
      srcData = fileLoadedEvent.target.result;
      let filename = upload.files[0].name;
      image.size = upload.files[0].size / 1000000;
      console.log(filename + image.size); // <--- data: base64

      Duotone();
    };
  }
}

function Duotone() {
  let canvas = document.getElementById("duotone");
  let ctx = canvas.getContext("2d");

  let downloadedImg = new Image();
  downloadedImg.onload = function () {
    if (downloadedImg.height > downloadedImg.width) {
      document.getElementById("duotone").style.height = "600px";
      document.getElementById("duotone").style.width = "auto";
    } else {
      document.getElementById("duotone").style.height = "auto";
      document.getElementById("duotone").style.width = "700px";
    }
    canvas.width = downloadedImg.width;
    canvas.height = downloadedImg.height;
    /*document.getElementById("duotone").style.display = "inline";*/
    ctx.drawImage(downloadedImg, 0, 0, canvas.width, canvas.height); // draws image to canvas on load
    // Converts to grayscale by averaging the values of each pixel
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];
      // Using relative luminance to convert to grayscale
      const avg = Math.round(
        (0.2126 * red + 0.7152 * green + 0.0722 * blue) * 1
      );
      //const avg = Math.round((0.299 * red + 0.587 * green + 0.114 * blue) * 1);
      pixels[i] = avg;
      pixels[i + 1] = avg;
      pixels[i + 2] = avg;
    }
    // Puts the grayscaled image data back into the canvas
    ctx.putImageData(imageData, 0, 0);
    // puts the duotone image into canvas with multiply and lighten
    ctx.globalCompositeOperation = primary_blend;
    ctx.fillStyle = primary; // colour for highlights
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // lighten
    ctx.globalCompositeOperation = secondary_blend;
    ctx.fillStyle = secondary; // colour for shadows
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // calls any other draws that you want through the function parameter passed in
  };
  if (loaded) {
    document.getElementById("drag-upload-wrap").style.display = "none";
    document.getElementById("canvas_container").className =
      "duotone-animation canvas_container";
    document.getElementById("sidenav").className = "sidenav-animation sidenav";
    document.getElementById("container").className =
      "container-animation container";
    document.getElementById("container").style.zIndex = "2000";
    loaded = false;
  }
  downloadedImg.src = srcData; // source for the image
}

function changeLight() {
  primary = document.getElementById("colorLight").value;
  Duotone();
}
function changeDark() {
  secondary = document.getElementById("colorDark").value;
  Duotone();
}
function preset1() {
  primary = "#FFB23F";
  secondary = "#FF6B00";

  Duotone();
}
function preset2() {
  primary = "#1cff86";
  secondary = "#52136e";
  document.getElementById("colorLight").value = "#1cff86";
  secondary = document.getElementById("colorDark").value = "#52136e";
  Duotone();
}
/*function addPreset() {
  var newpreset = document.createElement("div");
  newpreset.style.cssText =
    "display: inline-block;width: 50px;height: 50px;margin:10px;border-radius: 50%;background: linear-gradient(137.76deg," +
    primary +
    " 14.83%," +
    secondary +
    " 86.08%)";

  document.getElementById("preset_container").appendChild(newpreset);
}
*/

function primarycolorchange(h, s, l) {
  primary = "hsl(" + h + "," + s + "%," + l + "%)";
  primary_dark = "hsl(" + h + "," + (s - 35) + "%," + (l - 5) + "%)";
  primary_dark_hsla = "hsla(" + h + "," + (s - 35) + "%," + (l - 5) + "%, 0.5)";

  document.getElementById("primary_saturation").style.background =
    "linear-gradient(90deg, #808080 0%, hsl(" +
    document.getElementById("primary_hue").value +
    ",100%,50%) 100%)";
  document.getElementById("primary_luminocity").style.background =
    "linear-gradient(90deg, #000000 0%, hsl(" +
    document.getElementById("primary_hue").value +
    ",100%,50%) 50%, #FFFFFF 100%)";

  document.getElementById("primary_color").style.background =
    "linear-gradient(180deg, " + primary + " 0%, " + primary_dark + " 100%)";
  document.getElementById("primary_color").style["boxShadow"] =
    "0 6px 23px " +
    primary_dark_hsla +
    ", inset 0px 12px 12px hsla(100, 100%, 100%, 0.27)";

  Duotone();
}

function secondarycolorchange(h, s, l) {
  secondary = "hsl(" + h + "," + s + "%," + l + "%)";
  secondary_dark = "hsl(" + h + "," + (s - 35) + "%," + (l - 5) + "%)";
  secondary_dark_hsla =
    "hsla(" + h + "," + (s - 35) + "%," + (l - 5) + "%, 0.5)";

  document.getElementById("secondary_saturation").style.background =
    "linear-gradient(90deg, #808080 0%, hsl(" +
    document.getElementById("secondary_hue").value +
    ",100%,50%) 100%)";
  document.getElementById("secondary_luminocity").style.background =
    "linear-gradient(90deg, #000000 0%, hsl(" +
    document.getElementById("secondary_hue").value +
    ",100%,50%) 50%, #FFFFFF 100%)";

  document.getElementById("secondary_color").style.background =
    "linear-gradient(180deg, " +
    secondary +
    " 0%, " +
    secondary_dark +
    " 100%)";
  document.getElementById("secondary_color").style["boxShadow"] =
    "0 6px 23px " +
    secondary_dark_hsla +
    ", inset 0px 12px 12px hsla(100, 100%, 100%, 0.27)";

  Duotone();
}

function primary_inputfield_sync() {
  let input_hue = document.getElementById("input_primary_hue").value;
  let input_saturation = document.getElementById("input_primary_saturation")
    .value;
  let input_luminocity = document.getElementById("input_primary_luminocity")
    .value;

  if (input_hue == "") {
    input_hue = "0";
  } else if (input_hue > 360) {
    input_hue = "360";
    document.getElementById("primary_hue").value = "360";
  } else {
    document.getElementById("primary_hue").value = input_hue;
  }

  if (input_saturation == "") {
    input_saturation = "0";
  } else if (input_saturation > 100) {
    input_saturation = "100";
    document.getElementById("primary_saturation").value = "100";
  } else {
    document.getElementById("primary_saturation").value = input_saturation;
  }

  if (input_luminocity == "") {
    input_luminocity = "0";
  } else if (input_luminocity > 100) {
    input_luminocity = "100";
    document.getElementById("primary_luminocity").value = "100";
  } else {
    document.getElementById("primary_luminocity").value = input_luminocity;
  }
  primarycolorchange(
    document.getElementById("primary_hue").value,
    document.getElementById("primary_saturation").value,
    document.getElementById("primary_luminocity").value
  );
}

function secondary_inputfield_sync() {
  let input_hue = document.getElementById("input_secondary_hue").value;
  let input_saturation = document.getElementById("input_secondary_saturation")
    .value;
  let input_luminocity = document.getElementById("input_secondary_luminocity")
    .value;

  if (input_hue == "") {
    input_hue = "0";
  } else if (input_hue > 360) {
    input_hue = "360";
    document.getElementById("secondary_hue").value = "360";
  } else {
    document.getElementById("secondary_hue").value = input_hue;
  }

  if (input_saturation == "") {
    input_saturation = "0";
  } else if (input_saturation > 100) {
    input_saturation = "100";
    document.getElementById("secondary_saturation").value = "100";
  } else {
    document.getElementById("secondary_saturation").value = input_saturation;
  }

  if (input_luminocity == "") {
    input_luminocity = "0";
  } else if (input_luminocity > 100) {
    input_luminocity = "100";
    document.getElementById("secondary_luminocity").value = "100";
  } else {
    document.getElementById("secondary_luminocity").value = input_luminocity;
  }
  secondarycolorchange(
    document.getElementById("secondary_hue").value,
    document.getElementById("secondary_saturation").value,
    document.getElementById("secondary_luminocity").value
  );
}

function primary_range_sync() {
  document.getElementById("input_primary_hue").value = document.getElementById(
    "primary_hue"
  ).value;
  document.getElementById(
    "input_primary_saturation"
  ).value = document.getElementById("primary_saturation").value;
  document.getElementById(
    "input_primary_luminocity"
  ).value = document.getElementById("primary_luminocity").value;

  primarycolorchange(
    document.getElementById("primary_hue").value,
    document.getElementById("primary_saturation").value,
    document.getElementById("primary_luminocity").value
  );
}

function secondary_range_sync() {
  document.getElementById(
    "input_secondary_hue"
  ).value = document.getElementById("secondary_hue").value;
  document.getElementById(
    "input_secondary_saturation"
  ).value = document.getElementById("secondary_saturation").value;
  document.getElementById(
    "input_secondary_luminocity"
  ).value = document.getElementById("secondary_luminocity").value;

  secondarycolorchange(
    document.getElementById("secondary_hue").value,
    document.getElementById("secondary_saturation").value,
    document.getElementById("secondary_luminocity").value
  );
}

/* Download */

function downloadImage() {
  console.log("button click");
  image = dataURItoBlob(
    document.querySelector("#duotone").toDataURL("image/jpg")
  );
  compressImage(image);
  console.log(image);
  console.log(result);
}

function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(",")[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
}

function downloadFinal() {
  console.log("final");
  var link = document.createElement("a");
  link.download = "filename.jpg";
  link.href = result;
  let { original, source } = image;
  console.log("ready");
  link.click();
}
function compressImage(image) {
  console.log("start compress");
  const files = [image];
  compress
    .compress(files, {
      size: image.size, // the max size in MB, defaults to 2MB // the quality of the image, max is 1,
      maxWidth: 1920, // the max width of the output image, defaults to 1920px
      maxHeight: 1920, // the max height of the output image, defaults to 1920px
      resize: false, // defaults to true, set false if you do not want to resize the image width and height
    })
    .then((images) => {
      console.log("im here");
      const img = images[0];
      console.log("yeah");

      result = img.prefix + img.data;
      console.log("finish compress");
      console.log(result);
      console.log(img.prefix);
      console.log(image);
      console.log(result);
      downloadFinal();
    });
}

function setstyle(id, primary_style, secondary_style) {
  primary_blend = primary_style;
  secondary_blend = secondary_style;
  Duotone();
}

/* function switchtosec() {
  document.getElementById("primarycolor").style.display = "none";
  document.getElementById("secondarycolor").style.display = "block";
  document.getElementById("blendmode").style.background =
    "hsl(" + document.getElementById("secondary_hue").value + ",100%,50%)";
  document.getElementById("primarycolorrec").style.border = "none";
  document.getElementById("secondarycolorrec").style.border =
    "6px solid  rgba(255, 255, 255)";
}
function switchtopri() {
  document.getElementById("primarycolor").style.display = "block";
  document.getElementById("secondarycolor").style.display = "none";
  document.getElementById("blendmode").style.background =
    "hsl(" + document.getElementById("primary_hue").value + ",100%,50%)";
  document.getElementById("primarycolorrec").style.border =
    "6px solid  rgba(255, 255, 255)";
  document.getElementById("secondarycolorrec").style.border = "none";
}
 function show() {
  document.getElementById("dropdown-content").style.display = "block";
}
function unshow() {
  document.getElementById("dropdown-content").style.display = "none";
}
function changebackcolor() {
  /*  if (background){
  document.body.style.backgroundColor = "#1D1D1D";
  document.getElementById("blendmode").style.background = "#1D1D1D";
  document.getElementById("preset_group_1").style.boxShadow = "none";
  document.getElementById("preset_group_2").style.boxShadow = "none";
  document.getElementById("preset_group_3").style.boxShadow = "none";
  document.getElementById("preset_group_4").style.boxShadow = "none";
  document.getElementById("preset_group_5").style.boxShadow = "none";
  document.getElementById("colors_container").style.boxShadow = "0px 24px 24px rgba(14, 14, 14, 0.55)";
  document.getElementById("sidenav").style.boxShadow = "24px 0px 24px rgba(14, 14, 14, 0.55)";
  document.getElementById("colors_container").style.background = "#272727";
  background = false;
} 
  if (background) {
    document.body.style.backgroundColor = "#211338";
    document.getElementById("blendmode").style.background = "#150C24";
    document.getElementById("sidenav").style.background = "#150C24";
    document.getElementById("preset_group_1").style.boxShadow = "none";
    document.getElementById("preset_group_2").style.boxShadow = "none";
    document.getElementById("preset_group_3").style.boxShadow = "none";
    document.getElementById("preset_group_4").style.boxShadow = "none";
    document.getElementById("preset_group_5").style.boxShadow = "none";
    document.getElementById("colors_container").style.boxShadow =
      "0px 24px 24px rgba(21, 12, 36, 0.33)";
    document.getElementById("sidenav").style.boxShadow = "none";
    document.getElementById("colors_container").style.background = "#150C24";
    background = false;
  } else {
    document.body.style.backgroundColor = "#F3F2F8";
    document.getElementById("blendmode").style.background = "#fff";
    document.getElementById("preset_group_1").style.boxShadow =
      "0px 25px 25px rgba(223, 219, 233, 0.55)";
    document.getElementById("preset_group_2").style.boxShadow =
      "0px 25px 25px rgba(223, 219, 233, 0.55)";
    document.getElementById("preset_group_3").style.boxShadow =
      "0px 25px 25px rgba(223, 219, 233, 0.55)";
    document.getElementById("preset_group_4").style.boxShadow =
      "0px 25px 25px rgba(223, 219, 233, 0.55)";
    document.getElementById("preset_group_5").style.boxShadow =
      "0px 25px 25px rgba(223, 219, 233, 0.55)";
    document.getElementById("colors_container").style.boxShadow =
      "0px 24px 24px rgba(223, 219, 233, 0.55)";
    document.getElementById("sidenav").style.boxShadow =
      "24px 0px 24px rgba(223, 219, 233, 0.55)";
    document.getElementById("colors_container").style.background = "#fff";
    background = true;
  }
}

function downloadImage() {
  // function to convert the canvas into a png image and set it as the src of the img tag
  var link = document.createElement("a");
  link.download = "filename.jpg";
  var image = document.querySelector("#duotone").toDataURL("image/jpg");

  const files = [...image];
  compress
    .compress(files, {
      size: 4, // the max size in MB, defaults to 2MB
      quality: 0.75, // the quality of the image, max is 1,
      maxWidth: 1920, // the max width of the output image, defaults to 1920px
      maxHeight: 1920, // the max height of the output image, defaults to 1920px
      resize: true, // defaults to true, set false if you do not want to resize the image width and height
    })
    .then((images) => {
      const img = images[0];
      link.href = img;
      link.click();
      return img;
    });

  const upload = document.getElementById("upload");
  upload.addEventListener(
    "change",
    function (evt) {
      const files = [...evt.target.files];
      compress
        .compress(files, {
          size: 4, // the max size in MB, defaults to 2MB
          quality: 0.75, // the quality of the image, max is 1,
          maxWidth: 1920, // the max width of the output image, defaults to 1920px
          maxHeight: 1920, // the max height of the output image, defaults to 1920px
          resize: true, // defaults to true, set false if you do not want to resize the image width and height
        })
        .then((data) => {
          // returns an array of compressed images
        });
    },
    false
  );

  /*   var link = document.createElement("downloaddd");
    link.onclick = function() {
      document.querySelector("canvas").toBlob(function(blob){
        // here the conversion has finished
        // to trigger the download (again) we use a dummy link
        var a = document.createElement("a");
        a.download = "image.jpg";
        a.href = URL.createObjectURL(blob);
        a.click();

      },'image/jpg', 0);
    };
    link.click(); 
  }

*/
