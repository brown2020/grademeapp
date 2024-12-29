type MenuItem = {
  label: string;
  href: string;
  show?: "everyone" | "user_only" | "admin_only" | "guest_only";
  icon?: React.ElementType;
  header?: boolean;
  footer?: boolean;
};
