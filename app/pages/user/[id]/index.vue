<template>
  <div class="min-h-screen bg-green-50">
    <NavBarProfile />

    <!-- Loading State -->
    <div v-if="loading && !summary" class="flex items-center justify-center min-h-screen">
      <GeneralLoader />
    </div>

    <!-- Error State -->
    <div v-else-if="error && !summary" class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="pi pi-exclamation-triangle text-4xl text-red-600 mb-4"></i>
        <h3 class="text-lg font-semibold text-red-800 mb-2">Failed to Load Profile</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="loadSummary(false)" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
          Try Again
        </button>
      </div>
    </div>

    <!-- Edit Profile View -->
    <div v-else-if="isEditingProfile && summary" class="max-w-2xl mx-auto px-4 py-8">
      <div class="mb-6">
        <button @click="cancelEdit" class="text-gray-700 font-medium flex items-center gap-2 hover:text-gray-900">
          <i class="pi pi-arrow-left"></i>
          <span>Back to Profile</span>
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-8 space-y-3">
        <div class="flex gap-5 items-center">
          <UserAvatar :firstName="firstName" :lastName="lastName" :size="100" />
          <div class="flex flex-col gap-1">
            <span class="font-medium text-gray-500"><i class="pi pi-user mr-2"></i> Username:</span>
            <span class="text-lg font-semibold text-gray-700">{{ cleanUsername }}</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-phone mr-2"></i>Phone Number
          </label>
          <input v-model="editForm.phoneNumber" type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-home mr-2"></i>Address
          </label>
          <input v-model="editForm.address" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent" />
        </div>
        <div class="pt-2 flex gap-3 justify-center items-center">
          <button @click="handleSaveProfile" :disabled="saving" class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            <i v-if="saving" class="pi pi-spin pi-spinner mr-2"></i>
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
          <button @click="cancelEdit" :disabled="saving" class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50">
            Cancel
          </button>
        </div>
        <div v-if="saveSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <i class="pi pi-check-circle text-green-600 mr-2"></i>
          <span class="text-green-700">Profile updated successfully!</span>
        </div>
        <div v-if="saveError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
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
                  <span class="font-medium text-gray-900">{{ summary.reviews.totalCount }}</span> Total Review{{ s(summary.reviews.totalCount) }}
                </span>
                <span class="px-3">
                  <span class="font-medium text-gray-900">{{ summary.points }}</span> Point{{ s(summary.points) }}
                </span>
                <span class="px-3">
                  <span class="font-medium text-gray-900">{{ summary.streak }}</span> Streak{{ s(summary.streak) }}
                </span>
              </div>
              <div v-if="isUser" class="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-gray-600 text-sm sm:text-base">
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
            <button v-if="isUser" @click="startEdit" class="mt-2 border rounded-md py-3 px-4 hover:text-[#008253] flex items-center gap-2 justify-center md:justify-start">
              <i class="pi pi-pencil md:text-base text-xs"></i>
              <span class="md:text-base text-xs">Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Menu Bar (Desktop/Tablet) -->
      <div v-if="isUser" class="bg-white border-b border-gray-200 sticky top-16 z-40 hidden sm:block">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-3 py-4">
            <button @click="activeTab = 'your-reviews'" :class="['px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2', activeTab === 'your-reviews' ? 'bg-[#008253] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
              <i class="pi pi-star"></i> Your Reviews
            </button>
            <button @click="activeTab = 'rewards'" :class="['px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2', activeTab === 'rewards' ? 'bg-[#008253] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
              <i class="pi pi-gift"></i> Rewards
            </button>
            <button @click="activeTab = 'notifications'" :class="['px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2', activeTab === 'notifications' ? 'bg-[#008253] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
              <i class="pi pi-bell"></i> Notifications
            </button>
            <button @click="activeTab = 'settings'" :class="['px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2', activeTab === 'settings' ? 'bg-[#008253] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
              <i class="pi pi-cog"></i> Settings
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
                <p class="text-sm">{{ isUser ? "You haven't earned any badges yet" : "No badges earned yet" }}</p>
                <p v-if="isUser" class="text-xs text-gray-400 mt-2">Keep reviewing to unlock badges!</p>
              </div>
              <div v-else class="space-y-3">
                <BadgeToolTip v-if="summary.tierBadge" :name="summary.tierBadge.badgeType" :icon="summary.tierBadge.icon" :color="getTierColor(summary.tierBadge.badgeType)" :description="summary.tierBadge.description" />
                <BadgeToolTip v-for="(badge, idx) in summary.achievementBadges" :key="idx" :name="badge.badgeType" :icon="badge.icon" :color="getAchievementColor(badge.badgeType)" :description="badge.description" />
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
            <div v-if="isUser" class="sm:hidden bg-white border-b border-gray-200 mb-6 -mx-4 px-4">
              <div class="flex justify-between py-4">
                <button @click="activeTab = 'your-reviews'" :class="['px-4 py-2 rounded-lg font-medium transition text-sm', activeTab === 'your-reviews' ? 'bg-[#008253] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
                  <i class="pi pi-star"></i>
                </button>
                <button @click="activeTab = 'rewards'" :class="['px-4 py-2 rounded-lg font-medium transition text-sm', activeTab === 'rewards' ? 'bg-[#008253] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
                  <i class="pi pi-gift"></i>
                </button>
                <button @click="activeTab = 'notifications'" :class="['px-4 py-2 rounded-lg font-medium transition text-sm', activeTab === 'notifications' ? 'bg-[#008253] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
                  <i class="pi pi-bell"></i>
                </button>
                <button v-if="isUser" @click="activeTab = 'settings'" :class="['px-4 py-2 rounded-lg font-medium transition text-sm', activeTab === 'settings' ? 'bg-[#008253] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
                  <i class="pi pi-cog"></i>
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">

              <!-- ── YOUR REVIEWS TAB ── -->
              <div v-if="activeTab === 'your-reviews'" class="space-y-6">
                <h2 class="md:text-2xl text-xl font-bold text-[#008253]">
                  <span v-if="isUser" class="md:text-2xl text-xl font-bold text-[#008253]">Your</span> Reviews
                </h2>

                <div v-if="isUser && mappedReviews.length === 0" class="text-center py-12">
                  <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
                  <h3 class="text-lg font-medium text-gray-700 mb-2">Ready to write your first review?</h3>
                  <NuxtLink to="/review/write-review" class="inline-block mt-4 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium">
                    Click here to get started
                  </NuxtLink>
                </div>

                <div v-else-if="!isUser && mappedReviews.length === 0" class="text-center py-12">
                  <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
                  <h3 class="text-base font-normal text-gray-700 mb-2">This member hasn't written any reviews on CleReview yet</h3>
                </div>

                <div v-else class="space-y-4">
                  <div
                    v-for="review in mappedReviews"
                    :key="review.id"
                    :class="['border rounded-lg p-4 transition-all', review.isGrayedOut ? 'border-gray-200 bg-gray-50/50 opacity-75' : 'border-gray-200 bg-white hover:shadow-md']"
                  >
                    <div class="flex md:flex-row flex-col justify-between items-start gap-4 relative">
                      <div class="flex gap-3 flex-1">
                        <div class="flex-shrink-0">
                          <img :src="review.logo || '/images/default-business-logo.png'" :alt="review.businessName" :class="['w-14 h-14 rounded-lg object-cover border border-gray-200', review.isGrayedOut && 'opacity-50']" @error="handleImageError" />
                        </div>
                        <div class="flex flex-col gap-2">
                          <h2 :class="['text-base font-semibold truncate whitespace-normal m-0 p-0', review.isGrayedOut ? 'text-gray-500' : 'text-gray-800']">{{ review.businessName }}</h2>
                          <p :class="['text-xs truncate', review.isGrayedOut ? 'text-gray-400' : 'text-gray-500']">{{ review.businessAddress }}</p>
                        </div>
                      </div>
                      <div class="flex md:flex-col items-end gap-2 flex-shrink-0">
                        <div class="flex items-center">
                          <Stars v-for="n in 5" :key="n" :filled="n <= review.rating" :colorLevel="n <= review.rating ? Math.round(review.rating) : 0" :class="['w-4 h-4', review.isGrayedOut && 'opacity-50']" />
                        </div>
                        <span :class="['text-xs', review.isGrayedOut ? 'text-gray-400' : 'text-gray-600']">{{ formatDateShort(review.date) }}</span>
                      </div>
                      <div class="absolute group right-[-22px] top-[-22px] bg-white">
                        <i :class="['pi text-2xl cursor-help', getStatusIcon(review.rawStatus).icon, getStatusIcon(review.rawStatus).color]"></i>
                        <div class="absolute right-0 top-full mt-1 hidden group-hover:block z-10 w-48">
                          <div class="bg-white text-gray-500 leading-relaxed text-xs rounded-lg px-3 py-2 shadow-lg">
                            <p class="text-gray-500 text-xs">{{ getStatusIcon(review.rawStatus).message }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <p :class="['text-sm leading-relaxed', review.isGrayedOut ? 'text-gray-500' : 'text-gray-700']">{{ review.body }}</p>
                    </div>
                    <div v-if="review.photoUrls && review.photoUrls.length > 0" class="mt-4">
                      <div class="flex gap-2 flex-wrap">
                        <img v-for="(photo, idx) in review.photoUrls" :key="idx" :src="photo" alt="Review photo" :class="['w-20 h-20 object-cover rounded-lg border border-gray-200', review.isGrayedOut && 'opacity-50']" />
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

              <!-- ── REWARDS TAB ── -->
              <div v-if="activeTab === 'rewards'" class="rewards-tab">

                <!-- Points Hero -->
                <div class="points-hero">
                  <div class="hero-bg-circles">
                    <div class="circle c1"></div>
                    <div class="circle c2"></div>
                    <div class="circle c3"></div>
                  </div>
                  <div class="hero-content">
                    <p class="hero-label">Total Balance</p>
                    <div class="hero-points">
                      <span class="points-number">{{ summary.points }}</span>
                      <span class="points-unit">pts</span>
                    </div>
                    <div class="hero-meta">
                      <div class="meta-pill meta-pill--gold">
                        <i class="pi pi-crown"></i>
                        <span>{{ capitalize(summary.pointTier) }} Tier</span>
                      </div>
                      <div class="meta-pill meta-pill--gold">
                        <i class="pi pi-chart-line"></i>
                        <span>Rank #{{ summary.rank }}</span>
                      </div>
                      <div class="meta-pill">
                        <i class="pi pi-bolt"></i>
                        <span>{{ summary.streak }} day streak</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Points Breakdown -->
                <section class="r-section">
                  <h3 class="r-section-title">
                    <i class="pi pi-star-fill" style="color:#f59e0b"></i>
                    How You've Earned
                  </h3>
                  <div class="breakdown-grid">

                    <div class="breakdown-card" @mouseenter="activeTip = 'review'" @mouseleave="activeTip = null">
                      <div class="bcard-icon" style="background:#dcfce7; color:#16a34a"><i class="pi pi-comment"></i></div>
                      <div class="bcard-body">
                        <p class="bcard-label">Review Points</p>
                        <p class="bcard-value">{{ summary.reviewPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon"><i class="pi pi-info-circle"></i></div>
                      <Transition name="tip-fade">
                        <div v-if="activeTip === 'review'" class="tooltip-bubble">
                          <p class="tip-title">📝 Review Rewards</p>
                          <p class="tip-body">Earn <em>2–15 points</em> per review based on quality, length, and photos added.</p>
                        </div>
                      </Transition>
                    </div>

                    <div class="breakdown-card" @mouseenter="activeTip = 'streak'" @mouseleave="activeTip = null">
                      <div class="bcard-icon" style="background:#fef3c7; color:#d97706"><i class="pi pi-bolt"></i></div>
                      <div class="bcard-body">
                        <p class="bcard-label">Streak Reward</p>
                        <p class="bcard-value">{{ summary.streakPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon"><i class="pi pi-info-circle"></i></div>
                      <Transition name="tip-fade">
                        <div v-if="activeTip === 'streak'" class="tooltip-bubble">
                          <p class="tip-title">🔥 Streak Reward</p>
                          <p class="tip-body">Reach a <em>100-day streak</em> and get verified to unlock <em>150 bonus points</em>. Current streak: {{ summary.streak }} day{{ summary.streak !== 1 ? 's' : '' }}. Longest: {{ summary.longestStreak }}.</p>
                        </div>
                      </Transition>
                    </div>

                    <div class="breakdown-card" @mouseenter="activeTip = 'referral'" @mouseleave="activeTip = null">
                      <div class="bcard-icon" style="background:#ede9fe; color:#7c3aed"><i class="pi pi-users"></i></div>
                      <div class="bcard-body">
                        <p class="bcard-label">Referral Points</p>
                        <p class="bcard-value">{{ summary.referralPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon"><i class="pi pi-info-circle"></i></div>
                      <Transition name="tip-fade">
                        <div v-if="activeTip === 'referral'" class="tooltip-bubble">
                          <p class="tip-title">👥 Referral Rewards</p>
                          <p class="tip-body">Earn <em>50 points</em> for every friend who signs up and leaves their first review using your code.</p>
                        </div>
                      </Transition>
                    </div>

                    <div class="breakdown-card" @mouseenter="activeTip = 'bonus'" @mouseleave="activeTip = null">
                      <div class="bcard-icon" style="background:#fce7f3; color:#db2777"><i class="pi pi-gift"></i></div>
                      <div class="bcard-body">
                        <p class="bcard-label">Bonus Points</p>
                        <p class="bcard-value">{{ summary.bonusPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon"><i class="pi pi-info-circle"></i></div>
                      <Transition name="tip-fade">
                        <div v-if="activeTip === 'bonus'" class="tooltip-bubble">
                          <p class="tip-title">🎁 Bonus Points</p>
                          <p class="tip-body">Special rewards from promotions, platform events, and milestone achievements. Keep an eye out!</p>
                        </div>
                      </Transition>
                    </div>

                    <div class="breakdown-card" @mouseenter="activeTip = 'other'" @mouseleave="activeTip = null">
                      <div class="bcard-icon" style="background:#e0f2fe; color:#0284c7"><i class="pi pi-thumbs-up"></i></div>
                      <div class="bcard-body">
                        <p class="bcard-label">Extra Points</p>
                        <p class="bcard-value">{{ summary.otherPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon"><i class="pi pi-info-circle"></i></div>
                      <Transition name="tip-fade">
                        <div v-if="activeTip === 'other'" class="tooltip-bubble">
                          <p class="tip-title">🤝 Community Points</p>
                          <p class="tip-body">Earned through helpful actions like voting on reviews, completing your profile, and other community contributions.</p>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </section>

                <!-- Referral -->
                <section class="r-section">
                  <h3 class="r-section-title">
                    <i class="pi pi-users" style="color:#7c3aed"></i>
                    Refer a Friend
                  </h3>
                  <div class="referral-card">
                    <div class="referral-left">
                      <p class="referral-headline">Share your code, earn together</p>
                      <p class="referral-sub">Get <em>50 points</em> for every friend who signs up and writes their first review.</p>
                      <div class="referral-code-row">
                        <div class="code-badge">
                          <span class="code-text">{{ summary.referral.code }}</span>
                        </div>
                        <button class="copy-btn" @click="copyReferralCode" :class="{ copied: codeCopied }">
                          <i :class="codeCopied ? 'pi pi-check' : 'pi pi-copy'"></i>
                          {{ codeCopied ? 'Copied!' : 'Copy Code' }}
                        </button>
                      </div>
                    </div>
                    <div class="referral-stats">
                      <div class="ref-stat">
                        <span class="ref-stat-val">{{ summary.referral.totalReferrals }}</span>
                        <span class="ref-stat-label">Total</span>
                      </div>
                      <div class="ref-stat-divider"></div>
                      <div class="ref-stat">
                        <span class="ref-stat-val" style="color:#16a34a">{{ summary.referral.successfulReferrals }}</span>
                        <span class="ref-stat-label">Successful</span>
                      </div>
                      <div class="ref-stat-divider"></div>
                      <div class="ref-stat">
                        <span class="ref-stat-val" style="color:#d97706">{{ summary.referral.pendingReferrals }}</span>
                        <span class="ref-stat-label">Pending</span>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Redeem Points -->
                <section class="r-section">
                  <h3 class="r-section-title">
                    <i class="pi pi-dollar" style="color:#16a34a"></i>
                    Redeem Points
                  </h3>

                  <!-- Locked -->
                  <div v-if="summary.points < 500" class="redeem-locked">
                    <div class="lock-icon md-block hidden">🔒</div>
                    <div class="lock-text">
                      <p class="lock-title"><div class="lock-icon md-hidden block">🔒</div>You need at least 500 points to redeem</p>
                      <p class="lock-sub">You have <strong>{{ summary.points }}</strong> pts — {{ 500 - summary.points }} more to go!</p>
                      <div class="progress-bar-wrap">
                        <div class="progress-bar-track">
                          <div class="progress-bar-fill" :style="{ width: Math.min((summary.points / 500) * 100, 100) + '%' }"></div>
                        </div>
                        <span class="progress-label">{{ summary.points }} / 500</span>
                      </div>
                    </div>
                  </div>

                  <!-- Redeem Options -->
                  <div v-else class="redeem-options">
                    <div
                      v-for="option in redeemCards"
                      :key="option.label"
                      class="redeem-option-card"
                      :class="{ selected: selectedRedeemOption?.label === option.label, disabled: summary.points < option.cost }"
                      @click="selectRedeemOption(option)"
                    >
                      <div class="option-header">
                        <span class="option-emoji">{{ option.emoji }}</span>
                        <div class="option-info">
                          <p class="option-label">{{ option.label }}</p>
                          <p class="option-cost"><span class="cost-num">{{ option.cost }}</span> points</p>
                        </div>
                        <div class="option-check" :class="{ visible: selectedRedeemOption?.label === option.label }">
                          <i class="pi pi-check"></i>
                        </div>
                      </div>
                      <p class="option-desc">{{ option.desc }}</p>
                      <p v-if="summary.points < option.cost" class="option-shortage">Need {{ option.cost - summary.points }} more points</p>
                    </div>

                    <!-- Coupon coming soon -->
                    <div class="redeem-option-card coming-soon-card">
                      <div class="option-header">
                        <span class="option-emoji">🎟️</span>
                        <div class="option-info">
                          <p class="option-label">Coupon Code</p>
                          <p class="option-cost">Various amounts</p>
                        </div>
                        <span class="coming-soon-badge">Soon</span>
                      </div>
                      <p class="option-desc">Redeem your points for discount coupons to use on partner platforms.</p>
                    </div>
                  </div>

                  <!-- Redeem Form -->
                  <Transition name="form-slide">
                    <div v-if="selectedRedeemOption && summary.points >= 500" class="redeem-form-wrap">
                      <div class="redeem-form">
                        <p class="form-title">Redeem <strong>{{ selectedRedeemOption.cost }} points</strong> as airtime</p>

                        <div class="network-selector">
                          <button
                            v-for="net in networks"
                            :key="net.name"
                            class="net-btn"
                            :class="{ active: selectedNetwork === net.name }"
                            :style="{ '--net-color': net.color }"
                            @click="selectedNetwork = net.name"
                          >
                            <span class="net-icon">{{ net.emoji }}</span>
                            <span class="net-name">{{ net.name }}</span>
                          </button>
                        </div>

                        <div>
                          <label class="phone-label">Phone Number</label>
                          <input v-model="redeemPhone" type="tel" placeholder="e.g. 08012345678" class="phone-input" maxlength="11" />
                        </div>

                        <div class="redeem-summary-row">
                          <span>You'll receive:</span>
                          <strong>₦{{ selectedRedeemOption.naira }} airtime</strong>
                        </div>

                        <button class="redeem-submit-btn" :disabled="!canRedeem || redeeming" @click="handleRedeem">
                          <i v-if="redeeming" class="pi pi-spin pi-spinner"></i>
                          <i v-else class="pi pi-credit-card"></i>
                          {{ redeeming ? 'Processing...' : 'Confirm Redemption' }}
                        </button>

                        <button class="redeem-cancel-btn" @click="cancelRedeem" :disabled="redeeming">Cancel</button>

                        <div v-if="redeemError" class="redeem-msg error">
                          <i class="pi pi-exclamation-triangle"></i> {{ redeemError = "Request Failed" }}
                        </div>
                        <div v-if="redeemSuccess" class="redeem-msg success">
                          <i class="pi pi-check-circle"></i> {{ redeemSuccess }}
                        </div>
                      </div>
                    </div>
                  </Transition>
                </section>

                <!-- Recent Activity -->
                <!-- <section v-if="summary.recentActivity?.length" class="r-section">
                  <h3 class="r-section-title">
                    <i class="pi pi-clock" style="color:#0284c7"></i>
                    Recent Activity
                  </h3>
                  <div class="activity-list">
                    <div v-for="(act, i) in summary.recentActivity" :key="i" class="activity-row">
                      <div class="act-icon"><i class="pi pi-plus-circle" style="color:#16a34a"></i></div>
                      <div class="act-body">
                        <p class="act-desc">{{ formatActivityDesc(act.description) }}</p>
                        <p class="act-date">{{ formatDateShort(act.createdAt) }}</p>
                      </div>
                      <span class="act-points">+{{ act.points }} pts</span>
                    </div>
                  </div>
                </section> -->

              </div>

              <!-- ── NOTIFICATIONS TAB ── -->
              <div v-if="isUser && activeTab === 'notifications'" class="text-center py-12">
                <i class="pi pi-bell text-6xl text-gray-300 mb-4"></i>
                <h2 class="text-2xl font-bold text-[#008253] mb-2">Notifications</h2>
                <p class="text-gray-500">Nothing new yet</p>
              </div>

              <!-- ── SETTINGS TAB ── -->
              <div v-if="activeTab === 'settings'" class="space-y-6">
                <h2 class="text-2xl font-bold text-[#008253]">Settings</h2>

                <!-- Social Media -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <i class="pi pi-share-alt text-[#008253]"></i> Social Media
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">Connect your social media accounts</p>
                  </div>
                  <div class="p-6">
                    <div v-if="!isEditingSocialMedia" class="space-y-4">
                      <div v-if="summary.profile.socialMedia && summary.profile.socialMedia.trim() && summary.profile.socialMedia !== 'Registered via Google'">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Connected Accounts</label>
                        <div class="space-y-2">
                          <div v-for="(account, idx) in parseSocialMediaAccounts(summary.profile.socialMedia)" :key="idx" class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div class="flex items-center gap-3">
                              <i :class="getSocialMediaIcon(account.platform)" class="text-xl"></i>
                              <div>
                                <p class="text-xs text-gray-500 font-medium">{{ account.platform }}</p>
                                <p class="text-gray-700">{{ account.handle }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button @click="startEditSocialMedia" class="mt-3 text-[#008253] hover:text-[#006641] flex items-center gap-1 text-sm font-medium">
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
                    <div v-else class="space-y-4">
                      <div v-for="(account, idx) in socialMediaAccounts" :key="idx" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="space-y-3">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                            <select v-model="account.platform" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent">
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
                            <input v-model="account.handle" type="text" :placeholder="getSocialMediaPlaceholder(account.platform)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent" />
                          </div>
                          <button v-if="socialMediaAccounts.length > 1" @click="removeSocialMediaAccount(idx)" class="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                            <i class="pi pi-trash text-xs"></i> Remove
                          </button>
                        </div>
                      </div>
                      <button @click="addSocialMediaAccount" class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#008253] hover:text-[#008253] transition flex items-center justify-center gap-2">
                        <i class="pi pi-plus"></i> Add Another Account
                      </button>
                      <div class="flex gap-3 pt-2">
                        <button @click="saveSocialMedia" :disabled="savingSocialMedia || !canSaveSocialMedia" class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                          <i v-if="savingSocialMedia" class="pi pi-spin pi-spinner mr-2"></i>
                          {{ savingSocialMedia ? "Saving..." : "Save Accounts" }}
                        </button>
                        <button @click="cancelEditSocialMedia" :disabled="savingSocialMedia" class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium">Cancel</button>
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
                      <i class="pi pi-bell text-[#008253]"></i> Notification Preferences
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">Manage how you receive notifications</p>
                  </div>
                  <div class="p-6">
                    <div class="space-y-4">
                      <div v-for="notif in notificationToggles" :key="notif.key" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
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
                          <!-- <span :class="['text-sm font-medium', summary.profile.notificationPreferences?.[notif.key] ? 'text-green-600' : 'text-gray-500']">
                            {{ summary.profile.notificationPreferences?.[notif.key] ? 'On' : 'Off' }}
                          </span> -->
                          <!-- <div :class="['w-12 h-6 rounded-full transition-colors cursor-pointer', summary.profile.notificationPreferences?.[notif.key] ? 'bg-[#008253]' : 'bg-gray-300']" @click="toggleNotification(notif.key)">
                            <div :class="['w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5', summary.profile.notificationPreferences?.[notif.key] ? 'translate-x-6' : 'translate-x-0.5']"></div>
                          </div> -->
                        </div>
                      </div>
                    </div>
                    <div v-if="notificationSettingsChanged" class="mt-6 flex gap-3">
                      <button @click="saveNotificationSettings" :disabled="savingNotifications" class="flex-1 bg-[#008253] text-white px-6 py-3 rounded-lg hover:bg-[#006641] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed">
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
                      <i class="pi pi-palette text-[#008253]"></i> Appearance
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
                        <div :class="['w-12 h-6 rounded-full transition-colors cursor-pointer', summary.profile.darkMode ? 'bg-[#008253]' : 'bg-gray-300']" @click="toggleDarkMode">
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
                <i class="pi pi-star"></i> Featured
              </p>
              <div v-for="ad in ads" :key="ad.id" class="mb-4 last:mb-0">
                <img :src="ad.image" :alt="ad.business" class="w-full h-32 object-cover rounded-lg mb-2" @error="handleImageError" />
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
import useUserSummary from "~/composables/useUserSummary";
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";
import type { Ad, EditFormData, UserSummary } from "~/types/user";
import type { PageState } from "primevue";

// ── Setup ──────────────────────────────────────────────────────────────────
const { getUserSummary } = useUserSummary();
const { updateUserProfile, getUserId, redeemPoints } = useUserProfileMethods();

const userId = getUserId();
const route = useRoute();
const currentUserId = computed(() => route.params.id as string);

// ── Core state ─────────────────────────────────────────────────────────────
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

// Rewards tab
const activeTip = ref<string | null>(null);
const codeCopied = ref(false);

// Redeem
const redeemCards = [
  { label: "₦500 Airtime",   cost: 500,  naira: 500,  emoji: "📱", desc: "Top up any Nigerian number with ₦500 airtime instantly." },
  { label: "₦1,000 Airtime", cost: 900,  naira: 1000, emoji: "📲", desc: "Get ₦1,000 airtime — a great value redemption." },
  { label: "₦2,000 Airtime", cost: 1700, naira: 2000, emoji: "💰", desc: "Big top-up! ₦2,000 airtime delivered to your number." },
];
const networks = [
  { name: "MTN",     emoji: "🟡", color: "#f59e0b" },
  { name: "Airtel",  emoji: "🔴", color: "#ef4444" },
  { name: "Glo",     emoji: "🟢", color: "#16a34a" },
  { name: "9mobile", emoji: "🟤", color: "#854d0e" },
];
const selectedRedeemOption = ref<typeof redeemCards[number] | null>(null);
const selectedNetwork = ref("");
const redeemPhone = ref("");
const redeeming = ref(false);
const redeemError = ref<string | null>(null);
const redeemSuccess = ref<string | null>(null);

const ads = ref<Ad[]>([
  { id: 1, business: "Prime Steakhouse", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop", tagline: "Enjoy a fine dining experience" },
  { id: 2, business: "Yoga Sanctuary",   image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop", tagline: "Let us help you Relax and Unwind." },
]);

const notificationToggles = [
  { key: "emailNotifications", label: "Email Notifications",  subtitle: "Receive updates via email",                   icon: "pi pi-envelope",  bgClass: "bg-blue-100",   iconClass: "text-blue-600" },
  { key: "smsNotifications",   label: "SMS Notifications",    subtitle: "Receive alerts via text message",              icon: "pi pi-mobile",    bgClass: "bg-green-100",  iconClass: "text-green-600" },
  { key: "pushNotifications",  label: "Push Notifications",   subtitle: "Receive push notifications in browser",        icon: "pi pi-send",      bgClass: "bg-purple-100", iconClass: "text-purple-600" },
  { key: "marketingEmails",    label: "Marketing Emails",     subtitle: "Receive promotional offers and updates",       icon: "pi pi-megaphone", bgClass: "bg-orange-100", iconClass: "text-orange-600" },
];

// ── Computed ───────────────────────────────────────────────────────────────
const cleanUsername = computed(() =>
  (summary.value?.profile.username || "").replace(/_\d+$/, "").trim()
);
const firstName = computed(() => cleanUsername.value.split(" ")[0] || "");
const lastName  = computed(() => cleanUsername.value.split(" ").slice(1).join(" ") || "");

const totalBadgeCount = computed(() => {
  if (!summary.value) return 0;
  return (summary.value.tierBadge ? 1 : 0) + summary.value.achievementBadges.length;
});

const mappedReviews = computed(() => {
  if (!summary.value) return [];
  return summary.value.reviews.items.map((r) => {
    const [city, state] = (r.businessAddress || "").split(",").map((p) => p.trim());
    const isGrayedOut = r.status === "REJECTED" || r.status === "PENDING";
    return {
      id: r.id,
      businessId: r.businessId,
      businessName: r.name,
      logo: r.logo,
      businessAddress: formatBusinessAddress(city ?? "", state ?? "", r.businessAddress || ""),
      body: r.reviewBody,
      rating: r.starRating,
      date: r.createdAt,
      rawStatus: r.status,
      isGrayedOut,
      photoUrls: r.photoUrls,
      reviewAsAnon: r.reviewAsAnon,
      isGuestReview: r.isGuestReview,
      validatedAt: r.validatedAt,
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
    const cityName  = (city.city  || "").trim();
    const stateName = (city.state || "").trim();
    const reviewCount = city.reviewCount ?? 0;
    if (cityName.toLowerCase() === "online" && stateName.toLowerCase() === "online") return { display: "Online", reviewCount };
    if (stateName === "Unknown") return { display: cityName, reviewCount };
    return { display: `${cityName}, ${stateName}`, reviewCount };
  });
});

const canSaveSocialMedia = computed(() =>
  socialMediaAccounts.value.some((acc) => acc.platform.trim() && acc.handle.trim())
);

const canRedeem = computed(() =>
  !!selectedRedeemOption.value && !!selectedNetwork.value && redeemPhone.value.length >= 10
);

// ── Data fetch ─────────────────────────────────────────────────────────────
const loadSummary = async (isInitial = false) => {
  if (!currentUserId.value) { error.value = "User ID is missing"; return; }
  loading.value = true;
  error.value = null;
  try {
    const result = await getUserSummary(currentUserId.value, reviewPage.value, reviewPageSize.value, isInitial);
    if (result?.statusCode === 200 && result.data) {
      summary.value = result.data;
      isUser.value = userId === currentUserId.value;
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
    if (editForm.value.username)    updates.username = editForm.value.username;
    if (editForm.value.phoneNumber) updates.phone    = editForm.value.phoneNumber;
    if (editForm.value.address)     updates.address  = editForm.value.address;
    const result = await updateUserProfile(currentUserId.value, updates);
    if (result?.statusCode === 200) {
      await loadSummary();
      saveSuccess.value = true;
      setTimeout(() => { isEditingProfile.value = false; saveSuccess.value = false; }, 2000);
    } else {
      saveError.value = "Failed to update profile";
    }
  } catch (err: any) {
    saveError.value = err?.response?.data?.message || err.message || "Failed to save profile";
  } finally {
    saving.value = false;
  }
};

// ── Notifications ──────────────────────────────────────────────────────────
const toggleNotification = (key: string) => {
  if (!summary.value?.profile.notificationPreferences) return;
  (summary.value.profile.notificationPreferences as any)[key] = !(summary.value.profile.notificationPreferences as any)[key];
  checkNotificationChanges();
};

const checkNotificationChanges = () => {
  if (!summary.value?.profile.notificationPreferences || !originalNotificationSettings.value) {
    notificationSettingsChanged.value = false;
    return;
  }
  const cur  = summary.value.profile.notificationPreferences as any;
  const orig = originalNotificationSettings.value;
  notificationSettingsChanged.value =
    cur.emailNotifications !== orig.emailNotifications ||
    cur.smsNotifications   !== orig.smsNotifications   ||
    cur.pushNotifications  !== orig.pushNotifications  ||
    cur.marketingEmails    !== orig.marketingEmails;
};

const saveNotificationSettings = async () => {
  if (!currentUserId.value || !summary.value) return;
  savingNotifications.value = true;
  notificationSaveSuccess.value = false;
  notificationSaveError.value = null;
  try {
    const result = await updateUserProfile(currentUserId.value, { notificationPreferences: summary.value.profile.notificationPreferences });
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
  return str.split("|").map((item) => {
    const [platform, handle] = item.split(":");
    return { platform: platform?.trim() || "", handle: handle?.trim() || "" };
  }).filter((acc) => acc.platform && acc.handle);
};

const getSocialMediaIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    WhatsApp:     "pi pi-whatsapp text-green-600",
    Instagram:    "pi pi-instagram text-pink-600",
    Snapchat:     "pi pi-snapchat text-yellow-500",
    "X (Twitter)":"pi pi-twitter text-blue-400",
    Facebook:     "pi pi-facebook text-blue-600",
    LinkedIn:     "pi pi-linkedin text-blue-700",
    TikTok:       "pi pi-tiktok text-gray-800",
    YouTube:      "pi pi-youtube text-red-600",
    Telegram:     "pi pi-telegram text-blue-500",
  };
  return icons[platform] || "pi pi-link text-gray-600";
};

const getSocialMediaPlaceholder = (platform: string): string => {
  const placeholders: Record<string, string> = {
    WhatsApp:     "+234 123 456 7890",
    Instagram:    "@username",
    Snapchat:     "@username",
    "X (Twitter)":"@username",
    Facebook:     "facebook.com/username",
    LinkedIn:     "linkedin.com/in/username",
    TikTok:       "@username",
    YouTube:      "@channelname",
    Telegram:     "@username",
    Other:        "Username or link",
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

const addSocialMediaAccount    = () => { socialMediaAccounts.value.push({ platform: "", handle: "" }); };
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
      setTimeout(() => { isEditingSocialMedia.value = false; socialMediaSaveSuccess.value = false; }, 2000);
    } else {
      socialMediaSaveError.value = "Failed to save social media accounts";
    }
  } catch (err: any) {
    socialMediaSaveError.value = err?.response?.data?.message || "Failed to save";
  } finally {
    savingSocialMedia.value = false;
  }
};

// ── Rewards helpers ────────────────────────────────────────────────────────
const copyReferralCode = async () => {
  try {
    await navigator.clipboard.writeText(summary.value?.referral.code || "");
    codeCopied.value = true;
    setTimeout(() => { codeCopied.value = false; }, 2000);
  } catch { /* fallback silently */ }
};

const selectRedeemOption = (option: typeof redeemCards[number]) => {
  if (!summary.value || summary.value.points < option.cost) return;
  selectedRedeemOption.value = option;
  redeemError.value = null;
  redeemSuccess.value = null;
};

const cancelRedeem = () => {
  selectedRedeemOption.value = null;
  selectedNetwork.value = "";
  redeemPhone.value = "";
  redeemError.value = null;
  redeemSuccess.value = null;
};

const handleRedeem = async () => {
  if (!canRedeem.value || !selectedRedeemOption.value) return;
  redeeming.value = true;
  redeemError.value = null;
  redeemSuccess.value = null;
  try {
    const result = await redeemPoints({
      userId: currentUserId.value,
      points: selectedRedeemOption.value.cost,
      phoneNumber: redeemPhone.value,
    });
    if (result?.statusCode === 200) {
      redeemSuccess.value = `Done! ₦${selectedRedeemOption.value.naira} airtime is on its way to ${redeemPhone.value}.`;
      // Optimistically subtract from local summary
      if (summary.value) summary.value.points -= selectedRedeemOption.value.cost;
      setTimeout(cancelRedeem, 3500);
    } else {
      redeemError.value = result?.data?.message || "Redemption failed. Please try again.";
    }
  } catch (err: any) {
    redeemError.value = err?.response?.data?.message || err.message || "Something went wrong.";
  } finally {
    redeeming.value = false;
  }
};

// ── Generic helpers ────────────────────────────────────────────────────────
const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;
};

const formatActivityDesc = (desc: string): string => {
  if (!desc) return desc;
  const match = desc.match(/Body:\s*([\d.]+),\s*Images:\s*([\d.]+)/);
  if (match) return `Review reward — body: ${match[1]} pts, images: ${match[2]} pts`;
  return desc;
};

const getStatusIcon = (status: string) => {
  const map: Record<string, { icon: string; color: string; message: string }> = {
    APPROVED: { icon: "pi-check-circle", color: "text-green-600", message: "Your review is live and visible to everyone" },
    PENDING:  { icon: "pi-clock",        color: "text-gray-600",  message: "Being reviewed by our team" },
    REJECTED: { icon: "pi-times-circle", color: "text-red-600",   message: "Did not meet community guidelines" },
    FLAGGED:  { icon: "pi-flag",         color: "text-orange-600",message: "Under review for potential issues" },
  };
  return map[status] ?? map["PENDING"]!;
};

const getTierColor = (tier: string): string => {
  const colors: Record<string, string> = {
    newbie: "bg-green-100", bronze: "bg-orange-100", silver: "bg-gray-100",
    expert: "bg-yellow-100", platinum: "bg-blue-100", pro: "bg-teal-100",
  };
  return colors[tier?.toLowerCase()] || "bg-gray-100";
};

const getAchievementColor = (badgeType: string): string => {
  const colors: Record<string, string> = {
    pioneer: "bg-yellow-100", explorer: "bg-blue-100",
    reviewer: "bg-green-100", influencer: "bg-purple-100",
  };
  return colors[badgeType?.toLowerCase()] || "bg-gray-100";
};

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = "/images/default-business-logo.png";
};

const formatBusinessAddress = (city: string, state: string, address?: string): string => {
  const isOnline = city?.toLowerCase() === "online" && state?.toLowerCase() === "online";
  if (isOnline) return "Online";
  if (state === "Unknown" || !state) return address ? `${address}, ${city}` : city;
  if (!city) return state;
  if (!address) return `${city}, ${state}`;
  return address;
};

const s = (n: number | null | undefined) => (n === 1 ? "" : "s");

// ── Lifecycle ──────────────────────────────────────────────────────────────
const onReviewPageChange = async (event: PageState) => {
  reviewPage.value = event.page + 1;
  reviewPageSize.value = event.rows;
  await loadSummary(false);
};

onBeforeMount(async () => { await loadSummary(true); });
</script>

<style scoped>
/* ── Rewards Tab ──────────────────────────────────────────────────────────── */
.rewards-tab {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.points-hero {
  position: relative;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
  border-radius: 1.25rem;
  padding: 2rem 1.5rem;
  overflow: hidden;
  text-align: center;
  color: white;
}
.hero-bg-circles { position: absolute; inset: 0; pointer-events: none; }
.circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.06); }
.c1 { width: 200px; height: 200px; top: -60px; right: -60px; background: rgba(251,191,36,0.08); }
.c2 { width: 140px; height: 140px; bottom: -40px; left: -30px; background: rgba(245,158,11,0.06);}
.c3 { width: 80px; height: 80px; top: 40%; left: 15%; background: rgba(255,255,255,0.04); }
.hero-content { position: relative; z-index: 1; }
.hero-label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #6ee7b7; margin: 0 0 0.5rem; }
.hero-points { display: flex; align-items: baseline; justify-content: center; gap: 0.3rem; margin-bottom: 1rem; }
.points-number { font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 8px rgba(251,191,36,0.4));}
.points-unit { font-size: 1.2rem; font-weight: 600; color: #6ee7b7; }
.hero-meta { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.meta-pill { display: flex; align-items: center; gap: 0.35rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 0.3rem 0.75rem; font-size: 0.75rem; font-weight: 600; backdrop-filter: blur(4px); }
/* .meta-pill--gold {
  background: linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.2));
  border-color: rgba(251,191,36,0.5);
  color: #fef3c7;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.meta-pill--gold i {
  color: #fbbf24;
  filter: drop-shadow(0 0 4px rgba(251,191,36,0.6));
} */

.r-section { background: white; border-radius: 1rem; padding: 1.25rem; border: 1px solid #f1f5f9; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.r-section-title { font-size: 0.88rem; font-weight: 700; color: #374151; margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem; }

/* Breakdown */
.breakdown-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.65rem; }
.breakdown-card { position: relative; display: flex; align-items: center; gap: 0.65rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 0.8rem; cursor: default; transition: box-shadow 0.2s, border-color 0.2s; }
.breakdown-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #cbd5e1; }
.bcard-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
.bcard-body { flex: 1; min-width: 0; }
.bcard-label { font-size: 0.65rem; font-weight: 600; color: #64748b; margin: 0; white-space: nowrap; }
.bcard-value { font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0; line-height: 1.2; }
.bcard-tip-icon { position: absolute; top: 7px; right: 7px; color: #94a3b8; font-size: 0.7rem; cursor: help; }
.all-time-badge { position: absolute; top: 7px; right: 7px; background: #f1f5f9; color: #64748b; font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 2px 5px; border-radius: 999px; }
.tooltip-bubble { position: absolute; bottom: calc(100% + 8px); left: 0; right: 0; z-index: 50; background: #c5c7cb; color: rgb(6, 2, 39); border-radius: 10px; padding: 0.65rem; box-shadow: 0 8px 24px rgba(0,0,0,0.2); pointer-events: none; }
.tip-title { font-size: 0.75rem; font-weight: 700; margin: 0 0 0.25rem; }
.tip-body  { font-size: 0.7rem; line-height: 1.5; margin: 0; color: #091c34; }
.tip-fade-enter-active, .tip-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.tip-fade-enter-from, .tip-fade-leave-to { opacity: 0; transform: translateY(4px); }

/* Referral */
.referral-card { background: linear-gradient(135deg, #faf5ff, #ede9fe); border: 1px solid #ddd6fe; border-radius: 0.875rem; padding: 1.25rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
.referral-left { flex: 1; min-width: 0; }
.referral-headline { font-size: 0.95rem; font-weight: 700; color: #4c1d95; margin: 0 0 0.25rem; }
.referral-sub { font-size: 0.8rem; color: #6d28d9; margin: 0 0 0.85rem; }
.referral-code-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.code-badge { background: white; border: 2px dashed #7c3aed; border-radius: 8px; padding: 0.45rem 0.9rem; }
.code-text { font-family: 'Courier New', monospace; font-size: 0.95rem; font-weight: 800; color: #5b21b6; letter-spacing: 0.1em; }
.copy-btn { display: flex; align-items: center; gap: 0.35rem; background: #7c3aed; color: white; border: none; border-radius: 8px; padding: 0.45rem 0.9rem; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.1s; }
.copy-btn:hover { background: #6d28d9; }
.copy-btn.copied { background: #16a34a; }
.copy-btn:active { transform: scale(0.97); }
.referral-stats { display: flex; align-items: center; gap: 0.65rem; background: white; border-radius: 10px; padding: 0.75rem 0.9rem; border: 1px solid #ede9fe; }
.ref-stat { text-align: center; }
.ref-stat-val { display: block; font-size: 1.3rem; font-weight: 800; color: #4c1d95; line-height: 1; }
.ref-stat-label { font-size: 0.62rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #8b5cf6; }
.ref-stat-divider { width: 1px; height: 30px; background: #ede9fe; }

/* Redeem */
.redeem-locked { display: flex; align-items: flex-start; gap: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.875rem; padding: 1.25rem; }
.lock-icon { font-size: 2rem; flex-shrink: 0; }
.lock-title { font-size: 0.88rem; font-weight: 700; color: #991b1b; margin: 0 0 0.2rem; }
.lock-sub   { font-size: 0.78rem; color: #b91c1c; margin: 0 0 0.65rem; }
.progress-bar-wrap { display: flex; align-items: center; gap: 0.5rem; }
.progress-bar-track { flex: 1; height: 8px; background: #fecaca; border-radius: 999px; overflow: hidden; }
.progress-bar-fill { height: 100%; background: linear-gradient(90deg, #ef4444, #dc2626); border-radius: 999px; transition: width 0.5s ease; }
.progress-label { font-size: 0.7rem; font-weight: 600; color: #b91c1c; white-space: nowrap; }

.redeem-options { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.65rem; }
.redeem-option-card { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 0.875rem; padding: 0.9rem; cursor: pointer; transition: all 0.2s; }
.redeem-option-card:hover:not(.coming-soon-card):not(.disabled) { border-color: #16a34a; background: #f0fdf4; box-shadow: 0 4px 12px rgba(22,163,74,0.1); }
.redeem-option-card.selected { border-color: #16a34a; background: #f0fdf4; box-shadow: 0 0 0 3px rgba(22,163,74,0.15); }
.redeem-option-card.disabled { opacity: 0.55; cursor: not-allowed; }
.coming-soon-card { opacity: 0.6; cursor: default; background: #fafafa; }
.option-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
.option-emoji { font-size: 1.4rem; }
.option-label { font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0; }
.option-cost  { font-size: 0.7rem; color: #64748b; margin: 0; }
.cost-num { font-weight: 700; color: #16a34a; }
.option-check { margin-left: auto; width: 18px; height: 18px; border-radius: 50%; background: #16a34a; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; opacity: 0; transition: opacity 0.2s; flex-shrink: 0; }
.option-check.visible { opacity: 1; }
.option-desc { font-size: 0.7rem; color: #64748b; margin: 0; line-height: 1.4; }
.option-shortage { font-size: 0.68rem; color: #ef4444; font-weight: 600; margin: 0.35rem 0 0; }
.coming-soon-badge { margin-left: auto; background: #fef3c7; color: #92400e; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 6px; border-radius: 999px; }

.redeem-form-wrap { margin-top: 0.85rem; overflow: hidden; }
.redeem-form { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 0.875rem; padding: 1.1rem; display: flex; flex-direction: column; gap: 0.75rem; }
.form-title { font-size: 0.85rem; font-weight: 700; color: #166534; margin: 0; text-align: center; }
.network-selector { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.net-btn { display: flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.7rem; border: 2px solid #d1fae5; border-radius: 8px; background: white; font-size: 0.75rem; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s; }
.net-btn:hover { border-color: var(--net-color); color: var(--net-color); }
.net-btn.active { border-color: var(--net-color); color: var(--net-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--net-color) 15%, transparent); }
.net-icon { font-size: 0.95rem; }
.net-name { font-size: 0.72rem; }
.phone-label { font-size: 0.75rem; font-weight: 600; color: #374151; display: block; margin-bottom: 0.3rem; }
.phone-input { width: 100%; padding: 0.55rem 0.85rem; border: 1.5px solid #d1fae5; border-radius: 8px; font-size: 0.88rem; outline: none; transition: border-color 0.15s; box-sizing: border-box; background: white; }
.phone-input:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.redeem-summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #374151; background: white; border-radius: 8px; padding: 0.55rem 0.85rem; border: 1px solid #d1fae5; }
.redeem-summary-row strong { color: #16a34a; font-size: 0.92rem; }
.redeem-submit-btn { display: flex; align-items: center; justify-content: center; gap: 0.45rem; background: #16a34a; color: white; border: none; border-radius: 9px; padding: 0.75rem 1.1rem; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: background 0.2s, transform 0.1s; }
.redeem-submit-btn:hover:not(:disabled) { background: #15803d; }
.redeem-submit-btn:active:not(:disabled) { transform: scale(0.98); }
.redeem-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.redeem-cancel-btn { background: none; border: 1.5px solid #d1fae5; color: #374151; border-radius: 9px; padding: 0.55rem 1.1rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.15s; text-align: center; }
.redeem-cancel-btn:hover { background: white; }
.redeem-msg { display: flex; align-items: center; gap: 0.45rem; padding: 0.65rem 0.9rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; }
.redeem-msg.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.redeem-msg.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.form-slide-enter-active, .form-slide-leave-active { transition: opacity 0.25s, transform 0.25s; }
.form-slide-enter-from, .form-slide-leave-to { opacity: 0; transform: translateY(-8px); }

/* Activity */
.activity-list { display: flex; flex-direction: column; gap: 0.45rem; }
.activity-row { display: flex; align-items: center; gap: 0.65rem; padding: 0.6rem 0.7rem; border-radius: 8px; background: #f8fafc; border: 1px solid #f1f5f9; transition: background 0.15s; }
.activity-row:hover { background: #f0fdf4; }
.act-icon { font-size: 1rem; flex-shrink: 0; }
.act-body { flex: 1; min-width: 0; }
.act-desc { font-size: 0.75rem; color: #374151; font-weight: 500; margin: 0; }
.act-date { font-size: 0.65rem; color: #94a3b8; margin: 0; }
.act-points { font-size: 0.78rem; font-weight: 800; color: #16a34a; background: #dcfce7; padding: 2px 7px; border-radius: 999px; white-space: nowrap; flex-shrink: 0; }

@media (max-width: 480px) {
  .breakdown-grid { grid-template-columns: 1fr; }


  .referral-card  { flex-direction: column; }
  .redeem-options { grid-template-columns: 1fr; }


  .r-section { background: white; border-radius: 0rem; padding: 0rem; border: 0px solid #f1f5f9; box-shadow: 0 0px 0px rgba(0,0,0,0.06); }
  .r-section-title { font-size: 0.75rem; font-weight: 700; color: #374151; margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem; }


  .referral-card { background: linear-gradient(135deg, #faf5ff, #ede9fe); border: 1px solid #ddd6fe; border-radius: 0.875rem; padding: 1rem; display: block; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
  .referral-left { flex: 1; min-width: 0; }

  .referral-stats { display: block; align-items: center; gap: 0.65rem; background: white; border-radius: 10px; padding: 0.75rem 0.9rem; border: 1px solid #ede9fe; margin-top: 10px; }
  .ref-stat { text-align: center; }
  .ref-stat-val { display: block; font-size: 1.3rem; font-weight: 800; color: #4c1d95; line-height: 1; }
  .ref-stat-label { font-size: 0.62rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #8b5cf6; }
  .ref-stat-divider { width: 1px; height: 30px; background: #ede9fe; }

  .redeem-locked { display: block; align-items: flex-start; gap: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.875rem; padding: 1.25rem; }
  .lock-icon { font-size: 1rem; flex-shrink: 0; }
  .lock-title { font-size: 0.75rem; font-weight: 700; color: #991b1b; margin: 0 0 0.2rem; }
  .lock-sub   { font-size: 0.7rem; color: #b91c1c; margin: 0 0 0.65rem; }

  .network-selector { display: flex; gap: 0.1rem; flex-wrap: wrap; }
  .net-icon { font-size: 0.75rem; }
  .net-name { font-size: 0.70rem; }

}

@media ( max-width: 768px){

  .redeem-options { grid-template-columns: 1fr 1fr; }

}
</style>