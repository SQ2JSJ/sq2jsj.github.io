(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const setOpen = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
    header && header.classList.toggle("is-open", open);
  };
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  const figures = Array.from(document.querySelectorAll(".gal figure"));
  if (!figures.length) return;

  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  const lbCount = lb.querySelector(".lb-count");
  const btnClose = lb.querySelector(".lb-close");
  const btnPrev = lb.querySelector(".lb-prev");
  const btnNext = lb.querySelector(".lb-next");
  let index = 0;

  const show = (i) => {
    index = (i + figures.length) % figures.length;
    const fig = figures[index];
    const img = fig.querySelector("img");
    const cap = fig.querySelector("figcaption");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || "";
    lbCap.textContent = cap ? cap.textContent : "";
    lbCount.textContent = index + 1 + " / " + figures.length;
  };

  const open = (i) => {
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    btnClose.focus();
  };
  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
  };

  figures.forEach((fig, i) => {
    fig.setAttribute("tabindex", "0");
    fig.setAttribute("role", "button");
    const cap = fig.querySelector("figcaption");
    fig.setAttribute("aria-label", "Powiększ: " + (cap ? cap.textContent : "zrzut ekranu"));
    const activate = (e) => {
      if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
      if (e.type === "keydown") e.preventDefault();
      open(i);
    };
    fig.addEventListener("click", activate);
    fig.addEventListener("keydown", activate);
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => show(index - 1));
  btnNext.addEventListener("click", () => show(index + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
