// Store references to inportant elements.
let outer_div = document.getElementById("outer-div");

function changeWidthDiv(media_query) {
    // If the width of the screen is at max 900px, then make the width 75vw
    if (media_query.matches) {
      outer_div.classList.add("w-75");
      outer_div.classList.remove("w-50");
    // Otherwise, make the width 50vw
    } else {
      outer_div.classList.add("w-50");
      outer_div.classList.remove("w-75");
    }
  }
  
  var media_query = window.matchMedia("(max-width: 900px)")
  changeWidthDiv(media_query) // Call listener function at run time
  media_query.addListener(changeWidthDiv) // Attach listener function on state changes