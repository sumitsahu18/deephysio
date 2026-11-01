import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { pagesApi, getErrorMessage } from '../../api/endpoints'
import { useSite } from '../../context/SiteContext'
import { Field, SaveBar, getPath, setPath, cleanLists } from '../../components/DocForm'

// PDF 2.3 Zero Hardcoding: har page ka headline, paragraph aur image yahan se badlo.
// Content Editor (clinic staff) bhi ye page use kar sakta hai.
const SCHEMA = {
  home: {
    label: 'Home',
    url: '/',
    groups: [
      {
        title: 'Hero',
        fields: [
          { key: 'welcome', label: 'Small heading above clinic name', wide: false },
          { key: 'tagline', label: 'Tagline' },
          { key: 'intro', label: 'Intro paragraph', type: 'textarea', rows: 3 },
          { key: 'heroImage', label: 'Hero background photo', type: 'image' },
          { key: 'conditionsTitle', label: 'Conditions heading', wide: false },
          { key: 'conditions', label: 'Conditions treated (one per line)', type: 'list', rows: 6 },
          { key: 'credentials', label: 'Practitioner credentials (one per line)', type: 'list', rows: 3 },
        ],
      },
      {
        title: 'Information panel',
        fields: [
          { key: 'noticeTitle', label: 'Notice heading', wide: false },
          { key: 'notice', label: 'Notice text', type: 'textarea', rows: 3 },
        ],
      },
      {
        title: 'Enquiry banner',
        fields: [
          { key: 'bandTitle', label: 'Heading' },
          { key: 'bandText', label: 'Text', type: 'textarea', rows: 2 },
          { key: 'bandImage', label: 'Background photo', type: 'image' },
        ],
      },
      {
        title: 'Services section',
        fields: [
          { key: 'servicesEyebrow', label: 'Small heading', wide: false },
          { key: 'servicesTitle', label: 'Heading', wide: false },
        ],
      },
      {
        title: 'Block 1 (links to About & Team)',
        fields: [
          { key: 'feature1.eyebrow', label: 'Small heading', wide: false },
          { key: 'feature1.title', label: 'Heading', wide: false },
          { key: 'feature1.text', label: 'Text', type: 'textarea', rows: 3 },
          { key: 'feature1.cta', label: 'Button text', wide: false },
          { key: 'feature1.image', label: 'Photo', type: 'image' },
        ],
      },
      {
        title: 'Block 2 (links to Contact)',
        fields: [
          { key: 'feature2.eyebrow', label: 'Small heading', wide: false },
          { key: 'feature2.title', label: 'Heading', wide: false },
          { key: 'feature2.text', label: 'Text', type: 'textarea', rows: 3 },
          { key: 'feature2.cta', label: 'Button text', wide: false },
          { key: 'feature2.image', label: 'Photo', type: 'image' },
        ],
      },
    ],
  },
  about: {
    label: 'About & Team',
    url: '/about',
    groups: [
      {
        title: 'Page header',
        fields: [
          { key: 'title', label: 'Page title', wide: false },
          { key: 'intro', label: 'Intro', type: 'textarea', rows: 2 },
          { key: 'headerImage', label: 'Header photo', type: 'image' },
        ],
      },
      {
        title: 'About text',
        fields: [
          { key: 'bodyTitle', label: 'Heading', wide: false },
          { key: 'body', label: 'Text (empty line = new paragraph)', type: 'textarea', rows: 7 },
        ],
      },
      {
        title: 'Registration badges',
        fields: [
          { key: 'credentialsTitle', label: 'Heading', wide: false },
          { key: 'hcpcText', label: 'HCPC text', type: 'textarea', rows: 2 },
          { key: 'cspText', label: 'CSP text', type: 'textarea', rows: 2 },
          { key: 'teamTitle', label: 'Team section heading' },
        ],
      },
    ],
  },
  services: {
    label: 'Services',
    url: '/services',
    groups: [
      {
        title: 'Page header',
        fields: [
          { key: 'title', label: 'Page title', wide: false },
          { key: 'intro', label: 'Intro', type: 'textarea', rows: 2 },
          { key: 'headerImage', label: 'Header photo', type: 'image' },
          { key: 'disclaimer', label: 'Note shown under the services', type: 'textarea', rows: 3 },
        ],
      },
    ],
  },
  contact: {
    label: 'Contact',
    url: '/contact',
    groups: [
      {
        title: 'Page header',
        fields: [
          { key: 'title', label: 'Page title', wide: false },
          { key: 'intro', label: 'Intro', type: 'textarea', rows: 2 },
          { key: 'headerImage', label: 'Header photo', type: 'image' },
        ],
      },
      {
        title: 'Enquiry form',
        fields: [
          { key: 'formTitle', label: 'Form heading', wide: false },
          { key: 'messageHint', label: 'Message box hint' },
          { key: 'successTitle', label: 'Thank-you heading' },
          { key: 'successText', label: 'Thank-you text' },
        ],
      },
    ],
  },
  privacy: {
    label: 'Privacy Policy',
    url: '/privacy',
    groups: [
      {
        title: 'Privacy policy',
        fields: [
          { key: 'title', label: 'Page title', wide: false },
          { key: 'body', label: 'Text (empty line = new paragraph)', type: 'textarea', rows: 12 },
        ],
      },
    ],
  },
}

export default function PageContent() {
  const { pages, setPages } = useSite()
  const [tab, setTab] = useState('home')
  const [form, setForm] = useState(pages)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({})

  useEffect(() => {
    setForm(pages)
  }, [pages])

  const page = SCHEMA[tab]

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMsg({})
    try {
      const updated = await pagesApi.update({ [tab]: cleanLists(form[tab]) })
      setPages(updated)
      setMsg({ type: 'ok', text: 'Saved. Changes are live on the website.' })
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Page content</h1>
          <p className="mt-1 text-muted">Edit the headings, text and photos on each page.</p>
        </div>
        <a href={page.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-pine-700">
          View page <ExternalLink className="size-4" />
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist">
        {Object.entries(SCHEMA).map(([key, s]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => {
              setTab(key)
              setMsg({})
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium ${tab === key ? 'bg-pine-700 text-white' : 'border border-line bg-white hover:border-pine-500'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        {page.groups.map((g) => (
          <section key={g.title} className="card grid gap-4 p-6 sm:grid-cols-2">
            <h2 className="text-lg font-semibold sm:col-span-2">{g.title}</h2>
            {g.fields.map((f) => (
              <Field
                key={f.key}
                field={f}
                value={getPath(form[tab], f.key)}
                onChange={(v) => setForm((all) => ({ ...all, [tab]: setPath(all[tab] || {}, f.key, v) }))}
              />
            ))}
          </section>
        ))}
      </div>

      <div className="sticky bottom-0 mt-6 flex justify-end border-t border-line bg-[#f2f6fa]/95 py-4 backdrop-blur">
        <SaveBar saving={saving} msg={msg} label={`Save ${page.label}`} />
      </div>
    </form>
  )
}
