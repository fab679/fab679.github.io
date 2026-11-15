/* Small, dependency-free page behavior: reveal sections and a gentle
   pointer parallax on the hero specimen. Reduced motion is respected. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sections = document.querySelectorAll(".section, .local-panel, .footer");
  if (!reduce && "IntersectionObserver" in window) {
    sections.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    sections.forEach((el) => io.observe(el));
  }

  const visual = document.querySelector(".hero-visual");
  const frame = document.querySelector(".canvas-frame");
  if (!reduce && visual && frame && matchMedia("(pointer: fine)").matches) {
    visual.addEventListener("pointermove", (e) => {
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = `perspective(1200px) rotateX(${(-y * 1.2).toFixed(2)}deg) rotateY(${(x * 1.6).toFixed(2)}deg)`;
    });
    visual.addEventListener("pointerleave", () => { frame.style.transform = ""; });
  }

  // Keep the sticky nav from covering anchor targets.
  const nav = document.querySelector(".nav");
  if (nav) {
    const h = nav.getBoundingClientRect().height + 12;
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + scrollY - h;
        scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      });
    });
  }
})();
