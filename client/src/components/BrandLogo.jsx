const logoSizes = {
  nav: "h-12 w-44 sm:w-52",
  footer: "h-20 w-56",
  auth: "h-28 w-full",
  admin: "h-20 w-56"
};

export default function BrandLogo({ className = "", variant = "nav" }) {
  return (
    <img
      src="/reliable-rides-logo.jpg"
      alt="Reliable brand logo"
      className={`${logoSizes[variant] || logoSizes.nav} object-contain ${className}`}
    />
  );
}
