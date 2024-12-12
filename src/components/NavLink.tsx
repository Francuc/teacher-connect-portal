import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  label: string;
}

export const NavLink = ({ to, label }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
    >
      {label}
    </Link>
  );
};