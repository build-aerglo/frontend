
```
frontend
├─ app
│  ├─ app.vue
│  ├─ assets
│  │  ├─ css
│  │  │  ├─ bundle.css
│  │  │  └─ bundles
│  │  │     ├─ core.css
│  │  │     ├─ demo.css
│  │  │     ├─ front-page.css
│  │  │     └─ page-auth.css
│  │  
│  │  ├─ profile.vue
│  │  ├─ profiles
│  │  │  └─ index.vue
│  │  ├─ rough.html
│  │  ├─ style.css
│  │  └─ svg
│  │     ├─ naira.svg
│  │     └─ spinner.svg
│  ├─ components
│  │  ├─ Auth
│  │  │  ├─ AuthSignInForm.vue
│  │  │  ├─ AuthSignUpForm.vue
│  │  │  └─ AuthUnifiedModal.vue
│  │  ├─ Badge.vue
│  │  ├─ BadgeToolTip.vue
│  │  ├─ Business
│  │  │  ├─ Business.vue
│  │  │  ├─ BusinessMedia.vue
│  │  │  ├─ BusinessOpeningHours.vue
│  │  │  ├─ BusinessProfile.vue
│  │  │  ├─ BusinessQr.vue
│  │  │  ├─ BusinessReviews.vue
│  │  │  ├─ BusinessSingle.vue
│  │  │  └─ BusinessStatusFrame.vue
│  │  ├─ BusinessLanding
│  │  │  ├─ CTA.vue
│  │  │  ├─ Hero.vue
│  │  │  ├─ KeyBenefit.vue
│  │  │  ├─ More.vue
│  │  │  ├─ Nav.vue
│  │  │  ├─ PricingPreview.vue
│  │  │  └─ SocialProof.vue
│  │  ├─ Button
│  │  │  └─ ButtonCustom.vue
│  │  ├─ Categories.vue
│  │  ├─ CategorySearch.vue
│  │  ├─ ChangePasswordModal.vue
│  │  ├─ EditBusinessModal.vue
│  │  ├─ General
│  │  │  └─ GeneralLoader.vue
│  │  ├─ Input
│  │  │  ├─ ImageUploader.vue
│  │  │  ├─ InputFile.vue
│  │  │  ├─ InputLabel.vue
│  │  │  ├─ InputMedia.vue
│  │  │  ├─ InputSelect.vue
│  │  │  ├─ InputTextAreaCustom.vue
│  │  │  └─ InputTextCustom.vue
│  │  ├─ LandingCategories.vue
│  │  ├─ LandingSub.vue
│  │  ├─ LogoutConfirm.vue
│  │  ├─ Nav
│  │  │  ├─ NavBar.vue
│  │  │  ├─ NavBarCategories.vue
│  │  │  ├─ NavBarProfile.vue
│  │  │  ├─ NavBarReview.vue
│  │  │  ├─ NavFooter.vue
│  │  │  ├─ NavLogo.vue
│  │  │  └─ NavSideBar.vue
│  │  ├─ OpeningHoursPicker.vue
│  │  ├─ Profile
│  │  │  ├─ ProfileDetails.vue
│  │  │  ├─ ProfileFaq.vue
│  │  │  ├─ ProfileField.vue
│  │  │  ├─ ProfileGetReview.vue
│  │  │  ├─ ProfileImageUploader.vue
│  │  │  ├─ ProfileLocation.vue
│  │  │  ├─ ProfileMedia.vue
│  │  │  ├─ ProfileOverview.vue
│  │  │  ├─ ProfileRating.vue
│  │  │  ├─ ProfileReview.vue
│  │  │  ├─ ProfileVerified.vue
│  │  │  └─ SettingConnection.vue
│  │  ├─ Profiles
│  │  │  ├─ ProfileDetails.vue
│  │  │  ├─ ProfileFaq.vue
│  │  │  ├─ ProfileField.vue
│  │  │  ├─ ProfileGetReview.vue
│  │  │  ├─ ProfileLocation.vue
│  │  │  ├─ ProfileMedia.vue
│  │  │  ├─ ProfileOverview.vue
│  │  │  ├─ ProfileRating.vue
│  │  │  ├─ ProfileReview.vue
│  │  │  ├─ ProfileVerified.vue
│  │  │  └─ SettingConnection.vue
│  │  ├─ Review
│  │  │  ├─ Review.vue
│  │  │  ├─ ReviewForm.vue
│  │  │  └─ ReviewSlider.vue
│  │  ├─ ReviewCard.vue
│  │  ├─ Search
│  │  │  ├─ SearchBarHome.vue
│  │  │  └─ SearchBusinessClaim.vue
│  │  ├─ Setting
│  │  │  ├─ SettingResponse.vue
│  │  │  ├─ SettingSecurity.vue
│  │  │  ├─ SettingSubscription.vue
│  │  │  └─ SettingTab.vue
│  │  ├─ Star
│  │  │  └─ Star.vue
│  │  ├─ Stars.vue
│  │  ├─ SubscriptionCard.vue
│  │  ├─ TopReviewed.vue
│  │  └─ UserAvatar.vue
│  ├─ composables
│  │  ├─ api
│  │  │  └─ useReviewApi.ts
│  │  ├─ business
│  │  │  ├─ useBusinessApi.ts
│  │  │  ├─ useBusinessMethods.ts
│  │  │  └─ useBusinessUser.ts
│  │  ├─ device
│  │  │  ├─ useDeviceFingerprint.ts
│  │  │  └─ useGeolocation.ts
│  │  ├─ method
│  │  │  ├─ usePageData.ts
│  │  │  └─ useReviewMethods.ts
│  │  ├─ review
│  │  │  ├─ useEnrichedReviews.ts
│  │  │  ├─ useReviewApi.ts
│  │  │  └─ useReviewMethods.ts
│  │  ├─ search
│  │  │  ├─ useSearch.ts
│  │  │  └─ useSearchApi.ts
│  │  ├─ support
│  │  │  ├─ useSupportApi.ts
│  │  │  └─ useSupportUser.ts
│  │  ├─ useApi.ts
│  │  ├─ useBadgeApi.ts
│  │  ├─ useBusinessDashboard.ts
│  │  ├─ useBusinessSampleData.ts
│  │  ├─ useDummyReviews.ts
│  │  ├─ useMethods.ts
│  │  ├─ useNigerianLocations.ts
│  │  ├─ user
│  │  │  ├─ useUserProfileApi.ts
│  │  │  └─ useUserProfileMethods.ts
│  │  ├─ useSampleAnalytics.ts
│  │  ├─ useSocialAuth.ts
│  │  └─ useUser.ts
│  ├─ layouts
│  │  ├─ biz.vue
│  │  ├─ business.vue
│  │  ├─ default.vue
│  │  └─ support.vue
│  ├─ middleware
│  │  └─ businessauth.ts
│  ├─ pages
│  │  ├─ auth
│  │  │  └─ callback.vue
│  │  ├─ biz
│  │  │  └─ [id]
│  │  │     ├─ claim-business.vue
│  │  │     ├─ index.vue
│  │  │     └─ test.vue
│  │  ├─ business
│  │  │  ├─ access.vue
│  │  │  ├─ auth
│  │  │  │  ├─ password-reset.vue
│  │  │  │  ├─ sign-in.vue
│  │  │  │  └─ sign-up.vue
│  │  │  ├─ branches
│  │  │  │  ├─ index.vue
│  │  │  │  └─ [id]
│  │  │  │     └─ manage.vue
│  │  │  ├─ dashboard.vue
│  │  │  ├─ help.vue
│  │  │  ├─ landing.vue
│  │  │  ├─ messages.vue
│  │  │  ├─ profile
│  │  │  │  └─ index.vue
│  │  │  ├─ reports.vue
│  │  │  ├─ reviews-management.vue
│  │  │  ├─ settings.vue
│  │  │  └─ [id].vue
│  │  ├─ category
│  │  │  └─ [id].vue
│  │  ├─ end-user
│  │  │  ├─ auth
│  │  │  │  └─ forgot-password.vue
│  │  │  ├─ landing
│  │  │  │  ├─ categories.vue
│  │  │  │  └─ explore.vue
│  │  │  └─ profile
│  │  │     ├─ business.vue
│  │  │     └─ index.vue
│  │  ├─ index.vue
│  │  ├─ links.vue
│  │  ├─ review
│  │  │  └─ write-review.vue
│  │  ├─ subscription.vue
│  │  ├─ support
│  │  │  ├─ auth
│  │  │  │  ├─ password-reset.vue
│  │  │  │  ├─ sign-in.vue
│  │  │  │  └─ sign-up.vue
│  │  │  └─ user
│  │  │     ├─ businesses.vue
│  │  │     ├─ category-management.vue
│  │  │     ├─ claim-management.vue
│  │  │     ├─ dashboard.vue
│  │  │     ├─ profile.vue
│  │  │     ├─ review-moderation.vue
│  │  │     └─ settings.vue
│  │  ├─ tags
│  │  │  └─ [id].vue
│  │  ├─ test.vue
│  │  ├─ user
│  │  │  └─ [id]
│  │  │     └─ index.vue
│  │  └─ waitlist
│  │     └─ index.vue
│  ├─ store
│  │  ├─ business
│  │  │  ├─ businessProfile.ts
│  │  │  └─ businessUser.ts
│  │  ├─ supportUser.ts
│  │  └─ user.ts
│  ├─ types
│  │  ├─ badge.ts
│  │  ├─ business
│  │  │  └─ index.ts
│  │  ├─ index.ts
│  │  ├─ review.ts
│  │  ├─ support
│  │  │  └─ index.ts
│  │  └─ user.ts
│  └─ utils
│     ├─ categoryIcons.ts
│     ├─ constants.ts
│     ├─ index.ts
│     └─ nigerianLocations.ts
├─ error.vue
├─ nuxt.config.ts
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.ico
│  
├─ README.md
├─ server
│  └─ api
│     ├─ delete.get.ts
│     └─ upload.post.ts
├─ tailwind.config.js
└─ tsconfig.json

```