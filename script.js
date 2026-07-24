const CONFIG = {
  whatsappNumber: "6289523156254",
  pricePerEgg: 2200,
};

const siteHeader = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

function closeNavigation() {
  navToggle?.classList.remove("active");
  mainNav?.classList.remove("open");
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Buka menu navigasi");
}

navToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.classList.toggle("active", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
});

mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));

window.addEventListener("scroll", () => {
  siteHeader?.classList.toggle("scrolled", window.scrollY > 18);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -30px" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const packageSelect = document.getElementById("packageSelect");
const quantityInput = document.getElementById("quantity");
const decreaseQty = document.getElementById("decreaseQty");
const increaseQty = document.getElementById("increaseQty");
const totalEggs = document.getElementById("totalEggs");
const totalPrice = document.getElementById("totalPrice");
const orderForm = document.getElementById("orderForm");

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function sanitizeQuantity(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 1;
  return Math.min(99, Math.max(1, parsed));
}

function updateOrderSummary() {
  if (!packageSelect || !quantityInput) return;
  const eggsPerPackage = Number(packageSelect.value);
  const quantity = sanitizeQuantity(quantityInput.value);
  quantityInput.value = quantity;

  const eggs = eggsPerPackage * quantity;
  const price = eggs * CONFIG.pricePerEgg;
  totalEggs.textContent = `${eggs.toLocaleString("id-ID")} butir`;
  totalPrice.textContent = rupiah.format(price);
}

decreaseQty?.addEventListener("click", () => {
  quantityInput.value = sanitizeQuantity(Number(quantityInput.value) - 1);
  updateOrderSummary();
});

increaseQty?.addEventListener("click", () => {
  quantityInput.value = sanitizeQuantity(Number(quantityInput.value) + 1);
  updateOrderSummary();
});

quantityInput?.addEventListener("input", updateOrderSummary);
packageSelect?.addEventListener("change", updateOrderSummary);

function scrollToOrder() {
  document.getElementById("pesan")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll(".product-order").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const eggCount = card?.dataset.eggs;
    if (eggCount && packageSelect) {
      packageSelect.value = eggCount;
      quantityInput.value = 1;
      updateOrderSummary();
    }
    scrollToOrder();
  });
});

orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const eggsPerPackage = Number(packageSelect.value);
  const quantity = sanitizeQuantity(quantityInput.value);
  const eggs = eggsPerPackage * quantity;
  const price = eggs * CONFIG.pricePerEgg;
  const selectedText = packageSelect.options[packageSelect.selectedIndex].text;

  const message = [
    "Halo Bayan Farm & Egg, saya ingin memesan telur ayam kampung Elba.",
    "",
    `Paket: ${selectedText}`,
    `Jumlah pembelian: ${quantity}`,
    `Total telur: ${eggs.toLocaleString("id-ID")} butir`,
    `Estimasi harga: ${rupiah.format(price)}`,
    "",
    "Mohon info ketersediaan dan ongkirnya. Terima kasih.",
  ].join("\n");

  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const button = item.querySelector("button");
  button?.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    faqItems.forEach((other) => {
      other.classList.remove("active");
      other.querySelector("button")?.setAttribute("aria-expanded", "false");
    });
    if (!isActive) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const testimonialTrack = document.getElementById("testimonialTrack");
const testimonialCards = Array.from(document.querySelectorAll(".testimonial-card"));
const sliderDots = document.getElementById("sliderDots");
const prevTestimonial = document.getElementById("prevTestimonial");
const nextTestimonial = document.getElementById("nextTestimonial");
let activeTestimonial = 0;
let testimonialTimer;

function visibleCards() {
  if (window.innerWidth >= 860) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function maxTestimonialIndex() {
  return Math.max(0, testimonialCards.length - visibleCards());
}

function rebuildDots() {
  if (!sliderDots) return;
  sliderDots.innerHTML = "";
  const count = maxTestimonialIndex() + 1;
  for (let index = 0; index < count; index += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Tampilkan ulasan ${index + 1}`);
    dot.addEventListener("click", () => goToTestimonial(index));
    sliderDots.appendChild(dot);
  }
}

function goToTestimonial(index) {
  if (!testimonialTrack || testimonialCards.length === 0) return;
  activeTestimonial = Math.min(maxTestimonialIndex(), Math.max(0, index));
  const cardWidth = testimonialCards[0].getBoundingClientRect().width;
  const gap = window.innerWidth >= 640 ? 16 : 0;
  testimonialTrack.style.transform = `translateX(-${activeTestimonial * (cardWidth + gap)}px)`;
  sliderDots?.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeTestimonial);
  });
}

function restartTestimonialTimer() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => {
    const nextIndex = activeTestimonial >= maxTestimonialIndex() ? 0 : activeTestimonial + 1;
    goToTestimonial(nextIndex);
  }, 5000);
}

prevTestimonial?.addEventListener("click", () => {
  const previousIndex = activeTestimonial <= 0 ? maxTestimonialIndex() : activeTestimonial - 1;
  goToTestimonial(previousIndex);
  restartTestimonialTimer();
});

nextTestimonial?.addEventListener("click", () => {
  const nextIndex = activeTestimonial >= maxTestimonialIndex() ? 0 : activeTestimonial + 1;
  goToTestimonial(nextIndex);
  restartTestimonialTimer();
});

window.addEventListener("resize", () => {
  activeTestimonial = Math.min(activeTestimonial, maxTestimonialIndex());
  rebuildDots();
  goToTestimonial(activeTestimonial);
});

rebuildDots();
goToTestimonial(0);
restartTestimonialTimer();
updateOrderSummary();

document.getElementById("currentYear").textContent = new Date().getFullYear();
