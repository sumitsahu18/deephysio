// Roles & permissions - frontend (menu chhupana) AUR backend (API mana karna) dono yahi file use karte hain.
//   admin  -> sab kuch: theme, general settings, users, delete
//   editor -> clinic staff (restricted Content Editor - PDF 2.3): homepage, about & team, services,
//             contact & enquiries, media. Theme, settings, users aur delete NAHI.
export const ROLES = ['admin', 'editor']

export const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'homepage', 'about', 'services', 'contact', 'media', 'theme', 'settings', 'users', 'delete'],
  editor: ['dashboard', 'homepage', 'about', 'services', 'contact', 'media'],
}

export const hasPermission = (role, permission) => (ROLE_PERMISSIONS[role] || []).includes(permission)

// Page content ka kaunsa hissa kaun sa permission maangta hai
export const PAGE_PERMISSION = {
  home: 'homepage',
  faq: 'homepage',
  privacy: 'homepage',
  about: 'about',
  services: 'services',
  contact: 'contact',
}
