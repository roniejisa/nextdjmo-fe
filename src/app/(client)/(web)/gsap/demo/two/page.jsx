/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import "../style.css";
import Lenis from "lenis";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";
import { scroll } from "@/packages/scroll/utils";
gsap.registerPlugin(ScrollTrigger);
const page = () => {
  useEffect(() => {
    const initSmoothScrolling = () => {
      // Instantiate the Lenis object with specified properties
      const lenis = new Lenis({
        lerp: 0.2, // Lower values create a smoother scroll effect
        smoothWheel: true, // Enables smooth scrolling for mouse wheel events
      });

      // Update ScrollTrigger each time the user scrolls
      lenis.on("scroll", () => {
        ScrollTrigger.update();
        console.log("hehe");
      });

      // Define a function to run at each animation frame
      const scrollFn = (time) => {
        lenis.raf(time); // Run Lenis' requestAnimationFrame method
        requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
      };
      // Start the animation frame loop
      requestAnimationFrame(scrollFn);
    };
    const contentElements = [...document.querySelectorAll(".content--sticky")];
    initSmoothScrolling();
    scroll(contentElements, "nine");
    return () => {
      gsap.killTweensOf(".content--sticky");
    };
  }, []);
  return (
    <div>
      <div class="content content--highlight content--intro">
        <p class="text-large">
          As data conglomerates reveled in the opulence of cognitive wealth, a
          silent underclass manifested, condemned to the digital periphery.
        </p>
      </div>
      <div class="wrap">
        <div class="content content--sticky content--half bg-1">
          <img class="content__img content__img--small" src="images/img.jpg" />
          <h2 class="content__title">
            <i>The</i> Algorithm
          </h2>
          <p class="content__text content__text--narrow text-meta">
            The algorithm's workings are shrouded in complexity.
          </p>
        </div>
        <div class="content content--sticky content--half bg-2">
          <img class="content__img content__img--small" src="images/img.jpg" />
          <h2 class="content__title">
            <i>The</i> Dogma
          </h2>
          <p class="content__text content__text--narrow text-meta">
            Enshrining the principles of conformity and reinforcing the status
            quo.
          </p>
        </div>
        <div class="content content--sticky content--half bg-3">
          <img class="content__img content__img--small" src="images/img.jpg" />
          <h2 class="content__title">
            <i>The</i> Architects
          </h2>
          <p class="content__text content__text--narrow text-meta">
            The elusive entities, lacking human form, operate in the shadows.
          </p>
        </div>
        <div class="content content--sticky content--half bg-4">
          <img class="content__img content__img--small" src="images/img.jpg" />
          <h2 class="content__title">
            <i>The</i> Wasteland
          </h2>
          <p class="content__text content__text--narrow text-meta">
            This overlooked realm, a consequence of algorithmic judgments.
          </p>
        </div>
        <div class="content content--sticky content--half bg-5">
          <img class="content__img content__img--small" src="images/img.jpg" />
          <h2 class="content__title">
            <i>The</i> Narrative
          </h2>
          <p class="content__text content__text--narrow text-meta">
            The collective story sculpted by the architects.
          </p>
        </div>
        <div class="content content--sticky content--half bg-6">
          <img class="content__img content__img--small" src="images/img.jpg" />
          <h2 class="content__title">
            <i>The</i> Opulence
          </h2>
          <p class="content__text content__text--narrow text-meta">
            The cognitive elite's wealth in the algorithmic society.
          </p>
        </div>
      </div>
      <div class="content content--highlight content--outro">
        <p class="text-large">
          Lost in perpetual dependency, inhabitants of the Synthetic Era found
          solace in cryptic simulations, where pain ebbed and cognitive loads
          momentarily lightened.
        </p>
        <img class="content__img spacer" src="images/img.jpg" />
      </div>
    </div>
  );
};

export default page;
