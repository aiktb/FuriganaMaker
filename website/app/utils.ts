export function addTextRisingAnime() {
  const riseObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-rising");
        riseObserver.unobserve(entry.target);
      }
    }
  });
  for (const el of document.querySelectorAll(".animeRising")) {
    riseObserver.observe(el);
  }
}
