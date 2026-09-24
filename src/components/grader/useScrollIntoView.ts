import { useEffect } from "react";

/** Smoothly scrolls the element with `id` into view whenever `id` changes. */
export function useScrollIntoView(id: string | null) {
  useEffect(() => {
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [id]);
}
