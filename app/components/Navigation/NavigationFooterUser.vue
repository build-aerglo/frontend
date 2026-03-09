<template>
  <Card class="px-[30px] py-[50px] !bg-[#1B1A1B] !rounded-none !text-white">
    <template #content>
      <div>
        <div class="flex sm:flex-row flex-col gap-[30px]">
          <div class="sm:w-[40%] w-full">
            <div class="text-2xl font-bold mb-[5px] text-gold">CleReview</div>
            <div>
              Empowering users to make confident decisions through transparent
              and authentic reviews. <br />Discover, compare, and share
              experiences with ease.
            </div>
            <div class="mt-[30px]">
              <span
                >Email:
                <a href="mailto:support@clereview.com"
                  >support@clereview.com</a
                ></span
              >
              <div class="flex gap-4 mt-2">
                <NuxtLink to="/" class="text-white transition"
                  ><i class="pi pi-facebook text-lg"></i
                ></NuxtLink>
                <NuxtLink to="/" class="text-white transition"
                  ><i class="pi pi-twitter text-lg"></i
                ></NuxtLink>
                <NuxtLink to="/" class="text-white transition"
                  ><i class="pi pi-instagram text-lg"></i
                ></NuxtLink>
                <NuxtLink to="/" class="text-white transition"
                  ><i class="pi pi-linkedin text-lg"></i
                ></NuxtLink>
              </div>
            </div>
          </div>
          <div class="flex-1 grid sm:grid-cols-3 grid-cols-2 gap-[20px]">
            <div v-for="(i, idx) in links" :key="idx">
              <div class="text-[120%] font-bold mb-[20px]">
                {{ i.title }}
              </div>

              <div class="flex flex-col gap-2.5">
                <NuxtLink v-for="(link, link_idx) in i.items" :key="link_idx">{{
                  link.name
                }}</NuxtLink>
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
const links = [
  {
    title: "Quick Links",
    items: [
      { name: "Home", url: "/" },
      { name: "About CleReview", url: "/" },
      { name: "Contact Us", url: "/" },
    ],
  },
  {
    title: "For Business",
    items: [
      { name: "Getting Started", url: "/" },
      { name: "Sign In", url: "/" },
      { name: "Create Account", url: "/" },
    ],
  },
  {
    title: "Support",
    items: [
      { name: "Terms of Service", url: "/" },
      { name: "Privacy Policy", url: "/" },
      { name: "FAQs", url: "/" },
    ],
  },
];
</script>

<style scoped>
a {
  color: white;
  padding-bottom: 1px;
  width: max-content;
}

a:hover {
  border-bottom: 1px solid white;
}
</style>
