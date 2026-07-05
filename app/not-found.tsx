import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 motion-fade">
      <h1 className="text-8xl sm:text-9xl font-bold text-primary/20 select-none">404</h1>
      <h2 className="-mt-4 text-2xl sm:text-3xl font-bold text-foreground">Page not found</h2>
      <p className="mt-2 text-muted-foreground text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
      >
        Back to Home
      </Link>
    </div>
  )
}
