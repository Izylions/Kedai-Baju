// scripts/animations.js

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// The Apple-style Zoom effect
function initScrollAnimations() {
    gsap.to("#hero-image img", {
        scale: 1.5, // Zooms in
        opacity: 0.5, // Fades slightly
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-scroll-container",
            start: "top top", // Starts when the container hits the top of the viewport
            end: "+=1000",    // Animation lasts for 1000px of scrolling
            scrub: true,      // Ties the animation directly to the scrollbar
            pin: true         // Pins the section to the screen while animating
        }
    });

    gsap.from(".hero-text", {
        y: 100,
        opacity: 0,
        scrollTrigger: {
            trigger: ".hero-scroll-container",
            start: "top center",
            end: "+=500",
            scrub: true
        }
    });
}

// Export or initialize
initScrollAnimations();
