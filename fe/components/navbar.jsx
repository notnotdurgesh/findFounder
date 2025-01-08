import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  return (
    (<nav className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold">
          CoFounder Match
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/founder/login">
            <Button variant="ghost">Founder Login</Button>
          </Link>
          <Link href="/developer/login">
            <Button variant="ghost">Developer Login</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>)
  );
}

