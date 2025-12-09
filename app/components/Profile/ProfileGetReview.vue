<template>
  <div class="flex flex-col gap-4">
    <div>
      <!-- Main Content Card -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <!-- Business Info -->
        <div class="text-center mb-8">
          <p class="text-sm text-gray-500">Share your review link and QR code to collect customer feedback</p>
        </div>

        <div class="mb-2 pb-2 border-b border-gray-200">
          <h3 class="text-2xl font-semibold text-gray-900 mb-2">{{ businessName }}</h3>
          <p class="text-gray-600">Share this link with your customers to collect reviews</p>
        </div>

        <!-- Shareable Link Section -->
        <div class="mb-10">
          <label class="block text-sm font-medium text-gray-700 mb-3">Your Review Link</label>
          <div class="flex gap-3">
            <div class="flex-1 relative">
              <input type="text" :value="reviewUrl" readonly
                class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008253] focus:border-transparent" />
              <i class="pi pi-link absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>

            <button @click="copyToClipboard"
              class="px-6 py-3 bg-[#008253] text-white rounded-lg font-medium hover:bg-[#006b44] transition-colors flex items-center gap-2 whitespace-nowrap">
              <i :class="copied ? 'pi pi-check' : 'pi pi-copy'"></i>
              {{ copied ? 'Copied!' : 'Copy Link' }}
            </button>
          </div>
        </div>

        <!-- QR Code Section -->
        <div class="grid md:grid-cols-2 gap-8">
          <!-- QR Code Display -->
          <div class="flex flex-col items-center">
            <label class="block text-sm font-medium text-gray-700 mb-4 self-start">QR Code</label>
            <div ref="qrCodeContainer" class="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
              <img :src="qrCodeUrl" class="w-64 h-64" />
            </div>
            <p class="text-sm text-gray-500 mt-3 text-center">Scan to leave a review</p>
          </div>

          <!-- QR Code Actions -->
          <div class="flex flex-col justify-center space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Share Your QR Code</h3>
            <p class="text-gray-600 text-sm mb-4">Download or print your QR code to display at your business location
            </p>

            <button @click="downloadQRCode"
              class="w-full px-6 py-3 bg-[#008253] text-white rounded-lg font-medium hover:bg-[#006b44] transition-colors flex items-center justify-center gap-2">
              <i class="pi pi-download"></i>
              Download QR Code
            </button>

            <button @click="printQRCode"
              class="w-full px-6 py-3 bg-white text-[#008253] border-2 border-[#008253] rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <i class="pi pi-print"></i>
              Print QR Code
            </button>

            <button @click="shareQRCode"
              class="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <i class="pi pi-share-alt"></i>
              Share
            </button>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="pi pi-lightbulb text-[#008253]"></i>
          Tips for Getting More Reviews
        </h3>

        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <i class="pi pi-check-circle text-[#008253] mt-1 flex-shrink-0"></i>
            <span>Print the QR code and display it at your checkout counter or entrance</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="pi pi-check-circle text-[#008253] mt-1 flex-shrink-0"></i>
            <span>Include the review link in follow-up emails or text messages</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="pi pi-check-circle text-[#008253] mt-1 flex-shrink-0"></i>
            <span>Add the QR code to receipts, business cards, or promotional materials</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps(['business'])
const businessName = ref(props.business.name);
const reviewUrl = ref(`https://clereview.com/business/${props.business.id}`);
const config = useRuntimeConfig();

const copied = ref(false);

const qrCodeUrl = computed(() =>
  `${config.public.QR_API_BASE}?size=${config.public.QR_SIZE}&data=${encodeURIComponent(
    reviewUrl.value
  )}`
);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(reviewUrl.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const downloadQRCode = () => {
  const link = document.createElement("a");
  link.href = qrCodeUrl.value;
  link.download = `${businessName.value.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const printQRCode = () => {
  const popup = window.open("", "_blank");
  if (!popup) return;

  popup.document.write(
    `
    <!DOCTYPE html>
    <ht` +
    `ml>
      <he` +
    `ad>
        <title>Print QR Code - ${businessName.value}</title>
        <style>
          body { 
            display:flex; flex-direction:column; align-items:center;
            justify-content:center; min-height:100vh; margin:0; padding:2rem;
            font-family:system-ui,-apple-system,sans-serif;
          }
          .qr-box {
            border:2px solid #e5e7eb; padding:2rem; border-radius:1rem;
            background:white;
          }
          img { max-width:400px; display:block; }
          p { margin-top:1rem; color:#6b7280; font-size:1.125rem; }
        </style>
      </he` +
    `ad>
      <bo` +
    `dy>
        <h1>${businessName.value}</h1>
        <div class="qr-box">
          <img src="${qrCodeUrl.value}" />
        </div>
        <p>Scan to leave a review</p>

        <scr` +
    `ipt>
          window.onload = () => setTimeout(() => window.print(), 300);
        </scr` +
    `ipt>
      </bo` +
    `dy>
    </ht` +
    `ml>
    `
  );

  popup.document.close();
};

const shareQRCode = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Leave a review for ${businessName.value}`,
        text: `Share your experience with ${businessName.value}`,
        url: reviewUrl.value,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  } else {
    await copyToClipboard();
  }
};
</script>
