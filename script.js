/* ── ARV Realty — script.js ─────────────────────────────────────── */

/* ─── Selectors ─────────────────────────────────────────────────── */
const navbar = document.querySelector(".header .navbar");
const contactInfo = document.getElementById("contactInfo");
const galleryModal = document.getElementById("galleryModal");

/* ─── Mobile menu ────────────────────────────────────────────────── */
document.getElementById("menu-btn").onclick = () => {
  navbar.classList.toggle("active");
};

/* ─── Contact drawer ─────────────────────────────────────────────── */
document.getElementById("info-btn").onclick = openContactInfo;
document.getElementById("close-contact-info").onclick = closeContactInfo;

function openContactInfo() {
  contactInfo.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeContactInfo() {
  contactInfo.classList.remove("active");
  document.body.style.overflow = "";
}

// Backdrop click closes drawer
contactInfo.addEventListener("click", (e) => {
  if (e.target === contactInfo) closeContactInfo();
});

/* ─── Scroll — close only the navbar, NOT the drawer ────────────── */
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.remove("active");
  },
  { passive: true },
);

/* ─── Escape key ─────────────────────────────────────────────────── */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (galleryModal.classList.contains("active")) closeGallery();
  else if (contactInfo.classList.contains("active")) closeContactInfo();
});

/* ─── Lazy-load videos with IntersectionObserver ────────────────── */
/*
  Videos have  preload="none"  and store their URL in  data-src.
  When a video enters the viewport for the first time we:
    1. Set src from data-src  →  browser starts downloading
    2. Call .play()           →  starts playing (muted autoplay allowed)
  This means videos that are never scrolled to are never downloaded.
*/
const lazyVideos = Array.from(document.querySelectorAll("video[data-src]"));

if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const video = entry.target;
        video.src = video.dataset.src;
        video.load();
        video.play().catch(() => {}); // silently ignore autoplay policy errors
        videoObserver.unobserve(video);
      });
    },
    { rootMargin: "200px" },
  ); // start loading 200px before entering view

  lazyVideos.forEach((v) => videoObserver.observe(v));
} else {
  // Fallback for older browsers: load all immediately
  lazyVideos.forEach((v) => {
    v.src = v.dataset.src;
    v.load();
    v.play().catch(() => {});
  });
}

/* ─── Home slider ────────────────────────────────────────────────── */
new Swiper(".home-slider", {
  loop: true,
  grabCursor: true,
  navigation: {
    nextEl: ".home-slider .swiper-button-next",
    prevEl: ".home-slider .swiper-button-prev",
  },
});

/* ─── Leaders slider ─────────────────────────────────────────────── */
new Swiper(".leaders-slider", {
  loop: true,
  grabCursor: true,
  spaceBetween: 30,
  slidesPerView: 1,
  breakpoints: {
    768: { slidesPerView: 2, spaceBetween: 30 },
  },
});

/* ═══════════════════════════════════════════════════════════════════
   GALLERY MODAL — custom slider (no Swiper, no loop-mode bugs)
   ═══════════════════════════════════════════════════════════════════ */
const modalClose = document.getElementById("modalClose");
const modalCounter = document.getElementById("modalCounter");
const modalPagEl = document.getElementById("modalPagination");

// We repurpose the existing #modalSwiperWrapper as our image stage
const modalStage = document.getElementById("modalSwiperWrapper");

// Re-use the existing nav buttons already in the HTML
const modalNext = document.querySelector("#modalSwiper .swiper-button-next");
const modalPrev = document.querySelector("#modalSwiper .swiper-button-prev");

let galleryImages = [];
let currentIndex = 0;

/* ── Render the image at `index` ──────────────────────────────────── */
function showSlide(index) {
  // Clamp / wrap
  currentIndex =
    ((index % galleryImages.length) + galleryImages.length) %
    galleryImages.length;

  // Show image — reuse a single <img> so the browser can cache between swipes
  const existing = modalStage.querySelector("img");
  const img = existing || document.createElement("img");
  img.src = galleryImages[currentIndex];
  img.alt = "Project image";
  img.draggable = false;
  if (!existing) modalStage.appendChild(img);

  // Counter
  modalCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;

  // Pagination dots
  modalPagEl.querySelectorAll(".g-dot").forEach((dot, i) => {
    dot.classList.toggle("g-dot--active", i === currentIndex);
  });
}

/* ── Open ─────────────────────────────────────────────────────────── */
function openGallery(images) {
  if (!images || !images.length) return;
  galleryImages = images;

  // Build pagination dots
  modalPagEl.innerHTML = images
    .map(
      (_, i) => `<span class="g-dot${i === 0 ? " g-dot--active" : ""}"></span>`,
    )
    .join("");

  // Dot clicks
  modalPagEl.querySelectorAll(".g-dot").forEach((dot, i) => {
    dot.addEventListener("click", () => showSlide(i));
  });

  // Show/hide nav arrows (no point showing them for a single image)
  const multiImage = images.length > 1;
  modalNext.style.display = multiImage ? "" : "none";
  modalPrev.style.display = multiImage ? "" : "none";

  galleryModal.classList.add("active");
  document.body.style.overflow = "hidden";
  showSlide(0);
}

/* ── Navigation ───────────────────────────────────────────────────── */
modalNext.addEventListener("click", () => showSlide(currentIndex + 1));
modalPrev.addEventListener("click", () => showSlide(currentIndex - 1));

/* ── Touch / swipe support ────────────────────────────────────────── */
let touchStartX = 0;
modalStage.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.touches[0].clientX;
  },
  { passive: true },
);
modalStage.addEventListener(
  "touchend",
  (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) showSlide(currentIndex + (delta < 0 ? 1 : -1));
  },
  { passive: true },
);

/* ── Close ────────────────────────────────────────────────────────── */
function closeGallery() {
  galleryModal.classList.remove("active");
  document.body.style.overflow = "";
  setTimeout(() => {
    modalStage.innerHTML = "";
    modalPagEl.innerHTML = "";
    galleryImages = [];
  }, 180);
}

modalClose.addEventListener("click", closeGallery);
galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) closeGallery();
});

// Expose for inline onclick
window.openGallery = openGallery;

/* ─── Contact form — Web3Forms AJAX submission ───────────────────── */
/*
  Submits via fetch so the visitor never leaves the page.
  Shows a success or error message in #formStatus.
*/
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.value = "Sending…";
    submitBtn.disabled = true;

    try {
      const data = new FormData(contactForm);
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        formStatus.textContent = "✅ Thank you! We'll be in touch soon.";
        formStatus.style.color = "#2a7a4b";
        contactForm.reset();
      } else {
        throw new Error(json.message || "Submission failed");
      }
    } catch (err) {
      formStatus.textContent =
        "❌ Something went wrong. Please email us directly at arv.riverdale@gmail.com";
      formStatus.style.color = "#b00020";
    } finally {
      formStatus.style.display = "block";
      submitBtn.value = "Send Message";
      submitBtn.disabled = false;
    }
  });
}
