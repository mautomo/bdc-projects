import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/competitive"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Competitive Analysis
      </Link>
      <Link
        href="/secret-shop"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Secret Shop
      </Link>
      <Link
        href="/comparison"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Comparison
      </Link>
      <Link
        href="/settings"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link>
    </nav>
  )
}