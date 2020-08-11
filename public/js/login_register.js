(function() {
     document.querySelector(".form-title-registration").addEventListener("click", () => {
          document.querySelector(".form-title-login").classList.remove('active');
          document.querySelector(".form-title-registration").classList.add('active');

          document.querySelector(".login").style.display = "none";
          document.querySelector(".registration").style.display = "block";
     });


     document.querySelector(".form-title-login").addEventListener("click", () => {
          document.querySelector(".form-title-login").classList.add('active');
          document.querySelector(".form-title-registration").classList.remove('active');

          document.querySelector(".registration").style.display = "none";
          document.querySelector(".login").style.display = "block";
     });
}())