import type { ReactNode } from "react";
import { siteConfig } from "@/app/layout/siteConfig";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export default function SurfaceCard({ children, className = "" }: SurfaceCardProps) {
  return <article className={`${siteConfig.theme.card} ${className}`.trim()}>{children}</article>;
}
