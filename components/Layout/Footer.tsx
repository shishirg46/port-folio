const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-8 md:px-12">
      <div className="flex max-w-6xl flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Shishir Ghimire</p>
        <p>Built with Next.js and Tailwind CSS</p>
      </div>
    </footer>
  )
}

export default Footer
