"use client";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "purple" | "cyan" | "green" | "none";
  hover?: boolean;
  as?: "div" | "section" | "article";
}

export default function GlassCard({
  children,
  className = "",
  glow = "none",
  hover = true,
  as: Tag = "div",
}: GlassCardProps) {
  const glowClass = glow !== "none" ? `glow-${glow}` : "";
  return (
    <Tag
      className={`glass-card p-5 ${glowClass} ${hover ? "hover:scale-[1.01]" : ""} transition-all duration-250 ${className}`}
    >
      {children}
    </Tag>
  );
}
