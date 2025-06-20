// GSAP Animation Only on Desktop (responsive to resizing)
let gsapEnabled = false;
let observerInstance;

function enableGsap() {
  if (gsapEnabled) return;
  gsapEnabled = true;

  gsap.registerPlugin(Observer);

  let sections = document.querySelectorAll("section"),
    images = document.querySelectorAll(".bg"),
    headings = gsap.utils.toArray(".section-heading"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

  gsap.set(outerWrappers, { yPercent: 100 });
  gsap.set(innerWrappers, { yPercent: -100 });

  function updateNavButtons() {
    const prevBtn = document.querySelector(".nav-link.prev");
    const nextBtn = document.querySelector(".nav-link.next");

    if (currentIndex === 0) {
      prevBtn.classList.add("disabled");
    } else {
      prevBtn.classList.remove("disabled");
    }

    if (currentIndex === sections.length - 1) {
      nextBtn.classList.add("disabled");
    } else {
      nextBtn.classList.remove("disabled");
    }
  }

  function gotoSection(index, direction) {
    if (index < 0 || index >= sections.length) return;

    animating = true;
    let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
          defaults: { duration: 1.25, ease: "power1.inOut" },
          onComplete: () => {
            animating = false;
            updateNavButtons();
          }
        });

    if (currentIndex >= 0) {
      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.to(images[currentIndex], { yPercent: -15 * dFactor })
        .set(sections[currentIndex], { autoAlpha: 0 });
    }

    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo([outerWrappers[index], innerWrappers[index]], {
        yPercent: i => i ? -100 * dFactor : 100 * dFactor
      }, {
        yPercent: 0
      }, 0)
      .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

    currentIndex = index;
  }

  observerInstance = Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => {
      if (!animating && currentIndex > 0) {
        gotoSection(currentIndex - 1, -1);
      }
    },
    onUp: () => {
      if (!animating && currentIndex < sections.length - 1) {
        gotoSection(currentIndex + 1, 1);
      }
    },
    tolerance: 10,
    preventDefault: true
  });

  gotoSection(0, 1);

  const prevBtn = document.querySelector(".nav-link.prev");
  const nextBtn = document.querySelector(".nav-link.next");

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!animating && currentIndex > 0) {
      gotoSection(currentIndex - 1, -1);
    }
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!animating && currentIndex < sections.length - 1) {
      gotoSection(currentIndex + 1, 1);
    }
  });

  updateNavButtons();
}

function disableGsap() {
  if (!gsapEnabled) return;
  gsapEnabled = false;

  if (observerInstance) {
    observerInstance.kill();
    observerInstance = null;
  }

  console.log("GSAP disabled due to small screen");
}

function checkViewportForGsap() {
  if (window.innerWidth >= 1024) {
    enableGsap();
  } else {
    disableGsap();
  }
}

window.addEventListener("resize", checkViewportForGsap);
document.addEventListener("DOMContentLoaded", checkViewportForGsap);


