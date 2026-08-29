type SectionTheme = "dark" | "light";

const THEME_CLASSES: Record<SectionTheme, string> = {
  dark: "bg-black text-white",
  light: "bg-white text-black",
};

export function Section({
  theme,
  children,
  className = "",
}: {
  theme: SectionTheme;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`${THEME_CLASSES[theme]} ${className}`}>
      {children}
    </section>
  );
}
