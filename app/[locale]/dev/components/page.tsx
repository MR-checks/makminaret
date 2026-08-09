import { Metadata } from "next";
import DevComponents from "./DevComponents";

export const metadata: Metadata = {
  title: "Dev Components | Minaret",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevComponentsPage() {
  return <DevComponents />;
}
