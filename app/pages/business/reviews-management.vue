<template>

    
    <div class="flex flex-col md:flex-row gap-5 mb-8">
      
      <div class="shadow-md rounded flex-1 p-6 flex flex-col justify-between bg-white border-b-4 border-blue-500">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-semibold text-gray-600">Awaiting Replies</span>
          <i class="pi pi-comment text-3xl text-blue-500"></i>
        </div>
        <div class="text-4xl font-bold text-gray-800">{{ cardStats.awaitingReplies }}</div>
        <p class="text-sm text-gray-400 mt-1">New reviews requiring attention.</p>
      </div>

      <div class="shadow-md rounded flex-1 p-6 flex flex-col justify-between bg-white border-b-4 border-green-500">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-semibold text-gray-600">Total Liked</span>
          <i class="pi pi-thumbs-up text-3xl text-green-500"></i>
        </div>
        <div class="text-4xl font-bold text-gray-800">{{ cardStats.totalLiked }}</div>
        <p class="text-sm text-gray-400 mt-1">Total replies appreciated by users.</p>
      </div>

      <div class="shadow-md rounded flex-1 p-6 flex flex-col justify-between bg-white border-b-4 border-red-500">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-semibold text-gray-600">Flagged Reviews</span>
          <i class="pi pi-flag text-3xl text-red-500"></i>
        </div>
        <div class="text-4xl font-bold text-gray-800">{{ cardStats.flaggedReviews }}</div>
        <p class="text-sm text-gray-400 mt-1">Under moderation for policy violation.</p>
      </div>
    </div>
    
    <div class="card bg-white p-6">
      <h2 class="text-xl font-bold text-contrast mb-4">Filter Reviews</h2>
      
      <div class="pb-4 border-b border-gray-100 mb-6">
        
        <div class="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          
          <div class="flex flex-col md:flex-row flex-grow gap-3 md:gap-4 w-full">
            
            <InputSelect label="Date Range" class="flex-1" v-model="filters.dateRange">
              <option value="all">All Time</option>
              <option value="last_7">Last 7 Days</option>
              <option value="last_30">Last 30 Days</option>
            </InputSelect>
            
            <InputSelect label="Location" class="flex-1" v-model="filters.location">
              <option value="all">All Locations</option>
              <option value="main">Main Branch</option>
              <option value="east">East Branch</option>
            </InputSelect>

            <InputSelect label="Sentiment" class="flex-1" v-model="filters.sentiment">
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </InputSelect>

            <InputSelect label="Rating" class="flex-1" v-model="filters.rating">
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars & Up</option>
              <option value="3">3 Stars & Up</option>
            </InputSelect>

            <InputSelect label="Status" class="flex-1" v-model="filters.status">
              <option value="all">All Statuses</option>
              <option value="replied">Posted</option>
              <option value="unreplied">Flagged</option>
              <option value="flagged">Removed</option>
              <option value="awaiting_reply">Awaiting Reply</option>
            </InputSelect>
          </div>
          
          <div class="flex gap-3 w-full md:w-auto mt-0 md:pt-2">
            
            <ButtonCustom 
              label="Export"
              icon="pi pi-download"cdcd
              :primary="true"
              size="lg"
              input-class="w-full md:w-auto"
              @click="exportReviews"
            />
            
            <ButtonCustom 
              label="Reset"
              icon="pi pi-refresh"
              :primary="true"
              size="lg"
              input-class="w-full md:w-auto"
              @click="resetFilters"
            />
          </div>
        </div>
      </div>
      
      <div class="pt-4 overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 border-collapse">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="py-3 px-3">Date</th>
              <th scope="col" class="py-3 px-3">Location</th>
              <th scope="col" class="py-3 px-3">Review</th>
              <th scope="col" class="py-3 px-3">Source</th>
              <th scope="col" class="py-3 px-3">Status</th>
              <th scope="col" class="py-3 px-3">Sentiment</th>
              <th scope="col" class="py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in allReviews" :key="review.id" class="bg-white border-b hover:bg-gray-50">
              <td class="py-4 px-3">{{ review.date }}</td>
              <td class="py-4 px-3">{{ review.location }}</td>
              
              <td class="py-4 px-3 max-w-xs truncate">
                {{ review.body.substring(0, 25) }}...
                <a href="#" class="!text-link hover:underline text-xs" @click.prevent="openActionModal('view', review)">see more</a>
              </td>
              
              <td class="py-4 px-3">{{ review.source }}</td>
              
              <td class="py-4 px-3">
                <span :class="getStatusClass(review.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ review.status }}
                </span>
              </td>
              
              <td class="py-4 px-3">
                <span :class="getSentimentClass(review.sentiment)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ review.sentiment }}
                </span>
              </td>
              
              <td class="py-4 px-3 flex gap-2">
                <ButtonCustom icon="pi pi-eye" size="sm" @click="openActionModal('view', review)" />
                <ButtonCustom icon="pi pi-reply" size="sm" @click="openActionModal('reply', review)" />
                <ButtonCustom icon="pi pi-flag" size="sm" severity="danger" @click="openActionModal('flag', review)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <Dialog 
      v-model:visible="modalVisible" 
      :modal="true" 
      :header="`Review Action: ${currentAction}`" 
      :style="{ width: '50vw' }"
      :breakpoints="{ '1100px': '70vw', '960px': '90vw' }"
    >
      <div v-if="currentReview" class="p-4">
        
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                    {{ currentReview.reviewer.name.substring(0, 1) }}
                </div>
                <div>
                    <span class="font-semibold text-lg text-gray-800">{{ currentReview.reviewer.name }}</span>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <i v-for="n in currentReview.rating" :key="n" class="pi pi-star-fill text-yellow-400 text-sm"></i>
                        <i v-for="n in (5 - currentReview.rating)" :key="n + 5" class="pi pi-star text-yellow-400 text-sm"></i>
                        <span>({{ currentReview.rating }} / 5)</span>
                    </div>
                </div>
            </div>
            <div class="text-sm text-gray-500">
                Date: {{ currentReview.date }}
            </div>
        </div>

        <div class="mb-6 p-4 bg-gray-50 rounded border border-gray-100">
            <p class="text-gray-700 whitespace-pre-line">{{ currentReview.body }}</p>
        </div>

        <div v-if="currentAction === 'flag'" class="mb-4 p-3 bg-red-50 text-red-600 rounded flex items-center gap-3">
            <i class="pi pi-flag-fill text-xl"></i>
            <span>Mark this review for moderation. Add a reason in the reply box below.</span>
        </div>

        <div v-if="currentAction === 'reply' || currentAction === 'flag'" class="mb-6">
            <label for="review-reply" class="block text-sm font-medium text-contrast mb-2">Your Reply:</label>
            <InputTextAreaCustom 
                id="review-reply" 
                v-model="replyText"
                rows="4" 
                placeholder="Type your professional reply here..."
            />
        </div>
      </div>
      
      <template #footer>
          
          <ButtonCustom 
            :label="currentAction === 'reply' ? 'Send Reply' : currentAction === 'flag' ? 'Confirm Flag' : ''"
            :severity="currentAction === 'flag' ? 'danger' : 'primary'"
            :icon="currentAction === 'reply' ? 'pi pi-send' : currentAction === 'flag' ? 'pi pi-flag-fill' : 'pi pi-check'"
            @click="handleActionSubmit" 
          />
      </template>
    </Dialog>
     
</template>

<script setup lang="ts">
definePageMeta({ layout: 'business' })
import { ref } from 'vue';

// --- INTERFACES ---
interface Reviewer {
    name: string;
}

interface Review {
    id: number;
    reviewer: Reviewer;
    date: string;
    rating: number;
    body: string;
    location: string; 
    source: string; 
    status: 'Posted' | 'Awaiting Reply' | 'Flagged' | 'Removed'; 
    sentiment: 'Positive' | 'Neutral' | 'Negative'; 
}

const filters = ref({
    dateRange: 'all',
    location: 'all',
    sentiment: 'all',
    rating: 'all',
    status: 'all',
});

const cardStats = ref({
    awaitingReplies: 12,
    totalLiked: 458,
    flaggedReviews: 3,
});

const modalVisible = ref(false);
const currentAction = ref<'view' | 'reply' | 'flag'>('view');
const currentReview = ref<Review | null>(null);
const replyText = ref(''); 

const mockReview1: Review = {
    id: 101,
    reviewer: { name: 'Sarah J.' },
    date: '2025-11-15',
    rating: 5,
    body: 'The service was excellent and the staff were incredibly friendly! I highly recommend this location. I will definitely be coming back next week. Thank you for a great experience!',
    location: 'Main Branch',
    source: 'Google Maps',
    status: 'Posted',
    sentiment: 'Positive',
};

const mockReview2: Review = {
    id: 102,
    reviewer: { name: 'John A.' },
    date: '2025-11-16',
    rating: 2,
    body: 'I had a terrible experience with the delivery time. It was an hour late and the food was cold. Needs serious improvement.',
    location: 'East Branch',
    source: 'Yelp',
    status: 'Flagged',
    sentiment: 'Negative',
};

const mockReview3: Review = {
    id: 103,
    reviewer: { name: 'Alex M.' },
    date: '2025-11-16',
    rating: 3,
    body: 'The atmosphere was nice, but the coffee machine was broken. Everything else was fine.',
    location: 'Main Branch',
    source: 'App Store',
    status: 'Awaiting Reply',
    sentiment: 'Neutral',
};

const allReviews = ref<Review[]>([
    mockReview1,
    mockReview2,
    mockReview3,
    {
        id: 104,
        reviewer: { name: 'Lisa K.' },
        date: '2025-11-14',
        rating: 1,
        body: 'Spam review: This place is absolutely terrible, go to [competitor name] instead.',
        location: 'East Branch',
        source: 'Google Maps',
        status: 'Removed',
        sentiment: 'Negative',
    },
]);


// --- FUNCTIONS ---
const getStatusClass = (status: Review['status']) => {
    switch (status) {
        case 'Posted':
            return 'text-green-700 bg-green-100';
        case 'Awaiting Reply':
            return 'text-yellow-800 bg-yellow-100'; 
        case 'Flagged':
            return 'text-red-700 bg-red-100'; 
        case 'Removed':
            return 'text-orange-700 bg-orange-100';
        default:
            return 'text-gray-700 bg-gray-100';
    }
}

const getSentimentClass = (sentiment: Review['sentiment']) => {
    switch (sentiment) {
        case 'Positive':
            return 'text-green-700 bg-green-100';
        case 'Neutral':
            return 'text-gray-700 bg-gray-100';
        case 'Negative':
            return 'text-red-700 bg-red-100';
        default:
            return 'text-gray-700 bg-gray-100';
    }
}

const resetFilters = () => {
    filters.value = {
        dateRange: 'all',
        location: 'all',
        sentiment: 'all',
        rating: 'all',
        status: 'all',
    };
    console.log('Filters reset.', filters.value);
};

const exportReviews = () => {
    console.log('Exporting reviews based on current filters:', filters.value);
};

const openActionModal = (action: 'view' | 'reply' | 'flag', review: Review) => {
    currentAction.value = action;
    currentReview.value = review;
    replyText.value = ''; 
    modalVisible.value = true;
    console.log(`Preparing modal for review ID ${review.id} with action: ${action}`);
};

const handleActionSubmit = () => {
    if (!currentReview.value) return;

    if (currentAction.value === 'reply') {
        console.log(`Submitting reply for review ID ${currentReview.value.id}: ${replyText.value}`);
    } else if (currentAction.value === 'flag') {
        console.log(`Confirming flag for review ID ${currentReview.value.id}. Reason/Note: ${replyText.value}`);
    } else if (currentAction.value === 'view') {

    }
    
    modalVisible.value = false;
};

</script>

<style scoped>
</style>