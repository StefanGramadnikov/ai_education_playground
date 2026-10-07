import { NavLink } from "./NavLink";

/** Primary navigation. To add a section, add one <NavLink> here. */
export function MainNav() {
  return (
    <nav aria-label="Main" style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
      <NavLink href="/tasks">Tasks</NavLink>
    </nav>
  );
}
