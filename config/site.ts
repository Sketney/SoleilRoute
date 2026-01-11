export const siteConfig = {
  name: "SoleilRoute",
  description:
    "Illuminating travel plans with smart budgets, visa guidance, and collaborative itineraries.",
  navigation: [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQs", href: "#faqs" },
  ],
  dashboardLinks: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Trips", href: "/dashboard/trips" },
    { name: "Budget Planner", href: "/dashboard/budget" },
    { name: "Visa Checker", href: "/dashboard/visa" },
    { name: "Notifications", href: "/dashboard/notifications" },
    { name: "Settings", href: "/dashboard/settings" },
    { name: "Help", href: "/help" },
  ],
  footerLinks: [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Release notes", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Support", href: "#" },
        { name: "Blog", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
  ],
  cta: {
    primary: "/register",
    secondary: "/login",
  },
};

export type SiteConfig = typeof siteConfig;
