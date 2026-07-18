const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");
const icon = menuBtn.querySelector("i");

menuBtn.onclick = () => {
    navbar.classList.toggle("active");

    // Mengubah ikon burger (bars) menjadi tanda silang (xmark) saat menu terbuka
    if (navbar.classList.contains("active")) {
        icon.classList.replace("fa-bars", "fa-xmark");
    } else {
        icon.classList.replace("fa-xmark", "fa-bars");
    }
};

// Menutup menu secara otomatis saat salah satu link navigasi diklik
document.querySelectorAll("#navbar a").forEach(link => {
    link.onclick = () => {
        navbar.classList.remove("active");
        icon.classList.replace("fa-xmark", "fa-bars");
    };
});