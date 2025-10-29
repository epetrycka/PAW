const menuToggleBtn = document.getElementById('menu-toggle-btn');
const sidebar = document.getElementById('sidebar');

menuToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-collapsed');
});