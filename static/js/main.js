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