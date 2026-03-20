import Icons from "./icons";

export type SectionId =
  | "overview"
  | "inventory"
  | "finance"
  | "ledger"
  | "loans"
  | "parties"
  | "alerts"
  | "settings";

export const navItems: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: "overview",   label: "Overview",   icon: Icons.overview },
  { id: "inventory",  label: "Inventory",  icon: Icons.inventory },
  { id: "finance",    label: "Finance",    icon: Icons.finance },
  { id: "ledger",     label: "Ledger",     icon: Icons.ledger },
  { id: "loans",      label: "Loans",      icon: Icons.loans },
  { id: "parties",    label: "Parties",    icon: Icons.parties },
  { id: "alerts",     label: "Alerts",     icon: Icons.alerts },
  { id: "settings",   label: "Settings",   icon: Icons.settings },
];

export const sectionInfo: Record<SectionId, { title: string; subtitle: string }> = {
  overview:  { title: "Business Overview",       subtitle: "High-level snapshot of your business" },
  inventory: { title: "Inventory",               subtitle: "Stock levels, valuation & alerts" },
  finance:   { title: "Finance",                 subtitle: "Profitability & cash movement" },
  ledger:    { title: "Ledger",                  subtitle: "Purchase & sales history" },
  loans:     { title: "Loans & Licenses",        subtitle: "Active loans & lending profile" },
  parties:   { title: "Parties Directory",       subtitle: "Manage customers and suppliers" },
  alerts:    { title: "Alerts & Insights",       subtitle: "System-generated recommendations" },
  settings:  { title: "Settings",               subtitle: "Manage your account preferences" },
};
