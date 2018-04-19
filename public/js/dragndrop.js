// Pic data for Drag and Drop
var RolePic = function(id, fileName, altText) {
     this.id = id;
     this.fileName = fileName;
     this.altText = altText;
};

var rolePics = [
     roleColleague = new RolePic("colleague", "tina.jpg", "Liz Lemon (Tina Fey)"),
     roleFriend = new RolePic("friend", "joan.jpg", "Permanent BFF (Joan Cusack"),
     roleMom = new RolePic("mom", "lois.jpg", "Lois Wilkerson (Jane Kaczmarek)"),
     roleWife = new RolePic("wife", "courtney.jpg", "Courtney Love"),
     roleDaughter = new RolePic("daughter", "marcia.jpg", "Marcia Brady (Maureen McCormick)"),
     roleBowie = new RolePic(null,"bowie_you_awesome.gif", "David Bowie thinks you are awesome!")
];

var draggedPic;


// When drag event starts, setup to allow drag and drop
function drag (event) {
     console.log("drag FN start");
     console.log(event);
     draggedPic = event.target; // TODO draggedPic
     event.dataTransfer.setData("text", event.target.id);
     event.dataTransfer.effectAllowed = "move";
}


// onDrop: allow drop (default is prevent), reset box color
function drop (event) {
  console.log("drop");
     event.stopPropagation();
     event.stopImmediatePropagation();
     event.preventDefault();

     // Check if box id matches pic id and allow drop and then
     // Remove dragged pic from top space and data and add to correct box
     if (this.classList.contains("DnD__dropZone-dropHere")
        && this.id === draggedPic.id) {
          this.classList.remove("DnD__dropZone-active");
          var picID = event.dataTransfer.getData("text");
          event.target.appendChild(document.getElementById(picID));

          // Show next pic to drag again
          rolePics.shift();
          showPic();
     } else {
       this.classList.remove("DnD__dropZone-active");
     }
   }

// onDragOver and onDragEnter: UI update, box color
function showHover(event) {
    if (this.classList.contains("DnD__dropZone-dropHere")) {
         this.className += " DnD__dropZone-active";
         event.preventDefault();
    }
  }

// onDragleave: UI update, box color
function hideHover(event) {
   if (this.classList.contains("DnD__dropZone-active")) {
        this.classList.remove("DnD__dropZone-active");
        event.preventDefault();
      }
  }


// Show pic from array
function showPic() {
     var nextImage = document.createElement("img");
     nextImage.src = "img/roles/" + rolePics[0].fileName;
     nextImage.id = rolePics[0].id;
     nextImage.alt = rolePics[0].altText;
     document.querySelector(".DnD__toDrag-img").appendChild(nextImage);
}


// Sets up event listeners
function init() {
     // Show first pic to drag
     document.addEventListener('DOMContentLoaded', showPic);
     // Listen for drag
     document.querySelector(".DnD__toDrag-img").addEventListener("dragstart", drag, false);
     // Set up for drop zones on the page
     var dropZones = document.querySelectorAll(".DnD__dropZone-dropHere");
     // Add listeners for all the boxes that are drop zones
     for (i = 0; i < dropZones.length; i++) {
          dropZones[i].addEventListener("dragover", showHover, false);
          dropZones[i].addEventListener("dragenter", showHover, false);
          dropZones[i].addEventListener("dragleave", hideHover, false);
          dropZones[i].addEventListener("dragend", hideHover, false); // TODO
          dropZones[i].addEventListener("drop", drop, false);
      }
     // dragNDrop();
}


console.log("started");
// Begin
init();
