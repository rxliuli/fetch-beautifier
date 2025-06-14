export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo/Site Name */}
          <a href="https://rxliuli.com" className="font-bold text-xl">
            Fetch Beautifier
          </a>
        </div>
      </div>
    </header>
  )
}
