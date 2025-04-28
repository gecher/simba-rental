import Link from "next/link"

interface NavItem {
  title: string
  href: string
}

const items: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Properties",
    href: "/properties",
  },
  {
    title: "My Properties",
    href: "/properties/my-properties",
  },
  {
    title: "My Advertisements",
    href: "/advertisements/my-requests",
  },
]

export function MainNav() {
  return (
    <nav className="flex items-center space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
} 