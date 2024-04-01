/*===== MENU TOGGLE =====*/ 
document.getElementById('nav-toggle').addEventListener('click', function() {
  var navMenu = document.getElementById('nav-menu');
  if (navMenu.style.display === 'flex') {
      navMenu.style.display = 'none';
  } else {
      navMenu.style.display = 'flex';
  }
});

/*==================== REMOVE MENU MOBILE ====================*/ 
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== PROFILE TOGGLE ====================*/ 
// Toggle profile card visibility
const profileImage = document.getElementById("profile-image");
const profileCard = document.getElementById("profile-card");

profileImage.addEventListener("click", () => {
    profileCard.style.display = profileCard.style.display === "block" ? "none" : "block";
});

// Close profile card when clicking outside
document.addEventListener("click", (event) => {
    if (!profileCard.contains(event.target) && event.target !== profileImage) {
        profileCard.style.display = "none";
    }
});