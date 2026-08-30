import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-8 md:px-12">
      <div className="flex max-w-6xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Shishir Ghimire</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <Link href="/projects" className="transition-colors hover:text-foreground">Projects</Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
        </nav>
        <p>Built with Next.js and Tailwind CSS</p>
      </div>
    </footer>
  )
}

export default Footer
