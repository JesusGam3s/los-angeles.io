let mybutton = document.getElementById("backToTopBtn");

window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        mybutton.style.display = "block"; 
    } else {
        mybutton.style.display = "none";
    }
};

function scrollToTop() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
}