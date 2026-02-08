<template>
  <div class="min-h-screen bg-green-50">
    <NavBarProfile />

    <!-- Loading State -->
    <div
      v-if="loading && !profileData"
      class="flex items-center justify-center min-h-screen"
    >
      <GeneralLoader />
    </div>

    <!-- Error State -->
    <div v-else-if="error && !profileData" class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="pi pi-exclamation-triangle text-4xl text-red-600 mb-4"></i>
        <h3 class="text-lg font-semibold text-red-800 mb-2">
          Failed to Load Profile
        </h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadProfile"
          class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Edit Profile View -->
    <div
      v-else-if="isEditingProfile && profileData"
      class="max-w-2xl mx-auto px-4 py-8"
    >
      <div class="mb-6">
        <button
          @click="cancelEdit"
          class="text-gray-700 font-medium flex items-center gap-2 hover:text-gray-900"
        >
          <i class="pi pi-arrow-left"></i>
          <span>Back to Profile</span>
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-8 space-y-3">
        <div class="flex gap-5 items-center">
          <UserAvatar :firstName="firstName" :lastName="lastName" :size="100" />
          <div class="flex flex-col gap-1">
            <span class="font-medium text-gray-500">
              <i class="pi pi-user mr-2"></i> Username:</span
            >
            <span class="text-lg font-semibold text-gray-700">{{
              profileData.username
            }}</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-phone mr-2"></i>
            Phone Number
          </label>
          <input
            v-model="editForm.phoneNumber"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-home mr-2"></i>
            Address
          </label>
          <input
            v-model="editForm.address"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
          />
        </div>

        <div class="pt-2 flex gap-3 justify-center items-center">
          <button
            @click="handleSaveProfile"
            :disabled="saving"
            class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="saving" class="pi pi-spin pi-spinner mr-2"></i>
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
          <button
            @click="cancelEdit"
            :disabled="saving"
            class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <!-- Save Success Message -->
        <div
          v-if="saveSuccess"
          class="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
        >
          <i class="pi pi-check-circle text-green-600 mr-2"></i>
          <span class="text-green-700">Profile updated successfully!</span>
        </div>

        <!-- Save Error Message -->
        <div
          v-if="saveError"
          class="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
        >
          <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
          <span class="text-red-700">{{ saveError }}</span>
        </div>
      </div>
    </div>

    <!-- Main Profile View -->
    <div v-else-if="profileData">
      <!-- User Profile Section -->
      <div class="bg-gradient-to-b from-blue-50 to-white py-8 mb-2">
        <div class="max-w-7xl flex md:flex-row flex-col md:justify-between justify-center items-center mx-auto px-4 sm:px-6 lg:px-8">
          <div
            class="flex flex-col md:flex-row items-center md:items-start gap-5"
          >
            <!-- Profile Image -->
            <UserAvatar
              :firstName="firstName"
              :lastName="lastName"
              :size="100"
            />

            <!-- Text Section -->
            <div class="space-y-1">
              <div
                class="flex items-center text-bold text-2xl justify-center md:justify-start text-gray-800"
              >
                <span class="font-semibold md:text-3xl text-xl  text-gray-800">{{ profileData.username }}</span>
              </div>

              <div class="flex items-center divide-x divide-gray-300 text-sm text-gray-600">
                <span class="px-3">
                  <span class="font-medium text-gray-900">{{ profileData.totalReviews || 0}}</span> Total Reviews
                </span>
                <span class="px-3">
                  <span class="font-medium text-gray-900">0</span> Helpful Reviews
                </span>
                <span class="px-3">
                  <span class="font-medium text-gray-900">0</span> Responses
                </span>
              </div>


              <div
              v-if="isUser"
              class="flex flex-wrap items-center justify-center md:justify-start
                    gap-x-4 gap-y-2 text-gray-600 text-sm sm:text-base"
            >
              <!-- Email -->
              <div class="flex items-center gap-2">
                <i class="pi pi-envelope"></i>
                <span>{{ profileData.email }}</span>
              </div>

              <!-- Phone -->
              <div
                v-if="profileData.phone"
                class="flex items-center gap-2"
              >
                <span class="hidden md:block h-5 w-px bg-gray-300"></span>
                <i class="pi pi-phone"></i>
                <span>{{ profileData.phone }}</span>
              </div>

              <!-- Address -->
              <div
                v-if="profileData.address"
                class="flex items-center gap-2"
              >
                <span class="hidden md:block h-5 w-px bg-gray-300"></span>
                <i class="pi pi-home"></i>
                <span class="truncate max-w-xs">{{ profileData.address }}</span>
              </div>
            </div>


          
            </div>
          </div>
          <div class="">
            <button
                v-if="isUser"
                @click="startEdit"
                class="mt-2 border rounded-md py-3 px-4 hover:text-[#008253] flex items-center gap-2 justify-center md:justify-start"
              >
                <i class="pi pi-pencil md:text-base text-xs"></i>
                <span class="md:text-base text-xs">Edit Profile</span>
              </button>
          </div>
        </div>
      </div>

      <!-- Menu Bar (Desktop/Tablet) -->
      <div
  v-if="isUser"
  class="bg-white border-b border-gray-200 sticky top-16 z-40 hidden md:block"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-3 py-4">

      <button
        @click="activeTab = 'your-reviews'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2',
          activeTab === 'your-reviews'
            ? 'bg-[#008253] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        <i class="pi pi-star"></i>
        Your Reviews
      </button>

      <button
        @click="activeTab = 'rewards'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2',
          activeTab === 'rewards'
            ? 'bg-[#008253] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        <i class="pi pi-gift"></i>
        Rewards
      </button>

      <button
        @click="activeTab = 'notifications'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2',
          activeTab === 'notifications'
            ? 'bg-[#008253] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        <i class="pi pi-bell"></i>
        Notifications
      </button>

      <button
        @click="activeTab = 'settings'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2',
          activeTab === 'settings'
            ? 'bg-[#008253] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        <i class="pi pi-cog"></i>
        Settings
      </button>

    </div>
  </div>
</div>


      <!-- Main Content Grid -->
      <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <!-- Left Column -->
          <div class="md:col-span-3 space-y-6">

          
            <!-- Badges -->
          <!-- REPLACE YOUR CURRENT BADGE SECTION WITH THIS -->

<!-- Badges -->
<div class="bg-white rounded-xl shadow-sm p-4 md:block">
  <h5 class="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
    <i class="pi pi-trophy text-gold"></i>
    <span v-if="isUser" class="font-bold text-gray-800 text-sm mr--1">Your</span>
    Badges
    <span v-if="totalBadges > 0" class="text-sm text-gray-500">({{ totalBadges + 1 }})</span>
  </h5>

  <!-- Loading State -->
  <div v-if="loading" class="flex items-center justify-center py-8">
    <GeneralLoader />
  </div>

  <!-- No Badges State -->
  <div v-else-if="!tierBadge && !badges.length" class="text-center py-8 text-gray-500">
    <i class="pi pi-trophy text-4xl mb-2 opacity-50"></i>
    <p class="text-sm">
      {{ isUser ? "You haven't earned any badges yet" : "No badges earned yet" }}
    </p>
    <p v-if="isUser" class="text-xs text-gray-400 mt-2">
      Keep reviewing to unlock badges!
    </p>
  </div>

  <!-- Badges List with Tooltips -->
  <div v-else class="space-y-3">
    <!-- Tier Badge (First) -->
    <BadgeToolTip
      v-if="tierBadge"
      :name="tierBadge.name"
      :icon="tierBadge.icon"
      :color="tierBadge.color"
      :description="tierBadge.description || ''"
    />

    <!-- Earned Badges -->
    <BadgeToolTip
      v-for="(badge, idx) in badges"
      :key="idx"
      :name="badge.name"
      :icon="badge.icon"
      :color="badge.color"
      :description="badge.description || ''"
    />

  </div>
</div>
            <!-- Replace your existing Top Categories and Top Locations sections with this -->

          <div class="grid grid-cols-1 gap-6">
            <!-- Top Categories -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <h5 class="font-bold text-sm whitespace-nowrap text-gray-900 mb-4 flex items-center gap-2">
                <i class="pi pi-star-fill text-gold"></i>
                Top Reviewed Categories
              </h5>
              
              <!-- Loading state -->
              <div v-if="topDataLoading" class="space-y-3">
                <GeneralLoader/>
              </div>
              
              <!-- Empty state -->
              <div v-else-if="topCategories.length === 0" class="text-sm flex gap-2 items-center justify-center text-gray-500 italic py-4 text-center">
                <i class="pi pi-inbox text-2xl mb-2 block text-gray-400"></i>
                No categories reviewed yet
              </div>
              
              <!-- Categories list -->
              <ul v-else class="space-y-3">
                <li v-for="(cat, idx) in topCategories.slice(0, 3)" :key="cat.id || idx">
  <!-- <NuxtLink
    :to="{ 
      path: '/end-user/landing/explore', 
      query: { 
        categoryId: cat.id, 
        category: cat.name 
      } 
    }"
    class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all"
  > -->
  <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all">
    <!-- Icon (unchanged color) -->
          <component :is="cat.icon" class="w-6 h-6" :class="cat.color || 'text-gray-400'"/>

    <!-- Text -->
    <div class="flex-1 min-w-0">
      <span class="block text-sm font-medium text-gray-900 truncate">
        {{ cat.name }}
      </span>

      <span class="block text-xs text-gray-400 leading-tight">
        ({{ cat.reviewCount }} reviews)
      </span>
    </div>

    <!-- <i class="pi pi-chevron-right text-gray-400 text-xs"></i> -->
    </div>
  <!-- </NuxtLink> -->
</li>

              </ul>
              
              <!-- Show all link -->
              <div v-if="topCategories.length > 3" class="mt-4 pt-4 border-t border-gray-100">
                <button class="text-sm text-[#008253] hover:text-[#006641] font-medium flex items-center gap-1 w-full justify-center">
                  View all {{ topCategoriesData?.totalCategoriesReviewed }} categories
                  <i class="pi pi-arrow-right text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Top Locations -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <h5 class="font-bold whitespace-nowrap text-sm text-gray-900 mb-4 flex items-center gap-2">
                <i class="pi pi-map-marker text-gold"></i>
                Top Reviewed Locations
              </h5>
              
              <!-- Loading state -->
              <div v-if="topDataLoading" class="space-y-3">
                <GeneralLoader/>
              </div>
              
              <!-- Empty state -->
              <div v-else-if="topLocations.length === 0" class="text-sm flex gap-2 items-center justify-center text-gray-500 italic py-4 text-center">
                <i class="pi pi-map text-2xl mb-2 block text-gray-400"></i>
                No locations reviewed yet
              </div>
              
              <!-- Locations list -->
              <ul v-else class="space-y-1">
                <li v-for="(loc, idx) in topLocations.slice(0, 3)" :key="idx">
                  <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all">
                    <i class="pi pi-map-marker text-gold text-lg"></i>
                    <div class="flex-1 min-w-0">
                      <span class="block text-sm font-medium text-gray-900 truncate">
                        {{ loc.display }}
                      </span>

                      <span class="block text-xs text-gray-400 leading-tight">
                        ({{ loc.reviewCount }} reviews)
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              
              <!-- Show all link -->
              <div v-if="topLocations.length > 3" class="mt-4 pt-4 border-t border-gray-100">
                <button class="text-sm text-[#008253] hover:text-[#006641] font-medium flex items-center gap-1 w-full justify-center">
                  View all {{ topCitiesData?.totalCitiesReviewed }} cities
                  <i class="pi pi-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
            <!-- Favourite Business -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <h5 class="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                <i class="pi pi-shop text-gold"></i>
                Favourite Businesses
              </h5>
              <span
                class="text-center flex justify-center h-20 items-center text-gray-500"
                >Coming Soon...</span
              >
            </div>
          </div>

          <!-- Middle Column -->
          <div class="md:col-span-7">
            <!-- Menu Bar (Mobile) -->
            <div v-if="isUser"
              class="md:hidden bg-white border-b border-gray-200 mb-6 -mx-4 px-4"
            >
              <div class="flex justify-between py-4">
                <button
                  @click="activeTab = 'your-reviews'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'your-reviews'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                >
                  <i class="pi pi-star"></i>
                  <!-- <span v-if="isUser">Your</span> Reviews -->
                </button>

                <button
                  @click="activeTab = 'rewards'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'rewards'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                >
                  <i class="pi pi-gift"></i>
                  <!-- Rewards -->
                </button>

                <button
                  @click="activeTab = 'notifications'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'notifications'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                >
                  <i class="pi pi-bell"></i>
                  <!-- Notifications -->
                </button>

                <button
                  v-if="isUser"
                  @click="activeTab = 'settings'"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'settings'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                >
                  <i class="pi pi-clock"></i>
                  <!-- Settings -->
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">


             <!-- Your Reviews Tab -->
            <div v-if="activeTab === 'your-reviews'" class="space-y-6">
              <h2 class="md:text-2xl text-xl font-bold text-[#008253]">
                <span v-if="isUser" class="md:text-2xl text-xl font-bold text-[#008253]">Your</span>
                Reviews
              </h2>

              <!-- ✅ Loading State -->
              <div v-if="reviewsLoading" class="text-center py-12">
                <GeneralLoader />
              </div>

              <!-- ✅ Empty State - User viewing their own profile -->
              <div
                v-else-if="isUser && (reviewsError || userReviews.length === 0)"
                class="text-center py-12"
              >
                <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-700 mb-2">
                  Ready to write your first review?
                </h3>
                <NuxtLink
                  to="/review/write-review"
                  class="inline-block mt-4 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium"
                >
                  Click here to get started
                </NuxtLink>
              </div>

              <!-- ✅ Empty State - User viewing someone else's profile -->
              <div
                v-else-if="!isUser && (reviewsError || userReviews.length === 0)"
                class="text-center py-12"
              >
                <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-base font-normal text-gray-700 mb-2">
                  This member hasn't written any reviews on CleReview yet
                </h3>
              </div>

              <!-- ✅ Reviews List -->
              <div v-else class="space-y-4">
                <div
                  v-for="review in userReviews"
                  :key="review.id"
                  :class="[
                    'border rounded-lg p-4 transition-all',
                    review.isGrayedOut
                      ? 'border-gray-200 bg-gray-50/50 opacity-75'
                      : 'border-gray-200 bg-white hover:shadow-md'
                  ]"
                >
                  <!-- Main Layout: Left (Logo + Business Info) | Right (Stars + Date + Status) -->
                  <div class="flex md:flex-row flex-col justify-between items-start gap-4 relative">
                    
                    <!-- Left Section: Business Logo + Info -->
                    <div class="flex gap-3 flex-1">
                      <!-- Business Logo -->
                      <div class="flex-shrink-0">
                        <img
                          :src="'/images/default-business-logo.png'"
                          :alt="review.businessName"
                          :class="[
                            'w-14 h-14 rounded-lg object-cover border border-gray-200',
                            review.isGrayedOut && 'opacity-50'
                          ]"
                        />
                      </div>

                      <!-- Business Name + Location + Category -->
                      <div class="flex flex-col gap-2">
                        <h2 
                          :class="[
                            'text-base font-semibold truncate m-0 p-0',
                            review.isGrayedOut ? 'text-gray-500' : 'text-gray-800'
                          ]"
                        >
                          {{ review.businessName }}
                        </h2>
                        
                        <!-- Location (small, grey, below logo) -->
                        <p 
                          :class="[
                            'text-xs truncate',
                            review.isGrayedOut ? 'text-gray-400' : 'text-gray-500'
                          ]"
                        >
                          {{review.branchState || review.businessState }} <span v-if="review.branchState || review.businessState">,</span> {{review.branchCity ||  review.businessCity }}
                        </p>

                      </div>
                    </div>

                    <!-- Right Section: Stars + Date + Status Icon -->
                    <div class="flex md:flex-col items-end gap-2 flex-shrink-0">
                      <!-- Stars (smaller size) -->
                      <div class="flex items-center">
                        <Stars
                          v-for="n in 5"
                          :key="n"
                          :filled="n <= review.rating"
                          :colorLevel="n <= review.rating ? Math.round(review.rating) : 0"
                          :class="['w-4 h-4', review.isGrayedOut && 'opacity-50']"
                        />
                      </div>

                      <!-- Date (dd/mm/yy format) -->
                      <span 
                        :class="[
                          'text-xs',
                          review.isGrayedOut ? 'text-gray-400' : 'text-gray-600'
                        ]"
                      >
                        {{ formatDateShort(review.date) }}
                      </span>

                    </div>
                      <!-- Status Icon with Tooltip -->
                      <div class="absolute group right-[-22px] top-[-22px] bg-white">
                        <i 
                          :class="[
                            'pi text-2xl cursor-help',
                            getStatusIcon(review.rawStatus).icon,
                            getStatusIcon(review.rawStatus).color
                          ]"
                        ></i>
                        
                        <!-- Tooltip -->
                        <div class="absolute right-0 top-full mt-1 hidden group-hover:block z-10 w-48">
                          <div class="bg-white text-gray-500 leading-relaxed text-xs rounded-lg px-3 py-2 shadow-lg">
                            <!-- <p class="font-medium">{{ getStatusIcon(review.rawStatus).title }}</p> -->
                            <p class="text-gray-500 text-xs">{{ getStatusIcon(review.rawStatus).message }}</p>
                          </div>
                        </div>
                      </div>
                  </div>

                  <!-- Review Body -->
                  <div class="mt-4">
                    <p 
                      :class="[
                        'text-sm leading-relaxed',
                        review.isGrayedOut ? 'text-gray-500' : 'text-gray-700'
                      ]"
                    >
                      {{ review.body }}
                    </p>
                  </div>

                  <!-- Photos (if available) -->
                  <div v-if="review.photoUrls && review.photoUrls.length > 0" class="mt-4">
                    <div class="flex gap-2 flex-wrap">
                      <img
                        v-for="(photo, idx) in review.photoUrls"
                        :key="idx"
                        :src="photo"
                        alt="Review photo"
                        :class="[
                          'w-20 h-20 object-cover rounded-lg border border-gray-200',
                          review.isGrayedOut && 'opacity-50'
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
              <!-- Rewards Tab -->
              <div
                v-if="activeTab === 'rewards'"
                class="bg-white rounded-xl p-4 max-w-2xl mx-auto space-y-6"
              >
                <!-- Refer a Friend Section -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <i class="pi pi-users text-five_star text-xl"></i>
                    <h3 class="font-semibold text-lg text-gray-800">
                      Refer a Friend
                    </h3>
                  </div>
                  <p class="text-gray-600 text-sm mb-3">
                    Invite friends and earn 50 points for each successful
                    referral!
                  </p>
                  <div class="flex items-center gap-3">
                    <input
                      type="text"
                      value="https://clereview.com/ref/user123"
                      readonly
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                    />
                    <button
                      class="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-[#008253] transition-colors"
                    >
                      <i class="pi pi-copy mr-1"></i> Copy
                    </button>
                  </div>
                  <div class="mt-3 text-sm text-gray-600">
                    <span class="font-medium">Successful Referrals:</span> 5
                    (250 points earned)
                  </div>
                </div>

                <!-- Earned Points Section -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-star-fill text-gold text-xl"></i>
                    <h3 class="font-semibold text-lg text-gray-800">
                      Earned Points
                    </h3>
                  </div>

                  <!-- Referral Points -->
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div class="flex items-center gap-2">
                      <i class="pi pi-users text-blue-500"></i>
                      <span class="text-gray-700">Referral Points</span>
                    </div>
                    <span class="font-semibold text-gray-800">250</span>
                  </div>

                  <!-- Review Points -->
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div class="flex items-center gap-2">
                      <i class="pi pi-comment text-green-500"></i>
                      <span class="text-gray-700">Review Points</span>
                    </div>
                    <span class="font-semibold text-gray-800">450</span>
                  </div>

                  <!-- Achievements -->
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div class="flex items-center gap-2">
                      <i class="pi pi-trophy text-purple-500"></i>
                      <span class="text-gray-700">Achievements</span>
                    </div>
                    <span class="font-semibold text-gray-800">300</span>
                  </div>

                  <!-- Total Points -->
                  <div
                    class="flex justify-between items-center py-3 mt-2 bg-gold/10 rounded-lg px-3"
                  >
                    <div class="flex items-center gap-2">
                      <i class="pi pi-star-fill text-gold"></i>
                      <span class="font-bold text-gray-800">Total Points</span>
                    </div>
                    <span class="font-bold text-xl text-gold">1,000</span>
                  </div>
                </div>

                <!-- Redeem Points Section -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-gift text-red-600 text-xl"></i>
                    <h3 class="font-semibold text-lg text-gray-800">
                      Redeem Points
                    </h3>
                  </div>

                  <div class="space-y-3">
                    <!-- Reward Option 1 -->
                    <div
                      class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gold hover:bg-gold/5 transition-all cursor-pointer"
                    >
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-800">$5 Gift Card</h4>
                        <p class="text-sm text-gray-600">500 points</p>
                      </div>
                      <button
                        class="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled
                      >
                        Redeem
                      </button>
                    </div>

                    <!-- Reward Option 2 -->
                    <div
                      class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gold hover:bg-gold/5 transition-all cursor-pointer"
                    >
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-800">$10 Gift Card</h4>
                        <p class="text-sm text-gray-600">900 points</p>
                      </div>
                      <button
                        class="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold/90 transition-colors"
                      >
                        Redeem
                      </button>
                    </div>

                    <!-- Reward Option 3 -->
                    <div
                      class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gold hover:bg-gold/5 transition-all cursor-pointer"
                    >
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-800">$20 Gift Card</h4>
                        <p class="text-sm text-gray-600">1,700 points</p>
                      </div>
                      <button
                        class="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled
                      >
                        Redeem
                      </button>
                    </div>

                    <!-- Reward Option 4 -->
                    <div
                      class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gold hover:bg-gold/5 transition-all cursor-pointer"
                    >
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-800">Premium Badge</h4>
                        <p class="text-sm text-gray-600">1,200 points</p>
                      </div>
                      <button
                        class="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled
                      >
                        Redeem
                      </button>
                    </div>
                  </div>

                  <p class="text-xs text-gray-500 mt-4 text-center">
                    <span v-if="isUser" class="text-xs text-gray-500"
                      >Your</span
                    >
                    current balance:
                    <strong class="text-gold">1,000 points</strong>
                  </p>
                </div>
              </div>
              <!-- Notifications Tab -->
              <div
                v-if="isUser && activeTab === 'notifications'"
                class="text-center py-12"
              >
                <i class="pi pi-bell text-6xl text-gray-300 mb-4"></i>
                <h2 class="text-2xl font-bold text-[#008253] mb-2">
                  Notifications
                </h2>
                <p class="text-gray-500">Nothing new yet</p>
              </div>

              <!-- Settings Tab -->
              <div v-if="activeTab === 'settings'" class="space-y-6">
                <h2 class="text-2xl font-bold text-[#008253]">Settings</h2>

                <!-- Social Media Section -->
                <div
                  class="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3
                      class="text-lg font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <i class="pi pi-share-alt text-[#008253]"></i>
                      Social Media
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      Connect your social media accounts
                    </p>
                  </div>
                  <div class="p-6">
                    <!-- View Mode -->
                    <div v-if="!isEditingSocialMedia" class="space-y-4">
                      <div
                        v-if="
                          profileData?.socialMedia &&
                          profileData.socialMedia.trim()
                        "
                      >
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Connected Accounts
                        </label>
                        <!-- Parse and display social media accounts -->
                        <div class="space-y-2">
                          <div
                            v-for="(account, idx) in parseSocialMediaAccounts(
                              profileData.socialMedia
                            )"
                            :key="idx"
                            class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                          >
                            <div class="flex items-center gap-3">
                              <i
                                :class="getSocialMediaIcon(account.platform)"
                                class="text-xl"
                              ></i>
                              <div>
                                <p class="text-xs text-gray-500 font-medium">
                                  {{ account.platform }}
                                </p>
                                <p class="text-gray-700">
                                  {{ account.handle }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          @click="startEditSocialMedia"
                          class="mt-3 text-[#008253] hover:text-[#006641] flex items-center gap-1 text-sm font-medium"
                        >
                          <i class="pi pi-pencil text-xs"></i>
                          Edit Accounts
                        </button>
                      </div>
                      <div
                        v-else
                        class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <div class="flex items-center gap-3">
                          <i
                            class="pi pi-times-circle text-gray-400 text-xl"
                          ></i>
                          <span class="text-gray-500"
                            >No social media accounts connected</span
                          >
                        </div>
                        <button
                          @click="startEditSocialMedia"
                          class="text-[#008253] hover:text-[#006641] flex items-center gap-1 text-sm font-medium"
                        >
                          <i class="pi pi-plus text-xs"></i>
                          Add
                        </button>
                      </div>
                    </div>

                    <!-- Edit Mode -->
                    <div v-else class="space-y-4">
                      <!-- List of social media inputs -->
                      <div
                        v-for="(account, idx) in socialMediaAccounts"
                        :key="idx"
                        class="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div class="space-y-3">
                          <!-- Platform Selector -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Platform
                            </label>
                            <select
                              v-model="account.platform"
                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
                            >
                              <option value="">Select platform...</option>
                              <option value="WhatsApp">WhatsApp</option>
                              <option value="Instagram">Instagram</option>
                              <option value="Snapchat">Snapchat</option>
                              <option value="X (Twitter)">X (Twitter)</option>
                              <option value="Facebook">Facebook</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="TikTok">TikTok</option>
                              <option value="YouTube">YouTube</option>
                              <option value="Telegram">Telegram</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <!-- Handle/Username Input -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Username/Handle/Phone
                            </label>
                            <input
                              v-model="account.handle"
                              type="text"
                              :placeholder="getPlaceholder(account.platform)"
                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
                            />
                          </div>

                          <!-- Remove Button (only if more than 1) -->
                          <button
                            v-if="socialMediaAccounts.length > 1"
                            @click="removeSocialMediaAccount(idx)"
                            class="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                          >
                            <i class="pi pi-trash text-xs"></i>
                            Remove
                          </button>
                        </div>
                      </div>

                      <!-- Add Another Account Button -->
                      <button
                        @click="addSocialMediaAccount"
                        class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#008253] hover:text-[#008253] transition flex items-center justify-center gap-2"
                      >
                        <i class="pi pi-plus"></i>
                        Add Another Account
                      </button>

                      <!-- Save/Cancel Buttons -->
                      <div class="flex gap-3 pt-2">
                        <button
                          @click="saveSocialMedia"
                          :disabled="savingSocialMedia || !canSaveSocialMedia"
                          class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i
                            v-if="savingSocialMedia"
                            class="pi pi-spin pi-spinner mr-2"
                          ></i>
                          {{
                            savingSocialMedia ? "Saving..." : "Save Accounts"
                          }}
                        </button>
                        <button
                          @click="cancelEditSocialMedia"
                          :disabled="savingSocialMedia"
                          class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                        >
                          Cancel
                        </button>
                      </div>

                      <!-- Success Message -->
                      <div
                        v-if="socialMediaSaveSuccess"
                        class="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                      >
                        <i class="pi pi-check-circle text-green-600 mr-2"></i>
                        <span class="text-green-700"
                          >Social media accounts saved successfully!</span
                        >
                      </div>

                      <!-- Error Message -->
                      <div
                        v-if="socialMediaSaveError"
                        class="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
                      >
                        <i
                          class="pi pi-exclamation-triangle text-red-600 mr-2"
                        ></i>
                        <span class="text-red-700">{{
                          socialMediaSaveError
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Notification Preferences Section -->
                <div
                  class="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3
                      class="text-lg font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <i class="pi pi-bell text-[#008253]"></i>
                      Notification Preferences
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      Manage how you receive notifications
                    </p>
                  </div>
                  <div class="p-6">
                    <div class="space-y-4">
                      <!-- Email Notifications -->
                      <div
                        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                          >
                            <i class="pi pi-envelope text-blue-600"></i>
                          </div>
                          <div>
                            <p class="font-medium text-gray-800">
                              Email Notifications
                            </p>
                            <p class="text-sm text-gray-600">
                              Receive updates via email
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <span
                            :class="[
                              'text-sm font-medium',
                              profileData?.notificationPreferences
                                ?.emailNotifications
                                ? 'text-green-600'
                                : 'text-gray-500',
                            ]"
                          >
                            {{
                              profileData?.notificationPreferences
                                ?.emailNotifications
                                ? "On"
                                : "Off"
                            }}
                          </span>
                          <div
                            :class="[
                              'w-12 h-6 rounded-full transition-colors cursor-pointer',
                              profileData?.notificationPreferences
                                ?.emailNotifications
                                ? 'bg-[#008253]'
                                : 'bg-gray-300',
                            ]"
                            @click="toggleNotification('emailNotifications')"
                          >
                            <div
                              :class="[
                                'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                                profileData?.notificationPreferences
                                  ?.emailNotifications
                                  ? 'translate-x-6'
                                  : 'translate-x-0.5',
                              ]"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- SMS Notifications -->
                      <div
                        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                          >
                            <i class="pi pi-mobile text-green-600"></i>
                          </div>
                          <div>
                            <p class="font-medium text-gray-800">
                              SMS Notifications
                            </p>
                            <p class="text-sm text-gray-600">
                              Receive alerts via text message
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <span
                            :class="[
                              'text-sm font-medium',
                              profileData?.notificationPreferences
                                ?.smsNotifications
                                ? 'text-green-600'
                                : 'text-gray-500',
                            ]"
                          >
                            {{
                              profileData?.notificationPreferences
                                ?.smsNotifications
                                ? "On"
                                : "Off"
                            }}
                          </span>
                          <div
                            :class="[
                              'w-12 h-6 rounded-full transition-colors cursor-pointer',
                              profileData?.notificationPreferences
                                ?.smsNotifications
                                ? 'bg-[#008253]'
                                : 'bg-gray-300',
                            ]"
                            @click="toggleNotification('smsNotifications')"
                          >
                            <div
                              :class="[
                                'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                                profileData?.notificationPreferences
                                  ?.smsNotifications
                                  ? 'translate-x-6'
                                  : 'translate-x-0.5',
                              ]"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- Push Notifications -->
                      <div
                        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                          >
                            <i class="pi pi-send text-purple-600"></i>
                          </div>
                          <div>
                            <p class="font-medium text-gray-800">
                              Push Notifications
                            </p>
                            <p class="text-sm text-gray-600">
                              Receive push notifications in browser
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <span
                            :class="[
                              'text-sm font-medium',
                              profileData?.notificationPreferences
                                ?.pushNotifications
                                ? 'text-green-600'
                                : 'text-gray-500',
                            ]"
                          >
                            {{
                              profileData?.notificationPreferences
                                ?.pushNotifications
                                ? "On"
                                : "Off"
                            }}
                          </span>
                          <div
                            :class="[
                              'w-12 h-6 rounded-full transition-colors cursor-pointer',
                              profileData?.notificationPreferences
                                ?.pushNotifications
                                ? 'bg-[#008253]'
                                : 'bg-gray-300',
                            ]"
                            @click="toggleNotification('pushNotifications')"
                          >
                            <div
                              :class="[
                                'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                                profileData?.notificationPreferences
                                  ?.pushNotifications
                                  ? 'translate-x-6'
                                  : 'translate-x-0.5',
                              ]"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- Marketing Emails -->
                      <div
                        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"
                          >
                            <i class="pi pi-megaphone text-orange-600"></i>
                          </div>
                          <div>
                            <p class="font-medium text-gray-800">
                              Marketing Emails
                            </p>
                            <p class="text-sm text-gray-600">
                              Receive promotional offers and updates
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <span
                            :class="[
                              'text-sm font-medium',
                              profileData?.notificationPreferences
                                ?.marketingEmails
                                ? 'text-green-600'
                                : 'text-gray-500',
                            ]"
                          >
                            {{
                              profileData?.notificationPreferences
                                ?.marketingEmails
                                ? "On"
                                : "Off"
                            }}
                          </span>
                          <div
                            :class="[
                              'w-12 h-6 rounded-full transition-colors cursor-pointer',
                              profileData?.notificationPreferences
                                ?.marketingEmails
                                ? 'bg-[#008253]'
                                : 'bg-gray-300',
                            ]"
                            @click="toggleNotification('marketingEmails')"
                          >
                            <div
                              :class="[
                                'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                                profileData?.notificationPreferences
                                  ?.marketingEmails
                                  ? 'translate-x-6'
                                  : 'translate-x-0.5',
                              ]"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Save Changes Button -->
                    <div
                      v-if="notificationSettingsChanged"
                      class="mt-6 flex gap-3"
                    >
                      <button
                        @click="saveNotificationSettings"
                        :disabled="savingNotifications"
                        class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i
                          v-if="savingNotifications"
                          class="pi pi-spin pi-spinner mr-2"
                        ></i>
                        {{
                          savingNotifications
                            ? "Saving..."
                            : "Save Notification Settings"
                        }}
                      </button>
                      <button
                        @click="cancelNotificationChanges"
                        :disabled="savingNotifications"
                        class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>

                    <!-- Success Message -->
                    <div
                      v-if="notificationSaveSuccess"
                      class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                    >
                      <i class="pi pi-check-circle text-green-600 mr-2"></i>
                      <span class="text-green-700"
                        >Notification settings saved successfully!</span
                      >
                    </div>

                    <!-- Error Message -->
                    <div
                      v-if="notificationSaveError"
                      class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center"
                    >
                      <i
                        class="pi pi-exclamation-triangle text-red-600 mr-2"
                      ></i>
                      <span class="text-red-700">{{
                        notificationSaveError
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Appearance Section -->
                <div
                  class="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3
                      class="text-lg font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <i class="pi pi-palette text-[#008253]"></i>
                      Appearance
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      Customize your viewing experience
                    </p>
                  </div>
                  <div class="p-6">
                    <div
                      class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
                        >
                          <i class="pi pi-moon text-yellow-400"></i>
                        </div>
                        <div>
                          <p class="font-medium text-gray-800">Dark Mode</p>
                          <p class="text-sm text-gray-600">
                            Use dark theme for better viewing at night
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span
                          :class="[
                            'text-sm font-medium',
                            profileData?.darkMode
                              ? 'text-green-600'
                              : 'text-gray-500',
                          ]"
                        >
                          {{ profileData?.darkMode ? "On" : "Off" }}
                        </span>
                        <div
                          :class="[
                            'w-12 h-6 rounded-full transition-colors cursor-pointer',
                            profileData?.darkMode
                              ? 'bg-[#008253]'
                              : 'bg-gray-300',
                          ]"
                          @click="toggleDarkMode"
                        >
                          <div
                            :class="[
                              'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5',
                              profileData?.darkMode
                                ? 'translate-x-6'
                                : 'translate-x-0.5',
                            ]"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <!-- Save Dark Mode Changes -->
                    <div v-if="darkModeChanged" class="mt-6 flex gap-3">
                      <button
                        @click="saveDarkModeSetting"
                        :disabled="savingDarkMode"
                        class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i
                          v-if="savingDarkMode"
                          class="pi pi-spin pi-spinner mr-2"
                        ></i>
                        {{
                          savingDarkMode
                            ? "Saving..."
                            : "Save Appearance Settings"
                        }}
                      </button>
                      <button
                        @click="cancelDarkModeChange"
                        :disabled="savingDarkMode"
                        class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>

                    <!-- Success Message -->
                    <div
                      v-if="darkModeSaveSuccess"
                      class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                    >
                      <i class="pi pi-check-circle text-green-600 mr-2"></i>
                      <span class="text-green-700"
                        >Appearance settings saved successfully!</span
                      >
                    </div>

                    <!-- Error Message -->
                    <div
                      v-if="darkModeSaveError"
                      class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center"
                    >
                      <i
                        class="pi pi-exclamation-triangle text-red-600 mr-2"
                      ></i>
                      <span class="text-red-700">{{ darkModeSaveError }}</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <!-- Right Column - Ads -->
          <div class="md:col-span-2 space-y-6">
            <div
              class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm p-4 border border-yellow-200"
            >
              <p
                class="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-2"
              >
                <i class="pi pi-star"></i>
                Featured
              </p>
              <div v-for="ad in ads" :key="ad.id" class="mb-4 last:mb-0">
                <img
                  :src="ad.image"
                  :alt="ad.business"
                  class="w-full h-32 object-cover rounded-lg mb-2"
                  @error="handleImageError"
                />
                <h4 class="font-semibold text-gray-800">{{ ad.business }}</h4>
                <p class="text-sm text-gray-600">{{ ad.tagline }}</p>
                <button
                  class="mt-2 text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
                >
                  Learn More
                  <i class="pi pi-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  //Vue and utils imports
import { ref, computed, onMounted } from "vue";
import {
  getCategoryIcon,
  getCategoryIconColor
} from '~/utils/categoryIcons'



  //Components import
import UserAvatar from "~/components/UserAvatar.vue";

  //Composables import
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";
import useMethods from '~/composables/useMethods';
import useEnrichedReviews from "~/composables/review/useEnrichedReviews";
import useReviewMethods from "~/composables/review/useReviewMethods";
import { useBadgeApi } from "~/composables/useBadgeApi";
  //Types import
import type {
  Ad, EditFormData, ProfileData,
} from "~/types/user";
import type {
  EnrichedReview, TopCitiesResponse, TopCategoriesResponse
} from "~/types/review";
import type { DisplayBadge, BadgeResponse, BadgeInfo } from '~/types/badge';
import BadgeToolTip from "~/components/BadgeToolTip.vue";

//////////////////////////////////////////////IMPORT ENDS//////////////////////////////////////////////


// Composables and Stores
const { triggerLogout } = useMethods();
const { getEnrichedUserReviews } = useEnrichedReviews();
const { getUserProfile, updateUserProfile, getUserId } = useUserProfileMethods();
const { getUserTopCities, getUserTopCategories } = useReviewMethods();
const { getUserBadges, getBadgeInfo, createTierBadge, mapBadgesToDisplay,  enrichBadgesWithIcons } = useBadgeApi();

const userId = getUserId();
const route = useRoute();

// Refs
const userReviews = ref<EnrichedReview[]>([]);
const reviewsLoading = ref(false);
const reviewsError = ref<string | null>(null);
const activeTab = ref<string>("your-reviews");
const isEditingProfile = ref<boolean>(false);
const saving = ref<boolean>(false);
const saveSuccess = ref<boolean>(false);
const saveError = ref<string | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const profileData = ref<ProfileData | null>(null);
const isUser = ref(false);
const editForm = ref<EditFormData>({
  username: "",
  phoneNumber: "",
  address: "",
});
const notificationSettingsChanged = ref(false);
const savingNotifications = ref(false);
const notificationSaveSuccess = ref(false);
const notificationSaveError = ref<string | null>(null);
const darkModeChanged = ref(false);
const savingDarkMode = ref(false);
const darkModeSaveSuccess = ref(false);
const darkModeSaveError = ref<string | null>(null);
const originalNotificationSettings = ref<any>(null);
const originalDarkMode = ref<boolean | null>(null);
const isEditingSocialMedia = ref(false);
const socialMediaAccounts = ref<Array<{ platform: string; handle: string }>>([
  { platform: "", handle: "" },
]);
const savingSocialMedia = ref(false);
const socialMediaSaveSuccess = ref(false);
const socialMediaSaveError = ref<string | null>(null);
const topCitiesData = ref<TopCitiesResponse | null>(null);
const topCategoriesData = ref<TopCategoriesResponse | null>(null);
const topDataLoading = ref(false);
const reviewsCache = ref<Map<string, any[]>>(new Map());
const badgeData = ref<BadgeResponse | null>(null);
const tierBadgeInfo = ref<any | null>(null);
const badgeInfoMap = ref<Map<string, BadgeInfo>>(new Map());
const ads = ref<Ad[]>([
  {
    id: 1,
    business: "Prime Steakhouse",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop",
    tagline: "Enjoy a fine dining experience",
  },
  {
    id: 2,
    business: "Yoga Sanctuary",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop",
    tagline: "Let us help you Relax and Unwind.",
  },
]);


// Constants
const defaultProfileImage = "https://via.placeholder.com/200";


//Computed
const currentUserId = computed(() => {
  const routeId = route.params.id as string;
  return routeId;
});
const firstName = computed(() => {
  const parts = profileData.value?.username?.trim().split(" ") || [];
  return parts[0] || "";
});
const lastName = computed(() => {
  const parts = profileData.value?.username?.trim().split(" ") || [];
  return parts.slice(1).join(" ") || ""; // Handles middle names too
});
const canSaveSocialMedia = computed(() => {
  // At least one account must have both platform and handle filled
  return socialMediaAccounts.value.some(
    (acc) => acc.platform.trim() && acc.handle.trim()
  );
});
const topCategories = computed(() => {
  if (!topCategoriesData.value?.topCategories) return [];
  
  return topCategoriesData.value.topCategories.map(cat => ({
    id: cat.categoryId,
    categoryId: cat.categoryId,
    name: cat.categoryName,
    reviewCount: cat.reviewCount,
    businessCount: cat.businessCount,
    averageRating: cat.averageRating,
    icon: getCategoryIcon(cat.categoryName),
    color: getCategoryIconColor(cat.categoryName)
  }));
});
const topLocations = computed(() => {
  if (!topCitiesData.value?.topCities) return [];
  
  return topCitiesData.value.topCities.map(city => {
    const stateInfo = city.state !== 'Unknown' ? `, ${city.state}` : '';
    return {
      display: `${city.city}${stateInfo}`,
      city: city.city,
      state: city.state,
      reviewCount: city.reviewCount,
      businessCount: city.businessCount,
      averageRating: city.averageRating
    };
  });
});
const badges = computed<DisplayBadge[]>(() => {
  if (!badgeData.value || !badgeData.value.badges.length) {
    return [];
  }
  // Just map - we'll enrich with icons in fetchBadges
  return mapBadgesToDisplay(badgeData.value.badges);
});

const tierBadge = computed<DisplayBadge | null>(() => {
  if (!badgeData.value || !tierBadgeInfo.value) {
    return null;
  }
  return createTierBadge(tierBadgeInfo.value, badgeData.value.currentTier);
});

const currentTier = computed(() => badgeData.value?.currentTier || 'newbie');
const totalBadges = computed(() => badgeData.value?.totalBadges || 0);


// Methods
const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};


const getStatusIcon = (status: string): { icon: string; color: string; title: string; message: string } => {
  const statusMap: Record<string, { icon: string; color: string; title: string; message: string }> = {
    'APPROVED': {
      icon: 'pi-check-circle',
      color: 'text-green-600',
      title: 'Published',
      message: 'Your review is live and visible to everyone'
    },
    'PENDING': {
      icon: 'pi-clock',
      color: 'text-gray-600',
      title: 'Pending Review',
      message: 'Being reviewed by our team'
    },
    'REJECTED': {
      icon: 'pi-times-circle',
      color: 'text-red-600',
      title: 'Not Approved',
      message: 'Did not meet community guidelines'
    },
    'FLAGGED': {
      icon: 'pi-flag',
      color: 'text-orange-600',
      title: 'Flagged',
      message: 'Under review for potential issues'
    }
  };

  return statusMap[status] ?? statusMap['PENDING']!;
};

const loadProfile = async () => {
  if (!currentUserId.value) {
    error.value = "User ID is missing";
    console.error("No user ID in route parameter");
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    console.log("📡 Fetching profile for user:", currentUserId.value);
    const result = await getUserProfile(currentUserId.value);
    console.log(userId, "This users id");

    if (result?.statusCode === 200 && result.data) {
      if (userId === currentUserId.value) {
        isUser.value = true;
      }
      console.log("Profile loaded successfully:", result.data);

      profileData.value = result.data;

      console.log(
        "Profile number loaded successfully:",
        profileData.value?.phone
      );
    } else {
      error.value = "Failed to load profile";
      console.error("Profile fetch returned non-200 status");
    }
  } catch (err: any) {
    console.error("Error loading profile:", err);
    console.error("Error response:", err?.response?.data);
    console.error("Error status:", err?.response?.status);
    error.value =
      err?.response?.data?.message || err.message || "Failed to load profile";
  } finally {
    loading.value = false;
  }
};

const startEdit = () => {
  if (profileData.value) {
    editForm.value = {
      username: profileData.value.username,
      phoneNumber: profileData.value.phone || "",
      address: profileData.value.address || "",
    };
  }
  isEditingProfile.value = true;
  saveSuccess.value = false;
  saveError.value = null;
};

const cancelEdit = () => {
  isEditingProfile.value = false;
  saveSuccess.value = false;
  saveError.value = null;
};

const handleSaveProfile = async () => {
  // Check if user is logged in
  saving.value = true;
  saveSuccess.value = false;
  saveError.value = null;

  try {
    // Prepare update payload (only send fields that are filled)
    const updates: any = {};

    if (editForm.value.username) {
      updates.username = editForm.value.username;
    }
    if (editForm.value.phoneNumber) {
      updates.phone = editForm.value.phoneNumber;
    }
    if (editForm.value.address) {
      updates.address = editForm.value.address;
    }

    console.log("📤 Updating profile with data:", updates);
    const result = await updateUserProfile(currentUserId.value, updates);

    if (result?.statusCode === 200) {
      console.log("✅ Profile updated successfully");
      // Refresh profile data
      const refreshed = await getUserProfile(currentUserId.value);
      if (refreshed?.data) {
        profileData.value = refreshed.data;
      }

      saveSuccess.value = true;

      // Close edit mode after 2 seconds
      setTimeout(() => {
        isEditingProfile.value = false;
        saveSuccess.value = false;
      }, 2000);
    } else {
      saveError.value = "Failed to update profile";
      console.error("❌ Update returned non-200 status");
    }
  } catch (err: any) {
    console.error("❌ Error saving profile:", err);
    console.error("❌ Error response:", err?.response?.data);
    saveError.value =
      err?.response?.data?.message || err.message || "Failed to save profile";
  } finally {
    saving.value = false;
  }
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = defaultProfileImage;
};

watch(
  () => profileData.value,
  (newProfile) => {
    if (newProfile && !originalNotificationSettings.value) {
      // Store original notification preferences
      if (newProfile.notificationPreferences) {
        originalNotificationSettings.value = JSON.parse(
          JSON.stringify(newProfile.notificationPreferences)
        );
      }
      // Store original dark mode
      originalDarkMode.value = newProfile.darkMode;
    }
  },
  { immediate: true, deep: true }
);

const toggleNotification = (settingKey: string) => {
  if (!profileData.value?.notificationPreferences) return;

  // Toggle the setting
  profileData.value.notificationPreferences[settingKey] =
    !profileData.value.notificationPreferences[settingKey];

  // Check if settings have changed
  checkNotificationChanges();
};

const checkNotificationChanges = () => {
  if (
    !profileData.value?.notificationPreferences ||
    !originalNotificationSettings.value
  ) {
    notificationSettingsChanged.value = false;
    return;
  }

  const current = profileData.value.notificationPreferences;
  const original = originalNotificationSettings.value;

  notificationSettingsChanged.value =
    current.emailNotifications !== original.emailNotifications ||
    current.smsNotifications !== original.smsNotifications ||
    current.pushNotifications !== original.pushNotifications ||
    current.marketingEmails !== original.marketingEmails;
};

const saveNotificationSettings = async () => {
  if (!currentUserId.value || !profileData.value) return;

  savingNotifications.value = true;
  notificationSaveSuccess.value = false;
  notificationSaveError.value = null;

  try {
    const updates = {
      notificationPreferences: profileData.value.notificationPreferences,
    };

    console.log("📤 Saving notification settings:", updates);
    const result = await updateUserProfile(currentUserId.value, updates);

    if (result?.statusCode === 200) {
      console.log("✅ Notification settings saved");

      // Update original settings
      originalNotificationSettings.value = JSON.parse(
        JSON.stringify(profileData.value.notificationPreferences)
      );

      notificationSettingsChanged.value = false;
      notificationSaveSuccess.value = true;

      // Hide success message after 3 seconds
      setTimeout(() => {
        notificationSaveSuccess.value = false;
      }, 3000);
    } else {
      notificationSaveError.value = "Failed to save notification settings";
    }
  } catch (err: any) {
    console.error("❌ Error saving notification settings:", err);
    notificationSaveError.value =
      err?.response?.data?.message || "Failed to save settings";
  } finally {
    savingNotifications.value = false;
  }
};

const cancelNotificationChanges = () => {
  if (!profileData.value || !originalNotificationSettings.value) return;

  // Restore original settings
  profileData.value.notificationPreferences = JSON.parse(
    JSON.stringify(originalNotificationSettings.value)
  );

  notificationSettingsChanged.value = false;
  notificationSaveError.value = null;
};

const toggleDarkMode = () => {
  if (!profileData.value) return;

  // Toggle dark mode
  profileData.value.darkMode = !profileData.value.darkMode;

  // Check if changed from original
  checkDarkModeChange();
};

const checkDarkModeChange = () => {
  if (!profileData.value || originalDarkMode.value === null) {
    darkModeChanged.value = false;
    return;
  }

  darkModeChanged.value = profileData.value.darkMode !== originalDarkMode.value;
};

const saveDarkModeSetting = async () => {
  if (!currentUserId.value || !profileData.value) return;

  savingDarkMode.value = true;
  darkModeSaveSuccess.value = false;
  darkModeSaveError.value = null;

  try {
    const updates = {
      darkMode: profileData.value.darkMode,
    };

    console.log("📤 Saving dark mode setting:", updates);
    const result = await updateUserProfile(currentUserId.value, updates);

    if (result?.statusCode === 200) {
      console.log("✅ Dark mode setting saved");

      // Update original setting
      originalDarkMode.value = profileData.value.darkMode;

      darkModeChanged.value = false;
      darkModeSaveSuccess.value = true;

      // Hide success message after 3 seconds
      setTimeout(() => {
        darkModeSaveSuccess.value = false;
      }, 3000);
    } else {
      darkModeSaveError.value = "Failed to save dark mode setting";
    }
  } catch (err: any) {
    console.error("❌ Error saving dark mode:", err);
    darkModeSaveError.value =
      err?.response?.data?.message || "Failed to save setting";
  } finally {
    savingDarkMode.value = false;
  }
};

const cancelDarkModeChange = () => {
  if (!profileData.value || originalDarkMode.value === null) return;

  // Restore original setting
  profileData.value.darkMode = originalDarkMode.value;

  darkModeChanged.value = false;
  darkModeSaveError.value = null;
};
// ========================================
// SOCIAL MEDIA WITH PLATFORMS - SCRIPT METHODS
// ========================================

const parseSocialMediaAccounts = (socialMediaString: string) => {
  if (!socialMediaString || !socialMediaString.trim()) return [];

  const accounts = socialMediaString
    .split("|")
    .map((item) => {
      const [platform, handle] = item.split(":");
      return {
        platform: platform?.trim() || "",
        handle: handle?.trim() || "",
      };
    })
    .filter((acc) => acc.platform && acc.handle);

  return accounts;
};

const getSocialMediaIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    WhatsApp: "pi pi-whatsapp text-green-600",
    Instagram: "pi pi-instagram text-pink-600",
    Snapchat: "pi pi-snapchat text-yellow-500",
    "X (Twitter)": "pi pi-twitter text-blue-400",
    Facebook: "pi pi-facebook text-blue-600",
    LinkedIn: "pi pi-linkedin text-blue-700",
    TikTok: "pi pi-tiktok text-gray-800",
    YouTube: "pi pi-youtube text-red-600",
    Telegram: "pi pi-telegram text-blue-500",
  };

  return icons[platform] || "pi pi-link text-gray-600";
};

const getPlaceholder = (platform: string) => {
  const placeholders: Record<string, string> = {
    WhatsApp: "+234 123 456 7890",
    Instagram: "@username",
    Snapchat: "@username",
    "X (Twitter)": "@username",
    Facebook: "facebook.com/username",
    LinkedIn: "linkedin.com/in/username",
    TikTok: "@username",
    YouTube: "@channelname",
    Telegram: "@username",
    Other: "Username or link",
  };

  return placeholders[platform] || "Enter username or link";
};

const startEditSocialMedia = () => {
  const currentAccounts = parseSocialMediaAccounts(
    profileData.value?.socialMedia || ""
  );

  if (currentAccounts.length > 0) {
    socialMediaAccounts.value = currentAccounts;
  } else {
    socialMediaAccounts.value = [{ platform: "", handle: "" }];
  }

  isEditingSocialMedia.value = true;
  socialMediaSaveSuccess.value = false;
  socialMediaSaveError.value = null;
};

const cancelEditSocialMedia = () => {
  isEditingSocialMedia.value = false;
  socialMediaAccounts.value = [{ platform: "", handle: "" }];
  socialMediaSaveSuccess.value = false;
  socialMediaSaveError.value = null;
};

const addSocialMediaAccount = () => {
  socialMediaAccounts.value.push({ platform: "", handle: "" });
};

/**
 * Remove a social media account
 */
const removeSocialMediaAccount = (index: number) => {
  socialMediaAccounts.value.splice(index, 1);

  // Ensure at least one empty account remains
  if (socialMediaAccounts.value.length === 0) {
    socialMediaAccounts.value = [{ platform: "", handle: "" }];
  }
};

/**
 * Save social media accounts
 */
const saveSocialMedia = async () => {
  if (!currentUserId.value) return;

  savingSocialMedia.value = true;
  socialMediaSaveSuccess.value = false;
  socialMediaSaveError.value = null;

  try {
    // Filter out empty accounts and format as string
    const validAccounts = socialMediaAccounts.value.filter(
      (acc) => acc.platform.trim() && acc.handle.trim()
    );

    // Format: "WhatsApp:+234123456789|Instagram:@johndoe|X (Twitter):@john"
    const socialMediaString = validAccounts
      .map((acc) => `${acc.platform}:${acc.handle}`)
      .join("|");

    const updates = {
      socialMedia: socialMediaString,
    };

    console.log("Saving social media accounts:", updates);
    const result = await updateUserProfile(currentUserId.value, updates);

    if (result?.statusCode === 200) {
      console.log("Social media accounts saved");

      // Update profile data
      if (profileData.value) {
        profileData.value.socialMedia = socialMediaString;
      }

      socialMediaSaveSuccess.value = true;

      // Close edit mode after 2 seconds
      setTimeout(() => {
        isEditingSocialMedia.value = false;
        socialMediaSaveSuccess.value = false;
      }, 2000);
    } else {
      socialMediaSaveError.value = "Failed to save social media accounts";
    }
  } catch (err: any) {
    console.error("Error saving social media:", err);
    socialMediaSaveError.value =
      err?.response?.data?.message || "Failed to save";
  } finally {
    savingSocialMedia.value = false;
  }
};


// Fetch function (call this in your existing onMounted or wherever you load data)
const fetchTopData = async () => {
  if (!currentUserId.value && !profileData.value?.email) return;

  try {
    topDataLoading.value = true;

    const [citiesResponse, categoriesResponse] = await Promise.all([
      getUserTopCities(
        currentUserId.value ?? undefined,
        profileData.value?.email ?? undefined
      ),
      getUserTopCategories(
        currentUserId.value ?? undefined,
        profileData.value?.email ?? undefined
      )
    ]);

    topCitiesData.value = citiesResponse;
    topCategoriesData.value = categoriesResponse;
  } catch (err) {
    console.error("Error fetching top data:", err);
  } finally {
    topDataLoading.value = false;
  }
};



const loadUserReviews = async () => {
  if (!currentUserId.value) {
    console.error("No user ID available for loading reviews");
    return;
  }

  reviewsLoading.value = true;
  reviewsError.value = null;

  try {
    console.log("📡 Fetching enriched reviews for user:", currentUserId.value);

    // Use the enriched reviews composable that fetches business data
    const enrichedReviews = await getEnrichedUserReviews(
      currentUserId.value,
      profileData.value?.email
    );

    console.log("✅ Enriched reviews loaded:", enrichedReviews);

    // The reviews are already in the correct format
    userReviews.value = enrichedReviews;
    if (profileData.value) {
      profileData.value.totalReviews = userReviews.value.length;
    }

    console.log(`📊 Total reviews loaded: ${userReviews.value.length}`);
  } catch (err: any) {
    console.error("❌ Error loading reviews:", err);
    reviewsError.value =
      err?.response?.data?.message || err.message || "Failed to load reviews";
  } finally {
    reviewsLoading.value = false;
  }
};


const loadUserReviewsWithCache = async () => {
  if (!currentUserId.value) {
    console.error("No user ID available for loading reviews");
    return;
  }

  // Check cache first
  const cacheKey = `${currentUserId.value}-${profileData.value?.email || 'no-email'}`;
  if (reviewsCache.value.has(cacheKey)) {
    console.log("📦 Using cached reviews");
    userReviews.value = reviewsCache.value.get(cacheKey)!;
    return;
  }

  reviewsLoading.value = true;
  reviewsError.value = null;

  try {
    console.log("📡 Fetching enriched reviews for user:", currentUserId.value);

    const enrichedReviews = await getEnrichedUserReviews(
      currentUserId.value,
      profileData.value?.email
    );

    console.log("✅ Enriched reviews loaded:", enrichedReviews);

    // Store in cache
    reviewsCache.value.set(cacheKey, enrichedReviews);
    userReviews.value = enrichedReviews;

    console.log(`📊 Total reviews loaded: ${userReviews.value.length}`);

    
  } catch (err: any) {
    console.error("❌ Error loading reviews:", err);
    reviewsError.value =
      err?.response?.data?.message || err.message || "Failed to load reviews";
  } finally {
    reviewsLoading.value = false;
  }
};

// ===== OPTIONAL: Add method to clear cache when needed =====
const clearReviewsCache = () => {
  reviewsCache.value.clear();
  console.log("🗑️ Reviews cache cleared");
};

watch(activeTab, (newTab) => {
  if (
    newTab === "your-reviews" &&
    userReviews.value.length === 0 &&
    !reviewsLoading.value
  ) {
    loadUserReviews();
  }
});

watch(
  () => profileData.value,
  (profile) => {
    if (profile) {
      fetchTopData();
    }
  },
  { immediate: true }
);


const fetchBadges = async () => {
  if (!currentUserId.value) return;
  
  loading.value = true;

  try {
    // Fetch user badges
    const response = await getUserBadges(currentUserId.value);
    if (response) {
      console.log('✅ Badge data loaded:', response);
      
      // Fetch tier badge info
      const tierInfo = await getBadgeInfo(response.currentTier);
      if (tierInfo) {
        tierBadgeInfo.value = tierInfo;
        console.log('✅ Tier badge info loaded:', tierInfo);
      }

      // Enrich earned badges with icons
      if (response.badges.length > 0) {
        const mappedBadges = mapBadgesToDisplay(response.badges);
        const enrichedBadges = await enrichBadgesWithIcons(mappedBadges);
        
        // Store enriched badges back with proper typing
        badgeData.value = {
          ...response,
          badges: response.badges.map((badge, idx) => {
            const enrichedBadge = enrichedBadges[idx];
            return {
              ...badge,
              // Add icon with fallback to ensure it's always a string
              icon: enrichedBadge?.icon || '🏆' // ✅ Always a string now
            };
          })
        };
        
        console.log('✅ Badges enriched with icons:', badgeData.value.badges);
      } else {
        // No earned badges, just store the response
        badgeData.value = response;
      }
    }
  } catch (err: any) {
    console.error('❌ Failed to fetch badges:', err);
  } finally {
    loading.value = false;
  }
};
// Lifecycle
onBeforeMount(async () => {
  await loadProfile();
  await fetchTopData();

  if (activeTab.value === "your-reviews") {
    await loadUserReviews();
  }
});

onMounted(() => {
  fetchBadges();
});

watch(() => currentUserId.value, () => {
  fetchBadges();
});

</script>

<style scoped>
/* Your existing styles */
</style>
