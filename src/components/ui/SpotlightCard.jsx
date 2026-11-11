/** Card surface without cursor-following light; keeps the existing layout and content. */
export default function SpotlightCard({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}) {
  return (
    <Tag className={`group relative overflow-hidden ${className}`} {...rest}>
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}
