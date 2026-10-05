import type { Metadata } from "next";
import { Contact } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact | Vern Prayoonthong",
  description: "Email, LinkedIn, and résumé.",
};

export default function ContactPage() {
  return <Contact />;
}
