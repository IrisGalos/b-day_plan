import './static/cat.css';
import '/workspaces/b-day_plan/docs/index';

gsap.registerPlugin(MotionPathPlugin, ScrollToPlugin, TextPlugin);
document.addEventListener('DOMContentLoaded', () => {
  try {
    const ID = "bongo-cat";
    const s = (selector) => `#${ID} ${selector}`;

    const notes = document.querySelectorAll(".note");
    const music = { note: s(".music .note") };
    const cat = {
      pawRight: {
        up: s(".paw-right .up"),
        down: s(".paw-right .down"),
      },
      pawLeft: {
        up: s(".paw-left .up"),
        down: s(".paw-left .down"),
      },
    };

    const musicNoteEls = document.querySelectorAll(music.note);

    if (!notes.length || !musicNoteEls.length) {
      throw new Error("Required elements not found in DOM");
    }

    notes.forEach(note => {
      if (note.parentElement) {
        note.parentElement.appendChild(note.cloneNode(true));
        note.parentElement.appendChild(note.cloneNode(true));
      }
    });

    const style = getComputedStyle(document.documentElement);
    const colors = [
      style.getPropertyValue("--green"),
      style.getPropertyValue("--pink"),
      style.getPropertyValue("--blue"),
      style.getPropertyValue("--orange"),
      style.getPropertyValue("--cyan"),
      "#a3a4ec",
      "#67b5c0",
      "#fd7c6e"
    ];

    initAnimations();

    function initAnimations() {
      gsap.set(music.note, { scale: 0, autoAlpha: 1 });

      const animatePawState = (selector) =>
        gsap.fromTo(
          selector,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.01,
            repeatDelay: 0.19,
            yoyo: true,
            repeat: -1,
          }
        );

      const tl = gsap.timeline();
      tl.add(animatePawState(cat.pawLeft.up), "start")
        .add(animatePawState(cat.pawRight.down), "start")
        .add(animatePawState(cat.pawLeft.down), "start+=0.19")
        .add(animatePawState(cat.pawRight.up), "start+=0.19")
        .timeScale(1.6);

      gsap.utils.toArray(".terminal-code line").forEach(line => {
        gsap.from(line, {
          drawSVG: "0%",
          duration: 0.1,
          stagger: 0.1,
          ease: "none",
          repeat: -1,
        });
      });

      const noteEls = gsap.utils.shuffle([...musicNoteEls]);
      const groupSize = Math.floor(noteEls.length / 3);
      const [notesG1, notesG2, notesG3] = [
        noteEls.slice(0, groupSize),
        noteEls.slice(groupSize, groupSize * 2),
        noteEls.slice(groupSize * 2),
      ];

      const colorizer = gsap.utils.random(colors, true);
      const rotator = gsap.utils.random(-50, 50, 1, true);
      const dir = (amt) => `${gsap.utils.random(["-", "+"])}=${amt}`;

      const animateNotes = (els) => {
        els.forEach((el) => {
          gsap.set(el, {
            stroke: colorizer(),
            rotation: rotator(),
            x: gsap.utils.random(-25, 25, 1),
          });
        });

        return gsap.fromTo(
          els,
          { autoAlpha: 1, y: 0, scale: 0 },
          {
            duration: 2,
            autoAlpha: 0,
            scale: 1,
            ease: "none",
            stagger: {
              from: "random",
              each: 0.5,
            },
            rotation: dir(gsap.utils.random(20, 30, 1)),
            x: dir(gsap.utils.random(40, 60, 1)),
            y: gsap.utils.random(-200, -220, 1),
            onComplete: () => animateNotes(els),
          }
        );
      };

      tl.add(animateNotes(notesG1))
        .add(animateNotes(notesG2), ">0.05")
        .add(animateNotes(notesG3), ">0.25");
    }
  } catch (error) {
    console.error("Animation error:", error);
  }
});

gsap.to("#cat-wrapper", {
  y: -20,
  duration: 1,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut"
});