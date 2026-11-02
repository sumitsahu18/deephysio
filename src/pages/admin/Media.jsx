import { useMemo, useRef, useState } from 'react'
import { Upload, LoaderCircle, RefreshCw, Trash2, ImageOff } from 'lucide-react'
import { mediaApi, siteApi, pagesApi, servicesApi, teamApi, testimonialsApi, uploadImage, getErrorMessage } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { useSite } from '../../context/SiteContext'
import { setPath, getPath } from '../../components/DocForm'
import useFetch from '../../hooks/useFetch'
import MediaPicker from '../../components/MediaPicker'
import Spinner from '../../components/Spinner'

// Media / Images: (1) website par jahan-jahan photo lagi hai - wahin se Replace
//                 (2) Media library - upload, aur jo kahin use nahi ho rahi wo Delete
const PAGE_IMAGES = [
  ['home', 'heroImage', 'Homepage → Hero photo'],
  ['home', 'backgroundImage', 'Whole website → Background photo'],
  ['home', 'bandImage', 'Homepage → Enquiry banner'],
  ['home', 'feature1.image', 'Homepage → About block'],
  ['home', 'feature2.image', 'Homepage → Home visits block'],
  ['about', 'headerImage', 'About & Team → Header'],
  ['services', 'headerImage', 'Services → Header'],
  ['contact', 'headerImage', 'Contact → Header'],
  ['faq', 'headerImage', 'FAQ → Header'],
]

export default function Media() {
  const { can } = useAuth()
  const { pages, setPages, site, setSite } = useSite()
  const lib = useFetch(mediaApi.list)
  const content = useFetch(() =>
    Promise.all([servicesApi.list(), teamApi.list(), testimonialsApi.list()]).then(([services, team, testimonials]) => ({ services, team, testimonials })),
  )
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState({})
  const [replacing, setReplacing] = useState(null) // slot

  // Website par lagi saari images ki list
  const slots = useMemo(() => {
    const out = PAGE_IMAGES.map(([page, key, label]) => ({ id: `${page}.${key}`, label, url: getPath(pages[page] || {}, key), kind: 'page', page, key }))
    // Logo global setting hai -> sirf admin badal sakta hai
    if (can('settings')) out.unshift({ id: 'logo', label: 'Whole website → Logo', url: site.logoUrl, kind: 'logo' })
    const c = content.data
    if (c) {
      c.services.forEach((s) => out.push({ id: `s-${s._id}`, label: `Service → ${s.title}`, url: s.image, kind: 'services', item: s, field: 'image' }))
      c.team.forEach((m) => out.push({ id: `t-${m._id}`, label: `Team → ${m.name}`, url: m.photo, kind: 'team', item: m, field: 'photo' }))
      c.testimonials.forEach((t) => out.push({ id: `r-${t._id}`, label: `Testimonial → ${t.name}`, url: t.photo, kind: 'testimonials', item: t, field: 'photo' }))
    }
    return out
  }, [pages, content.data, site.logoUrl, can])

  const used = useMemo(() => new Set([...slots.map((s) => s.url), site.logoUrl].filter(Boolean)), [slots, site.logoUrl])

  async function replace(slot, url) {
    setReplacing(null)
    setMsg({})
    try {
      if (slot.kind === 'logo') {
        setSite(await siteApi.update({ logoUrl: url }))
      } else if (slot.kind === 'page') {
        const updated = await pagesApi.update({ [slot.page]: setPath(pages[slot.page] || {}, slot.key, url) })
        setPages(updated)
      } else {
        const api = { services: servicesApi, team: teamApi, testimonials: testimonialsApi }[slot.kind]
        await api.update(slot.item._id, { [slot.field]: url })
        await content.reload()
      }
      await lib.reload()
      setMsg({ type: 'ok', text: `Updated: ${slot.label}` })
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err) })
    }
  }

  async function onFiles(e) {
    const files = [...(e.target.files || [])]
    e.target.value = ''
    if (!files.length) return
    setBusy(true)
    setMsg({})
    try {
      for (const f of files) await uploadImage(f)
      await lib.reload()
      setMsg({ type: 'ok', text: `${files.length} image${files.length > 1 ? 's' : ''} uploaded to the library.` })
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err) })
      lib.reload()
    } finally {
      setBusy(false)
    }
  }

  async function remove(m) {
    if (used.has(m.url)) return setMsg({ type: 'err', text: 'This image is used on the website. Replace it there first, then delete it.' })
    if (!confirm('Delete this image from the library?')) return
    try {
      await mediaApi.remove(m._id)
      lib.setData((list) => list.filter((x) => x._id !== m._id))
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err) })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-glass text-3xl font-semibold">Media / Images</h1>
          <p className="mt-1 text-muted">Replace any photo on the website, upload new ones and remove images you no longer use.</p>
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary" disabled={busy}>
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload images
        </button>
        <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onFiles} />
      </div>

      {msg.text && <p className={`rounded-xl p-3 text-sm ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>}

      {/* 1) Website images */}
      <section>
        <h2 className="text-xl font-semibold">Images on the website</h2>
        <p className="mt-1 text-sm text-muted">Click “Replace” to upload a new photo or pick one from the library.</p>
        {content.loading ? (
          <Spinner />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((s) => (
              <div key={s.id} className="card overflow-hidden">
                <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-sand text-xs text-muted">
                  {s.url ? <img src={s.url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" /> : <span className="flex items-center gap-1.5"><ImageOff className="size-4" /> No image</span>}
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <p className="min-w-0 truncate text-sm font-medium" title={s.label}>{s.label}</p>
                  <button type="button" onClick={() => setReplacing(s)} className="btn-outline shrink-0 px-3 py-1.5 text-xs">
                    <RefreshCw className="size-3.5" /> Replace
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2) Library */}
      <section>
        <h2 className="text-xl font-semibold">Media library</h2>
        <p className="mt-1 text-sm text-muted">Images you have uploaded. Images marked “In use” can’t be deleted until they are replaced.</p>
        {lib.loading ? (
          <Spinner />
        ) : !lib.data?.length ? (
          <p className="card mt-4 p-8 text-center text-sm text-muted">No uploaded images yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {lib.data.map((m) => {
              const inUse = used.has(m.url)
              return (
                <div key={m._id} className="card overflow-hidden">
                  <div className="relative aspect-square overflow-hidden"><img src={m.url} alt={m.name} loading="lazy" className="absolute inset-0 size-full object-cover" /></div>
                  <div className="space-y-2 p-3">
                    <p className="truncate text-xs" title={m.name}>{m.name}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${inUse ? 'bg-emerald-50 text-emerald-800' : 'bg-sand text-muted'}`}>
                        {inUse ? 'In use' : 'Not used'}
                      </span>
                      {can('delete') && !inUse && (
                        <button type="button" onClick={() => remove(m)} className="grid size-8 place-items-center rounded-lg text-red-700 hover:bg-red-50" aria-label={`Delete ${m.name}`}>
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {replacing && <MediaPicker title={`Replace: ${replacing.label}`} onClose={() => setReplacing(null)} onPick={(url) => replace(replacing, url)} />}
    </div>
  )
}
