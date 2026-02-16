import routes from 'virtual:generated-pages'
import { createApp } from 'vue'
import { createRouter, createWebHistory, type RouteLocationNormalizedLoaded } from 'vue-router'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const defaultTitle = 'sThree | Simplify Three.js'
const defaultDescription = 'sThree is a lightweight helper library that simplifies Three.js scene setup, animation, and debugging.'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let element = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', url)
}

function updateSeo(to: RouteLocationNormalizedLoaded) {
  let title = defaultTitle
  let description = defaultDescription
  let robots = 'index,follow,max-image-preview:large'

  if (to.path.startsWith('/hi/')) {
    title = `sThree Greeting | ${String(to.params.name || 'Visitor')}`
    description = 'A lightweight demo page powered by sThree.'
    robots = 'noindex,nofollow'
  }
  else if (to.matched.some(item => item.path.includes(':all'))) {
    title = 'Page Not Found | sThree'
    description = 'The requested page does not exist.'
    robots = 'noindex,nofollow'
  }

  const canonicalUrl = new URL(to.fullPath || to.path, window.location.origin).toString()
  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', robots)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', canonicalUrl)
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertCanonical(canonicalUrl)
}

router.afterEach((to) => {
  updateSeo(to)
})

app.use(router)
app.mount('#app')

router.isReady().then(() => updateSeo(router.currentRoute.value))
