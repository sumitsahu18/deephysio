import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Spinner from './components/Spinner'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'

// Admin panel alag chunk mein load hota hai (public site fast rahe)
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Media = lazy(() => import('./pages/admin/Media'))
const Theme = lazy(() => import('./pages/admin/Theme'))
const Account = lazy(() => import('./pages/admin/Account'))
const section = (name) => lazy(() => import('./pages/admin/Sections').then((m) => ({ default: m[name] })))
const HomepageSection = section('HomepageSection')
const AboutSection = section('AboutSection')
const ServicesSection = section('ServicesSection')
const ContactSection = section('ContactSection')
const GeneralSection = section('GeneralSection')

const guard = (perm, el) => <ProtectedRoute permission={perm}>{el}</ProtectedRoute>

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public website - PDF 2.2 Site Structure */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        {/* ONE admin dashboard (JWT protected, role based) */}
        <Route path="/admin" element={guard(null, <AdminLayout />)}>
          <Route index element={<Dashboard />} />
          <Route path="homepage" element={guard('homepage', <HomepageSection />)} />
          <Route path="about" element={guard('about', <AboutSection />)} />
          <Route path="services" element={guard('services', <ServicesSection />)} />
          <Route path="contact" element={guard('contact', <ContactSection />)} />
          <Route path="media" element={guard('media', <Media />)} />
          <Route path="theme" element={guard('theme', <Theme />)} />
          <Route path="settings" element={guard('settings', <GeneralSection />)} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
