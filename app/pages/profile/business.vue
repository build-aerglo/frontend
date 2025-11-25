<template>
<div class="min-h-screen bg-green-50">
<NavBarBusProfile/>
<!-- Business Header Section -->
<div class="bg-white border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Business Image -->        
            <div 
            class="flex-shrink-0 relative w-40 h-40 group cursor-pointer"
            @click="triggerImageUpload"
            >
            <img 
                :src="businessData.image" 
                alt="Business Logo" 
                class="w-full h-full object-cover rounded-xl border border-gray-200"
                @error="handleImageError"
            />
            <!-- Hover overlay -->
            <div 
                class="absolute inset-0 bg-slate-50 bg-opacity-40 rounded-xl hidden group-hover:flex items-center justify-center"
            >
                <i class="pi pi-camera text-white text-xl"></i>
            </div>

            <!-- Hidden file input -->
            <input 
                type="file"
                accept="image/*"
                ref="imageInput"
                class="hidden"
                @change="handleImageUpload"
            />
            </div>

      <!-- Business Info with Edit -->
      <div class="flex-1">
        <div class="flex flex-wrap items-start justify-between gap-4 mb-1">
          <div class="flex-1">
            <!-- Business Name -->
            <div class="flex items-center gap-2">
              <input 
                v-if="isEditing.name"
                v-model="businessData.name"
                class="text-3xl font-bold text-gray-900 border-b-2 border-[#008253] focus:outline-none bg-transparent"
                @blur="isEditing.name = false"
                @keyup.enter="isEditing.name = false"
              />
              <h1 v-else class="text-3xl font-bold text-gray-900">{{ businessData.name }}</h1>
              <button 
                @click="isEditing.name = true"
                class="text-[#008253] hover:text-[#006642]"
              >
                <i class="pi pi-pencil text-sm"></i>
              </button>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <div class="flex">
                      <Star
                        v-for="n in 5"
                        :key="n"
                        :value="businessData.rating - (n - 1)"
                        :color-level="Math.ceil(businessData.rating)"
                        class="w-6 h-6"
                      />
              </div>
              <span class="text-lg font-semibold text-gray-700">{{ businessData.rating }}</span>
              <span class="text-gray-500">({{ businessData.reviewCount }} reviews)</span>
            </div>
          </div>
        </div>

        <div class="space-y-2 text-gray-700">
          <!-- Address -->
          <div class="flex items-start gap-2">
            <i class="pi pi-map-marker text-[#008253] mt-1"></i>
            <input 
              v-if="isEditing.address"
              v-model="businessData.address"
              class="flex-1 border-b border-[#008253] focus:outline-none bg-transparent"
              @blur="isEditing.address = false"
              @keyup.enter="isEditing.address = false"
            />
            <span v-else class="flex-1">{{ businessData.address }}</span>
            <button 
              @click="isEditing.address = true"
              class="text-[#008253] hover:text-[#006642]"
            >
              <i class="pi pi-pencil text-xs"></i>
            </button>
          </div>

          <!-- Phone -->
          <div class="flex items-center gap-2">
            <i class="pi pi-phone text-[#008253]"></i>
            <input 
              v-if="isEditing.phone"
              v-model="businessData.phone"
              class="flex-1 border-b border-[#008253] focus:outline-none bg-transparent"
              @blur="isEditing.phone = false"
              @keyup.enter="isEditing.phone = false"
            />
            <span v-else class="flex-1">{{ businessData.phone }}</span>
            <button 
              @click="isEditing.phone = true"
              class="text-[#008253] hover:text-[#006642]"
            >
              <i class="pi pi-pencil text-xs"></i>
            </button>
          </div>

          <!-- Website -->
          <div class="flex items-center gap-2">
            <i class="pi pi-globe text-[#008253]"></i>
            <input 
              v-if="isEditing.website"
              v-model="businessData.website"
              class="flex-1 border-b border-[#008253] focus:outline-none bg-transparent"
              @blur="isEditing.website = false"
              @keyup.enter="isEditing.website = false"
            />
            <a v-else :href="businessData.website" target="_blank" class="text-blue-600 hover:underline flex-1">
              {{ businessData.website }}
            </a>
            <button 
              @click="isEditing.website = true"
              class="text-[#008253] hover:text-[#006642]"
            >
              <i class="pi pi-pencil text-xs"></i>
            </button>
          </div>

          <!-- Hours -->
          <div class="flex items-center gap-2">
            <i class="pi pi-clock text-[#008253]"></i>
            <span class="businessData.isOpen ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
              {{ businessData.isOpen ? 'Open Now' : 'Closed' }} • {{ businessData.hours }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Tabs -->
<div class="bg-white border-b border-gray-200 sticky top-16 z-40">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex gap-2 sm:gap-6 py-4 overflow-x-auto">
      <button
        @click="activeTab = 'overview'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap',
          activeTab === 'overview'
            ? 'bg-[#008253] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        Overview
      </button>
      <button
        @click="activeTab = 'reviews'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap',
          activeTab === 'reviews'
            ? 'bg-[#008253] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        Reviews ({{ businessData.reviewCount }})
      </button>
      <button
        @click="activeTab = 'photos'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap',
          activeTab === 'photos'
            ? 'bg-[#008253] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        Photos
      </button>
      <button
        @click="activeTab = 'about'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap',
          activeTab === 'about'
            ? 'bg-[#008253] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        About
      </button>
    </div>
  </div>
</div>

<!-- Main Content -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Content Area -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <!-- About Section -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">About</h3>
            <button 
              @click="isEditing.description = !isEditing.description"
              class="text-[#008253] hover:text-[#006642]"
            >
              <i :class="isEditing.description ? 'pi pi-check' : 'pi pi-pencil'"></i>
            </button>
          </div>
          <textarea 
            v-if="isEditing.description"
            v-model="businessData.description"
            class="w-full text-gray-800 leading-relaxed border border-[#008253] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#008253]"
            rows="4"
            @blur="isEditing.description = false"
          ></textarea>
          <p v-else class="text-gray-800 leading-relaxed">{{ businessData.description }}</p>
        </div>

        <!-- Tags Section -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">Tags</h3>
            <button 
              @click="addTag"
              class="text-[#008253] hover:text-[#006642] flex items-center gap-1"
            >
              <i class="pi pi-plus"></i>
              <span class="text-sm">Add Tag</span>
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="(tag, idx) in businessData.tags" 
              :key="idx"
              class="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
            >
              <span>{{ tag }}</span>
              <button 
                @click="removeTag(idx)"
                class="hover:text-red-600"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
            <input 
              v-if="showTagInput"
              v-model="newTag"
              @keyup.enter="saveTag"
              @blur="saveTag"
              placeholder="Enter tag..."
              class="px-4 py-2 border border-[#008253] rounded-full text-sm focus:outline-none"
              ref="tagInput"
            />
          </div>
        </div>

        <!-- Highlights -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">Highlights</h3>
            <button 
              @click="addHighlight"
              class="text-[#008253] hover:text-[#006642] flex items-center gap-1"
            >
              <i class="pi pi-plus"></i>
              <span class="text-sm">Add</span>
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
              v-for="(highlight, idx) in businessData.highlights" 
              :key="idx"
              class="flex items-center gap-2 text-gray-700 group"
            >
              <i class="pi pi-check-circle text-green-600"></i>
              <input 
                v-if="isEditing[`highlight-${idx}`]"
                v-model="businessData.highlights[idx]"
                class="flex-1 border-b border-[#008253] focus:outline-none bg-transparent"
                @blur="isEditing[`highlight-${idx}`] = false"
                @keyup.enter="isEditing[`highlight-${idx}`] = false"
              />
              <span v-else class="flex-1">{{ highlight }}</span>
              <button 
                @click="isEditing[`highlight-${idx}`] = true"
                class="opacity-0 group-hover:opacity-100 text-[#008253] hover:text-[#006642]"
              >
                <i class="pi pi-pencil text-xs"></i>
              </button>
              <button 
                @click="removeHighlight(idx)"
                class="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700"
              >
                <i class="pi pi-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Popular Services -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">Popular Services</h3>
            <button 
              @click="addService"
              class="text-[#008253] hover:text-[#006642] flex items-center gap-1"
            >
              <i class="pi pi-plus"></i>
              <span class="text-sm">Add</span>
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="(service, idx) in businessData.services" 
              :key="idx"
              class="px-4 py-2 bg-green-50 text-[#008253] rounded-full text-sm font-medium flex items-center gap-2 group"
            >
              <input 
                v-if="isEditing[`service-${idx}`]"
                v-model="businessData.services[idx]"
                class="bg-transparent border-b border-[#008253] focus:outline-none w-24"
                @blur="isEditing[`service-${idx}`] = false"
                @keyup.enter="isEditing[`service-${idx}`] = false"
              />
              <span v-else>{{ service }}</span>
              <button 
                @click="isEditing[`service-${idx}`] = true"
                class="opacity-0 group-hover:opacity-100 hover:text-[#006642]"
              >
                <i class="pi pi-pencil text-xs"></i>
              </button>
              <button 
                @click="removeService(idx)"
                class="opacity-100 group-hover:opacity-700 text-red-600 hover:text-red-700"
              >
                <i class="pi pi-times text-[#008253] text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Reviews Preview -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900">Recent Reviews</h3>
            <button 
              @click="activeTab = 'reviews'"
              class="text-[#008253] font-medium hover:underline"
            >
              See All
            </button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="review in businessReviews.slice(0, 3)" 
              :key="review.id"
              class="border-b border-gray-200 pb-4 last:border-0"
            >
              <div class="flex items-start gap-3 mb-2">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {{ review.author.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <p class="font-semibold text-gray-900">{{ review.author }}</p>
                    <span class="text-sm text-gray-500">{{ review.date }}</span>
                  </div>
                  <div class="flex mb-2">
                    <Star
                      v-for="n in 5"
                      :key="n"
                      :filled="n <= review.rating"
                      class="w-4 h-4"
                    />
                  </div>
                  <p class="text-gray-700 text-sm mb-2">{{ review.body }}</p>
                  <div class="flex items-center gap-3 text-sm">
                    <button 
                      @click="toggleReplyBox(review.id)"
                      class="text-[#008253] hover:text-[#006642] flex items-center gap-1"
                    >
                      <i class="pi pi-reply"></i>
                      <span>Reply</span>
                    </button>
                    <button class="text-red-600 hover:text-red-700 flex items-center gap-1">
                      <i class="pi pi-flag"></i>
                      <span>Flag</span>
                    </button>
                  </div>
                  <div v-if="showReplyBox === review.id" class="mt-3">
                    <textarea 
                      v-model="replyText"
                      placeholder="Write your reply..."
                      class="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008253]"
                      rows="2"
                    ></textarea>
                    <div class="flex gap-2 mt-2">
                      <button 
                        @click="saveReply(review.id)"
                        class="px-3 py-1 bg-[#008253] text-white rounded text-sm hover:bg-[#006642]"
                      >
                        Send
                      </button>
                      <button 
                        @click="showReplyBox = null"
                        class="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Tab -->
      <div v-if="activeTab === 'reviews'" class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">All Reviews</h3>
          
          <!-- Review Summary -->
          <div class="bg-green-50 rounded-lg p-4 mb-6">
            <div class="flex items-center gap-4">
              <div class="text-center">
                <div class="text-4xl font-bold text-gray-900">{{ businessData.rating }}</div>
                <div class="flex justify-center">
                  <div class="flex">
                          <Stars
                            v-for="n in 5"
                            :key="n"
                            :filled="n <= businessData.rating"
                            :colorLevel="n <= businessData.rating ? businessData.rating : 0"
                            class="w-6 h-6"
                          />
                      </div>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ businessData.reviewCount }} reviews</p>
              </div>
              <div class="flex-1 space-y-1">
                <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-2">
                  <span class="text-sm text-gray-600 w-8">{{ star }}★</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-gold h-2 rounded-full" 
                      :style="{ width: `${getStarPercentage(star)}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600 w-12">{{ getStarCount(star) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Individual Reviews -->
          <div class="space-y-6">
            <div 
              v-for="review in businessReviews" 
              :key="review.id"
              class="border-b border-gray-200 pb-6 last:border-0"
            >
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {{ review.author.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <p class="font-semibold text-gray-900">{{ review.author }}</p>
                    <span class="text-sm text-gray-500">{{ review.date }}</span>
                  </div>
                  <div class="flex mb-2">
                    <Star
                      v-for="n in 5"
                      :key="n"
                      :filled="n <= review.rating"
                      class="w-5 h-5"
                    />
                  </div>
                  <p class="text-gray-700 mb-3">{{ review.body }}</p>
                  
                  <!-- Owner Reply -->
                  <div v-if="review.reply" class="bg-gray-50 rounded-lg p-3 mb-3">
                    <p class="text-sm font-semibold text-gray-900 mb-1">Response from owner:</p>
                    <p class="text-sm text-gray-700">{{ review.reply }}</p>
                  </div>

                  <div class="flex items-center gap-4 text-sm">
                    <button 
                      @click="toggleReplyBox(review.id)"
                      class="text-[#008253] hover:text-[#006642] flex items-center gap-1"
                    >
                      <i class="pi pi-reply"></i>
                      <span>{{ review.reply ? 'Edit Reply' : 'Reply' }}</span>
                    </button>
                    <button class="text-red-600 hover:text-red-700 flex items-center gap-1">
                      <i class="pi pi-flag"></i>
                      <span>Flag</span>
                    </button>
                  </div>

                  <div v-if="showReplyBox === review.id" class="mt-3">
                    <textarea 
                      v-model="replyText"
                      placeholder="Write your reply..."
                      class="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008253]"
                      rows="3"
                    ></textarea>
                    <div class="flex gap-2 mt-2">
                      <button 
                        @click="saveReply(review.id)"
                        class="px-3 py-1 bg-[#008253] text-white rounded text-sm hover:bg-[#006642]"
                      >
                        Send
                      </button>
                      <button 
                        @click="showReplyBox = null; replyText = ''"
                        class="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Photos Tab -->
      <div v-if="activeTab === 'photos'" class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">Photos</h3>
            <button 
              @click="addPhoto"
              class="px-4 py-2 bg-[#008253] text-white rounded-lg hover:bg-[#006642] flex items-center gap-2"
            >
              <i class="pi pi-plus"></i>
              <span>Add Photos</span>
            </button>
          </div>
          <input 
            ref="photoInput" 
            type="file" 
            accept="image/*" 
            multiple
            class="hidden" 
            @change="handlePhotoSelect"
          />
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              v-for="(photo, idx) in businessPhotos" 
              :key="idx"
              class="relative group"
            >
              <img 
                :src="photo"
                alt="Business photo"
                class="w-full h-48 object-cover rounded-lg"
                @error="handleImageError"
              />
              <button 
                @click="removePhoto(idx)"
                class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
              >
                <i class="pi pi-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- About Tab-->
      <div v-if="activeTab === 'about'" class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-xl font-bold text-[#008253] mb-4">Business Information</h3>
        <div class="space-y-4">
        <!-- Description -->
        <div>
          <div class="flex items-center justify-between mb-2">
             <h4 class="font-semibold text-gray-900">Description</h4>
              <button
              @click="isEditing.descriptionFull = !isEditing.descriptionFull"
              class="text-[#008253] hover:text-[#006642]"
              >
              <i :class="isEditing.description ? 'pi pi-check' : 'pi pi-pencil'"></i>
              </button>
          </div>
        <textarea
          v-if="isEditing.descriptionFull"
          v-model="businessData.description"
          class="w-full text-gray-700 border border-[#008253] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#008253]"
          rows="4"
          @blur="isEditing.descriptionFull = false"
          >
        </textarea>
        <p v-else class="text-gray-700">{{ businessData.description }}</p>
      </div>

<!-- Business Hours -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Business Hours (Weekly)</h4>
              <div class="space-y-1">
                <div 
                  v-for="(hours, day) in businessData.businessHours" 
                  :key="day"
                  class="flex justify-between text-gray-700 items-center group"
                >
                  <span class="font-medium">{{ day }}</span>
                  <div class="flex items-center gap-2">
                    <input 
                      v-if="isEditing[`hours-${day}`]"
                      v-model="businessData.businessHours[day]"
                      class="border-b border-[#008253] focus:outline-none bg-transparent text-right"
                      @blur="isEditing[`hours-${day}`] = false"
                      @keyup.enter="isEditing[`hours-${day}`] = false"
                    />
                    <span v-else>{{ hours }}</span>
                    <button 
                      @click="isEditing[`hours-${day}`] = true"
                      class="opacity-0 group-hover:opacity-100 text-[#008253] hover:text-[#006642]"
                    >
                      <i class="pi pi-pencil text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Amenities -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900">Amenities</h4>
                <button 
                  @click="addAmenity"
                  class="text-[#008253] hover:text-[#006642] flex items-center gap-1"
                >
                  <i class="pi pi-plus"></i>
                  <span class="text-sm">Add</span>
                </button>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div 
                  v-for="(amenity, idx) in businessData.amenities" 
                  :key="idx"
                  class="flex items-center gap-2 text-gray-700 group"
                >
                  <i class="pi pi-check text-[#008253]"></i>
                  <input 
                    v-if="isEditing[`amenity-${idx}`]"
                    v-model="businessData.amenities[idx]"
                    class="flex-1 border-b border-[#008253] focus:outline-none bg-transparent"
                    @blur="isEditing[`amenity-${idx}`] = false"
                    @keyup.enter="isEditing[`amenity-${idx}`] = false"
                  />
                  <span v-else class="flex-1">{{ amenity }}</span>
                  <button 
                    @click="isEditing[`amenity-${idx}`] = true"
                    class="opacity-0 group-hover:opacity-100 text-[#008253] hover:text-[#006642]"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button 
                    @click="removeAmenity(idx)"
                    class="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar - Quick Actions -->
    <div class="lg:col-span-1 space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
        <h4 class="font-bold text-gray-900 mb-4">Quick Actions</h4>
        <div class="space-y-3">
          <button 
            @click="saveAllChanges"
            class="w-full px-4 py-3 bg-[#008253] text-white rounded-lg hover:bg-[#006642] transition font-medium flex items-center justify-center gap-2"
          >
            <i class="pi pi-save"></i>
            <span>Save All Changes</span>
          </button>
          <button 
            @click="shareProfile"
            class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
          >
            <i class="pi pi-share-alt"></i>
            <span>Share Profile</span>
          </button>
          <button 
            @click="exportData"
            class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
          >
            <i class="pi pi-download"></i>
            <span>Export Data</span>
          </button>
        </div>
      </div>

      <!-- Location Map Placeholder -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h4 class="font-bold text-gray-900 mb-4">Location</h4>
        <div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-3">
          <i class="pi pi-map text-4xl text-gray-400"></i>
        </div>
        <p class="text-sm text-gray-700">{{ businessData.address }}</p>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import Star from '~/components/Stars.vue'

interface BusinessData {
  name: string
  image: string
  rating: number
  reviewCount: number
  category: string
  address: string
  phone: string
  website: string
  instagram: string
  twitter: string
  facebook: string
  isOpen: boolean
  hours: string
  description: string
  highlights: string[]
  services: string[]
  tags: string[]
  businessHours: Record<string, string>
  amenities: string[]
}

interface Review {
  id: number
  author: string
  date: string
  rating: number
  body: string
  helpful: number
  reply?: string
}

const activeTab = ref<string>('overview')
const isEditing = ref<Record<string, boolean>>({})
const showImageOptions = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const photoInput = ref<HTMLInputElement | null>(null)
const tagInput = ref<HTMLInputElement | null>(null)
const showTagInput = ref(false)
const newTag = ref('')
const showReplyBox = ref<number | null>(null)
const replyText = ref('')

const businessData = ref<BusinessData>
({
  name: 'The Cozy Cafe',
  image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop',
  rating: 4.5,
  reviewCount: 127,
  category: 'Coffee & Cafes',
  address: '45 Marina Road, Victoria Island, Lagos',
  phone: '+234 809-456-7890',
  website: 'www.cozycafe.ng',
  instagram: '@cozycafe',
  twitter: '@cozycafe',
  facebook: 'cozycafe',
  isOpen: true,
  hours: 'Closes at 10:00 PM',
  description: 'The Cozy Cafe is your perfect spot for premium coffee, delicious pastries, and a warm atmosphere. Whether you\'re looking for a quiet place to work, catch up with friends, or simply enjoy a great cup of coffee, we\'ve got you covered. Our skilled baristas craft each drink with care, using only the finest locally-sourced beans.',
  highlights: [
    'Free Wi-Fi',
    'Outdoor Seating',
    'Air Conditioned',
    'Pet Friendly',
    'Wheelchair Accessible',
    'Parking Available'
  ],
  services: [
    'Espresso',
    'Cappuccino',
    'Latte',
    'Fresh Pastries',
    'Sandwiches',
    'Smoothies'
  ],
  tags: [
    'Coffee',
    'Breakfast',
    'Work Friendly',
    'Date Spot'
  ],
  businessHours: {
    'Monday': '7:00 AM - 11:00 PM',
    'Tuesday': '7:00 AM - 10:00 PM',
    'Wednesday': '7:00 AM - 10:00 PM',
    'Thursday': '7:00 AM - 10:00 PM',
    'Friday': '7:00 AM - 11:00 PM',
    'Saturday': '8:00 AM - 11:00 PM',
    'Sunday': '9:00 AM - 9:00 PM'
  },
  amenities: [
    'Free Wi-Fi',
    'Outdoor Seating',
    'Air Conditioning',
    'Wheelchair Accessible',
    'Pet Friendly',
    'Parking',
    'Takeout Available',
    'Delivery'
  ]
})

const businessReviews = ref<Review[]>([
  {
    id: 1,
    author: 'Chioma Okafor',
    date: '2025-11-08',
    rating: 5,
    body: 'Absolutely love this place! The coffee is exceptional and the staff are so friendly. Perfect spot for remote work with fast Wi-Fi.',
    helpful: 12
  },
  {
    id: 2,
    author: 'Tunde Adebayo',
    date: '2025-11-06',
    rating: 4,
    body: 'Great coffee and nice ambiance. Can get a bit crowded during lunch hours but overall a solid choice.',
    helpful: 8
  },
  {
    id: 3,
    author: 'Sarah Manuel',
    date: '2025-11-04',
    rating: 5,
    body: 'The best cafe in VI! Their cappuccino is to die for and the pastries are always fresh. Highly recommend!',
    helpful: 15
  },
  {
    id: 4,
    author: 'Coker Yusuf',
    date: '2025-11-02',
    rating: 4,
    body: 'Good coffee and pleasant atmosphere. Prices are a bit high but worth it for the quality.',
    helpful: 5
  },
  {
    id: 5,
    author: 'Johnson Eze',
    date: '2025-10-30',
    rating: 5,
    body: 'My favorite spot in Lagos! The outdoor seating is lovely and the service is always excellent.',
    helpful: 10
  }
])

const businessPhotos = ref<string[]>(['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop',
])

// Image handling
const imageInput = ref<HTMLInputElement | null>(null)

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    businessData.value.image = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      businessData.value.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleImageError = (e: Event)=> {
  const target = e.target as HTMLImageElement
  target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop'
}

// Tags
const addTag = async () => {
  showTagInput.value = true
  await nextTick()
  tagInput.value?.focus()
}

const saveTag = () => {
  if (newTag.value.trim()) {
    businessData.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
  showTagInput.value = false
}

const removeTag = (index: number) => {
  businessData.value.tags.splice(index, 1)
}

// Highlights
const addHighlight = () => {
  businessData.value.highlights.push('New Highlight')
  const newIndex = businessData.value.highlights.length - 1
  isEditing.value[`highlight-${newIndex}`] = true
}

const removeHighlight = (index: number) => {
  businessData.value.highlights.splice(index, 1)
}

// Services
const addService = () => {
  businessData.value.services.push('New Service')
  const newIndex = businessData.value.services.length - 1
  isEditing.value[`service-${newIndex}`] = true
}

const removeService = (index: number) => {
  businessData.value.services.splice(index, 1)
}


// Amenities
const addAmenity = () => {
  businessData.value.amenities.push('New Amenity')
  const newIndex = businessData.value.amenities.length - 1
  isEditing.value[`amenity-${newIndex}`] = true
}

const removeAmenity = (index: number) => {
  businessData.value.amenities.splice(index, 1)
}

// Photos
const addPhoto = () => {
  photoInput.value?.click()
}

const handlePhotoSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        businessPhotos.value.push(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }
}

const removePhoto = (index: number) => {
  businessPhotos.value.splice(index, 1)
}

// Reviews
const toggleReplyBox = (reviewId: number) => {
  const review = businessReviews.value.find(r => r.id === reviewId)
  if (review && review.reply) {
    replyText.value = review.reply
  } else {
    replyText.value = ''
  }
  showReplyBox.value= showReplyBox.value === reviewId ? null : reviewId
}

const saveReply = (reviewId: number) => {
  const review = businessReviews.value.find(r => r.id === reviewId)
  if (review && replyText.value.trim()) {
    review.reply = replyText.value.trim()
  }
  showReplyBox.value = null
  replyText.value = ''
}

// Quick Actions
const saveAllChanges = () => {
  alert('All changes saved successfully!')
  console.log('Saved data:', businessData.value)
}

const shareProfile = () => {
  const profileUrl = window.location.href
  if (navigator.share) {
    navigator.share({
      title: businessData.value.name,
      text: `Check out ${businessData.value.name} on our platform!`,
      url: profileUrl
    }).catch(err => console.log('Error sharing:', err))
  } else {
    navigator.clipboard.writeText(profileUrl)
    alert('Profile link copied to clipboard!')
  }
}

const exportData = () => {
  const dataStr = JSON.stringify({
    business: businessData.value,
    reviews: businessReviews.value,
    photos: businessPhotos.value
  }, null, 2)
  
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${businessData.value.name.replace(/\s+/g, '_')}_data.json`
  link.click()
  URL.revokeObjectURL(url)
}

const getStarPercentage = (star: number): number => {
  const total = businessReviews.value.length
  const count = businessReviews.value.filter(r => r.rating === star).length
  return (count / total) * 100
}

const getStarCount = (star: number): number => {
  return businessReviews.value.filter(r => r.rating === star).length
}
</script>
<style scoped>
.bg-gold {
  background-color: #deae29;
}
</style>