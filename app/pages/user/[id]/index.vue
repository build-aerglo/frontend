<template>
  <div class="min-h-screen bg-green-50">
    <NavBarProfile />

    <!-- Email Verification Banner -->
    <div
      v-if="
        isUser &&
        summary &&
        !summary.profile.isEmailVerified &&
        !verificationBannerDismissed
      "
      class="verification-banner"
    >
      <div class="vb-inner">
        <div class="vb-left">
          <i class="pi pi-exclamation-circle vb-icon"></i>
          <span class="vb-text">
            Your account is <strong>unverified</strong> — verify your email to
            unlock full access.
          </span>
        </div>
        <div class="vb-actions">
          <button
            class="vb-btn"
            @click="openVerificationModal"
            :disabled="sendingVerification"
          >
            <i v-if="sendingVerification" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-envelope"></i>
            {{ sendingVerification ? "Sending..." : "Verify Email" }}
          </button>
          <button
            class="vb-dismiss"
            @click="verificationBannerDismissed = true"
            title="Dismiss"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
    </div>

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
            <span class="font-medium text-gray-500"
              ><i class="pi pi-user mr-2"></i> Username:</span
            >
            <span class="text-lg font-semibold text-gray-700">{{
              cleanUsername
            }}</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-phone mr-2"></i>Phone Number
          </label>
          <input
            v-model="editForm.phoneNumber"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent"
          />
        </div>

        <!-- State dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-map mr-2"></i>State
          </label>
          <select
            v-model="editForm.state"
            @change="onStateChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent bg-white"
          >
            <option value="">Select a state...</option>
            <option
              v-for="st in nigerianLocations"
              :key="st.state"
              :value="st.state"
            >
              {{ st.state }}
            </option>
          </select>
        </div>

        <!-- City dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-2">
            <i class="pi pi-map-marker mr-2"></i>City / Area
          </label>
          <select
            v-model="editForm.city"
            :disabled="!editForm.state"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008253] focus:border-transparent bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <option value="">
              {{ editForm.state ? "Select a city..." : "Select a state first" }}
            </option>
            <option v-for="city in availableCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
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
        <div
          class="max-w-7xl flex md:flex-row flex-col md:justify-between justify-center items-center mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div
            class="flex flex-col md:flex-row items-center md:items-start gap-5"
          >
            <UserAvatar
              :firstName="firstName"
              :lastName="lastName"
              :size="100"
            />
            <div class="space-y-1">
              <div
                class="flex items-center text-bold text-2xl justify-center md:justify-start text-gray-800"
              >
                <span class="font-semibold md:text-3xl text-xl text-gray-800">{{
                  cleanUsername
                }}</span>
              </div>
              <div
                class="flex justify-center md:justify-start items-center divide-x divide-gray-300 text-sm text-gray-600"
              >
                <span class="px-3">
                  <span class="font-medium text-gray-900">{{
                    summary.reviews.totalCount
                  }}</span>
                  Total Review{{ s(summary.reviews.totalCount) }}
                </span>
                <span class="px-3">
                  <span class="font-medium text-gray-900">{{
                    summary.points
                  }}</span>
                  Point{{ s(summary.points) }}
                </span>
                <span class="px-3">
                  <span class="font-medium text-gray-900">{{
                    summary.streak
                  }}</span>
                  Streak{{ s(summary.streak) }}
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
                <div
                  v-if="summary.profile.phone"
                  class="flex items-center gap-2"
                >
                  <span class="hidden md:block h-5 w-px bg-gray-300"></span>
                  <i class="pi pi-phone"></i>
                  <span>{{ summary.profile.phone }}</span>
                </div>
                <div
                  v-if="summary.profile.address"
                  class="flex items-center gap-2"
                >
                  <span class="hidden md:block h-5 w-px bg-gray-300"></span>
                  <i class="pi pi-home"></i>
                  <span class="truncate max-w-xs">{{
                    summary.profile.address
                  }}</span>
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
        class="bg-white border-b border-gray-200 sticky top-16 z-50 hidden sm:block"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-center items-center gap-3 py-4">
            <button
              @click="activeTab = 'your-reviews'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2',
                activeTab === 'your-reviews'
                  ? 'bg-[#008253] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              <i class="pi pi-star"></i> Your Reviews
            </button>
            <button
              @click="activeTab = 'rewards'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2',
                activeTab === 'rewards'
                  ? 'bg-[#008253] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              <i class="pi pi-gift"></i> Rewards
            </button>
            <!-- Add Notification and Settings buttons -->
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 md:pb-0 pb-8 md:py-8">
        <div class="profile-grid gap-3">
          <!-- Middle Column -->
          <div class="middle-col">
            <!-- Menu Bar (Mobile) -->
            <div v-if="isUser" class="sm:hidden mb-6 -mx-4 px-4">
              <div class="flex justify-between gap-2">
                <button
                  @click="activeTab = 'your-reviews'"
                  :class="[
                    'w-full px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'your-reviews'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                >
                  <i class="pi pi-star"></i>
                </button>
                <button
                  @click="activeTab = 'rewards'"
                  :class="[
                    'w-full px-4 py-2 rounded-lg font-medium transition text-sm',
                    activeTab === 'rewards'
                      ? 'bg-[#008253] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                >
                  <i class="pi pi-gift"></i>
                </button>
                <!-- Add Notification and Settings Tab From TODO -->
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">
              <!-- ── YOUR REVIEWS TAB ── -->
              <div v-if="activeTab === 'your-reviews'" class="space-y-6">
                <div class="flex items-center justify-between flex-wrap gap-3">
                  <h2 class="md:text-2xl text-xl font-bold text-[#008253]">
                    <span
                      v-if="isUser"
                      class="md:text-2xl text-xl font-bold text-[#008253]"
                      >Your</span
                    >
                    Reviews
                  </h2>

                  <!-- Sort control — icon + compact dropdown -->
                  <div
                    v-if="mappedReviews.length > 0"
                    class="relative flex items-center gap-1.5"
                  >
                    <i
                      class="pi pi-sort-alt text-gray-400 text-sm pointer-events-none"
                    ></i>
                    <select
                      v-model="reviewSortBy"
                      class="text-xs font-medium border border-gray-200 rounded-lg pl-2 pr-7 py-1.5 bg-white text-gray-600 focus:ring-1 focus:ring-[#008253] focus:border-transparent cursor-pointer appearance-none"
                    >
                      <option value="date-desc">Latest</option>
                      <option value="date-asc">Earliest</option>
                      <option value="rating-desc">Highest Rated</option>
                      <option value="rating-asc">Lowest Rated</option>
                    </select>
                    <i
                      class="pi pi-chevron-down text-gray-400 text-xs absolute right-2 pointer-events-none"
                    ></i>
                  </div>
                </div>

                <div
                  v-if="isUser && mappedReviews.length === 0"
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

                <div
                  v-else-if="!isUser && mappedReviews.length === 0"
                  class="text-center py-12"
                >
                  <i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
                  <h3 class="text-base font-normal text-gray-700 mb-2">
                    This member hasn't written any reviews on CleReview yet
                  </h3>
                </div>

                <div v-else class="space-y-4">
                  <div
                    v-for="review in sortedReviews"
                    :key="review.id"
                    :class="[
                      'border rounded-lg p-4 transition-all',
                      review.isGrayedOut
                        ? 'border-gray-200 bg-gray-50/50 opacity-75'
                        : 'border-gray-200 bg-white hover:shadow-md',
                    ]"
                  >
                    <div
                      class="flex md:flex-row flex-col justify-between items-start gap-4 relative"
                    >
                      <div class="flex gap-3 flex-1">
                        <div class="flex-shrink-0">
                          <img
                            :src="
                              review.logo || '/images/default-business-logo.png'
                            "
                            :alt="review.businessName"
                            :class="[
                              'w-14 h-14 rounded-lg object-cover border border-gray-200',
                              review.isGrayedOut && 'opacity-50',
                            ]"
                            @error="handleImageError"
                          />
                        </div>
                        <div class="flex flex-col gap-2">
                          <h2
                            :class="[
                              'text-base font-semibold truncate whitespace-normal m-0 p-0',
                              review.isGrayedOut
                                ? 'text-gray-500'
                                : 'text-gray-800',
                            ]"
                          >
                            {{ review.businessName }}
                          </h2>
                          <p
                            :class="[
                              'text-xs truncate whitespace-normal',
                              review.isGrayedOut
                                ? 'text-gray-400'
                                : 'text-gray-500',
                            ]"
                          >
                            {{ review.businessAddress }}
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex md:flex-col items-end gap-2 flex-shrink-0"
                      >
                        <div class="flex items-center">
                          <Stars
                            v-for="n in 5"
                            :key="n"
                            :value="getStarValue(review.rating, n)"
                            :colorLevel="Math.round(review.rating)"
                            :class="[
                              'w-4 h-4',
                              review.isGrayedOut && 'opacity-50',
                            ]"
                          />
                        </div>
                        <span
                          :class="[
                            'text-xs',
                            review.isGrayedOut
                              ? 'text-gray-400'
                              : 'text-gray-600',
                          ]"
                          >{{ formatDateShort(review.date) }}</span
                        >
                      </div>
                      <div
                        class="absolute group right-[-22px] top-[-22px] bg-white"
                      >
                        <i
                          :class="[
                            'pi text-2xl cursor-help',
                            getStatusIcon(review.rawStatus).icon,
                            getStatusIcon(review.rawStatus).color,
                          ]"
                        ></i>
                        <div
                          class="absolute right-0 top-full mt-1 hidden group-hover:block z-10 w-48"
                        >
                          <div
                            class="bg-white text-gray-500 leading-relaxed text-xs rounded-lg px-3 py-2 shadow-lg"
                          >
                            <p class="text-gray-500 text-xs">
                              {{ getStatusIcon(review.rawStatus).message }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mt-4">
                      <p
                        :class="[
                          'text-sm leading-relaxed',
                          review.isGrayedOut
                            ? 'text-gray-500'
                            : 'text-gray-700',
                        ]"
                      >
                        {{ review.body }}
                      </p>
                    </div>

                    <!-- Vote & Flag Action Row -->
                    <div
                      class="review-actions mt-3 pt-3 border-t border-gray-100"
                    >
                      <template v-if="isUser">
                        <span class="own-vote-count">
                          <i class="pi pi-thumbs-up"></i>
                          <span
                            class="own-vote-badge"
                            v-if="
                              (voteState[review.id]?.count ??
                                review.helpfulCount) > 0
                            "
                          >
                            {{
                              voteState[review.id]?.count ?? review.helpfulCount
                            }}
                          </span>
                        </span>
                      </template>
                      <template v-else>
                        <button
                          :class="[
                            'action-btn action-btn--vote',
                            voteState[review.id]?.hasVoted &&
                              'action-btn--voted',
                            votingInProgress[review.id] &&
                              'action-btn--loading',
                          ]"
                          @click="handleHelpfulVote(review.id)"
                          :disabled="votingInProgress[review.id]"
                          :title="
                            voteState[review.id]?.hasVoted
                              ? 'Remove helpful vote'
                              : 'Mark as helpful'
                          "
                        >
                          <i
                            :class="[
                              'pi',
                              votingInProgress[review.id]
                                ? 'pi-spin pi-spinner'
                                : 'pi-thumbs-up',
                            ]"
                          ></i>
                          <span
                            v-if="(voteState[review.id]?.count ?? 0) > 0"
                            class="vote-count"
                          >
                            {{ voteState[review.id]?.count ?? 0 }}
                          </span>
                        </button>
                        <button
                          class="action-btn action-btn--flag"
                          @click="
                            openDisputeModal(review.id, review.businessId)
                          "
                        >
                          <i class="pi pi-flag"></i>
                        </button>
                      </template>
                    </div>

                    <!-- Business Reply -->
                    <div
                      v-if="review.businessReply"
                      class="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div
                        class="bg-emerald-50 border border-emerald-100 rounded-lg p-3"
                      >
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-xs font-semibold text-emerald-800"
                            >Business Response</span
                          >
                          <!-- <span class="text-xs text-gray-400">{{ formatDateShort(review.businessReply.createdAt) }}</span> -->
                        </div>
                        <p
                          class="text-sm text-gray-700 leading-relaxed"
                          v-html="review.businessReply"
                        ></p>
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
                <!-- Points Hero — tier badge shown here -->
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
                      <div
                        v-if="summary.tierBadge"
                        class="meta-pill meta-pill--tier"
                      >
                        <span>{{ summary.tierBadge.icon }}</span>
                        <span>{{
                          capitalize(summary.tierBadge.badgeType)
                        }}</span>
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
                    <i class="pi pi-star-fill" style="color: #f59e0b"></i>
                    How You've Earned
                  </h3>
                  <div class="breakdown-grid">
                    <div
                      class="breakdown-card"
                      style="--tip-border: #bbf7d0; --tip-accent: #16a34a"
                      @mouseenter="activeTip = 'review'"
                      @mouseleave="activeTip = null"
                    >
                      <div
                        class="bcard-icon"
                        style="background: #dcfce7; color: #16a34a"
                      >
                        <i class="pi pi-comment"></i>
                      </div>
                      <div class="bcard-body">
                        <p class="bcard-label">Review Points</p>
                        <p class="bcard-value">{{ summary.reviewPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon">
                        <i class="pi pi-info-circle"></i>
                      </div>
                      <Transition name="tip-fade">
                        <div
                          v-if="activeTip === 'review'"
                          class="tooltip-bubble"
                        >
                          <p class="tip-title">📝 Review Rewards</p>
                          <p class="tip-body">
                            Earn <em>2–15 points</em> per review based on
                            quality, length, and photos added.
                          </p>
                        </div>
                      </Transition>
                    </div>

                    <div
                      class="breakdown-card"
                      style="--tip-border: #fde68a; --tip-accent: #d97706"
                      @mouseenter="activeTip = 'streak'"
                      @mouseleave="activeTip = null"
                    >
                      <div
                        class="bcard-icon"
                        style="background: #fef3c7; color: #d97706"
                      >
                        <i class="pi pi-bolt"></i>
                      </div>
                      <div class="bcard-body">
                        <p class="bcard-label">Streak Reward</p>
                        <p class="bcard-value">{{ summary.streakPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon">
                        <i class="pi pi-info-circle"></i>
                      </div>
                      <Transition name="tip-fade">
                        <div
                          v-if="activeTip === 'streak'"
                          class="tooltip-bubble"
                        >
                          <p class="tip-title">🔥 Streak Reward</p>
                          <p class="tip-body">
                            Reach a <em>100-day streak</em> and get verified to
                            unlock <em>150 bonus points</em>. Current streak:
                            {{ summary.streak }} day{{
                              summary.streak !== 1 ? "s" : ""
                            }}. Longest: {{ summary.longestStreak }}.
                          </p>
                        </div>
                      </Transition>
                    </div>

                    <div
                      class="breakdown-card"
                      style="--tip-border: #ddd6fe; --tip-accent: #7c3aed"
                      @mouseenter="activeTip = 'referral'"
                      @mouseleave="activeTip = null"
                    >
                      <div
                        class="bcard-icon"
                        style="background: #ede9fe; color: #7c3aed"
                      >
                        <i class="pi pi-users"></i>
                      </div>
                      <div class="bcard-body">
                        <p class="bcard-label">Referral Points</p>
                        <p class="bcard-value">{{ summary.referralPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon">
                        <i class="pi pi-info-circle"></i>
                      </div>
                      <Transition name="tip-fade">
                        <div
                          v-if="activeTip === 'referral'"
                          class="tooltip-bubble tooltip-bubble--referral"
                        >
                          <p class="tip-title">✨ Referral Rewards</p>
                          <p class="tip-body">
                            Earn <em>50 pts</em> when a friend you referred
                            completes their 3rd approved review. They also
                            receive <em>25 pts</em> as a welcome bonus.
                          </p>
                        </div>
                      </Transition>
                    </div>

                    <div
                      class="breakdown-card"
                      style="--tip-border: #fbcfe8; --tip-accent: #db2777"
                      @mouseenter="activeTip = 'bonus'"
                      @mouseleave="activeTip = null"
                    >
                      <div
                        class="bcard-icon"
                        style="background: #fce7f3; color: #db2777"
                      >
                        <i class="pi pi-gift"></i>
                      </div>
                      <div class="bcard-body">
                        <p class="bcard-label">Bonus Points</p>
                        <p class="bcard-value">{{ summary.bonusPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon">
                        <i class="pi pi-info-circle"></i>
                      </div>
                      <Transition name="tip-fade">
                        <div
                          v-if="activeTip === 'bonus'"
                          class="tooltip-bubble"
                        >
                          <p class="tip-title">🎁 Bonus Points</p>
                          <p class="tip-body">
                            Special rewards from promotions, platform events,
                            and milestone achievements.
                          </p>
                        </div>
                      </Transition>
                    </div>

                    <div
                      class="breakdown-card"
                      style="--tip-border: #bae6fd; --tip-accent: #0284c7"
                      @mouseenter="activeTip = 'other'"
                      @mouseleave="activeTip = null"
                    >
                      <div
                        class="bcard-icon"
                        style="background: #e0f2fe; color: #0284c7"
                      >
                        <i class="pi pi-thumbs-up"></i>
                      </div>
                      <div class="bcard-body">
                        <p class="bcard-label">Extra Points</p>
                        <p class="bcard-value">{{ summary.otherPoints }}</p>
                      </div>
                      <div class="bcard-tip-icon">
                        <i class="pi pi-info-circle"></i>
                      </div>
                      <Transition name="tip-fade">
                        <div
                          v-if="activeTip === 'other'"
                          class="tooltip-bubble"
                        >
                          <p class="tip-title">🤝 Community Points</p>
                          <p class="tip-body">
                            Earned through helpful votes, completing your
                            profile, and community contributions.
                          </p>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </section>

                <!-- Referral -->
                <section class="r-section">
                  <h3 class="r-section-title">
                    <i class="pi pi-users" style="color: #7c3aed"></i>
                    Refer a Friend
                  </h3>
                  <div class="referral-card">
                    <div class="referral-left">
                      <p class="referral-headline">
                        Share your code, earn together
                      </p>
                      <p class="referral-sub">
                        Earn <em>50 pts</em> once your friend completes 3
                        approved reviews. They get <em>25 pts</em> too.
                      </p>
                      <div class="referral-code-row">
                        <div class="code-badge">
                          <span class="code-text">{{
                            summary.referral.code
                          }}</span>
                        </div>
                        <button
                          class="copy-btn"
                          @click="copyReferralCode"
                          :class="{ copied: codeCopied }"
                        >
                          <i
                            :class="codeCopied ? 'pi pi-check' : 'pi pi-copy'"
                          ></i>
                          {{ codeCopied ? "Copied!" : "Copy Code" }}
                        </button>
                      </div>

                      <!-- Enter a referral code — shown only within 24hrs of registration -->
                      <div
                        v-if="canEnterReferralCode"
                        class="enter-referral-wrap"
                      >
                        <div v-if="!referralCodeApplied">
                          <p class="enter-ref-label">
                            Have a friend's referral code?
                          </p>
                          <div class="enter-ref-row">
                            <input
                              v-model="incomingReferralCode"
                              type="text"
                              placeholder="e.g. JANE2026"
                              maxlength="20"
                              class="enter-ref-input"
                              :disabled="applyingReferralCode"
                              @input="
                                incomingReferralCode =
                                  incomingReferralCode.toUpperCase()
                              "
                            />
                            <button
                              class="apply-ref-btn"
                              :disabled="
                                !incomingReferralCode.trim() ||
                                applyingReferralCode
                              "
                              @click="handleApplyReferralCode"
                            >
                              <i
                                v-if="applyingReferralCode"
                                class="pi pi-spin pi-spinner"
                              ></i>
                              <span>{{
                                applyingReferralCode ? "Applying..." : "Apply"
                              }}</span>
                            </button>
                          </div>
                          <p
                            v-if="referralCodeError"
                            class="ref-apply-msg ref-apply-msg--error"
                          >
                            <i class="pi pi-exclamation-triangle"></i>
                            {{ referralCodeError }}
                          </p>
                        </div>
                        <div
                          v-else
                          class="ref-apply-msg ref-apply-msg--success"
                        >
                          <i class="pi pi-check-circle"></i> Referral code
                          applied successfully! You both earned points.
                        </div>
                      </div>
                    </div>
                    <div class="referral-stats">
                      <div class="ref-stat">
                        <span class="ref-stat-val">{{
                          summary.referral.totalReferrals
                        }}</span>
                        <span class="ref-stat-label">Total</span>
                      </div>
                      <div class="ref-stat-divider"></div>
                      <div class="ref-stat">
                        <span class="ref-stat-val" style="color: #16a34a">{{
                          summary.referral.successfulReferrals
                        }}</span>
                        <span class="ref-stat-label">Successful</span>
                      </div>
                      <div class="ref-stat-divider"></div>
                      <div class="ref-stat">
                        <span class="ref-stat-val" style="color: #d97706">{{
                          summary.referral.pendingReferrals
                        }}</span>
                        <span class="ref-stat-label">Pending</span>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Redeem Points -->
                <section class="r-section">
                  <h3 class="r-section-title">
                    <i class="pi pi-dollar" style="color: #16a34a"></i>
                    Redeem Points
                  </h3>
                  <span
                    class="text-center flex justify-center h-20 items-center text-gray-500"
                    >Coming Soon...</span
                  >
                  <!-- Add Redeem Points Code from TODO -->
                </section>
              </div>

              <!-- Add Notification and Settings page from TODO -->
            </div>
          </div>
          <!-- Left Column -->
          <div class="left-col space-y-6">
            <!-- Badges (achievement only — tier badge lives in Rewards hero) -->
            <div class="bg-white rounded-xl shadow-sm p-4 md:block">
              <h5
                class="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2"
              >
                <i class="pi pi-trophy text-gold"></i>
                <span v-if="isUser" class="font-bold text-gray-800 text-sm"
                  >Your</span
                >
                Badges
                <span
                  v-if="summary.achievementBadges.length > 0"
                  class="text-sm text-gray-500"
                  >({{ summary.achievementBadges.length }})</span
                >
              </h5>
              <div
                v-if="!summary.achievementBadges.length"
                class="text-center py-8 text-gray-500"
              >
                <i class="pi pi-trophy text-4xl mb-2 opacity-50"></i>
                <p class="text-sm">
                  {{
                    isUser
                      ? "You haven't earned any badges yet"
                      : "No badges earned yet"
                  }}
                </p>
                <p v-if="isUser" class="text-xs text-gray-400 mt-2">
                  Keep reviewing to unlock badges!
                </p>
              </div>
              <div v-else class="space-y-3">
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
                <h5
                  class="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="pi pi-star-fill text-gold"></i>
                  Top Reviewed Categories
                </h5>
                <div
                  v-if="!topCategories.length"
                  class="text-sm flex gap-2 items-center justify-center text-gray-500 italic py-4 text-center"
                >
                  <i class="pi pi-inbox text-2xl mb-2 block text-gray-400"></i>
                  No categories reviewed yet
                </div>
                <ul v-else class="space-y-3">
                  <li
                    v-for="(cat, idx) in topCategories.slice(0, 3)"
                    :key="cat.categoryId || idx"
                  >
                    <div
                      class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <component
                        :is="cat.icon"
                        class="w-6 h-6"
                        :class="cat.color || 'text-gray-400'"
                      />
                      <div class="flex-1 min-w-0">
                        <span
                          class="block text-sm font-medium text-gray-900 truncate"
                          >{{ cat.categoryName }}</span
                        >
                        <span class="block text-xs text-gray-400 leading-tight"
                          >({{ cat.reviewCount }} review{{
                            s(cat.reviewCount)
                          }})</span
                        >
                      </div>
                    </div>
                  </li>
                </ul>
                <div
                  v-if="summary.topCategories.length > 3"
                  class="mt-4 pt-4 border-t border-gray-100"
                >
                  <button
                    class="text-sm text-[#008253] hover:text-[#006641] font-medium flex items-center gap-1 w-full justify-center"
                  >
                    View all {{ summary.topCategories.length }} categories
                    <i class="pi pi-arrow-right text-xs"></i>
                  </button>
                </div>
              </div>

              <!-- Top Locations -->
              <div class="bg-white rounded-xl shadow-sm p-4">
                <h5
                  class="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="pi pi-map-marker text-gold"></i>
                  Top Reviewed Locations
                </h5>
                <div
                  v-if="!topLocations.length"
                  class="text-sm flex gap-2 items-center justify-center text-gray-500 italic py-4 text-center"
                >
                  <i class="pi pi-map text-2xl mb-2 block text-gray-400"></i>
                  No locations reviewed yet
                </div>
                <ul v-else class="space-y-1">
                  <li v-for="(loc, idx) in topLocations.slice(0, 3)" :key="idx">
                    <div
                      class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <i class="pi pi-map-marker text-gold text-lg"></i>
                      <div class="flex-1 min-w-0">
                        <span
                          class="block text-sm font-medium text-gray-900 truncate"
                          >{{ loc.display }}</span
                        >
                        <span class="block text-xs text-gray-400 leading-tight"
                          >({{ loc.reviewCount }} review{{
                            s(loc.reviewCount)
                          }})</span
                        >
                      </div>
                    </div>
                  </li>
                </ul>
                <div
                  v-if="summary.topCities.length > 3"
                  class="mt-4 pt-4 border-t border-gray-100"
                >
                  <button
                    class="text-sm text-[#008253] hover:text-[#006641] font-medium flex items-center gap-1 w-full justify-center"
                  >
                    View all {{ summary.topCities.length }} cities
                    <i class="pi pi-arrow-right text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Favourite Business -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <h5
                class="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2"
              >
                <i class="pi pi-shop text-gold"></i>
                Favourite Businesses
              </h5>
              <span
                class="text-center flex justify-center h-20 items-center text-gray-500"
                >Coming Soon...</span
              >
            </div>
          </div>

          <!-- Right Column - Ads -->
          <div class="right-col space-y-6">
            <div
              class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm p-4 border border-yellow-200"
            >
              <p
                class="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-2"
              >
                <i class="pi pi-star"></i> Featured
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
                  Learn More <i class="pi pi-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <!-- Email Verification Toast -->
    <Transition name="verif-toast">
      <div
        v-if="verificationToast.visible"
        class="verif-toast"
        :class="`verif-toast--${verificationToast.type}`"
      >
        <i
          :class="[
            'pi',
            verificationToast.type === 'success'
              ? 'pi-check-circle'
              : verificationToast.type === 'error'
                ? 'pi-exclamation-triangle'
                : 'pi-envelope',
          ]"
        ></i>
        <span>{{ verificationToast.message }}</span>
        <button
          class="verif-toast-close"
          @click="verificationToast.visible = false"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
    </Transition>
    <!-- Dispute Modal -->
    <div
      v-if="disputeModal.open"
      class="fixed inset-0 z-[1200] flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        @click="closeDisputeModal"
      ></div>
      <div class="dispute-modal relative z-10">
        <button
          @click="closeDisputeModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <i class="pi pi-times"></i>
        </button>

        <div v-if="!disputeSuccess">
          <div class="dispute-modal__header">
            <div class="dispute-icon"><i class="pi pi-flag"></i></div>
            <h3 class="dispute-title">Report Review</h3>
            <p class="dispute-subtitle">Help us keep CleReview trustworthy</p>
          </div>

          <div class="dispute-modal__body">
            <div class="field-group">
              <label class="field-label"
                >Reason <span class="text-red-500">*</span></label
              >
              <select v-model="disputeForm.categoryCode" class="field-select">
                <option value="">Select a reason...</option>
                <option
                  v-for="cat in disputeCategories"
                  :key="cat.code"
                  :value="cat.code"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="field-group">
              <label class="field-label"
                >Explanation <span class="text-red-500">*</span></label
              >
              <textarea
                v-model="disputeForm.explanation"
                class="field-textarea"
                placeholder="Describe why you're reporting this review..."
                rows="4"
                maxlength="1000"
              ></textarea>
              <span class="field-hint"
                >{{ disputeForm.explanation.length }}/1000</span
              >
            </div>

            <div class="field-group">
              <label class="field-label"
                >Evidence URL
                <span class="field-optional">(optional)</span></label
              >
              <input
                v-model="disputeForm.evidenceUrl"
                type="url"
                class="field-input"
                placeholder="https://..."
              />
            </div>

            <div v-if="disputeError" class="dispute-error">
              <i class="pi pi-exclamation-triangle"></i> {{ disputeError }}
            </div>

            <div class="dispute-modal__actions">
              <button @click="closeDisputeModal" class="dispute-cancel-btn">
                Cancel
              </button>
              <button
                @click="handleSubmitDispute"
                :disabled="
                  !disputeForm.categoryCode ||
                  !disputeForm.explanation.trim() ||
                  disputeSubmitting
                "
                class="dispute-submit-btn"
              >
                <i v-if="disputeSubmitting" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-send"></i>
                {{ disputeSubmitting ? "Submitting..." : "Submit Report" }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="dispute-success">
          <div class="success-icon"><i class="pi pi-check-circle"></i></div>
          <h3>Report Submitted</h3>
          <p>
            Thanks for helping keep CleReview trustworthy. Our team will review
            this shortly.
          </p>
        </div>
      </div>
    </div>

    <!-- Guest auth prompt -->
    <AuthUnifiedModal
      v-if="showGuestAuthModal"
      :hide-back-to-review="true"
      @close="showGuestAuthModal = false"
      @authenticated="showGuestAuthModal = false"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { getCategoryIcon, getCategoryIconColor } from "~/utils/categoryIcons";
import UserAvatar from "~/components/UserAvatar.vue";
import BadgeToolTip from "~/components/BadgeToolTip.vue";
import useUserSummary from "~/composables/useUserSummary";
import useUserProfileMethods from "~/composables/user/useUserProfileMethods";
import useReviewMethods from "~/composables/review/useReviewMethods";
import { nigerianLocations } from "~/utils/nigerianLocations";
import type { Ad, EditFormData, UserSummary } from "~/types/user";
import type { PageState } from "primevue";
import useUserProfileApi from "~/composables/user/useUserProfileApi";
// import { useToast } from "primevue/usetoast";
import { useToast } from "~/composables/useToast";

// ── Setup ──────────────────────────────────────────────────────────────────
const toast = useToast();
const { getUserSummary } = useUserSummary();
const { updateUserProfile, getUserId } = useUserProfileMethods();
const {
  getHelpfulVoteStatus,
  getDisputeCategories,
  sendDispute,
  toggleUpvoteReview,
} = useReviewMethods();

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

// Review sort
const reviewSortBy = ref<
  "date-desc" | "date-asc" | "rating-desc" | "rating-asc"
>("date-desc");

// Helpful votes — keyed by reviewId
const voteState = ref<Record<string, { hasVoted: boolean; count: number }>>({});
const votingInProgress = ref<Record<string, boolean>>({});

// Dispute / flag
const disputeModal = ref<{
  open: boolean;
  reviewId: string;
  businessId: string;
}>({ open: false, reviewId: "", businessId: "" });
const disputeCategories = ref<Array<{ code: string; name: string }>>([]);
const disputeForm = ref({ categoryCode: "", explanation: "", evidenceUrl: "" });
const disputeSubmitting = ref(false);
const disputeSuccess = ref(false);
const disputeError = ref<string | null>(null);

// Auth modal for guests triggering vote/dispute
const showGuestAuthModal = ref(false);

// Edit profile
const isEditingProfile = ref(false);
const saving = ref(false);
const saveSuccess = ref(false);
const saveError = ref<string | null>(null);
const editForm = ref<EditFormData & { state: string; city: string }>({
  username: "",
  phoneNumber: "",
  address: "",
  state: "",
  city: "",
});

// Referral code entry
const incomingReferralCode = ref("");
const applyingReferralCode = ref(false);
const referralCodeError = ref<string | null>(null);
const referralCodeApplied = ref(false);

// Rewards tab
const activeTip = ref<string | null>(null);
const codeCopied = ref(false);

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

// ── Computed ───────────────────────────────────────────────────────────────
const cleanUsername = computed(() =>
  (summary.value?.profile.username || "").replace(/_\d+$/, "").trim(),
);
const firstName = computed(() => cleanUsername.value.split(" ")[0] || "");
const lastName = computed(
  () => cleanUsername.value.split(" ").slice(1).join(" ") || "",
);

const mappedReviews = computed(() => {
  if (!summary.value) return [];
  return summary.value.reviews.items.map((r) => {
    const [city, state] = (r.businessAddress || "")
      .split(",")
      .map((p) => p.trim());
    const isGrayedOut = r.status === "REJECTED" || r.status === "PENDING";
    return {
      id: r.id,
      businessId: r.businessId,
      businessName: r.name,
      logo: r.logo,
      businessAddress: formatBusinessAddress(
        city ?? "",
        state ?? "",
        r.businessAddress || "",
      ),
      body: r.reviewBody,
      rating: r.starRating,
      date: r.createdAt,
      rawStatus: r.status,
      isGrayedOut,
      photoUrls: r.photoUrls,
      reviewAsAnon: r.reviewAsAnon,
      isGuestReview: r.isGuestReview,
      validatedAt: r.validatedAt,
      helpfulCount: r.helpfulCount ?? 0,
      businessReply: r.businessReply ?? null,
    };
  });
});

const sortedReviews = computed(() => {
  const reviews = [...mappedReviews.value];
  switch (reviewSortBy.value) {
    case "date-asc":
      return reviews.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    case "date-desc":
      return reviews.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    case "rating-desc":
      return reviews.sort((a, b) => b.rating - a.rating);
    case "rating-asc":
      return reviews.sort((a, b) => a.rating - b.rating);
    default:
      return reviews;
  }
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
    const cityName = (city.city || "").trim();
    const stateName = (city.state || "").trim();
    const reviewCount = city.reviewCount ?? 0;
    if (
      cityName.toLowerCase() === "online" &&
      stateName.toLowerCase() === "online"
    )
      return { display: "Online", reviewCount };
    if (stateName === "Unknown") return { display: cityName, reviewCount };
    return { display: `${cityName}, ${stateName}`, reviewCount };
  });
});

const availableCities = computed(() => {
  if (!editForm.value.state) return [];
  const found = nigerianLocations.find((l) => l.state === editForm.value.state);
  return found ? found.cities : [];
});

// Show referral entry only within 24hrs of registration
const canEnterReferralCode = computed(() => {
  if (!summary.value || !isUser.value) return false;
  const regDate =
    (summary.value.profile as any).createdAt ||
    (summary.value.profile as any).joinDate;
  if (!regDate) return false;
  const hoursSinceReg =
    (Date.now() - new Date(regDate).getTime()) / (1000 * 60 * 60);
  return hoursSinceReg <= 24;
});

// ── Business reply fetching ────────────────────────────────────────────────

const handleHelpfulVote = async (reviewId: string) => {
  if (!userId) {
    showGuestAuthModal.value = true;
    return;
  }
  if (votingInProgress.value[reviewId]) return;

  votingInProgress.value[reviewId] = true;

  // Optimistic update — flip immediately so UI feels instant
  const current = voteState.value[reviewId] ?? { hasVoted: false, count: 0 };
  const optimisticCount = current.hasVoted
    ? Math.max(0, current.count - 1)
    : current.count + 1;

  voteState.value[reviewId] = {
    hasVoted: !current.hasVoted,
    count: optimisticCount,
  };

  try {
    const res = await toggleUpvoteReview(reviewId, userId);
    if (res?.statusCode === 200 && res.data) {
      // Reconcile with server truth
      voteState.value[reviewId] = {
        hasVoted:
          res.data.userHasVoted ?? res.data.hasVoted ?? !current.hasVoted,
        count: res.data.helpfulCount ?? optimisticCount,
      };
    } else {
      // API failed — roll back to previous state
      voteState.value[reviewId] = current;
    }
  } catch {
    // Network error — roll back
    voteState.value[reviewId] = current;
  } finally {
    votingInProgress.value[reviewId] = false;
  }
};

const seedVoteState = async (reviewIds: string[]) => {
  if (!reviewIds.length) return;

  // First, seed ALL reviews with their count from the summary as a baseline
  // This ensures count is always visible even before API calls return
  reviewIds.forEach((id) => {
    const reviewItem = summary.value?.reviews.items.find((r) => r.id === id);
    voteState.value[id] = {
      hasVoted: false,
      count: reviewItem?.helpfulCount ?? 0,
    };
  });

  // If no logged-in user, we're done — just show counts, no hasVoted state needed
  if (!userId) return;

  // Fire status checks in parallel for logged-in users
  const results = await Promise.allSettled(
    reviewIds.map((id) => getHelpfulVoteStatus(id, userId)),
  );

  results.forEach((result, index) => {
    const reviewId = reviewIds[index];
    if (!reviewId) return;

    if (
      result.status === "fulfilled" &&
      result.value?.statusCode === 200 &&
      result.value.data
    ) {
      // Preserve the count from summary, just update hasVoted + use API count if available
      voteState.value[reviewId] = {
        hasVoted: result.value.data.hasVoted ?? false,
        count:
          result.value.data.helpfulCount ??
          voteState.value[reviewId]?.count ??
          0,
      };
    }
    // On failure, the baseline seed above is already in place — no action needed
  });
};

// ── Dispute / flag ─────────────────────────────────────────────────────────
const openDisputeModal = async (reviewId: string, businessId: string) => {
  if (!userId) {
    showGuestAuthModal.value = true;
    return;
  }
  disputeModal.value = { open: true, reviewId, businessId };
  disputeForm.value = { categoryCode: "", explanation: "", evidenceUrl: "" };
  disputeSuccess.value = false;
  disputeError.value = null;

  if (!disputeCategories.value.length) {
    const res = await getDisputeCategories();
    if (res?.statusCode === 200 && Array.isArray(res.data)) {
      disputeCategories.value = res.data;
    }
  }
};

const closeDisputeModal = () => {
  disputeModal.value = { open: false, reviewId: "", businessId: "" };
};

const handleSubmitDispute = async () => {
  if (!disputeForm.value.categoryCode || !disputeForm.value.explanation.trim())
    return;
  disputeSubmitting.value = true;
  disputeError.value = null;
  try {
    const payload = {
      reviewId: disputeModal.value.reviewId,
      businessId: disputeModal.value.businessId,
      categoryCode: disputeForm.value.categoryCode,
      filedByUserId: userId,
      explanation: disputeForm.value.explanation.trim(),
      evidenceUrls: disputeForm.value.evidenceUrl.trim()
        ? [disputeForm.value.evidenceUrl.trim()]
        : [],
      businessPlan: "",
    };
    const res = await sendDispute(payload);
    if (res?.statusCode === 200 || res?.statusCode === 201) {
      disputeSuccess.value = true;
      setTimeout(closeDisputeModal, 2500);
    } else {
      disputeError.value =
        res?.data?.error ||
        res?.data?.message ||
        "Failed to submit report. Please try again.";
    }
  } catch (err: any) {
    disputeError.value = err?.response?.data
      ? err.response.data.error || err.response.data.message
      : "Something went wrong.";
  } finally {
    disputeSubmitting.value = false;
  }
};

// ── Data fetch ─────────────────────────────────────────────────────────────
const loadSummary = async (isInitial = false) => {
  if (!currentUserId.value) {
    error.value = "User ID is missing";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const result = await getUserSummary(
      currentUserId.value,
      reviewPage.value,
      reviewPageSize.value,
      isInitial,
    );
    if (result?.statusCode === 200 && result.data) {
      summary.value = result.data;
      isUser.value = userId === currentUserId.value;
      // ── Seed vote state if viewing own profile ──────────────────────
      if (summary.value?.reviews?.items?.length) {
        await seedVoteState(summary.value.reviews.items.map((r) => r.id));
      }
    } else {
      error.value = "Failed to load profile";
    }
  } catch (err: any) {
    error.value =
      err?.response?.data?.message || err.message || "Failed to load profile";
  } finally {
    loading.value = false;
  }
};

// ── Email Verification ─────────────────────────────────────────────────────
const verificationBannerDismissed = ref(false);
const sendingVerification = ref(false);
const verificationToast = ref<{
  visible: boolean;
  message: string;
  type: "info" | "success" | "error";
}>({
  visible: false,
  message: "",
  type: "info",
});

let toastTimer: ReturnType<typeof setTimeout> | null = null;

const openVerificationModal = async () => {
  if (sendingVerification.value) return;
  sendingVerification.value = true;
  try {
    const api = useUserProfileApi();
    await api.post("api/Verification/reverify-email", {
      email: summary.value?.profile.email,
    });
    verificationBannerDismissed.value = true;
    toast.add({
      severity: "success",
      summary: "Verification Email Sent",
      detail:
        "Please check your inbox and click the link to verify your account.",
      life: 8000,
    });
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Failed to Send",
      detail:
        err?.response?.data?.message ||
        "Could not send verification email. Please try again.",
      life: 6000,
    });
  } finally {
    sendingVerification.value = false;
  }
};

// ── Address helpers ────────────────────────────────────────────────────────
const onStateChange = () => {
  editForm.value.city = "";
};

// ── Profile edit ───────────────────────────────────────────────────────────
const startEdit = () => {
  if (summary.value) {
    const parts = (summary.value.profile.address || "")
      .split(",")
      .map((p) => p.trim());
    const existingCity = parts[0] || "";
    const existingState = parts[1] || "";
    editForm.value = {
      username: summary.value.profile.username,
      phoneNumber: summary.value.profile.phone || "",
      address: summary.value.profile.address || "",
      state: existingState,
      city: existingCity,
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
    if (editForm.value.city && editForm.value.state) {
      updates.address = `${editForm.value.city}, ${editForm.value.state}`;
    } else if (editForm.value.state) {
      updates.address = editForm.value.state;
    }
    const result = await updateUserProfile(currentUserId.value, updates);
    if (result?.statusCode === 200) {
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
    saveError.value =
      err?.response?.data?.message || err.message || "Failed to save profile";
  } finally {
    saving.value = false;
  }
};

// ── Referral code entry ────────────────────────────────────────────────────
const handleApplyReferralCode = async () => {
  if (!incomingReferralCode.value.trim() || !currentUserId.value) return;
  applyingReferralCode.value = true;
  referralCodeError.value = null;
  try {
    const api = useUserProfileApi();
    const res = await api.post<{
      success: boolean;
      message: string;
      referrerId: string;
    }>(`api/referral/use`, {
      userId: currentUserId.value,
      code: incomingReferralCode.value.trim(),
    });
    if (res.data.success) {
      referralCodeApplied.value = true;
    } else {
      referralCodeError.value =
        res.data.message || "Invalid or already used code.";
    }
  } catch (err: any) {
    referralCodeError.value =
      err?.response?.data?.message || "Failed to apply code. Please try again.";
  } finally {
    applyingReferralCode.value = false;
  }
};

// ── Rewards helpers ────────────────────────────────────────────────────────
const copyReferralCode = async () => {
  try {
    await navigator.clipboard.writeText(summary.value?.referral.code || "");
    codeCopied.value = true;
    setTimeout(() => {
      codeCopied.value = false;
    }, 2000);
  } catch {
    /* fallback silently */
  }
};

// ── Generic helpers ────────────────────────────────────────────────────────
const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;
};

const getStatusIcon = (status: string) => {
  const map: Record<string, { icon: string; color: string; message: string }> =
    {
      APPROVED: {
        icon: "pi-check-circle",
        color: "text-green-600",
        message: "Your review is live and visible to everyone",
      },
      PENDING: {
        icon: "pi-clock",
        color: "text-gray-600",
        message: "Being reviewed by our team",
      },
      REJECTED: {
        icon: "pi-times-circle",
        color: "text-red-600",
        message: "Did not meet community guidelines",
      },
      FLAGGED: {
        icon: "pi-flag",
        color: "text-orange-600",
        message: "Under review for potential issues",
      },
    };
  return map[status] ?? map["PENDING"]!;
};

const getAchievementColor = (badgeType: string): string => {
  const colors: Record<string, string> = {
    pioneer: "bg-yellow-100",
    explorer: "bg-blue-100",
    reviewer: "bg-green-100",
    influencer: "bg-purple-100",
  };
  return colors[badgeType?.toLowerCase()] || "bg-gray-100";
};

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = "/images/default-business-logo.png";
};

const formatBusinessAddress = (
  city: string,
  state: string,
  address?: string,
): string => {
  const isOnline =
    city?.toLowerCase() === "online" && state?.toLowerCase() === "online";
  if (isOnline) return "Online";
  if (state === "Unknown" || !state)
    return address ? `${address}, ${city}` : city;
  if (!city) return state;
  if (!address) return `${city}, ${state}`;
  return address;
};

const s = (n: number | null | undefined) => (n === 1 ? "" : "s");

const getStarValue = (rating: number, position: number): number => {
  if (rating >= position) return 1; // full star
  if (rating >= position - 1) return rating - (position - 1); // partial e.g. 0.5
  return 0; // empty star
};

// ── Lifecycle ──────────────────────────────────────────────────────────────
const pageChanging = ref(false);

const onReviewPageChange = async (event: PageState) => {
  if (pageChanging.value) return;
  pageChanging.value = true;
  reviewPage.value = event.page + 1;
  reviewPageSize.value = event.rows;
  await loadSummary(false);
  pageChanging.value = false;
};

onBeforeMount(async () => {
  await loadSummary(true);
});

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer);
});
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
.hero-bg-circles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.circle {
  position: absolute;
  border-radius: 50%;
}
.c1 {
  width: 200px;
  height: 200px;
  top: -60px;
  right: -60px;
  background: rgba(251, 191, 36, 0.08);
}
.c2 {
  width: 140px;
  height: 140px;
  bottom: -40px;
  left: -30px;
  background: rgba(245, 158, 11, 0.06);
}
.c3 {
  width: 80px;
  height: 80px;
  top: 40%;
  left: 15%;
  background: rgba(255, 255, 255, 0.04);
}
.hero-content {
  position: relative;
  z-index: 1;
}
.hero-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6ee7b7;
  margin: 0 0 0.5rem;
}
.hero-points {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.3rem;
  margin-bottom: 1rem;
}
.points-number {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 8px rgba(251, 191, 36, 0.4));
}
.points-unit {
  font-size: 1.2rem;
  font-weight: 600;
  color: #6ee7b7;
}
.hero-meta {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}
.meta-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}
.meta-pill--tier {
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.3),
    rgba(245, 158, 11, 0.25)
  );
  border-color: rgba(251, 191, 36, 0.6);
  color: #fef3c7;
  font-size: 0.8rem;
}
.meta-pill--gold {
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.2),
    rgba(245, 158, 11, 0.15)
  );
  border-color: rgba(251, 191, 36, 0.4);
  color: #fef9e7;
}

.r-section {
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.r-section-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Breakdown */
.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.65rem;
}
.breakdown-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.8rem;
  cursor: default;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}
.breakdown-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}
.bcard-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.bcard-body {
  flex: 1;
  min-width: 0;
}
.bcard-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
}
.bcard-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}
.bcard-tip-icon {
  position: absolute;
  top: 7px;
  right: 7px;
  color: #94a3b8;
  font-size: 0.7rem;
  cursor: help;
}
.tooltip-bubble {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  right: 0;
  z-index: 50;
  background: white;
  border: 1.5px solid var(--tip-border, #e2e8f0);
  border-top: 3px solid var(--tip-accent, #e2e8f0);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.09),
    0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0.75rem;
  padding: 0.75rem 0.85rem;
  pointer-events: none;
}

.tooltip-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 1.25rem;
  border: 6px solid transparent;
  border-top-color: var(--tip-border, #e2e8f0);
}

.tip-title {
  font-size: 0.74rem;
  font-weight: 700;
  margin: 0 0 0.3rem;
  color: var(--tip-accent, #1e293b);
}

.tip-body {
  font-size: 0.69rem;
  line-height: 1.6;
  margin: 0;
  color: #64748b;
}

.tip-body em {
  font-style: normal;
  font-weight: 700;
  color: var(--tip-accent, #1e293b);
}
.tip-fade-enter-active,
.tip-fade-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.tip-fade-enter-from,
.tip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Referral */
.referral-card {
  background: linear-gradient(135deg, #faf5ff, #ede9fe);
  border: 1px solid #ddd6fe;
  border-radius: 0.875rem;
  padding: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
}
.referral-left {
  flex: 1;
  min-width: 0;
}
.referral-headline {
  font-size: 0.95rem;
  font-weight: 700;
  color: #4c1d95;
  margin: 0 0 0.25rem;
}
.referral-sub {
  font-size: 0.8rem;
  color: #6d28d9;
  margin: 0 0 0.85rem;
}
.referral-code-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.code-badge {
  background: white;
  border: 2px dashed #7c3aed;
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
}
.code-text {
  font-family: "Courier New", monospace;
  font-size: 0.95rem;
  font-weight: 800;
  color: #5b21b6;
  letter-spacing: 0.1em;
}
.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
}
.copy-btn:hover {
  background: #6d28d9;
}
.copy-btn.copied {
  background: #16a34a;
}
.copy-btn:active {
  transform: scale(0.97);
}
.referral-stats {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: white;
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  border: 1px solid #ede9fe;
}
.ref-stat {
  text-align: center;
}
.ref-stat-val {
  display: block;
  font-size: 1.3rem;
  font-weight: 800;
  color: #4c1d95;
  line-height: 1;
}
.ref-stat-label {
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8b5cf6;
}
.ref-stat-divider {
  width: 1px;
  height: 30px;
  background: #ede9fe;
}

/* Referral code entry */
.enter-referral-wrap {
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px dashed #ddd6fe;
}
.enter-ref-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6d28d9;
  margin: 0 0 0.45rem;
}
.enter-ref-row {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.enter-ref-input {
  flex: 1;
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #5b21b6;
  background: white;
  border: 2px solid #ddd6fe;
  border-radius: 8px;
  padding: 0.4rem 0.7rem;
  outline: none;
  transition: border-color 0.15s;
}
.enter-ref-input:focus {
  border-color: #7c3aed;
}
.enter-ref-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.apply-ref-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.apply-ref-btn:hover:not(:disabled) {
  background: #6d28d9;
}
.apply-ref-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ref-apply-msg {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.73rem;
  font-weight: 600;
  margin-top: 0.5rem;
  padding: 0.4rem 0.65rem;
  border-radius: 7px;
}
.ref-apply-msg--error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.ref-apply-msg--success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.coming-soon-card {
  opacity: 0.6;
  cursor: default;
  background: #fafafa;
}
.option-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}
.option-emoji {
  font-size: 1.4rem;
}
.option-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
.option-cost {
  font-size: 0.7rem;
  color: #64748b;
  margin: 0;
}
.cost-num {
  font-weight: 700;
  color: #16a34a;
}
.option-check {
  margin-left: auto;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}
.option-check.visible {
  opacity: 1;
}
.option-desc {
  font-size: 0.7rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}
.option-shortage {
  font-size: 0.68rem;
  color: #ef4444;
  font-weight: 600;
  margin: 0.35rem 0 0;
}
.coming-soon-badge {
  margin-left: auto;
  background: #fef3c7;
  color: #92400e;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 6px;
  border-radius: 999px;
}

/* ── Review Action Row ───────────────────────────────────────────────────── */
.review-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.action-btn:hover:not(:disabled) {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #374151;
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.action-btn--vote.action-btn--voted {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #2563eb;
}

.action-btn--vote:hover:not(:disabled):not(.action-btn--voted) {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.action-btn--flag:hover:not(:disabled) {
  border-color: #f97316;
  color: #ea580c;
  background: #fff7ed;
}

.vote-count {
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 999px;
  padding: 0 0.4rem;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.4;
  min-width: 1.2rem;
  text-align: center;
}

.action-btn--voted .vote-count {
  background: #2563eb;
  color: white;
}

/* ── Dispute Modal ───────────────────────────────────────────────────────── */
.dispute-modal {
  background: white;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.dispute-modal__header {
  background: linear-gradient(135deg, #fff7ed, #fed7aa);
  border-radius: 1.25rem 1.25rem 0 0;
  padding: 1.5rem 1.5rem 1.25rem;
  text-align: center;
  border-bottom: 1px solid #fed7aa;
}

.dispute-icon {
  width: 48px;
  height: 48px;
  background: #ea580c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  color: white;
  font-size: 1.1rem;
}

.dispute-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #7c2d12;
  margin: 0 0 0.25rem;
}

.dispute-subtitle {
  font-size: 0.78rem;
  color: #9a3412;
  margin: 0;
}

.dispute-modal__body {
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #374151;
}

.field-optional {
  font-weight: 400;
  color: #9ca3af;
}

.field-select,
.field-input {
  width: 100%;
  padding: 0.55rem 0.85rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #1f2937;
  background: white;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.field-select:focus,
.field-input:focus {
  border-color: #ea580c;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
}

.field-textarea {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #1f2937;
  background: white;
  outline: none;
  resize: vertical;
  min-height: 90px;
  font-family: inherit;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.field-textarea:focus {
  border-color: #ea580c;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
}

.field-hint {
  font-size: 0.68rem;
  color: #9ca3af;
  text-align: right;
}

.dispute-error {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.55rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
}

.dispute-modal__actions {
  display: flex;
  gap: 0.6rem;
  padding-top: 0.25rem;
}

.dispute-cancel-btn {
  flex: 1;
  padding: 0.65rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.dispute-cancel-btn:hover {
  background: #e5e7eb;
}

.dispute-submit-btn {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem;
  background: #ea580c;
  color: white;
  border: none;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.dispute-submit-btn:hover:not(:disabled) {
  background: #c2410c;
}
.dispute-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dispute-success {
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #16a34a;
  font-size: 1.5rem;
}

.dispute-success h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #166534;
  margin: 0 0 0.5rem;
}

.dispute-success p {
  font-size: 0.82rem;
  color: #4b7c5c;
  line-height: 1.5;
  margin: 0;
}

.own-vote-count {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #cbd5e1;
  font-size: 0.73rem;
}

.own-vote-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.3rem;
  padding: 0 0.4rem;
  height: 1.3rem;
  background: #f1f5f9;
  color: #94a3b8;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1;
}

/* ── Email Verification Banner ───────────────────────────────────────────── */
.verification-banner {
  position: sticky;
  top: 64px; /* height of NavBarProfile */
  z-index: 45;
  background: linear-gradient(90deg, #7c2d12, #c2410c);
  color: white;
  padding: 0.6rem 1rem;
  box-shadow: 0 2px 8px rgba(194, 65, 12, 0.3);
}

.vb-inner {
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.vb-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  min-width: 0;
}

.vb-icon {
  font-size: 1rem;
  flex-shrink: 0;
  opacity: 0.9;
}

.vb-text {
  font-size: 0.82rem;
  line-height: 1.4;
}

.vb-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.vb-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: white;
  color: #c2410c;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.vb-btn:hover:not(:disabled) {
  background: #fff7ed;
}
.vb-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vb-dismiss {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  transition: background 0.15s;
  flex-shrink: 0;
}

.vb-dismiss:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* ── Verification Toast ──────────────────────────────────────────────────── */
.verif-toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1300;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 500;
  max-width: 420px;
  width: calc(100% - 2rem);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  line-height: 1.4;
}

.verif-toast--info {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.verif-toast--info .pi {
  color: #2563eb;
  font-size: 1rem;
  flex-shrink: 0;
}

.verif-toast--success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.verif-toast--success .pi {
  color: #16a34a;
  font-size: 1rem;
  flex-shrink: 0;
}

.verif-toast--error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.verif-toast--error .pi {
  color: #ef4444;
  font-size: 1rem;
  flex-shrink: 0;
}

.verif-toast span {
  flex: 1;
}

.verif-toast-close {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  padding: 0.1rem 0.2rem;
  flex-shrink: 0;
  font-size: 0.75rem;
}
.verif-toast-close:hover {
  opacity: 1;
}

.verif-toast-enter-active,
.verif-toast-leave-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.verif-toast-enter-from,
.verif-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* ── Profile Grid Layout ─────────────────────────────────────────────────── */
.profile-grid {
  display: flex;
  flex-direction: column;
}

.middle-col {
  order: 1;
}
.left-col {
  order: 2;
}
.right-col {
  order: 3;
  display: block;
} /* hidden on mobile */

@media (min-width: 768px) {
  .profile-grid {
    display: grid;
    grid-template-columns: 3fr 7fr 2fr; /* matches col-span-3, 7, 2 */
    align-items: start;
  }

  /* Reset order — grid uses DOM order, which is Middle, Left, Right */
  /* So we need to explicitly place them in the right grid columns */
  .left-col {
    grid-column: 1;
    grid-row: 1;
    order: unset;
  }
  .middle-col {
    grid-column: 2;
    grid-row: 1;
    order: unset;
  }
  .right-col {
    grid-column: 3;
    grid-row: 1;
    display: block;
  }
}

@media (max-width: 480px) {
  .breakdown-grid {
    grid-template-columns: 1fr;
  }
  .referral-card {
    flex-direction: column;
  }
  .redeem-options {
    grid-template-columns: 1fr;
  }
  .r-section {
    border-radius: 0;
    padding: 0;
    border: none;
    box-shadow: none;
  }
  .referral-code-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap;
    margin-bottom: 10px;
  }
  .copy-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.55rem 0.5rem;
    font-size: 0.65rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.2s,
      transform 0.1s;
  }
  .referral-card {
    display: block;
    padding: 1rem;
  }
  .referral-stats {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    background: white;
    border-radius: 10px;
    padding: 0.75rem 0.9rem;
    border: 1px solid #ede9fe;
    width: full;
    justify-content: center;
  }
  .ref-stat {
    text-align: center;
    width: full;
    justify-content: center;
    align-items: center;
  }
  .ref-stat-val {
    display: block;
    font-size: 0.9rem;
    font-weight: 800;
    color: #4c1d95;
    line-height: 1;
  }
  .ref-stat-label {
    font-size: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8b5cf6;
  }
  .ref-stat-divider {
    display: none;
  }
  .enter-ref-row {
    flex-direction: column;
    align-items: stretch;
  }
  .apply-ref-btn {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .redeem-options {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
