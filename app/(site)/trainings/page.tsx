import type { Metadata } from "next";
import { TrainingsPageContent } from "./TrainingsPageContent";

export const metadata: Metadata = {
  title: "Nos Formations — AloPro Lab",
  description:
    "Découvrez toutes nos formations professionnelles : développement web, intelligence artificielle, graphisme, bureautique et plus encore.",
};

export default function TrainingsPage() {
  return <TrainingsPageContent />;
}
