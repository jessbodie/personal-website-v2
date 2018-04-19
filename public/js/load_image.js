// Load an image to a div after CSS, content loads
var loadImage = (function(imageID) {
  window.addEventListener("load", function() {
    var newImage = document.createElement("img");
    newImage.className = "obligatory__image-crazy";
    newImage.src = "img/profile_crazy_cropped.jpg";
    newImage.setAttribute("alt", "Wacky Jess");

    var imageDiv = document.getElementById(imageID);
    imageDiv.appendChild(newImage);
    });
  });

var divID = "obligatory__image-only";
loadImage(divID);
