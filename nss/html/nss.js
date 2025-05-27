const menuToggle = document.querySelector('.toggle');
// console.log(menuToggle);
const showcase = document.querySelector('.showcase');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  showcase.classList.toggle('active');
})