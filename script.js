const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

function activateTab(nextTab) {
  tabs.forEach((tab) => {
    const isSelected = tab === nextTab;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.id === nextTab.getAttribute("aria-controls");
    panel.hidden = !isActive;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    activateTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

const year = document.querySelector("#current-year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const canvas = document.querySelector("#spark-canvas");
const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

if (canvas && hero && canvas.getContext) {
  const context = canvas.getContext("2d");
  const particles = [];
  let frameId = null;
  let lastSpawn = 0;

  function resizeCanvas() {
    const rect = hero.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * scale);
    canvas.height = Math.round(rect.height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function draw() {
    const rect = hero.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.035;
      particle.life -= 0.025;
      particle.rotation += particle.spin;

      if (particle.life <= 0) {
        particles.splice(index, 1);
        continue;
      }

      context.save();
      context.globalAlpha = Math.max(particle.life, 0);
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.fillStyle = particle.color;
      context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      context.restore();
    }

    if (particles.length > 0) {
      frameId = requestAnimationFrame(draw);
    } else {
      frameId = null;
    }
  }

  function spawnParticle(event) {
    if (reducedMotion.matches || !finePointer.matches) {
      return;
    }

    const now = performance.now();
    if (now - lastSpawn < 42) {
      return;
    }
    lastSpawn = now;

    const rect = hero.getBoundingClientRect();
    const colors = ["#2457ff", "#ffe600", "#111318"];
    particles.push({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -0.55 - Math.random() * 1.2,
      size: 3 + Math.random() * 6,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.08,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });

    if (particles.length > 70) {
      particles.splice(0, particles.length - 70);
    }

    if (frameId === null) {
      frameId = requestAnimationFrame(draw);
    }
  }

  resizeCanvas();
  hero.addEventListener("pointermove", spawnParticle);
  window.addEventListener("resize", resizeCanvas);

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(hero);
}
