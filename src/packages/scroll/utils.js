import gsap from "gsap";
const one = (contentElements) => {
  const totalContentElements = contentElements.length;
  contentElements.forEach((el, position) => {
    const isLast = position === totalContentElements - 1;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=100%",
          scrub: true,
        },
      })
      .to(
        el,
        {
          ease: "none",
          startAt: { filter: "brightness(100%) contrast(100%)" },
          filter: isLast ? "none" : "brightness(60%) contrast(135%)",
          yPercent: isLast ? 0 : -15,
        },
        0
      )
      // Animate the content inner image
      .to(
        el.querySelector(".content__img"),
        {
          ease: "power1.in",
          yPercent: -40,
          rotation: -20,
        },
        0
      );
  });
};

const two = (contentElements) => {
  const totalContentElements = contentElements.length;
  contentElements.forEach((el, position) => {
    const isLast = position === totalContentElements - 1;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=100%",
          scrub: true,
        },
      })
      .to(
        el,
        {
          ease: "none",
          startAt: { filter: "brightness(100%)" },
          filter: isLast ? "none" : "brightness(50%)",
          scale: 0.95,
          borderRadius: 40,
        },
        0
      );
  });
};

const three = (contentElements) => {
  const totalContentElements = contentElements.length;
  contentElements.forEach((el, position) => {
    const isLast = position === totalContentElements - 1;
    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=100%",
          scrub: true,
        },
      })
      .set(el, {
        transformOrigin: `50% ${isLast ? 100 : 0}%`,
      })
      .to(
        el,
        {
          ease: "none",
          scale: 0,
        },
        0
      );
  });
};

const four = (contentElements) => {
  const totalContentElements = contentElements.length;
  contentElements.forEach((el, position) => {
    const isLast = position === totalContentElements - 1;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=100%",
          scrub: true,
        },
      })
      .set(el, {
        transformOrigin: `${position % 2 === 0 ? 0 : 100}% ${
          isLast ? 100 : 0
        }%`,
      })
      .to(
        el,
        {
          ease: "none",
          scale: 0,
          borderRadius: 200,
        },
        0
      );
  });
};

const five = (contentElements) => {
  const totalContentElements = contentElements.length;

  contentElements.forEach((el, position) => {
    const isLast = position === totalContentElements - 1;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=100%",
          scrub: true,
        },
      })
      .set(el, {
        transformOrigin: `${position % 2 === 0 ? 2 : 98}% ${isLast ? 0 : 2}%`,
      })
      .to(
        el,
        {
          ease: isLast ? "none" : "none",
          scale: 0,
          yPercent: isLast ? 100 : 0,
          rotation: position % 2 === 0 ? 10 : -10,
        },
        0
      );
  });
};

const six = (contentElements) => {
  const totalContentElements = contentElements.length;
  contentElements.forEach((el, position) => {
    const isLast = position === totalContentElements - 1;
    const inner = el.querySelector(".content__inner");

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=200%",
          scrub: true,
        },
      })
      .set(inner, {
        transformOrigin: "50% 0%",
      })
      .to(
        inner,
        {
          ease: "power1",
          startAt: { filter: "brightness(100%)" },
          filter: "brightness(60%)",
          scale: 0.9,
          rotationX: -90,
          yPercent: isLast ? 100 : 0,
        },
        0
      );
  });
};

const seven = (contentElements) => {
  const totalContentElements = contentElements.length;

  contentElements.forEach((el, position) => {
    const isLast = position === totalContentElements - 1;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "center center",
          end: "+=100%",
          scrub: true,
        },
      })
      .to(
        el,
        {
          ease: "none",
          scale: 0.6,
          opacity: 0,
          yPercent: isLast ? 125 : 0,
        },
        0
      );
  });
};

const eight = (contentElements) => {
  contentElements.forEach((el) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "center center",
          end: "max",
          scrub: true,
        },
      })
      .to(
        el,
        {
          ease: "none",
          startAt: { filter: "blur(0px)" },
          filter: "blur(3px)",
          scrollTrigger: {
            trigger: el,
            start: "center center",
            end: "+=100%",
            scrub: true,
          },
        },
        0
      )
      .to(
        el,
        {
          ease: "none",
          scale: 0.4,
          yPercent: -50,
        },
        0
      );
  });
};

const nine = (contentElements) => {
  const totalContentElements = contentElements.length;
  contentElements.forEach((el, position) => {
    const isLast = position === totalContentElements - 1;
    const isPreLast = position === totalContentElements - 2;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: () => {
            if (isLast) {
              return "top top";
            } else if (isPreLast) {
              return "bottom top";
            } else {
              return "bottom+=100% top";
            }
          },
          end: "+=100%",
          scrub: true,
        },
      })
      .to(
        el,
        {
          ease: "none",
          yPercent: -100,
        },
        0
      )
      // Animate the content inner image
      .fromTo(
        el.querySelector(".content__img"),
        {
          yPercent: 20,
          rotation: 40,
          scale: 0.8,
          filter: "contrast(400%)",
        },
        {
          ease: "none",
          yPercent: -100,
          rotation: 0,
          scale: 1,
          filter: "contrast(100%)",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "max",
            scrub: true,
          },
        },
        0
      );
  });
};

export const scroll = (contentElements, type = "one") => {
  switch (type) {
    case "one":
      one(contentElements);
      break;
    case "two":
      two(contentElements);
      break;
    case "three":
      three(contentElements);
      break;
    case "four":
      four(contentElements);
      break;
    case "five":
      five(contentElements);
      break;
    case "six":
      six(contentElements);
      break;
    case "seven":
      seven(contentElements);
      break;
    case "eight":
      eight(contentElements);
      break;
    case "nine":
      nine(contentElements);
      break;
    case "ten":
      ten(contentElements);
      break;
    case "eleven":
      eleven(contentElements);
      break;
    case "twelve":
      twelve(contentElements);
      break;
    case "thirteen":
      thirteen(contentElements);
      break;
    case "fourteen":
      fourteen(contentElements);
      break;
    case "fifteen":
      fifteen(contentElements);
      break;
    default:
      one(contentElements);
      break;
  }
};
