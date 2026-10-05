import type { Metadata } from "next";
import { About } from "@/components/about";

export const metadata: Metadata = {
  title: "About | Vern Prayoonthong",
  description: "Mechanical engineering student at Carnegie Mellon, minor in robotics.",
};

export default function AboutPage() {
  return <About />;
}
