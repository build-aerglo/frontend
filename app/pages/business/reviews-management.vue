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
        
        <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          
          <div class="flex flex-col md:flex-row flex-grow gap-1 md:gap-3 w-full">
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <Dropdown 
                v-model="filters.dateRange"
                :options="dateRangeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Date Range"
                class="w-full"
              />
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Dropdown 
                v-model="filters.location"
                :options="locationOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Location"
                class="w-full"
              />
            </div>

            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
              <Dropdown 
                v-model="filters.sentiment"
                :options="sentimentOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Sentiment"
                class="w-full"
              />
            </div>

            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <Dropdown 
                v-model="filters.rating"
                :options="ratingOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Rating"
                class="w-full"
              />
            </div>

            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Dropdown 
                v-model="filters.status"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Status"
                class="w-full"
              />
            </div>
          </div>
          
          <div class="flex gap-1 w-full md:w-auto mt-0 md:pt-2">
            
            <ButtonCustom 
              label="Export"
              icon="pi pi-download"
              :primary="true"
              size="md"
              input-class="w-full md:w-auto"
              @click="exportReviews"
            />
            
            <ButtonCustom 
              label="Reset"
              icon="pi pi-refresh"
              :primary="true"
              size="md"
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
            <tr v-for="review in filteredReviews" :key="review.id" class="bg-white border-b hover:bg-gray-50">
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
    
    <!-- View/Reply Modal -->
    <Dialog 
      v-if="currentAction !== 'flag'"
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
                    <div class="flex items-center text-sm text-gray-500">
                        <Star
                          v-for="n in 5"
                          :key="n"
                          :value="currentReview.rating- (n - 1)"
                          :color-level="Math.ceil(currentReview.rating)"
                          class="w-6 h-6"
                        />
                        <span>({{ currentReview.rating }})</span>
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

        <div v-if="currentAction === 'reply'" class="mb-6">
            <label for="review-reply" class="block text-sm font-medium text-contrast mb-2">Reply Review:</label>
            <InputTextAreaCustom 
                id="review-reply" 
                v-model="replyText"
                rows="4" 
                placeholder="Type your reply here..."
            />
        </div>
      </div>
      
      <template #footer>
          <ButtonCustom 
            v-if="currentAction === 'reply'"
            label="Send Reply"
            severity="primary"
            icon="pi pi-send"
            @click="handleActionSubmit" 
          />
      </template>
    </Dialog>

    <!-- Flag Modal -->
    <Dialog 
      v-if="currentAction === 'flag'"
      v-model:visible="modalVisible" 
      :modal="true" 
      header="Flag Review" 
      :style="{ width: '50vw' }"
      :breakpoints="{ '1100px': '70vw', '960px': '90vw' }"
    >
      <div v-if="currentReview" class="p-4">
        
        <!-- Review Header -->
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
              {{ currentReview.reviewer.name.substring(0, 1) }}
            </div>
            <div>
              <span class="font-semibold text-lg text-gray-800">{{ currentReview.reviewer.name }}</span>
              <div class="flex items-center text-sm text-gray-500">
                <Star
                          v-for="n in 5"
                          :key="n"
                          :value="currentReview.rating- (n - 1)"
                          :color-level="Math.ceil(currentReview.rating)"
                          class="w-6 h-6"
                        />
                <span>{{ currentReview.rating }}</span>
              </div>
            </div>
          </div>
          <div class="text-sm text-gray-500">
            Date: {{ currentReview.date }}
          </div>
        </div>

        <!-- Review Body -->
        <div class="mb-6 p-4 bg-gray-50 rounded border border-gray-100">
          <p class="text-gray-700 whitespace-pre-line">{{ currentReview.body }}</p>
        </div>

        <!-- Warning Banner -->
        <div class="mb-4 p-3 bg-red-50 text-red-500 rounded flex items-center gap-3">
          <i class="pi pi-flag-fill text-sm"></i>
          <span>Flag this review for moderation review</span>
        </div>

        <!-- Reason Dropdown -->
        <div class="mb-4">
          <label for="flag-reason" class="block text-sm font-medium text-gray-400 mb-2">
            Reason for Flagging <span class="text-red-500">*</span>
          </label>
          <Dropdown 
            id="flag-reason"
            v-model="flagReason" 
            :options="flagReasons" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Select a reason"
            class="w-full"
            :class="{ 'p-invalid': showValidation && !flagReason }"
          />
          <small v-if="showValidation && !flagReason" class="p-error">Please select a reason</small>
        </div>

        <!-- Explanation Text Area -->
        <div class="mb-4">
          <label for="flag-explanation" class="block text-sm font-medium text-gray-400 mb-2">
            Brief Explanation <span class="text-red-500">*</span>
          </label>
          <Textarea 
            id="flag-explanation"
            v-model="flagExplanation"
            rows="3"
            placeholder="Provide a brief explanation for flagging this review..."
            class="w-full"
            :class="{ 'p-invalid': showValidation && !flagExplanation }"
          />
          <small v-if="showValidation && !flagExplanation" class="p-error">Please provide an explanation</small>
        </div>

        <!-- File Upload -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-2">
            Supporting Image (Optional)
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*"
              @change="handleFileUpload"
              class="hidden"
            />
            
            <div v-if="!uploadedFile" @click="triggerFileUpload" class="cursor-pointer">
              <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-2"></i>
              <p class="text-sm text-gray-600">Click to upload an image</p>
              <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
            </div>

            <div v-else class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="pi pi-image text-2xl text-blue-500"></i>
                <div class="text-left">
                  <p class="text-sm font-medium text-gray-400">{{ uploadedFile.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(uploadedFile.size) }}</p>
                </div>
              </div>
              <Button 
                icon="pi pi-times" 
                @click="removeFile"
                severity="danger"
                text
                rounded
              />
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button 
            label="Cancel" 
            icon="pi pi-times"
            @click="closeModal"
            severity="secondary"
            text
          />
          <Button 
            label="Flag"
            icon="pi pi-flag"
            @click="handleFlagSubmit" 
            severity="danger"
          />
        </div>
      </template>
    </Dialog>
     
</template>

<script setup lang="ts">
definePageMeta({ layout: 'business' })
import { ref, computed } from 'vue';
import Star from '~/components/Stars.vue'

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

// Dropdown options
const dateRangeOptions = [
  { label: 'all', value: 'all' },
  { label: 'Last 7 Days', value: 'last_7' },
  { label: 'Last 30 Days', value: 'last_30' }
];

const locationOptions = [
  { label: 'all', value: 'all' },
  { label: 'Main Branch', value: 'main' },
  { label: 'East Branch', value: 'east' }
];

const sentimentOptions = [
  { label: 'all', value: 'all' },
  { label: 'Positive', value: 'positive' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Negative', value: 'negative' }
];

const ratingOptions = [
  { label: 'all', value: 'all' },
  { label: '5 Stars', value: '5' },
  { label: '4 Stars & Up', value: '4' },
  { label: '3 Stars & Up', value: '3' }
];

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Posted', value: 'replied' },
  { label: 'Flagged', value: 'unreplied' },
  { label: 'Removed', value: 'flagged' },
  { label: 'Awaiting Reply', value: 'awaiting_reply' }
];

const cardStats = ref({
    awaitingReplies: 12,
    totalLiked: 458,
    flaggedReviews: 3,
});

const modalVisible = ref(false);
const currentAction = ref<'view' | 'reply' | 'flag'>('view');
const currentReview = ref<Review | null>(null);
const replyText = ref(''); 

// Flag Modal specific refs
const showValidation = ref(false);
const flagReason = ref('');
const flagExplanation = ref('');
const uploadedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const flagReasons = [
  { label: 'Spam or Fake Review', value: 'spam' },
  { label: 'Inappropriate Language', value: 'inappropriate' },
  { label: 'Conflict of Interest', value: 'conflict' },
  { label: 'False Information', value: 'false-info' },
  { label: 'Legal', value: 'legal' },
  { label: 'Privacy Violation', value: 'privacy' },
  { label: 'Other', value: 'other' }
];

const mockReview1: Review = {
    id: 101,
    reviewer: { name: 'Sarah J.' },
    date: '2025-11-15',
    rating: 4.4,
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
    rating: 2.3,
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
    rating: 3.1,
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
        rating: 1.8,
        body: 'Spam review: This place is absolutely terrible, go to [competitor name] instead.',
        location: 'East Branch',
        source: 'Google Maps',
        status: 'Removed',
        sentiment: 'Negative',
    },
    {
        id: 105,
        reviewer: { name: 'Michael B.' },
        date: '2025-12-01',
        rating: 4.9,
        body: 'Outstanding customer service! The team went above and beyond to help me find exactly what I needed. The store was clean and well-organized.',
        location: 'Main Branch',
        source: 'Facebook',
        status: 'Posted',
        sentiment: 'Positive',
    },
    {
        id: 106,
        reviewer: { name: 'Emily R.' },
        date: '2025-11-28',
        rating: 4.0,
        body: 'Good selection of products and reasonable prices. Staff could be more attentive during peak hours, but overall a positive experience.',
        location: 'East Branch',
        source: 'Yelp',
        status: 'Awaiting Reply',
        sentiment: 'Positive',
    },
    {
        id: 107,
        reviewer: { name: 'David T.' },
        date: '2025-11-20',
        rating: 3.5,
        body: 'The location is convenient but parking is always a nightmare. The service inside is okay, nothing special.',
        location: 'Main Branch',
        source: 'Google Maps',
        status: 'Posted',
        sentiment: 'Neutral',
    },
]);

// Computed property for filtered reviews
const filteredReviews = computed(() => {
    return allReviews.value.filter(review => {
        // Date filter
        if (filters.value.dateRange !== 'all') {
            const reviewDate = new Date(review.date);
            const today = new Date();
            const daysDiff = Math.floor((today.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (filters.value.dateRange === 'last_7' && daysDiff > 7) return false;
            if (filters.value.dateRange === 'last_30' && daysDiff > 30) return false;
        }
        
        // Location filter
        if (filters.value.location !== 'all' && review.location !== filters.value.location) {
            return false;
        }
        
        // Sentiment filter
        if (filters.value.sentiment !== 'all' && review.sentiment.toLowerCase() !== filters.value.sentiment.toLowerCase()) {
            return false;
        }
        
        // Rating filter
        if (filters.value.rating !== 'all') {
            const minRating = parseInt(filters.value.rating);
            if (review.rating < minRating) return false;
        }
        
        // Status filter
        if (filters.value.status !== 'all') {
            const statusMap: Record<string, string> = {
                'replied': 'Posted',
                'unreplied': 'Flagged',
                'flagged': 'Removed',
                'awaiting_reply': 'Awaiting Reply'
            };
            const mappedStatus = statusMap[filters.value.status];
            if (review.status !== mappedStatus) return false;
        }
        
        return true;
    });
});


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
    
    // Get filtered reviews to export
    const reviewsToExport = filteredReviews.value;
    
    // Create CSV content
    const headers = ['Date', 'Location', 'Reviewer', 'Rating', 'Review', 'Source', 'Status', 'Sentiment'];
    const csvRows = [headers.join(',')];
    
    reviewsToExport.forEach(review => {
        const row = [
            review.date,
            review.location,
            review.reviewer.name,
            review.rating,
            `"${review.body.replace(/"/g, '""')}"`, // Escape quotes in review text
            review.source,
            review.status,
            review.sentiment
        ];
        csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const openActionModal = (action: 'view' | 'reply' | 'flag', review: Review) => {
    currentAction.value = action;
    currentReview.value = review;
    replyText.value = ''; 
    resetFlagForm();
    modalVisible.value = true;
    console.log(`Preparing modal for review ID ${review.id} with action: ${action}`);
};

const handleActionSubmit = () => {
    if (!currentReview.value) return;

    if (currentAction.value === 'reply') {
        console.log(`Submitting reply for review ID ${currentReview.value.id}: ${replyText.value}`);
        modalVisible.value = false;
    }
};

// Flag Modal Functions
const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    uploadedFile.value = file;
  }
};

const removeFile = () => {
  uploadedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const closeModal = () => {
  modalVisible.value = false;
  resetFlagForm();
};

const resetFlagForm = () => {
  flagReason.value = '';
  flagExplanation.value = '';
  uploadedFile.value = null;
  showValidation.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const handleFlagSubmit = () => {
  showValidation.value = true;
  
  // Validate required fields
  if (!flagReason.value || !flagExplanation.value) {
    return;
  }
  
  console.log('Flag submitted:', {
    reviewId: currentReview.value?.id,
    reason: flagReason.value,
    explanation: flagExplanation.value,
    hasImage: !!uploadedFile.value,
    fileName: uploadedFile.value?.name
  });
  
  // Show success message or handle submission
  alert('Review flagged successfully!');
  closeModal();
};
</script>