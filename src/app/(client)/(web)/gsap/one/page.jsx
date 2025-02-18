"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.scss";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const firstRef = useRef(null);
  const scrollRef = useRef(null);
  const swipeRef = useRef(null);
  const isHorizontalDone = useRef(false);
  useEffect(() => {
    const sections = gsap.utils.toArray(".section");

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none", // Làm cho animation nhanh hơn
      scrollTrigger: {
        trigger: scrollRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + scrollRef.current.offsetWidth,
        onUpdate: (self) => {
          if (self.progress == 1) {
            isHorizontalDone.current = true;
          } else {
            isHorizontalDone.current = false;
          }
        },
      },
    });

    // Lắng nghe sự kiện cuộn chuột tiếp theo
    const observer = ScrollTrigger.observe({
      type: "wheel,touch",
      onChange: (self) => {
        if (isHorizontalDone.current && self.deltaY > 0) {
          window.scrollTo({
            top: firstRef.current.offsetTop,
            behavior: "smooth",
          });

          observer.kill();
        }
      },
    });

    // Tạo hiệu ứng Parallax cho mỗi section trong swipe-section
    gsap.utils.toArray(".swipe-section section").forEach((section, index) => {
      if (index == 0) {
        return;
      }
      gsap.fromTo(
        section,
        { yPercent: 15 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: index === sections.length - 1 ? "bottom bottom" : "bottom top", // Giữ section cuối cùng cố định
            scrub: 1,
          },
        }
      );
    });
    
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      observer.kill();
    };
  }, []);

  return (
    <div>
      <div className="overflow-hidden">
        <div className="w-[400%] flex" ref={scrollRef}>
          <section className="section w-full min-h-screen bg-red-500">
            ONE
          </section>
          <section className="section w-full min-h-screen bg-orange-500">
            TWO
          </section>
          <section className="section w-full min-h-screen bg-purple-500">
            THREE
          </section>
          <section className="section w-full min-h-screen bg-green-500">
            FOUR
          </section>
        </div>
      </div>
      <div ref={firstRef} className="w-full min-h-screen bg-blue-400">
        <div>
          <h1>Mixed observer and scrolling...</h1>
          <div className="scroll-down">
            Scroll down<div className="arrow"></div>
          </div>
        </div>
      </div>

      <div className="swipe-section" ref={swipeRef}>
        <section className="w-full min-h-screen sticky top-0 bg-red-500">
          ScrollTrigger.observe() section
        </section>
        <section className="w-full min-h-screen sticky top-0 bg-purple-500">
          SWIPE SECTION 2
        </section>
        <section className="w-full min-h-screen sticky top-0 bg-blue-500">
          SWIPE SECTION 3
        </section>
        <section className="w-full min-h-screen sticky top-0 bg-orange-500">
          Last swipe section... continue scrolling
        </section>
      </div>
    </div>
  );
}
