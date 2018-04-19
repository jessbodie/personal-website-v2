var dataController = (function() {

    var curFeature = {
      image: '',
      title: '',
      descrip: ''
    };

    var prevClickedFeature = {
      image: '',
      title: '',
      descrip: ''
    };

    var projToggleID;
    var prevFeature;
    var nextFeature;


    return {

      // Load list of projects from JSON
      loadJSON: function(listReady) {
        var listURL = "data/projects_list.json";   
        // var listURL = "http://www.panix.com/~ianr/jbr/data/projects_list.json";   
        var list = new XMLHttpRequest();
            // list.overrideMimeType("application/json");
            list.open('GET', listURL); 
            list.responseType = "json";
            list.send();
    
            // After successful data load, call fn to show JSON
            list.onreadystatechange = function () {
              if (list.readyState === 4 && list.status == "200") {
                var listJSON = list.response;
                // Workaround because IE 11 isn't supporting responseType
                if (typeof listJSON === 'string') {
                  listJSON = JSON.parse(listJSON);
               }
                listReady(listJSON);
              } 
          };
      },
    
      getCurFeature: function() {
        return curFeature;
      },

      getPrevFeature: function() {
        return prevFeature;
      },

      getNextFeature: function() {
        return nextFeature;
      },

      getPrevClickedFeature: function() {
        return prevClickedFeature;
      },

      getCurNode: function() {
        return projToggleID;
      },

      updateFeature: function(cur) {

        // Set the previous feature data to what was current feature
        prevClickedFeature.image = curFeature.image;
        prevClickedFeature.title = curFeature.title;
        prevClickedFeature.descrip = curFeature.descrip;

        // Currently selected node
        projToggleID = cur.parentNode.parentNode;

        // If there is node BEFORE current, set data for it, else set to null
        if (projToggleID.parentNode.previousElementSibling) {
          prevFeature = projToggleID.parentNode.previousElementSibling.children[1];
        } else {
          prevFeature = null;
        }

        // If there is node AFTER current, set data for it, else set to null
        if (projToggleID.parentNode.nextElementSibling) {
          nextFeature = projToggleID.parentNode.nextElementSibling.children[1];
        } else  {
          nextFeature = null;
        }

        // Title text (displayed on  mobile) from list for feature area
        var curProjTitle = projToggleID.nextSibling.nextSibling.childNodes[1].childNodes[1];

        // Descriptive text (displayed on  mobile) from list for feature area
        var curProjDescrip = projToggleID.nextSibling.nextSibling.childNodes[1].childNodes[3];
        // Update data for current feature
        curFeature.image = cur;
        curFeature.title = curProjTitle;
        curFeature.descrip = curProjDescrip;

      }

    }

})();



var UIController = (function() {

  return {
    // Show all projects from JSON
    showAllProjects: function(p) {
      // console.log(p);

      for (var i = 0; i < p.length; i++) {
        var newProjDiv = document.createElement("div");
        document.getElementById("list").appendChild(newProjDiv);
        newProjDiv.outerHTML = "<div class='list__container'><input id='toggle" + i +"' type='checkbox' unchecked>  <label for='toggle" + i +"'>  <div class='list__container-image' data-aos='fade-up' data-aos-once='true'> <div class='list__container-header'> <div class='list__container-header-rotate'> <h2 class='heading-secondary'>" + p[i].label + "</h2> </div> </div> <img src='" + p[i].screenshot + "' alt='" + p[i].alt + "'> </div> </label> <div id='expand'> <div class='list__container-text' id='proj-text-" + i + "'> <h3 class='heading-tertiary'>" + p[i].title + "</h3>" + p[i].description + "</div> </div> </div>";
        // If object has link, add it
        if (p[i].link) {
          var featLink = document.createElement("a");
          featLink.href = p[i].link;
          featLink.target = "_blank";
          // console.log(featLink);
          document.getElementById("proj-text-" + i).appendChild(featLink);
        }
      }
    },

    // Show the image and text for selected project in feature area
    showFeature: function (projImage) {
      // Find parent Div of selected project, with ID
      var projToggleID = projImage.parentNode.parentNode;

      // Get title, descrip (displayed on  mobile only)
      var projTitle = projToggleID.nextSibling.nextSibling.childNodes[1].childNodes[1]; 
      var projDescrip = projToggleID.nextSibling.nextSibling.childNodes[1].childNodes[2];
      var projLink = projToggleID.nextSibling.nextSibling.childNodes[1].childNodes[3];

      // Define where featured image and text should appear
      var featuredImageDiv = document.getElementById("feature-container").childNodes[3];
      var featuredTextDiv = document.getElementById("feature-container").childNodes[5];


      // Clone image, title, descrip that was selected from list
      // To show in top featured area
      var featuredImage = projImage.cloneNode();
      var featuredDescrip = projDescrip.cloneNode(true);
      var featuredTitle = projTitle.cloneNode(true);

      var featuredLink;
      // Add link to image in featured area
      if (projLink) {
        featuredLink = projLink.cloneNode();
        featuredLink.appendChild(featuredImage);
        } else {
          featuredLink = featuredImage;
        }
    
      //Remove u-hidden and add u-visible
      document.getElementById("section-featured").classList.remove('u-hidden');
      document.getElementById("section-featured").className += ' u-visible';

    
      // Check if featured image already
      if (featuredImageDiv.childNodes[1]) {

        // Add newly featured
        featuredImageDiv.appendChild(featuredLink);

        featuredTextDiv.appendChild(featuredTitle);
        featuredTextDiv.appendChild(featuredDescrip);
        document.getElementById("hero").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

        // Remove previously featured
        // Add first, then remove to avoid iOS scrolling bug
        featuredImageDiv.removeChild(featuredImageDiv.childNodes[1]);
        featuredTextDiv.removeChild(featuredTextDiv.childNodes[1]);
        // Since first child was just removed, formerly 2nd child now first child
        featuredTextDiv.removeChild(featuredTextDiv.childNodes[1]);
        
      } else {
        // If no featured image already
        // Add cloned image, title, descrip to featured area
        featuredImageDiv.appendChild(featuredLink);
        featuredTextDiv.appendChild(featuredTitle);
        featuredTextDiv.appendChild(featuredDescrip);
        document.getElementById("hero").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      }
    },

    closeFeature: function () {
      document.getElementById("section-featured").classList.remove('u-visible');
      document.getElementById("section-featured").className += ' u-hidden';

    },

    hideBtn: function (id) {
      document.getElementById(id).className += ' u-visibility';
    },

    showBtn: function (id) {
      document.getElementById(id).classList.remove('u-visibility');
    }


  }

})();



var controller = (function(dataCtrl, UICtrl){

    // Convert the event's target in order to call updateFeature with the target var
    var evTarget = function (ev) {
      updateFeat(ev.target);
    }

    // Update the feature section
    var updateFeat = function(feat) {
      // Get previous featured
      var curFeat = dataCtrl.getCurFeature();

      dataCtrl.getPrevClickedFeature(); // TODO Don't reload feature if already selected

      // Set currently selected, previous node, next node
      dataCtrl.updateFeature(feat);

      // Show new featured
      UICtrl.showFeature(feat, curFeat);

      // If current feature is first, hide previous button
      var isPrevFeat = dataCtrl.getPrevFeature();
      var prevBtn = document.getElementById("list__featured-prev");
      var prevBtnID = "list__featured-prev";

      if (isPrevFeat == null) {
        UICtrl.hideBtn(prevBtnID);
      } else if (prevBtn.className === "list__featured-prev u-visibility") {
        UICtrl.showBtn(prevBtnID);
      }

      // If current feature is last, hide last button
      var isNextFeat = dataCtrl.getNextFeature();
      var nextBtn = document.getElementById("list__featured-next");
      var nextBtnID = "list__featured-next";

      if (isNextFeat == null) {
        UICtrl.hideBtn(nextBtnID);
      } else if (nextBtn.className === "list__featured-next u-visibility") {
        UICtrl.showBtn(nextBtnID);
      }

      // Add listener for previous/next on arrow keys
      document.addEventListener("keydown", function(e) {
        if (e.defaultPrevented) {
          return; // Return if the event was already processed
        }

        switch (e.key) {
          case "ArrowLeft": 
            prevFeat();
            break;
          case "ArrowRight": 
            nextFeat();
            break;
        }

        // Cancel the default action to avoid it being handled more than once
        e.preventDefault();
      }, true);
      
    }

    // When Previous Button clicked, check for Previous, then update
    var prevFeat = function () {
      var prev = dataCtrl.getPrevFeature();
      if (prev) {
        var prevImage = prev.children[0].children[1];
        updateFeat(prevImage);

        // If Previous Button clicked, re-display Next button
        var nextBtnID = "list__featured-next";
        UICtrl.showBtn(nextBtnID);
      }
    }


    // When Next Button clicked, check for Next, then update
    var nextFeat = function () {
      var next = dataCtrl.getNextFeature();
      if (next) {
        var nextImage = next.children[0].children[1];
        updateFeat(nextImage);

        // If Next Button clicked, re-display Previous button
        var prevBtnID = "list__featured-prev";
        UICtrl.showBtn(prevBtnID);
      }
    }

    var setupEventListeners = function() {
      // Setup to detect window width
      var w = window.innerWidth;

      // On resize, update event listeners
      window.addEventListener('resize', resizeReset);

      // Listeners for showing project in featured area
      var divList = document.querySelectorAll('.list__container-image > img');
      for (var i = 0; i < divList.length; i++) {
        // If window width greater than 600, listener to show top feature area
        if (w >= 600) {
          // console.log(divList[i]);
          divList[i].addEventListener('click', evTarget);
          divList[i].addEventListener('focus', evTarget);
        } else {
          // Less than 600px, listener to scroll current project into view
          divList[i].addEventListener('click', function(el) {
            var projContainer = el.target.parentNode.parentNode.parentNode;
            // console.log(projContainer);
            projContainer.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
          });
        }
      }

      // Listener for close button
      document.getElementById('list__featured-close').addEventListener('click', UICtrl.closeFeature);

      // Listener for previous button
      document.getElementById('list__featured-prev').addEventListener('click', prevFeat);

      // Listener for next button
      document.getElementById('list__featured-next').addEventListener('click', nextFeat);

    }

    // When user resizes window, reset the listeners. (For edge use case.)
    var resizeReset = function() {

      // Listeners for showing project in featured area
      var divList = document.querySelectorAll('.list__container-image > img');
      for (var i = 0; i < divList.length; i++) {

        // Remove listeners
          divList[i].removeEventListener('click', evTarget);
          divList[i].removeEventListener('focus', evTarget);
          divList[i].removeEventListener('click', function(el) {
            el.target.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
          });
        }

        setupEventListeners();
      }

    // Draw list of Projects
    var projectList = function(list) {
      UICtrl.showAllProjects(list);
    }



    return {
      init: function() {
        // Load Projects List JSON
        dataCtrl.loadJSON(controller.projListReady);
      }, 

      // When JSON data is loaded -       
      projListReady: function(allJSONData) {
        // Initiate showing of each project
        projectList(allJSONData);

        // Event Listeners
        setupEventListeners();
      }    
    
    }

})(dataController, UIController);

controller.init();
