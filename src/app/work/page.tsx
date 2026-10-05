import type { Metadata } from "next";
import { Work } from "@/components/work";

export const metadata: Metadata = {
  title: "Work | Vern Prayoonthong",
  description: "Engineering roles: CMU Lunabotics and NSTDA.",
};

export default function WorkPage() {
  return <Work />;
}
