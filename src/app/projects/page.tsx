import type { Metadata } from "next";
import { Projects } from "@/components/projects";

export const metadata: Metadata = {
  title: "Projects | Vern Prayoonthong",
  description: "Mechanical design, fabrication, and robotics projects.",
};

export default function ProjectsPage() {
  return <Projects />;
}
