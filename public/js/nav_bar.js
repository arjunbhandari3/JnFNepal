var mobile = false;
(function(){
     if (getComputedStyle(document.querySelector(".elevenSensor")).color === "rgb(0, 0, 255)"){
          mobile = true;
          document.querySelector("#header").classList.remove('unScroll');
     }
}())

window.addEventListener('resize', function(event) {
     senseOperation(document.documentElement.scrollTop);
});


window.addEventListener('scroll', function(e) {
     senseOperation(e.pageY);
});

function senseOperation(pageY){
     if (getComputedStyle(document.querySelector(".elevenSensor")).color === "rgb(0, 0, 255)"){
          mobile = true;
     } else {
          mobile = false;
     }
     if (pageY <= 10 && !mobile    ) {
               document.querySelector("#header").classList.add('unScroll');
     } else {
          document.querySelector("#header").classList.remove('unScroll');
     }
}

document.querySelector('#toggle_nav').addEventListener('click', () => {
     if (!document.querySelector('#header > div').style.display || document.querySelector('#header > div').style.display == "none"){
          document.querySelector('#header > div').style.display = "block";
     } else {
          document.querySelector('#header > div').style.display = "none";
     }
});