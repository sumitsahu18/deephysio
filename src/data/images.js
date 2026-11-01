// Free photos from Unsplash (Unsplash License: free for commercial use, no permission needed).
// Ye sirf starting images hain. Admin > Page content / Treatments / Team se badal sakte ho.
const u = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const IMAGES = {
  hero: u('1649751361457-01d3a696c7e6', 2200), // leg examination
  band: u('1519824145371-296894a0daa9', 2000),
  about: u('1645005512968-0c1fe99f0093', 1400), // shoulder treatment
  homeVisits: u('1773227055624-07b515ba87c5', 1400), // caregiver with elderly patient
  aboutHeader: u('1706353399656-210cca727a33', 2000),
  servicesHeader: u('1540205895360-4ad4cffb3aa8', 2000),
  contactHeader: u('1519823551278-64ac92734fb1', 2000),
  services: {
    manipulation: u('1768507423533-b87b62769758', 900),
    mobilisation: u('1757689314932-bec6e9c39e51', 900),
    electrotherapy: u('1772122028843-9139d23af4fb', 900),
    'exercise-therapy': u('1645005513713-9e2b92a687d3', 900),
    traction: u('1758063800058-473d9071937a', 900),
    'biomechanical-assessment': u('1522898467493-49726bf28798', 900),
  },
}

// Image load na ho (net slow / link toota) to image hide ho jaye aur blue background dikhe
export const onImgError = (e) => {
  e.currentTarget.style.display = 'none'
}
