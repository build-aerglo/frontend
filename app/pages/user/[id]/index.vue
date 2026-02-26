<template>
  <div class="min-h-screen bg-green-50">
    <NavBarProfile />

    <!-- Loading State -->
    <div
      v-if="loading && !summary"
      class="flex items-center justify-center min-h-screen"
    >
      <GeneralLoader />
    </div>

    <!-- Error State -->
    <div v-else-if="error && !summary" class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="pi pi-exclamation-triangle text-4xl text-red-600 mb-4"></i>
        <h3 class="text-lg font-semibold text-red-800 mb-2">
          Failed to Load Profile
        </h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadSummary(false)"
          class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Edit Profile View -->
    <div
      v-else-if="isEditingProfile && summary"
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
              cleanUsername
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

        <div
          v-if="saveSuccess"
          class="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
        >
          <i class="pi pi-check-circle text-green-600 mr-2"></i>
          <span class="text-green-700">Profile updated successfully!</span>
        </div>

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
    <div v-else-if="summary">
      <!-- User Profile Section -->
      <div class="bg-gradient-to-b from-blue-50 to-white py-8 mb-2">
        <div class="max-w-7xl flex md:flex-row flex-col md:justify-between justify-center items-center mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-5">
            <UserAvatar :firstName="firstName" :lastName="lastName" :size="100" />
            <div class="space-y-1">
              <div class="flex items-center text-bold text-2xl justify-center md:justify-start text-gray-800">
                <span class="font-semibold md:text-3xl text-xl text-gray-800">{{ cleanUsername }}</span>
              </div>

              <div class="flex items-center divide-x divide-gray-300 text-sm text-gray-600">
                <span class="px-3">
                  <span class="font-medium text-gray-900">{{ summary.reviews.totalCount }}</span> Total Review{{s(summary.reviews.totalCount)}}
                </span>
                <span class="px-3">
                  <span class="font-medium text-gray-900">{{ summary.points }}</span> Point{{s(summary.points)}}
                </span>
                <span class="px-3">
                  <span class="font-medium text-gray-900">{{ summary.streak }}</span> Streak{{s(summary.streak)}}
                </span>
              </div>

              <div
                v-if="isUser"
                class="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-gray-600 text-sm sm:text-base"
              >
                <div class="flex items-center gap-2">
                  <i class="pi pi-envelope"></i>
                  <span>{{ summary.profile.email }}</span>
                </div>
                <div v-if="summary.profile.phone" class="flex items-center gap-2">
                  <span class="hidden md:block h-5 w-px bg-gray-300"></span>
                  <i class="pi pi-phone"></i>
                  <span>{{ summary.profile.phone }}</span>
                </div>
                <div v-if="summary.profile.address" class="flex items-center gap-2">
                  <span class="hidden md:block h-5 w-px bg-gray-300"></span>
                  <i class="pi pi-home"></i>
                  <span class="truncate max-w-xs">{{ summary.profile.address }}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
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
                activeTab === 'your-reviews' ? 'bg-[#008253] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <i class="pi pi-star"></i>
              Your Reviews
            </button>
            <button
              @click="activeTab = 'rewards'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2',
                activeTab === 'rewards' ? 'bg-[#008253] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <i class="pi pi-gift"></i>
              Rewards
            </button>
            <button
              @click="activeTab = 'notifications'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2',
                activeTab === 'notifications' ? 'bg-[#008253] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <i class="pi pi-bell"></i>
              Notifications
            </button>
            <button
              @click="activeTab = 'settings'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2',
                activeTab === 'settings' ? 'bg-[#008253] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div class="bg-white rounded-xl shadow-sm p-4 md:block">
              <h5 class="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                <i class="pi pi-trophy text-gold"></i>
                <span v-if="isUser" class="font-bold text-gray-800 text-sm">Your</span>
                Badges
                <span v-if="totalBadgeCount > 0" class="text-sm text-gray-500">({{ totalBadgeCount }})</span>
              </h5>

              <div v-if="!summary.tierBadge && !summary.achievementBadges.length" class="text-center py-8 text-gray-500">
                <i class="pi pi-trophy text-4xl mb-2 opacity-50"></i>
                <p class="text-sm">
                  {{ isUser ? "You haven't earned any badges yet" : "No badges earned yet" }}
                </p>
                <p v-if="isUser" class="text-xs text-gray-400 mt-2">Keep reviewing to unlock badges!</p>
              </div>

              <div v-else class="space-y-3">
                <!-- Tier Badge -->
                <BadgeToolTip
                  v-if="summary.tierBadge"
                  :name="summary.tierBadge.badgeType"
                  :icon="summary.tierBadge.icon"
                  :color="getTierColor(summary.tierBadge.badgeType)"
                  :description="summary.tierBadge.description"
                />
                <!-- Achievement Badges -->
                <BadgeToolTip
                  v-for="(badge, idx) in summary.achievementBadges"
                  :key="idx"
                  :name="badge.badgeType"
                  :icon="badge.icon"
                  :color="getAchievementColor(badge.badgeType)"
                  :description="badge.description"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <!-- Top Categories -->
              <div class="bg-white rounded-xl shadow-sm p-4">
                <h5 class="font-bold text-sm whitespace-nowrap text-gray-900 mb-4 flex items-center gap-2">
                  <i class="pi pi-star-fill text-gold"></i>
                  Top Reviewed Categories
                </h5>
                <div v-if="!topCategories.length" class="text-sm flex gap-2 items-center justify-center text-gray-500 italic py-4 text-center">
                  <i class="pi pi-inbox text-2xl mb-2 block text-gray-400"></i>
                  No categories reviewed yet
                </div>
                <ul v-else class="space-y-3">
                  <li v-for="(cat, idx) in topCategories.slice(0, 3)" :key="cat.categoryId || idx">
                    <div class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all">
                      <component :is="cat.icon" class="w-6 h-6" :class="cat.color || 'text-gray-400'" />
                      <div class="flex-1 min-w-0">
                        <span class="block text-sm font-medium text-gray-900 truncate">{{ cat.categoryName }}</span>
                        <span class="block text-xs text-gray-400 leading-tight">({{ cat.reviewCount }} review{{ s(cat.reviewCount) }})</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-if="summary.topCategories.length > 3" class="mt-4 pt-4 border-t border-gray-100">
                  <button class="text-sm text-[#008253] hover:text-[#006641] font-medium flex items-center gap-1 w-full justify-center">
                    View all {{ summary.topCategories.length }} categories
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
                <div v-if="!topLocations.length" class="text-sm flex gap-2 items-center justify-center text-gray-500 italic py-4 text-center">
                  <i class="pi pi-map text-2xl mb-2 block text-gray-400"></i>
                  No locations reviewed yet
                </div>
                <ul v-else class="space-y-1">
                  <li v-for="(loc, idx) in topLocations.slice(0, 3)" :key="idx">
                    <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all">
                      <i class="pi pi-map-marker text-gold text-lg"></i>
                      <div class="flex-1 min-w-0">
                        <span class="block text-sm font-medium text-gray-900 truncate">{{ loc.display }}</span>
                        <span class="block text-xs text-gray-400 leading-tight">({{ loc.reviewCount }} review{{ s(loc.reviewCount) }})</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-if="summary.topCities.length > 3" class="mt-4 pt-4 border-t border-gray-100">
                  <button class="text-sm text-[#008253] hover:text-[#006641] font-medium flex items-center gap-1 w-full justify-center">
                    View all {{ summary.topCities.length }} cities
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
              <span class="text-center flex justify-center h-20 items-center text-gray-500">Coming Soon...</span>
            </div>
          </div>

          <!-- Middle Column -->
          <div class="md:col-span-7">
            <!-- Menu Bar (Mobile) -->
            <div v-if="isUser" class="md:hidden bg-white border-b border-gray-200 mb-6 -mx-4 px-4">
              <div class="flex justify-between py-4">
                <button
                  @click="activeTab = 'your-reviews'"
                  :class="['px-4 py-2 rounded-lg font-medium transition text-sm', activeTab === 'your-reviews' ? 'bg-[#008253] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
                ><i class="pi pi-star"></i></button>
                <button
                  @click="activeTab = 'rewards'"
                  :class="['px-4 py-2 rounded-lg font-medium transition text-sm', activeTab === 'rewards' ? 'bg-[#008253] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
                ><i class="pi pi-gift"></i></button>
                <button
                  @click="activeTab = 'notifications'"
                  :class="['px-4 py-2 rounded-lg font-medium transition text-sm', activeTab === 'notifications' ? 'bg-[#008253] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
                ><i class="pi pi-bell"></i></button>
                <button
                  v-if="isUser"
                  @click="activeTab = 'settings'"
                  :class="['px-4 py-2 rounded-lg font-medium transition text-sm', activeTab === 'settings' ? 'bg-[#008253] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
                ><i class="pi pi-cog"></i></button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">

              <!-- Your Reviews Tab -->
              <div v-if="activeTab === 'your-reviews'" class="space-y-6">
                <h2 class="md:text-2xl text-xl font-bold text-[#008253]">
                  <span v-if="isUser" class="md:text-2xl text-xl font-bold text-[#008253]">Your</span>
                  Reviews
                </h2>

                <!-- Empty State - own profile -->
                <div
                  v-if="isUser && mappedReviews.length === 0"
                  class="text-center py-12"
                >
                  <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
                  <h3 class="text-lg font-medium text-gray-700 mb-2">Ready to write your first review?</h3>
                  <NuxtLink
                    to="/review/write-review"
                    class="inline-block mt-4 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium"
                  >
                    Click here to get started
                  </NuxtLink>
                </div>

                <!-- Empty State - someone else's profile -->
                <div
                  v-else-if="!isUser && mappedReviews.length === 0"
                  class="text-center py-12"
                >
                  <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
                  <h3 class="text-base font-normal text-gray-700 mb-2">
                    This member hasn't written any reviews on CleReview yet
                  </h3>
                </div>

                <!-- Reviews List -->
                <div v-else class="space-y-4">
                  <div
                    v-for="review in mappedReviews"
                    :key="review.id"
                    :class="[
                      'border rounded-lg p-4 transition-all',
                      review.isGrayedOut
                        ? 'border-gray-200 bg-gray-50/50 opacity-75'
                        : 'border-gray-200 bg-white hover:shadow-md'
                    ]"
                  >
                    <div class="flex md:flex-row flex-col justify-between items-start gap-4 relative">
                      <!-- Left: Business info -->
                      <div class="flex gap-3 flex-1">
                        <div class="flex-shrink-0">
                          <img
                            :src="review.logo || '/images/default-business-logo.png'"
                            :alt="review.businessName"
                            :class="['w-14 h-14 rounded-lg object-cover border border-gray-200', review.isGrayedOut && 'opacity-50']"
                            @error="handleImageError"
                          />
                        </div>
                        <div class="flex flex-col gap-2">
                          <h2 :class="['text-base font-semibold truncate m-0 p-0', review.isGrayedOut ? 'text-gray-500' : 'text-gray-800']">
                            {{ review.businessName }}
                          </h2>
                          <p :class="['text-xs truncate', review.isGrayedOut ? 'text-gray-400' : 'text-gray-500']">
                            {{ review.businessAddress }}
                          </p>
                        </div>
                      </div>

                      <!-- Right: Stars + date -->
                      <div class="flex md:flex-col items-end gap-2 flex-shrink-0">
                        <div class="flex items-center">
                          <Stars
                            v-for="n in 5"
                            :key="n"
                            :filled="n <= review.rating"
                            :colorLevel="n <= review.rating ? Math.round(review.rating) : 0"
                            :class="['w-4 h-4', review.isGrayedOut && 'opacity-50']"
                          />
                        </div>
                        <span :class="['text-xs', review.isGrayedOut ? 'text-gray-400' : 'text-gray-600']">
                          {{ formatDateShort(review.date) }}
                        </span>
                      </div>

                      <!-- Status Icon -->
                      <div class="absolute group right-[-22px] top-[-22px] bg-white">
                        <i :class="['pi text-2xl cursor-help', getStatusIcon(review.rawStatus).icon, getStatusIcon(review.rawStatus).color]"></i>
                        <div class="absolute right-0 top-full mt-1 hidden group-hover:block z-10 w-48">
                          <div class="bg-white text-gray-500 leading-relaxed text-xs rounded-lg px-3 py-2 shadow-lg">
                            <p class="text-gray-500 text-xs">{{ getStatusIcon(review.rawStatus).message }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Review Body -->
                    <div class="mt-4">
                      <p :class="['text-sm leading-relaxed', review.isGrayedOut ? 'text-gray-500' : 'text-gray-700']">
                        {{ review.body }}
                      </p>
                    </div>

                    <!-- Photos -->
                    <div v-if="review.photoUrls && review.photoUrls.length > 0" class="mt-4">
                      <div class="flex gap-2 flex-wrap">
                        <img
                          v-for="(photo, idx) in review.photoUrls"
                          :key="idx"
                          :src="photo"
                          alt="Review photo"
                          :class="['w-20 h-20 object-cover rounded-lg border border-gray-200', review.isGrayedOut && 'opacity-50']"
                        />
                      </div>
                    </div>
                  </div>

                  <Paginator
                    v-if="summary.reviews.totalCount > reviewPageSize"
                    :rows="reviewPageSize"
                    :totalRecords="summary.reviews.totalCount"
                    :first="(reviewPage - 1) * reviewPageSize"
                    @page="onReviewPageChange"
                    template="PrevPageLink PageLinks NextPageLink"
                    class="mt-4"
                  />
                </div>
              </div>

              <!-- Rewards Tab -->
              <div v-if="activeTab === 'rewards'" class="bg-white rounded-xl p-4 max-w-2xl mx-auto space-y-6">
                <!-- Refer a Friend -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <i class="pi pi-users text-five_star text-xl"></i>
                    <h3 class="font-semibold text-lg text-gray-800">Refer a Friend</h3>
                  </div>
                  <p class="text-gray-600 text-sm mb-3">Invite friends and earn 50 points for each successful referral!</p>
                  <div class="flex items-center gap-3">
                    <input
                      type="text"
                      value="https://clereview.com/ref/user123"
                      readonly
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                    />
                    <button class="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-[#008253] transition-colors">
                      <i class="pi pi-copy mr-1"></i> Copy
                    </button>
                  </div>
                  <div class="mt-3 text-sm text-gray-600">
                    <span class="font-medium">Successful Referrals:</span> 5 (250 points earned)
                  </div>
                </div>

                <!-- Earned Points -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-star-fill text-gold text-xl"></i>
                    <h3 class="font-semibold text-lg text-gray-800">Earned Points</h3>
                  </div>
                  <div>
                  <div class="flex justify-between items-center border-b border-gray-100">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-comment text-green-500"></i>
                      <span class="text-gray-700">Review Points</span>
                    </div>
                    <span class="font-semibold text-gray-800">{{ summary.points }}</span>
                  </div>
                  <div class="flex justify-between items-center border-b border-gray-100">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-comment text-green-500"></i>
                      <span class="text-gray-700">Referral Points</span>
                    </div>
                    <span class="font-semibold text-gray-800">0</span>
                  </div>
                  <div class="flex justify-between items-center border-b border-gray-100">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-comment text-green-500"></i>
                      <span class="text-gray-700">Streak Reward</span>
                    </div>
                    <span class="font-semibold text-gray-800">{{ summary.streak }}</span>
                  </div>
                  </div>

                </div>

                <!-- Redeem Points -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-gift text-red-600 text-xl"></i>
                    <h3 class="font-semibold text-lg text-gray-800">Redeem Points</h3>
                  </div>
                  <div class="space-y-3">
                    <div
                      v-for="reward in redeemOptions"
                      :key="reward.label"
                      class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gold hover:bg-gold/5 transition-all cursor-pointer"
                    >
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-800">{{ reward.label }}</h4>
                        <p class="text-sm text-gray-600">{{ reward.cost }} points</p>
                      </div>
                      <button
                        :disabled="summary.points < reward.cost"
                        class="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-4 text-center">
                    <span v-if="isUser" class="text-xs text-gray-500">Your</span>
                    current balance: <strong class="text-gold">{{ summary.points }} points</strong>
                  </p>
                </div>
              </div>

              <!-- Notifications Tab -->
              <div v-if="isUser && activeTab === 'notifications'" class="text-center py-12">
                <i class="pi pi-bell text-6xl text-gray-300 mb-4"></i>
                <h2 class="text-2xl font-bold text-[#008253] mb-2">Notifications</h2>
                <p class="text-gray-500">Nothing new yet</p>
              </div>

              <!-- Settings Tab -->
              <div v-if="activeTab === 'settings'" class="space-y-6">
                <h2 class="text-2xl font-bold text-[#008253]">Settings</h2>

                <!-- Social Media -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <i class="pi pi-share-alt text-[#008253]"></i>
                      Social Media
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">Connect your social media accounts</p>
                  </div>
                  <div class="p-6">
                    <!-- View Mode -->
                    <div v-if="!isEditingSocialMedia" class="space-y-4">
                      <div v-if="summary.profile.socialMedia && summary.profile.socialMedia.trim() && summary.profile.socialMedia !== 'Registered via Google'">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Connected Accounts</label>
                        <div class="space-y-2">
                          <div
                            v-for="(account, idx) in parseSocialMediaAccounts(summary.profile.socialMedia)"
                            :key="idx"
                            class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                          >
                            <div class="flex items-center gap-3">
                              <i :class="getSocialMediaIcon(account.platform)" class="text-xl"></i>
                              <div>
                                <p class="text-xs text-gray-500 font-medium">{{ account.platform }}</p>
                                <p class="text-gray-700">{{ account.handle }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          @click="startEditSocialMedia"
                          class="mt-3 text-[#008253] hover:text-[#006641] flex items-center gap-1 text-sm font-medium"
                        >
                          <i class="pi pi-pencil text-xs"></i> Edit Accounts
                        </button>
                      </div>
                      <div v-else class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div class="flex items-center gap-3">
                          <i class="pi pi-times-circle text-gray-400 text-xl"></i>
                          <span class="text-gray-500">No social media accounts connected</span>
                        </div>
                        <button @click="startEditSocialMedia" class="text-[#008253] hover:text-[#006641] flex items-center gap-1 text-sm font-medium">
                          <i class="pi pi-plus text-xs"></i> Add
                        </button>
                      </div>
                    </div>

                    <!-- Edit Mode -->
                    <div v-else class="space-y-4">
                      <div
                        v-for="(account, idx) in socialMediaAccounts"
                        :key="idx"
                        class="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div class="space-y-3">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
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
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Username/Handle/Phone</label>
                            <input
                              v-model="account.handle"
                              type="text"
                              :placeholder="getPlaceholder(account.platform)"
                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
                            />
                          </div>
                          <button
                            v-if="socialMediaAccounts.length > 1"
                            @click="removeSocialMediaAccount(idx)"
                            class="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                          >
                            <i class="pi pi-trash text-xs"></i> Remove
                          </button>
                        </div>
                      </div>
                      <button
                        @click="addSocialMediaAccount"
                        class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#008253] hover:text-[#008253] transition flex items-center justify-center gap-2"
                      >
                        <i class="pi pi-plus"></i> Add Another Account
                      </button>
                      <div class="flex gap-3 pt-2">
                        <button
                          @click="saveSocialMedia"
                          :disabled="savingSocialMedia || !canSaveSocialMedia"
                          class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i v-if="savingSocialMedia" class="pi pi-spin pi-spinner mr-2"></i>
                          {{ savingSocialMedia ? "Saving..." : "Save Accounts" }}
                        </button>
                        <button
                          @click="cancelEditSocialMedia"
                          :disabled="savingSocialMedia"
                          class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                      <div v-if="socialMediaSaveSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <i class="pi pi-check-circle text-green-600 mr-2"></i>
                        <span class="text-green-700">Social media accounts saved successfully!</span>
                      </div>
                      <div v-if="socialMediaSaveError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
                        <span class="text-red-700">{{ socialMediaSaveError }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Notification Preferences -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <i class="pi pi-bell text-[#008253]"></i>
                      Notification Preferences
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">Manage how you receive notifications</p>
                  </div>
                  <div class="p-6">
                    <div class="space-y-4">
                      <div
                        v-for="notif in notificationToggles"
                        :key="notif.key"
                        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center gap-3">
                          <div :class="['w-10 h-10 rounded-full flex items-center justify-center', notif.bgClass]">
                            <i :class="[notif.icon, notif.iconClass]"></i>
                          </div>
                          <div>
                            <p class="font-medium text-gray-800">{{ notif.label }}</p>
                            <p class="text-sm text-gray-600">{{ notif.subtitle }}</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <span :class="['text-sm font-medium', summary.profile.notificationPreferences?.[notif.key] ? 'text-green-600' : 'text-gray-500']">
                            {{ summary.profile.notificationPreferences?.[notif.key] ? 'On' : 'Off' }}
                          </span>
                          <div
                            :class="['w-12 h-6 rounded-full transition-colors cursor-pointer', summary.profile.notificationPreferences?.[notif.key] ? 'bg-[#008253]' : 'bg-gray-300']"
                            @click="toggleNotification(notif.key)"
                          >
                            <div :class="['w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5', summary.profile.notificationPreferences?.[notif.key] ? 'translate-x-6' : 'translate-x-0.5']"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="notificationSettingsChanged" class="mt-6 flex gap-3">
                      <button
                        @click="saveNotificationSettings"
                        :disabled="savingNotifications"
                        class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i v-if="savingNotifications" class="pi pi-spin pi-spinner mr-2"></i>
                        {{ savingNotifications ? "Saving..." : "Save Notification Settings" }}
                      </button>
                      <button @click="cancelNotificationChanges" :disabled="savingNotifications" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">Cancel</button>
                    </div>
                    <div v-if="notificationSaveSuccess" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <i class="pi pi-check-circle text-green-600 mr-2"></i>
                      <span class="text-green-700">Notification settings saved successfully!</span>
                    </div>
                    <div v-if="notificationSaveError" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
                      <span class="text-red-700">{{ notificationSaveError }}</span>
                    </div>
                  </div>
                </div>

                <!-- Appearance -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <i class="pi pi-palette text-[#008253]"></i>
                      Appearance
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">Customize your viewing experience</p>
                  </div>
                  <div class="p-6">
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                          <i class="pi pi-moon text-yellow-400"></i>
                        </div>
                        <div>
                          <p class="font-medium text-gray-800">Dark Mode</p>
                          <p class="text-sm text-gray-600">Use dark theme for better viewing at night</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span :class="['text-sm font-medium', summary.profile.darkMode ? 'text-green-600' : 'text-gray-500']">
                          {{ summary.profile.darkMode ? 'On' : 'Off' }}
                        </span>
                        <div
                          :class="['w-12 h-6 rounded-full transition-colors cursor-pointer', summary.profile.darkMode ? 'bg-[#008253]' : 'bg-gray-300']"
                          @click="toggleDarkMode"
                        >
                          <div :class="['w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5', summary.profile.darkMode ? 'translate-x-6' : 'translate-x-0.5']"></div>
                        </div>
                      </div>
                    </div>
                    <div v-if="darkModeChanged" class="mt-6 flex gap-3">
                      <button @click="saveDarkModeSetting" :disabled="savingDarkMode" class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        <i v-if="savingDarkMode" class="pi pi-spin pi-spinner mr-2"></i>
                        {{ savingDarkMode ? "Saving..." : "Save Appearance Settings" }}
                      </button>
                      <button @click="cancelDarkModeChange" :disabled="savingDarkMode" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">Cancel</button>
                    </div>
                    <div v-if="darkModeSaveSuccess" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <i class="pi pi-check-circle text-green-600 mr-2"></i>
                      <span class="text-green-700">Appearance settings saved successfully!</span>
                    </div>
                    <div v-if="darkModeSaveError" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
                      <span class="text-red-700">{{ darkModeSaveError }}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Right Column - Ads -->
          <div class="md:col-span-2 space-y-6">
            <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm p-4 border border-yellow-200">
              <p class="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-2">
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
                <button class="mt-2 text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  Learn More <i class="pi pi-arrow-right text-xs"></i>
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
import { ref, computed, onBeforeMount } from "vue";
import { getCategoryIcon, getCategoryIconColor } from "~/utils/categoryIcons";

import UserAvatar from "~/components/UserAvatar.vue";
import BadgeToolTip from "~/components/BadgeToolTip.vue";

// ── Only composables still needed ──────────────────────────────────────────
import useUserSummary from "~/composables/useUserSummary";
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";

import type { Ad, EditFormData, UserSummary } from "~/types/user";
import type { PageState } from "primevue";

// ── Setup ──────────────────────────────────────────────────────────────────
const { getUserSummary } = useUserSummary();
const { updateUserProfile, getUserId } = useUserProfileMethods();

const userId = getUserId();
const route = useRoute();

const currentUserId = computed(() => route.params.id as string);

// ── State ──────────────────────────────────────────────────────────────────
const reviewPage = ref(1);
const reviewPageSize = ref(10);
const summary = ref<UserSummary | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const isUser = ref(false);
const activeTab = ref("your-reviews");

// Edit profile
const isEditingProfile = ref(false);
const saving = ref(false);
const saveSuccess = ref(false);
const saveError = ref<string | null>(null);
const editForm = ref<EditFormData>({ username: "", phoneNumber: "", address: "" });

// Notification settings
const notificationSettingsChanged = ref(false);
const savingNotifications = ref(false);
const notificationSaveSuccess = ref(false);
const notificationSaveError = ref<string | null>(null);
const originalNotificationSettings = ref<any>(null);

// Dark mode
const darkModeChanged = ref(false);
const savingDarkMode = ref(false);
const darkModeSaveSuccess = ref(false);
const darkModeSaveError = ref<string | null>(null);
const originalDarkMode = ref<boolean | null>(null);

// Social media
const isEditingSocialMedia = ref(false);
const socialMediaAccounts = ref<Array<{ platform: string; handle: string }>>([{ platform: "", handle: "" }]);
const savingSocialMedia = ref(false);
const socialMediaSaveSuccess = ref(false);
const socialMediaSaveError = ref<string | null>(null);

const ads = ref<Ad[]>([
  { id: 1, business: "Prime Steakhouse", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop", tagline: "Enjoy a fine dining experience" },
  { id: 2, business: "Yoga Sanctuary", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop", tagline: "Let us help you Relax and Unwind." },
]);

const redeemOptions = [
  { label: "$5 Gift Card", cost: 500 },
  { label: "$10 Gift Card", cost: 900 },
  { label: "$20 Gift Card", cost: 1700 },
  { label: "Premium Badge", cost: 1200 },
];

const notificationToggles = [
  { key: "emailNotifications", label: "Email Notifications", subtitle: "Receive updates via email", icon: "pi pi-envelope", bgClass: "bg-blue-100", iconClass: "text-blue-600" },
  { key: "smsNotifications", label: "SMS Notifications", subtitle: "Receive alerts via text message", icon: "pi pi-mobile", bgClass: "bg-green-100", iconClass: "text-green-600" },
  { key: "pushNotifications", label: "Push Notifications", subtitle: "Receive push notifications in browser", icon: "pi pi-send", bgClass: "bg-purple-100", iconClass: "text-purple-600" },
  { key: "marketingEmails", label: "Marketing Emails", subtitle: "Receive promotional offers and updates", icon: "pi pi-megaphone", bgClass: "bg-orange-100", iconClass: "text-orange-600" },
];

// ── Computed ───────────────────────────────────────────────────────────────
const cleanUsername = computed(() =>
  (summary.value?.profile.username || "").replace(/_\d+$/, "").trim()
);
const firstName = computed(() => cleanUsername.value.split(" ")[0] || "");
const lastName = computed(() => cleanUsername.value.split(" ").slice(1).join(" ") || "");

const totalBadgeCount = computed(() => {
  if (!summary.value) return 0;
  return (summary.value.tierBadge ? 1 : 0) + summary.value.achievementBadges.length;
});

/** Map raw API reviews → display shape (no separate enrichment call needed) */
const mappedReviews = computed(() => {
  if (!summary.value) return [];
  return summary.value.reviews.items.map((r) => {
    const [city, state] = (r.businessAddress || "").split(",").map((s) => s.trim());
    const isGrayedOut = r.status === "REJECTED" || r.status === "PENDING";
    return {
      id: r.id,
      businessId: r.businessId,
      businessName: r.name,
      logo: r.logo,
      businessAddress: formatBusinessAddress(city ?? "", state ?? "", r.businessAddress || ""),
      businessCity: city || "",
      businessState: state || "",
      body: r.reviewBody,
      rating: r.starRating,
      date: r.createdAt,
      rawStatus: r.status,
      status: r.status,
      isGrayedOut,
      photoUrls: r.photoUrls,
      reviewAsAnon: r.reviewAsAnon,
      isGuestReview: r.isGuestReview,
      validatedAt: r.validatedAt,
      createdAt: r.createdAt,
    };
  });
});

const topCategories = computed(() => {
  if (!summary.value) return [];
  return summary.value.topCategories.map((cat) => ({
    ...cat,
    icon: getCategoryIcon(cat.categoryName),
    color: getCategoryIconColor(cat.categoryName),
  }));
});

const topLocations = computed(() => {
  if (!summary.value) return [];
  return summary.value.topCities.map((city) => {
    // If both city and state are "Online", show just "Online"
    const cityName = (city.city || "").trim();
    const stateName = (city.state || "").trim();
    const reviewCount = city.reviewCount ?? 0;

    // If both city and state are "Online", show just "Online"
    if (cityName.toLowerCase() === "online" && stateName.toLowerCase() === "online") {
      return { display: "Online", reviewCount };
    }
    // If state is "Unknown", show just city
    if (stateName === "Unknown") {
      return { display: cityName, reviewCount };
    }
    return { display: `${cityName}, ${stateName}`, reviewCount };
  });
});

const canSaveSocialMedia = computed(() =>
  socialMediaAccounts.value.some((acc) => acc.platform.trim() && acc.handle.trim())
);

// ── Core data fetch ────────────────────────────────────────────────────────
const loadSummary = async (isInitial = false) => {
  if (!currentUserId.value) {
    error.value = "User ID is missing";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const result = await getUserSummary(currentUserId.value, reviewPage.value, reviewPageSize.value, isInitial);
    if (result?.statusCode === 200 && result.data) {
      summary.value = result.data;
      isUser.value = userId === currentUserId.value;

      // Snapshot originals for cancel/reset
      if (summary.value) {
        originalNotificationSettings.value = summary.value.profile.notificationPreferences
          ? JSON.parse(JSON.stringify(summary.value.profile.notificationPreferences))
          : null;
        originalDarkMode.value = summary.value.profile.darkMode ?? null;
      }
    } else {
      error.value = "Failed to load profile";
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || err.message || "Failed to load profile";
  } finally {
    loading.value = false;
  }
};

// ── Profile edit ───────────────────────────────────────────────────────────
const startEdit = () => {
  if (summary.value) {
    editForm.value = {
      username: summary.value.profile.username,
      phoneNumber: summary.value.profile.phone || "",
      address: summary.value.profile.address || "",
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
  saving.value = true;
  saveSuccess.value = false;
  saveError.value = null;
  try {
    const updates: any = {};
    if (editForm.value.username) updates.username = editForm.value.username;
    if (editForm.value.phoneNumber) updates.phone = editForm.value.phoneNumber;
    if (editForm.value.address) updates.address = editForm.value.address;

    const result = await updateUserProfile(currentUserId.value, updates);
    if (result?.statusCode === 200) {
      // Refresh the whole summary to stay in sync
      await loadSummary();
      saveSuccess.value = true;
      setTimeout(() => {
        isEditingProfile.value = false;
        saveSuccess.value = false;
      }, 2000);
    } else {
      saveError.value = "Failed to update profile";
    }
  } catch (err: any) {
    saveError.value = err?.response?.data?.message || err.message || "Failed to save profile";
  } finally {
    saving.value = false;
  }
};

// ── Notification settings ──────────────────────────────────────────────────
const toggleNotification = (key: string) => {
  if (!summary.value?.profile.notificationPreferences) return;
  summary.value.profile.notificationPreferences[key] = !summary.value.profile.notificationPreferences[key];
  checkNotificationChanges();
};

const checkNotificationChanges = () => {
  if (!summary.value?.profile.notificationPreferences || !originalNotificationSettings.value) {
    notificationSettingsChanged.value = false;
    return;
  }
  const cur = summary.value.profile.notificationPreferences;
  const orig = originalNotificationSettings.value;
  notificationSettingsChanged.value =
    cur.emailNotifications !== orig.emailNotifications ||
    cur.smsNotifications !== orig.smsNotifications ||
    cur.pushNotifications !== orig.pushNotifications ||
    cur.marketingEmails !== orig.marketingEmails;
};

const saveNotificationSettings = async () => {
  if (!currentUserId.value || !summary.value) return;
  savingNotifications.value = true;
  notificationSaveSuccess.value = false;
  notificationSaveError.value = null;
  try {
    const result = await updateUserProfile(currentUserId.value, {
      notificationPreferences: summary.value.profile.notificationPreferences,
    });
    if (result?.statusCode === 200) {
      originalNotificationSettings.value = JSON.parse(JSON.stringify(summary.value.profile.notificationPreferences));
      notificationSettingsChanged.value = false;
      notificationSaveSuccess.value = true;
      setTimeout(() => { notificationSaveSuccess.value = false; }, 3000);
    } else {
      notificationSaveError.value = "Failed to save notification settings";
    }
  } catch (err: any) {
    notificationSaveError.value = err?.response?.data?.message || "Failed to save settings";
  } finally {
    savingNotifications.value = false;
  }
};

const cancelNotificationChanges = () => {
  if (!summary.value || !originalNotificationSettings.value) return;
  summary.value.profile.notificationPreferences = JSON.parse(JSON.stringify(originalNotificationSettings.value));
  notificationSettingsChanged.value = false;
  notificationSaveError.value = null;
};

// ── Dark mode ──────────────────────────────────────────────────────────────
const toggleDarkMode = () => {
  if (!summary.value) return;
  summary.value.profile.darkMode = !summary.value.profile.darkMode;
  darkModeChanged.value = summary.value.profile.darkMode !== originalDarkMode.value;
};

const saveDarkModeSetting = async () => {
  if (!currentUserId.value || !summary.value) return;
  savingDarkMode.value = true;
  darkModeSaveSuccess.value = false;
  darkModeSaveError.value = null;
  try {
    const result = await updateUserProfile(currentUserId.value, { darkMode: summary.value.profile.darkMode });
    if (result?.statusCode === 200) {
      originalDarkMode.value = summary.value.profile.darkMode;
      darkModeChanged.value = false;
      darkModeSaveSuccess.value = true;
      setTimeout(() => { darkModeSaveSuccess.value = false; }, 3000);
    } else {
      darkModeSaveError.value = "Failed to save dark mode setting";
    }
  } catch (err: any) {
    darkModeSaveError.value = err?.response?.data?.message || "Failed to save setting";
  } finally {
    savingDarkMode.value = false;
  }
};

const cancelDarkModeChange = () => {
  if (!summary.value || originalDarkMode.value === null) return;
  summary.value.profile.darkMode = originalDarkMode.value;
  darkModeChanged.value = false;
  darkModeSaveError.value = null;
};

// ── Social media ───────────────────────────────────────────────────────────
const parseSocialMediaAccounts = (str: string) => {
  if (!str?.trim()) return [];
  return str
    .split("|")
    .map((item) => {
      const [platform, handle] = item.split(":");
      return { platform: platform?.trim() || "", handle: handle?.trim() || "" };
    })
    .filter((acc) => acc.platform && acc.handle);
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
  const current = parseSocialMediaAccounts(summary.value?.profile.socialMedia || "");
  socialMediaAccounts.value = current.length ? current : [{ platform: "", handle: "" }];
  isEditingSocialMedia.value = true;
  socialMediaSaveSuccess.value = false;
  socialMediaSaveError.value = null;
};

const cancelEditSocialMedia = () => {
  isEditingSocialMedia.value = false;
  socialMediaAccounts.value = [{ platform: "", handle: "" }];
};

const addSocialMediaAccount = () => {
  socialMediaAccounts.value.push({ platform: "", handle: "" });
};

const removeSocialMediaAccount = (idx: number) => {
  socialMediaAccounts.value.splice(idx, 1);
  if (!socialMediaAccounts.value.length) socialMediaAccounts.value = [{ platform: "", handle: "" }];
};

const saveSocialMedia = async () => {
  if (!currentUserId.value) return;
  savingSocialMedia.value = true;
  socialMediaSaveSuccess.value = false;
  socialMediaSaveError.value = null;
  try {
    const socialMediaString = socialMediaAccounts.value
      .filter((acc) => acc.platform.trim() && acc.handle.trim())
      .map((acc) => `${acc.platform}:${acc.handle}`)
      .join("|");

    const result = await updateUserProfile(currentUserId.value, { socialMedia: socialMediaString });
    if (result?.statusCode === 200) {
      if (summary.value) summary.value.profile.socialMedia = socialMediaString;
      socialMediaSaveSuccess.value = true;
      setTimeout(() => {
        isEditingSocialMedia.value = false;
        socialMediaSaveSuccess.value = false;
      }, 2000);
    } else {
      socialMediaSaveError.value = "Failed to save social media accounts";
    }
  } catch (err: any) {
    socialMediaSaveError.value = err?.response?.data?.message || "Failed to save";
  } finally {
    savingSocialMedia.value = false;
  }
};

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;
};

const getStatusIcon = (status: string) => {
  const map: Record<string, { icon: string; color: string; title: string; message: string }> = {
    APPROVED: { icon: "pi-check-circle", color: "text-green-600", title: "Published", message: "Your review is live and visible to everyone" },
    PENDING: { icon: "pi-clock", color: "text-gray-600", title: "Pending Review", message: "Being reviewed by our team" },
    REJECTED: { icon: "pi-times-circle", color: "text-red-600", title: "Not Approved", message: "Did not meet community guidelines" },
    FLAGGED: { icon: "pi-flag", color: "text-orange-600", title: "Flagged", message: "Under review for potential issues" },
  };
  return map[status] ?? map["PENDING"]!;
};

const getTierColor = (tier: string): string => {
  const colors: Record<string, string> = {
    newbie: 'bg-green-100',
    bronze: 'bg-orange-100',
    silver: 'bg-gray-100',
    expert: 'bg-yellow-100',
    platinum: 'bg-blue-100',
    pro: 'bg-teal-100',
  };
  return colors[tier?.toLowerCase()] || 'bg-gray-100';
};

const getAchievementColor = (badgeType: string): string => {
  const colors: Record<string, string> = {
    pioneer: 'bg-yellow-100',
    explorer: 'bg-blue-100',
    reviewer: 'bg-green-100',
    influencer: 'bg-purple-100',
  };
  return colors[badgeType?.toLowerCase()] || 'bg-gray-100';
};

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = "/images/default-business-logo.png";
};

const s = (n: number | null | undefined) => (n === 1 ? "" : "s");

const formatBusinessAddress = (city: string, state: string, address?: string) => {
  const isOnline = city?.toLowerCase() === "online" && state?.toLowerCase() === "online";
  if (isOnline) return "Online";
  if (state === "Unknown" || !state) return address ? `${address}, ${city}` : city;
  if (!city) return state;
  if (!address) return `${city}, ${state}`;
  return `${address}`;
};

// ── Lifecycle ──────────────────────────────────────────────────────────────
const onReviewPageChange = async (event: PageState) => {
  reviewPage.value = event.page + 1;
  reviewPageSize.value = event.rows;
  await loadSummary(false);
};

onBeforeMount(async () => {
  await loadSummary(true);
});
</script>