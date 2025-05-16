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
    scroll(contentElements, "six");
    return () => {
      gsap.killTweensOf(".content--sticky");
    };
  }, []);
  return (
    <div>
      <div className="content content--highlight content--intro">
        <p className="text-large">
          As data conglomerates reveled in the opulence of cognitive wealth, a
          silent underclass manifested, condemned to the digital periphery.
        </p>
      </div>
      <div className="wrap">
        <div className="content content--sticky content--grid bg-1">
          <img
            className="content__img content__img--large content__img--left"
            src="/images/img.jpg"
          />
          <h2 className="content__title">
            <i>The</i> Algorithm
          </h2>
          <p className="content__text content__text--left text-meta">
            The algorithm's workings are shrouded in complexity, and its
            decision-making processes are inscrutable to the general populace.
          </p>
        </div>
        <div className="content content--sticky content--grid bg-2">
          <img
            className="content__img content__img--large content__img--left"
            src="/images/img.jpg"
          />
          <h2 className="content__title">
            <i>The</i> Dogma
          </h2>
          <p className="content__text content__text--left text-meta">
            The digital gospel etched into the very code of the algorithmic
            society, served as the bedrock of the cognitive regime.
          </p>
        </div>
        <div className="content content--sticky content--grid bg-3">
          <img
            className="content__img content__img--large content__img--left"
            src="/images/img.jpg"
          />
          <h2 className="content__title">
            <i>The</i> Architects
          </h2>
          <p className="content__text content__text--left text-meta">
            The elusive entities, lacking human form, operate in the shadows,
            skillfully shaping societal norms through the complex interplay of
            algorithms and Dogmas.
          </p>
        </div>
        <div className="content content--sticky content--grid bg-4">
          <img
            className="content__img content__img--large content__img--left"
            src="/images/img.jpg"
          />
          <h2 className="content__title">
            <i>The</i> Wasteland
          </h2>
          <p className="content__text content__text--left text-meta">
            This overlooked realm, a consequence of algorithmic judgments, is a
            haunting landscape filled with the echoes of untold stories and
            uncharted thoughts.
          </p>
        </div>
        <div className="content content--sticky content--grid bg-5">
          <img
            className="content__img content__img--large content__img--left"
            src="/images/img.jpg"
          />
          <h2 className="content__title">
            <i>The</i> Narrative
          </h2>
          <p className="content__text content__text--left text-meta">
            "The Narrative" unfolds as the omnipresent thread weaving through
            the fabric of the algorithmic society.
          </p>
        </div>
        <div className="content content--sticky content--grid bg-6">
          <img
            className="content__img content__img--large content__img--left"
            src="/images/img.jpg"
          />
          <h2 className="content__title">
            <i>The</i> Opulence
          </h2>
          <p className="content__text content__text--left text-meta">
            "The Opulence" epitomizes the cognitive elite's wealth in the
            algorithmic society, where opulent thoughts and experiences shape
            the societal narrative.
          </p>
        </div>
      </div>
      <div className="content content--highlight content--outro">
        <p className="text-large">
          Lost in perpetual dependency, inhabitants of the Synthetic Era found
          solace in cryptic simulations, where pain ebbed and cognitive loads
          momentarily lightened.
        </p>
        <img className="content__img spacer" src="/images/img.jpg" />
      </div>
    </div>
  );
};

export default page;
