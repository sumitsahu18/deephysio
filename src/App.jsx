import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
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
const Enquiries = lazy(() => import('./pages/admin/Enquiries'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const AdminServices = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.AdminServices })))
const AdminTeam = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.AdminTeam })))
const AdminFaqs = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.AdminFaqs })))
const AdminUsers = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.AdminUsers })))

const guard = (perm, el) => <ProtectedRoute permission={perm}>{el}</ProtectedRoute>

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public website */}
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

        {/* Admin (JWT protected) */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={guard(null, <AdminLayout />)}>
          <Route index element={<Dashboard />} />
          <Route path="enquiries" element={guard('enquiries', <Enquiries />)} />
          <Route path="services" element={guard('services', <AdminServices />)} />
          <Route path="team" element={guard('team', <AdminTeam />)} />
          <Route path="faqs" element={guard('faqs', <AdminFaqs />)} />
          <Route path="settings" element={guard('settings', <Settings />)} />
          <Route path="users" element={guard('users', <AdminUsers />)} />
        </Route>
      </Routes>
    </Suspense>
  )
}
