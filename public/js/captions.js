
// Caption data controller
var dataController = (function() {

     // Pre-populated caption data
     var newCaption = [
          "%Insert YOUR caption here.%",
          "Come on, add something funny, YOU CAN DO IT!",
          "HEY! Keep it PG-13!",
          "All the cool kids are writing their own captions.",
          "Hey, YOU, get in the game! Enter your own caption!",
          "Seriously, I know how creative you are. FEED ME CAPTIONS!"];

     // Add more preset strings to the array for ABOUT page
     if (document.querySelector("title").textContent.includes("About")) {
          newCaption.push(
               "J Boh the Damager",
               "If it's going to be that kind of party, I'll stick my thumb in the mashed potatoes!",
               "Jelly beans in the dryer... again!",
               "Happy St. Paddy's Day!",
               "That tea was HOT!");
     } else if (document.querySelector("title").textContent.includes("Web Developer")) {
          // Add more preset strings to the array for HOME page
          newCaption.push(
               "Oh, look, dinner!",
               "I'll give you my plastic bags when you pry (or take) it from my cold, dead hands!",
               "A tree grows in Brooklyn... (really)");
     } else if (document.querySelector("title").textContent.includes("Captions")) {
          // Add more preset strings to the array for SANDBOX page
          newCaption.push(
               "Introducing... the next Albert Einstein!",
               "Hey, who turned out the lights?",
               "Are you sure? I don't see any holes.",
               "Come out, come out wherever you are!");
     }

     var prevIndex = 0;

     return {
          // Return array of captions
          getData: function() {
               return newCaption;
          },

          // Return previous index used for caption aray
          getPrevIndex: function() {
               return prevIndex;
          },


          // Random number generator
          getRand: function(max, min, prev) {
               do {
                    var cur = parseInt(Math.random() * (max - min) + min);
                    // Prevent case when first rand generated was same before while
                    if (cur != prev) {

                         // Move the new random to the previous random
                         prevIndex = cur;
                         return cur;
                    }
               }
               // Check to make sure new random number isn't same as old one
               while (prev === cur);
          },

          addNewCaption: function(caption) {
               if (newCaption[0] === "%Insert YOUR caption here.%") {
                    newCaption.splice(0, 1);
               }
               newCaption.push(caption);
               return newCaption;
          }

     };

})();


var UIController = (function() {

     // Set pause variable to not paused
     var isPaused = false;

     return {

          // Show caption, auto-gen, from timer
          showCaption: function(cap) {
               document.getElementById("change-caption").value = cap;
               document.getElementById("change-caption").classList.remove('captions__form-fadeOut');
               document.getElementById("change-caption").className += ' captions__form-fadeIn';
               return false;
          },

          fadeCaption: function() {
              document.getElementById("change-caption").classList.remove('captions__form-fadeIn');
              document.getElementById("change-caption").className += ' captions__form-fadeOut';
          },

          // Show caption when user adds new
          capAdded: function () {
              document.getElementById("change-caption").className += ' captions__form-fadeIn';
          },

          // Clear contents of caption
          clearCaption: function() {
               document.getElementById("change-caption").value = "";
               return false;
          },

          // Show Rehash button
          showBtnRehash: function() {
               // Decrease text area to 80%
               document.getElementById("change-caption").className += " captions__form-narrow";

               // Add button with class, ID, text
               btnRehash = document.createElement('button');
               btnRehash.className = 'captions__rehash';
               btnRehash.id = 'rehash';
               btnRehash.type = 'button';
               var btnRehashText = document.createTextNode('Rehash');
               btnRehash.appendChild(btnRehashText);

               // Place button as child of form / next to text area
               var btnParent = document.getElementById("change-caption").parentNode;
               btnParent.appendChild(btnRehash);

               return false;
          }
     };

})();

var controller = (function(dataCtrl, UICtrl){

     var intervalID;

     // Change caption after specified idle time
     var changeCaptionOnTimer = function(maxLength, pauseTog) {
          // Initial timer data in seconds
          var timeIdle = 0;
          window.clearInterval(intervalID);

          if (!pauseTog) {
               intervalID = window.setInterval(function() {
                    // Increment each second
                    timeIdle++;
                    console.log(timeIdle);

                    // Check if every 5th second
                    if ((timeIdle % 5) == 0) {
                         // Show new caption using rand index
                         captionGen();
                    }

                    if (timeIdle === 4) {
                         UICtrl.fadeCaption();
                    }

               }, 1000);
          } else {
               window.clearInterval(intervalID);
          }
     };

     // Reset timer
     var resetTimer = function() {
          window.clearInterval(intervalID);
          timeIdle = 0;
          changeCaptionOnTimer(dataCtrl.getData().length, false);

     };

     // When user is focused on caption,
     // Clear caption display and pause timer
     var pauseTimer = function() {

          // Reset pause toggle, clear caption, reset timerID
          UICtrl.isPaused = true;
          UICtrl.clearCaption();
          window.clearInterval(intervalID);
          console.log("paused");

          // Pause timer
          changeCaptionOnTimer(dataCtrl.getData().length, true);

          // Restart auto-caption on blur
          document.getElementById("change-caption").addEventListener('blur', function() {
               changeCaptionOnTimer(dataCtrl.getData().length, false);
          });

     };


     // Show captions using random array index number as input
     var captionGen = function() {
          UICtrl.fadeCaption();
          resetTimer();

          // Get array of captions
          var captions = dataCtrl.getData();

          // Get new random index
          var newRand = dataCtrl.getRand(captions.length, 0, dataCtrl.getPrevIndex());
          // Use random index number to show rand caption
          UICtrl.showCaption(captions[newRand]);
     };

     var captureNewCaption = function() {
          // Get new caption and add to array
          // Display this caption
          var newCap = document.getElementById("change-caption").value;
          if (newCap) {
               dataCtrl.addNewCaption(newCap);
               UICtrl.capAdded();
               document.getElementById("change-caption").blur();
          }

          // Show rehash button after user presses Enter
         if (document.getElementById("rehash") == undefined) {
              UICtrl.showBtnRehash();
              // Listen for click on Rehash button to generate new caption
              document.getElementById("rehash").addEventListener("click", captionGen);
         }

         changeCaptionOnTimer(dataCtrl.getData().length, false);

     };

     var setupEventListeners = function() {

          // Load captions on timer
          document.addEventListener("DOMContentLoaded", function(){
                    changeCaptionOnTimer(dataCtrl.getData().length, false);
          });

          // Events that detect user input and reset idle timer
          document.addEventListener("scroll", resetTimer);
          document.addEventListener("touchmove", resetTimer);
          document.addEventListener("mousemove", resetTimer);
          document.addEventListener("pointermove", resetTimer);

          // When user clicks on caption, pause timer, clear caption
          document.getElementById("change-caption").addEventListener('focus', pauseTimer);

          // On Enter, capture new caption
          document.getElementById("change-caption").addEventListener('keypress', function(event) {
               if (event.keyCode == 13) {
                    captureNewCaption();
               }
          });
     };


     return {
          init: function() {
               console.log("app started");
               setupEventListeners();
          }
     };

})(dataController, UIController);

controller.init();
