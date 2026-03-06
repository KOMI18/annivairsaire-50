import { useReveal } from "../hooks/useReveal";

export default function Reveal({ children, delay = "" }) {
  const [ref, on] = useReveal();
  return (
    <div ref={ref} className={`rv ${delay} ${on ? "on" : ""}`}>
      {children}
    </div>
  );
}