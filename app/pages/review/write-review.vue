<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mb-0">
      <NavBarReview />
    </div>

    <div class="w-full h-full px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10">

        <div class="md:col-span-6 md:order-2 rounded-xl bg-white p-6 shadow-[rgba(0,130,83,0.35)_0px_0px_50px_5px]">
          <ReviewForm 
            :key="formKey"
            :initial-data="pageDraft"
            @success="handlePageSuccess"
          />
        </div>

        <div class="md:col-span-3 md:order-1 bg-white rounded-lg shadow-md p-2">
          <h2 class="text-xl font-bold text-center text-gray-400 mb-6 uppercase tracking-wider">Featured Businesses</h2>
          <div class="space-y-3">
            <div v-for="(business, index) in featuredBusinesses" :key="index"
              class="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
              <div class="flex items-start justify-between mb-1">
                <div class="flex-1">
                  <h4 class="font-semibold mb-0 text-lg text-gray-400">{{ business.name }}</h4>
                  <p class="text-xs mt-0 text-gray-400">{{ business.location }}</p>
                </div>
                <button @click="removeBusiness(index)" class="text-gray-400 hover:text-gray-800 transition-colors">
                  <i class="pi pi-times text-xs"></i>
                </button>
              </div>
              <div class="flex items-center mt-2">
                <Star v-for="n in 5" :key="n" :value="(business.hoverRating || business.rating) - (n - 1)"
                  :color-level="Math.ceil(business.hoverRating || business.rating)" class="cursor-pointer mb-0"
                  @mousemove="business.hoverRating = n - 1 + getFraction($event)" @mouseleave="business.hoverRating = 0"
                  @click="rateBusiness(index, n - 1 + getFraction($event))" />
              </div>
            </div>
          </div>
        </div>

        <div class="md:col-span-3 md:order-3 space-y-4">
          <div v-for="i in 5" :key="i"
            class="bg-white rounded-lg shadow-md p-6 h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div class="text-center text-gray-400">
              <i class="pi pi-image text-3xl mb-2"></i>
              <p class="text-sm">Ad Space</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Star from '~/components/Stars.vue'
import ReviewForm from '~/components/Review/ReviewForm.vue'

const route = useRoute();
const router = useRouter();
const queryDraft = computed(() => {
  if (route.query.bizId) {
    return {
      businessName: route.query.bizName || "",
      selectedBusinessId: route.query.bizId || "",
      selectedBusinessLogo: route.query.bizLogo || "",
      rating: 0,
      reviewBody: '',
      images: [],
      isAddingNewBusiness: false
    };
  }
  return null;
});
const pageDraft = ref<any>(null);
const formKey = ref(0);
const featuredBusinesses = ref([
  { name: "KFC", location: "Yaba", rating: 0, hoverRating: 0, logo: "/images/logos/kfc.png" },
  { name: "Domino's Pizza", location: "Ikeja", rating: 0, hoverRating: 0, logo: "/images/logos/pizza.png" },
  { name: "Chicken Republic", location: "Victoria Island", rating: 0, hoverRating: 0, logo: "/images/logos/republic.png" },
]);

const handlePageSuccess = () => {
  pageDraft.value = {
    businessName: "",
    selectedBusinessId: "",
    selectedBusinessLogo: "",
    rating: 0,
    reviewBody: '',
    images: [],
    isAddingNewBusiness: false
  };
  formKey.value++; 
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const rateBusiness = (index: number, value: number) => {
  const business = featuredBusinesses.value[index];
  if (business) {
    business.rating = Math.round(value * 2) / 2;
  }
};

const removeBusiness = (index: number) => featuredBusinesses.value.splice(index, 1);

const getFraction = (event: MouseEvent): number => {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = event.clientX - rect.left;
  const fraction = x / rect.width;
  return fraction < 0.25 ? 0 : (fraction < 0.75 ? 0.5 : 1);
};

onMounted(() => {
  const savedDraft = localStorage.getItem('review_draft');
  if (savedDraft) {
    pageDraft.value = JSON.parse(savedDraft);
    localStorage.removeItem('review_draft');
  } else if (queryDraft.value) {
    // 2. Assign the computed query draft to the ref
    pageDraft.value = queryDraft.value;
  }
});
</script>