// Replace the introductory question text with actual name/title text
var name = "jess bodie richards"
var title = "web developer"

// Listen for 1st animations to end, then fade in new text
document.getElementById("showName").addEventListener("animationend", fadeNewText);
document.getElementById("showTitle").addEventListener("animationend",  fadeNewText);

function fadeNewText (e) {
    e.target.setAttribute("style", "font-size: 3rem; animation-name: fadeIn; animation-delay: 2s; animation-duration: 5s;")

    if (e.target.id === "showName") {
        e.target.textContent = name;
        document.getElementById("showName").removeEventListener("animationend", fadeNewText);
    } else if (e.target.id === "showTitle") {
        e.target.textContent = title;
        document.getElementById("showTitle").removeEventListener("animationend", fadeNewText);
    }
}
