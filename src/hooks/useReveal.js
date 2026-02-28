import { useEffect } from "react";

export default function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".reveal, .chapter");
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}