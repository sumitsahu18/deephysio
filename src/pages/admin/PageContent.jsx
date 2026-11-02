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
          { key: 'heroImage', label: 'Hero photo (behind the glass card)', type: 'image' },
          { key: 'backgroundImage', label: 'Website background photo (shows through the glass on every page)', type: 'image' },
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
        title: 'Testimonials section',
        fields: [{ key: 'testimonialsTitle', label: 'Heading', wide: false }],
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
  faq: {
    label: 'FAQ',
    url: '/faq',
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
        title: 'Bottom box',
        fields: [
          { key: 'ctaTitle', label: 'Heading', wide: false },
          { key: 'ctaText', label: 'Text', type: 'textarea', rows: 2 },
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

// Ek page ka text/images form. Admin ke section tabs mein use hota hai: <PageContent page="home" />
export default function PageContent({ page: key }) {
  const { pages, setPages } = useSite()
  const [form, setForm] = useState(pages[key] || {})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({})
  const page = SCHEMA[key]

  useEffect(() => {
    setForm(pages[key] || {})
  }, [pages, key])

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMsg({})
    try {
      const updated = await pagesApi.update({ [key]: cleanLists(form) })
      setPages(updated)
      setMsg({ type: 'ok', text: 'Saved. Changes are live on the website.' })
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Edit the headings, text and photos on the {page.label} page.</p>
        <a href={page.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-pine-700">
          Preview page <ExternalLink className="size-4" />
        </a>
      </div>

      {page.groups.map((g) => (
        <section key={g.title} className="card grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <h2 className="text-lg font-semibold sm:col-span-2">{g.title}</h2>
          {g.fields.map((f) => (
            <Field key={f.key} field={f} value={getPath(form, f.key)} onChange={(v) => setForm((all) => setPath(all || {}, f.key, v))} />
          ))}
        </section>
      ))}

      <div className="sticky bottom-0 z-10 -mx-1 flex justify-end rounded-2xl border border-line bg-deep/70 px-4 py-3 backdrop-blur-xl">
        <SaveBar saving={saving} msg={msg} label="Save changes" />
      </div>
    </form>
  )
}
