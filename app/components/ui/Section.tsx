import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
};

export default function Section({
  children,
  className = "",
  title,
  titleClassName = "text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl",
}: SectionProps) {
  return (
    <section className={`space-y-6 ${className}`.trim()}>
      {title ? <h2 className={titleClassName}>{title}</h2> : null}
      {children}
    </section>
  );
}
