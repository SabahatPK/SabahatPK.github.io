$(function() {
  //start document ready function
  $(document).on("click", 'a[href^="#"]', function(event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $($.attr(this, "href")).offset().top + -75
      },
      1000
    );
  }); // offsets anchor by 75px (size of the header) and adds in scroll animation
}); //end of document ready

//"Go to top" button:
mybutton = document.getElementById("myBtn");

window.onscroll = function() {
  scrollFunction();
};
function scrollFunction() {
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.documentElement.scrollTop = 0;
}
