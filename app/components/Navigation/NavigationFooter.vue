<template>
  <Card
    class="px-[15px] sm:px-[30px] py-[50px] !bg-[#1B1A1B] !rounded-none !text-white"
  >
    <template #content>
      <div>
        <div class="flex sm:flex-row flex-col gap-[30px]">
          <div class="sm:w-[40%] w-full">
            <div class="text-2xl font-bold mb-[5px] text-gold">CleReview</div>
            <div>{{ tagline }}</div>
            <div class="mt-[30px]">
              <span>
                Email:
                <a href="mailto:support@clereview.com">support@clereview.com</a>
              </span>
              <div class="flex gap-4 mt-2">
                <NuxtLink to="/" class="text-white transition">
                  <i class="pi pi-facebook text-lg"></i>
                </NuxtLink>
                <NuxtLink to="/" class="text-white transition">
                  <i class="pi pi-twitter text-lg"></i>
                </NuxtLink>
                <NuxtLink to="/" class="text-white transition">
                  <i class="pi pi-instagram text-lg"></i>
                </NuxtLink>
                <NuxtLink to="/" class="text-white transition">
                  <i class="pi pi-linkedin text-lg"></i>
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="flex-1 grid sm:grid-cols-3 grid-cols-2 gap-[20px]">
            <div v-for="(section, idx) in mergedLinks" :key="idx">
              <div class="text-[120%] font-bold mb-[20px]">
                {{ section.title }}
              </div>
              <div class="flex flex-col gap-2.5">
                <template v-for="(link, link_idx) in section.items" :key="link_idx">
                  <!-- Modal trigger: renders as a styled button, emits event upward -->
                  <button
                    v-if="link.modal"
                    class="text-left"
                    @click="emit('modal-link', link.modal)"
                  >
                    {{ link.name }}
                  </button>
                  <!-- Regular navigation link -->
                  <NuxtLink v-else :to="link.url ?? '/'">
                    {{ link.name }}
                  </NuxtLink>
                </template>
              </div>
            </div>
          </div>
        </div>

        <Divider class="my-[20px]" />
        <div class="text-right">
          © AergloTechnologies {{ new Date().getFullYear() }}
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
interface FooterLink {
  name: string
  url?: string
  modal?: string
}

interface FooterSection {
  title: string
  items: FooterLink[]
}

interface FooterSectionOverride {
  matchTitle: string
  title: string
  items: FooterLink[]
}

const emit = defineEmits<{ 'modal-link': [modal: string] }>()

const props = withDefaults(
  defineProps<{
    tagline?: string
    linkOverrides?: FooterSectionOverride[]
  }>(),
  {
    tagline:
      'Empowering users to make confident decisions through transparent and authentic reviews. Discover, compare, and share experiences with ease.',
    linkOverrides: () => [],
  }
)

// ── Default sections (end-user baseline) ─────────────────────
const defaultLinks: FooterSection[] = [
  {
    title: 'Quick Links',
    items: [
      { name: 'Home',            url: '/' },
      { name: 'About CleReview', url: '/about' },
      { name: 'Help Center', url: '/help-center' },
      { name: 'Contact Us',      url: '/about#contact-us' },
    ],
  },
  {
    title: 'For Users',
    items: [
      { name: 'Browse Businesses', url: '/end-user/landing/explore' },
      { name: 'Write a Review', modal: 'write-review' },
      { name: 'Sign In',          modal: 'auth' },
      { name: 'Create Account',   modal: 'auth' },
    ],
  },
  {
    title: 'Support',
    items: [
      { name: 'Terms of Service', url: '/terms-and-conditions' },
      { name: 'Privacy Policy',   url: '/privacy-policy' },
      { name: 'FAQs',             url: '/help-center#faqs' },
    ],
  },
]

// ── Merge: match by matchTitle, display override title + items ─
const mergedLinks = computed<FooterSection[]>(() =>
  defaultLinks.map((section) => {
    const override = props.linkOverrides.find((o) => o.matchTitle === section.title)
    if (!override) return section
    return { title: override.title, items: override.items }
  })
)
</script>

<style scoped>
a, button {
  color: white;
  padding-bottom: 1px;
  width: max-content;
  background: none;
  font-size: inherit;
  cursor: pointer;
}

a:hover, button:hover {
  border-bottom: 1px solid white;
}
</style>