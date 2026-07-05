  "use client"

  import { useState, useEffect, useRef, type FormEvent } from 'react'
  import { Lock, Save, LogOut, Plus, X, Eye, EyeOff, CheckCircle2, Loader2, ExternalLink, Upload, ArrowLeft } from 'lucide-react'

  const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact'] as const

  const sectionIcons: Record<string, string> = {
    hero: 'Home',
    about: 'User',
    skills: 'Zap',
    projects: 'FolderGit2',
    contact: 'Mail',
  }

  function Input({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>
    )
  }

  function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-y" />
      </div>
    )
  }

  function StringList({ items, onChange, label }: { items: string[]; onChange: (items: string[]) => void; label: string }) {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 min-w-0">
              <input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n) }} className="flex-1 min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" />
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => onChange([...items, ''])} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"><Plus className="h-3.5 w-3.5" />Add {label.toLowerCase()}</button>
      </div>
    )
  }

  function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/50 has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
        {label}
      </label>
    )
  }

  function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      console.log('[ImageUpload] file selected:', file.name)
      setError('')
      setUploading(true)
      try {
        const token = localStorage.getItem('admin_token')
        const formData = new FormData()
        formData.append('file', file)
        console.log('[ImageUpload] uploading...')
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
        console.log('[ImageUpload] upload response:', res.status)
        if (!res.ok) {
          const err = await res.json()
          console.log('[ImageUpload] upload error:', err)
          setError(err.error || 'Upload failed')
          return
        }
        const { url } = await res.json()
        console.log('[ImageUpload] upload success, url:', url)
        onChange(url)
      } catch (e) {
        console.log('[ImageUpload] upload exception:', e)
        setError('Network error. Check your connection.')
      } finally {
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ''
      }
    }

    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
        {value && (
          <div className="mb-2 overflow-hidden rounded-lg border border-border">
            <img src={value} alt="" className="max-h-40 w-full object-contain bg-muted" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Add Photo'}
          </button>
          {uploading && (
            <span className="text-xs text-muted-foreground animate-pulse">Uploading...</span>
          )}
        </div>
        {error && (
          <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <X className="h-3 w-3 shrink-0" />
            <span className="flex-1">{error}</span>
            <button type="button" onClick={() => setError('')} className="shrink-0 hover:text-red-900 transition-colors">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <div className="mt-2">
          <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="/filename.png" className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
      </div>
    )
  }

  function SectionCard({ title, children, onRemove }: { title: string; children: React.ReactNode; onRemove: () => void }) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 sm:px-5 py-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate min-w-0">{title}</span>
          <button type="button" onClick={onRemove} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 p-4 sm:p-5">{children}</div>
      </div>
    )
  }

  function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
    return (
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"><Plus className="h-4 w-4" />{label}</button>
    )
  }

  function HeroForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const set = (field: string, value: any) => onChange({ ...data, [field]: value })
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Profile Info</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={data.name || ''} onChange={v => set('name', v)} />
            <Input label="Title" value={data.title || ''} onChange={v => set('title', v)} />
            <Input label="Subtitle" value={data.subtitle || ''} onChange={v => set('subtitle', v)} />
            <Input label="Badge" value={data.badge || ''} onChange={v => set('badge', v)} />
          </div>
          <div className="mt-4 space-y-4">
            <Textarea label="Subheading" value={data.subheading || ''} onChange={v => set('subheading', v)} rows={2} />
            <Textarea label="Description" value={data.description || ''} onChange={v => set('description', v)} rows={3} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Media & Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUpload label="Profile Photo" value={data.profileImage || ''} onChange={v => set('profileImage', v)} />
            <Input label="Resume URL" value={data.resumeUrl || ''} onChange={v => set('resumeUrl', v)} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Stats</h3>
          <div className="space-y-3">
            {(data.stats || []).map((s: any, i: number) => (
              <div key={i} className="flex gap-2 items-start min-w-0">
                <input value={s.value || ''} onChange={e => { const n = [...(data.stats || [])]; n[i] = { ...n[i], value: e.target.value }; set('stats', n) }} placeholder="Value" className="w-20 sm:w-24 shrink-0 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" />
                <input value={s.label || ''} onChange={e => { const n = [...(data.stats || [])]; n[i] = { ...n[i], label: e.target.value }; set('stats', n) }} placeholder="Label" className="flex-1 min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" />
                <button type="button" onClick={() => set('stats', (data.stats || []).filter((_: any, j: number) => j !== i))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <AddButton onClick={() => set('stats', [...(data.stats || []), { value: '', label: '' }])} label="Add stat" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Tech Stack</h3>
          <StringList label="Technologies" items={data.techStack || []} onChange={v => set('techStack', v)} />
        </div>
      </div>
    )
  }

  function AboutForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const set = (field: string, value: any) => onChange({ ...data, [field]: value })
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <Input label="Heading" value={data.heading || ''} onChange={v => set('heading', v)} />
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">Paragraphs</label>
            <div className="space-y-2">
              {(data.paragraphs || []).map((p: string, i: number) => (
                <div key={i} className="flex gap-2 min-w-0">
                  <textarea value={p} onChange={e => { const n = [...(data.paragraphs || [])]; n[i] = e.target.value; set('paragraphs', n) }} rows={2} className="flex-1 min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" />
                  <button type="button" onClick={() => set('paragraphs', (data.paragraphs || []).filter((_: any, j: number) => j !== i))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            <AddButton onClick={() => set('paragraphs', [...(data.paragraphs || []), ''])} label="Add paragraph" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Highlights</h3>
          <div className="space-y-4">
            {(data.highlights || []).map((h: any, i: number) => (
              <SectionCard key={i} title={`Highlight ${i + 1}`} onRemove={() => set('highlights', (data.highlights || []).filter((_: any, j: number) => j !== i))}>
                <Input label="Icon" value={h.icon || ''} onChange={v => { const n = [...(data.highlights || [])]; n[i] = { ...n[i], icon: v }; set('highlights', n) }} />
                <Input label="Title" value={h.title || ''} onChange={v => { const n = [...(data.highlights || [])]; n[i] = { ...n[i], title: v }; set('highlights', n) }} />
                <Textarea label="Text" value={h.text || ''} onChange={v => { const n = [...(data.highlights || [])]; n[i] = { ...n[i], text: v }; set('highlights', n) }} rows={2} />
              </SectionCard>
            ))}
          </div>
          <AddButton onClick={() => set('highlights', [...(data.highlights || []), { icon: 'Code2', title: '', text: '' }])} label="Add highlight" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Experience</h3>
          <div className="space-y-4">
            {(data.experience || []).map((e: any, i: number) => (
              <SectionCard key={i} title={`Experience ${i + 1}`} onRemove={() => set('experience', (data.experience || []).filter((_: any, j: number) => j !== i))}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Role" value={e.role || ''} onChange={v => { const n = [...(data.experience || [])]; n[i] = { ...n[i], role: v }; set('experience', n) }} />
                  <Input label="Period" value={e.period || ''} onChange={v => { const n = [...(data.experience || [])]; n[i] = { ...n[i], period: v }; set('experience', n) }} />
                </div>
                <Textarea label="Description" value={e.description || ''} onChange={v => { const n = [...(data.experience || [])]; n[i] = { ...n[i], description: v }; set('experience', n) }} rows={2} />
              </SectionCard>
            ))}
          </div>
          <AddButton onClick={() => set('experience', [...(data.experience || []), { role: '', period: '', description: '' }])} label="Add experience" />
        </div>
      </div>
    )
  }

  function SkillsForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const set = (field: string, value: any) => onChange({ ...data, [field]: value })
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <Textarea label="Description" value={data.description || ''} onChange={v => set('description', v)} rows={2} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Categories</h3>
          <div className="space-y-4">
            {(data.categories || []).map((cat: any, i: number) => (
              <SectionCard key={i} title={`Category ${i + 1}`} onRemove={() => set('categories', (data.categories || []).filter((_: any, j: number) => j !== i))}>
                <Input label="Category Name" value={cat.category || ''} onChange={v => { const n = [...(data.categories || [])]; n[i] = { ...n[i], category: v }; set('categories', n) }} />
                <Input label="Description" value={cat.description || ''} onChange={v => { const n = [...(data.categories || [])]; n[i] = { ...n[i], description: v }; set('categories', n) }} />
                <StringList label="Skills" items={cat.items || []} onChange={v => { const n = [...(data.categories || [])]; n[i] = { ...n[i], items: v }; set('categories', n) }} />
              </SectionCard>
            ))}
          </div>
          <AddButton onClick={() => set('categories', [...(data.categories || []), { category: '', description: '', items: [] }])} label="Add category" />
        </div>
      </div>
    )
  }

  function ProjectsForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const set = (field: string, value: any) => onChange({ ...data, [field]: value })
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <Textarea label="Description" value={data.description || ''} onChange={v => set('description', v)} rows={2} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Projects</h3>
          <div className="space-y-4">
            {(data.projects || []).map((proj: any, i: number) => (
              <SectionCard key={i} title={`Project ${i + 1}`} onRemove={() => set('projects', (data.projects || []).filter((_: any, j: number) => j !== i))}>
    <Input label="Title" value={proj.title || ''} onChange={v => { const n = [...(data.projects || [])]; n[i] = { ...n[i], title: v }; set('projects', n) }} />
    <Input label="Link (GitHub or Live URL)" value={proj.link || ''} onChange={v => { const n = [...(data.projects || [])]; n[i] = { ...n[i], link: v }; set('projects', n) }} placeholder="https://github.com/you/repo or https://your-site.com" />
    <Textarea label="Description" value={proj.description || ''} onChange={v => { const n = [...(data.projects || [])]; n[i] = { ...n[i], description: v }; set('projects', n) }} rows={2} />
    <ImageUpload label="Project Photo" value={proj.image || ''} onChange={v => { const n = [...(data.projects || [])]; n[i] = { ...n[i], image: v }; set('projects', n) }} />
    <Checkbox label="Featured" checked={!!proj.featured} onChange={v => { const n = [...(data.projects || [])]; n[i] = { ...n[i], featured: v }; set('projects', n) }} />
    <StringList label="Tech Stack" items={proj.tech || []} onChange={v => { const n = [...(data.projects || [])]; n[i] = { ...n[i], tech: v }; set('projects', n) }} />
  </SectionCard>
            ))}
          </div>
          <AddButton onClick={() => set('projects', [...(data.projects || []), { title: '', description: '', tech: [], image: '', featured: false }])} label="Add project" />
        </div>
      </div>
    )
  }

  function ContactForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const set = (field: string, value: any) => onChange({ ...data, [field]: value })
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Contact Info</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Email" value={data.email || ''} onChange={v => set('email', v)} />
            <Input label="Tagline" value={data.tagline || ''} onChange={v => set('tagline', v)} />
          </div>
          <div className="mt-4">
            <Textarea label="Description" value={data.description || ''} onChange={v => set('description', v)} rows={2} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Social Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="GitHub URL" value={data.social?.github || ''} onChange={v => set('social', { ...data.social, github: v })} />
            <Input label="LinkedIn URL" value={data.social?.linkedin || ''} onChange={v => set('social', { ...data.social, linkedin: v })} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Email Delivery</h3>
          <p className="text-xs text-muted-foreground">Emails are sent server-side via Gmail SMTP. Set <code className="rounded bg-muted px-1 py-0.5 font-mono">GMAIL_USER</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono">GMAIL_PASS</code> (app password) in <code className="rounded bg-muted px-1 py-0.5 font-mono">.env.local</code>.</p>
        </div>
      </div>
    )
  }

  function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
    return (
      <div className={`fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 z-50 flex items-center gap-2.5 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-right sm:max-w-md ${type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
        {type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
        <span className="text-sm font-medium">{message}</span>
      </div>
    )
  }

  export default function AdminPage() {
    const [token, setToken] = useState<string | null>(null)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [tab, _setTab] = useState('hero')
    const [data, setData] = useState<Record<string, any>>({})
    const [loaded, setLoaded] = useState<Record<string, boolean>>({})
    const [saving, setSaving] = useState<string | null>(null)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    const showToast = (message: string, type: 'success' | 'error') => {
      setToast({ message, type })
      setTimeout(() => setToast(null), 2500)
    }

    useEffect(() => {
      const t = localStorage.getItem('admin_token')
      if (t) {
        setToken(t)
        fetch('/api/auth', { headers: { Authorization: `Bearer ${t}` } })
          .then(r => { if (r.status === 401) logout() })
        const params = new URLSearchParams(window.location.search)
        const tabParam = params.get('tab')
        setTimeout(() => setTab(tabParam && SECTIONS.includes(tabParam as typeof SECTIONS[number]) ? tabParam : 'hero'), 0)
      }
    }, [])

    const setTab = (t: string) => {
      _setTab(t)
      if (!loaded[t]) {
        fetch(`/api/content/${t}`)
          .then(r => r.json())
          .then(d => { setData(prev => ({ ...prev, [t]: d })); setLoaded(prev => ({ ...prev, [t]: true })) })
          .catch(() => showToast('Failed to load section', 'error'))
      }
    }

    const handleLogin = async (e: FormEvent) => {
      e.preventDefault()
      setLoginError('')
      try {
        const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
        if (!res.ok) { setLoginError('Invalid password'); return }
        const { token: t } = await res.json()
        setToken(t)
        localStorage.setItem('admin_token', t)
        setTimeout(() => setTab('hero'), 0)
      } catch {
        setLoginError('Connection failed')
      }
    }

    const logout = () => {
      setToken(null)
      localStorage.removeItem('admin_token')
      showToast('Session expired, please login again', 'error')
    }

    const save = async (section: string) => {
      setSaving(section)
      try {
        const res = await fetch(`/api/content/${section}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data[section]) })
        if (!res.ok) {
          if (res.status === 401) { logout(); return }
          const err = await res.json()
          showToast(err.error || 'Save failed', 'error')
        } else {
          showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} saved`, 'success')
        }
      } catch { showToast('Failed to save', 'error') }
      setSaving(null)
    }

    if (!token) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4">
          <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-lg">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h1 className="mb-1 text-center text-xl font-bold text-foreground">Admin Login</h1>
            <p className="mb-6 text-center text-sm text-muted-foreground">Enter your password to continue</p>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" autoFocus />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {loginError && <p className="mt-3 text-center text-sm text-destructive">{loginError}</p>}
            <button type="submit" className="mt-5 w-full rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]">Login</button>
          </form>
        </div>
      )
    }

    const tabs = [
      { id: 'hero', label: 'Hero' },
      { id: 'about', label: 'About' },
      { id: 'skills', label: 'Skills' },
      { id: 'projects', label: 'Projects' },
      { id: 'contact', label: 'Contact' },
    ]

    return (
      <div className="flex min-h-screen">
        {toast && <Toast message={toast.message} type={toast.type} />}

        <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-60 flex-col border-r border-border bg-card">
          <div className="flex items-center gap-2.5 border-b border-border px-6 py-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Dashboard</h2>
              <p className="text-xs text-muted-foreground">Content Manager</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${tab === t.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${tab === t.id ? 'bg-primary-foreground/15' : 'bg-muted'}`}>{t.label.charAt(0)}</span>
                {t.label}
              </button>
            ))}
          </nav>
          <div className="border-t border-border p-3 space-y-1">
            <a href="/" className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <ExternalLink className="h-4 w-4" />
              Back to Portfolio
            </a>
            <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0 lg:ml-60">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 py-3 backdrop-blur">
            <div className="flex items-center gap-3 min-w-0">
              <a href="/" className="lg:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Back to Portfolio">
                <ArrowLeft className="h-4 w-4" />
              </a>
              <h1 className="text-base font-bold text-foreground capitalize truncate">{tab}</h1>
              <span className="hidden text-xs text-muted-foreground sm:inline shrink-0">/ edit content</span>
            </div>
            <button onClick={() => save(tab)} disabled={saving === tab} className="hidden lg:inline-flex items-center gap-2 shrink-0 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100">
              {saving === tab ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving === tab ? 'Saving...' : 'Save'}
            </button>
          </header>

          <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
            {!loaded[tab] ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="mt-3 text-sm">Loading {tab} content...</p>
              </div>
            ) : tab === 'hero' ? <HeroForm data={data.hero || {}} onChange={d => setData(prev => ({ ...prev, hero: d }))} />
              : tab === 'about' ? <AboutForm data={data.about || {}} onChange={d => setData(prev => ({ ...prev, about: d }))} />
              : tab === 'skills' ? <SkillsForm data={data.skills || {}} onChange={d => setData(prev => ({ ...prev, skills: d }))} />
              : tab === 'projects' ? <ProjectsForm data={data.projects || {}} onChange={d => setData(prev => ({ ...prev, projects: d }))} />
              : tab === 'contact' ? <ContactForm data={data.contact || {}} onChange={d => setData(prev => ({ ...prev, contact: d }))} />
              : null}
            <button onClick={() => save(tab)} disabled={saving === tab} className="lg:hidden mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100">
              {saving === tab ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving === tab ? 'Saving...' : 'Save'}
            </button>
          </main>
        </div>
      </div>
    )
  }
