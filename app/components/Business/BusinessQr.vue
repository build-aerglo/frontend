<template>
    <Card class="shadow-none border-none">
        <template #content>
            <div class="p-[20px]">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-[50px]">
                    
                    <div class="flex justify-center items-start">
                        <div 
                            id="qr-poster-area" class="bg-white border-2 border-slate-100 shadow-2xl rounded-2xl p-8 flex flex-col items-center w-full max-w-[350px] text-center"
                        >
                            <div class="mb-6 flex flex-col items-center">
                                <img v-if="business?.logo" :src="business.logo" class="w-16 h-16 object-contain mb-2" />
                                <h2 class="text-2xl font-bold text-gray-700">{{ business?.name }}</h2>
                            </div>

                            <div class="w-full aspect-square bg-white border-4 border-slate-50 rounded-lg p-2 mb-4 flex items-center justify-center shadow-inner">
                                <img v-if="business?.qrCodeBase64" 
                                     :src="`data:image/png;base64,${business.qrCodeBase64}`" 
                                     class="w-full h-full object-contain" 
                                     alt="Business QR Code" />
                                
                                <Qrcode v-else
                                    :value="`https://clereview.com/biz/${business?.id}`"
                                    :size="300"
                                    level="H"
                                    class="w-full h-full"
                                />
                            </div>

                            <p class="text-xl font-bold text-slate-700 mb-6">How did we do today?</p>

                            <div class="flex items-center gap-2 pt-4 border-t border-slate-100 w-full justify-center">
                                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">Powered by</span>
                                <img src="~/assets/images/e-user-logo.png" alt="Clereview Logo" class="h-7 w-auto object-contain" />
                            </div>
                        </div>
                    </div>

                    <div class="md:col-span-2">
                        <div class="flex-1">Business Review Link:</div>
                        <div class="flex mb-[50px] gap-[10px]">
                            <InputText disabled v-model="qr" fluid />
                            <ButtonCustom :label="copied ? 'Copied' : 'Copy'" icon="copy" @clicked="copyToClipboard"
                                input-class="w-max" primary="true" size="lg" />
                        </div>

                        <div class="header">Share Your QR Code</div>
                        <div class="mt-[-20px] mb-8 text-slate-500">
                            Download or print your QR code to display at your business location
                        </div>

                        <div class="flex flex-col gap-[10px] mt-[40px] mb-12">
                            <ButtonCustom size="lg" :primary="true" icon="download" @clicked="downloadQRCode"
                                label="Download QR Code" />
                            <ButtonCustom size="lg" label="Print QR Code" icon="print" @clicked="printQRCode" />
                            <ButtonCustom size="lg" label="Share QR Code" icon="share-alt" @clicked="shareQRCode" />
                        </div>

                        <div class="mt-[100px]">
                            <div class="header">Tips for Getting More Reviews</div>
                            <div class="flex flex-col gap-[5px]">
                                <div v-for="(i, idx) in tips" :key="idx" class="flex gap-[5px] items-center">
                                    <i class="pi pi-check-circle"></i>
                                    {{ i }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import * as htmlToImage from 'html-to-image';
const props = defineProps(['business'])
const qr = ref("")
const copied = ref(false)
const tips = [
    "Print the QR code and display it at your checkout counter or entrance",
    "Include the review link in follow - up emails or text messages",
    "Add the QR code to receipts, business cards, or promotional materials"
]

// Fallback generator hook
const qrUrlGenerated = useQrcode(`https://clereview.com/biz/${props.business?.id}`, {
    toBase64: true,
})

onBeforeMount(() => {
    if (props.business) {
        qr.value = `https://clereview.com/biz/${props.business?.id}`
    }
})

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(qr.value);
        copied.value = true;
        setTimeout(() => (copied.value = false), 2000);
    } catch (err) {
        console.error("Failed to copy:", err);
    }
};

const printQRCode = async () => {
    const node = document.getElementById('qr-poster-area');
    if (!node) return;

    try {
        // We use htmlToImage to get a clean dataURL so the print window 
        // doesn't have to worry about loading external images or CORS
        const dataUrl = await htmlToImage.toPng(node, {
            backgroundColor: '#ffffff',
            pixelRatio: 2,
        });

        const popup = window.open("", "_blank");
        if (!popup) return;

        popup.document.write(`
            <html>
                <head>
                    <title>Print QR Code - ${props.business?.name}</title>
                    <style>
                        body { 
                            margin: 0; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            min-height: 100vh; 
                            background: #fff;
                        }
                        img { 
                            max-width: 90%; 
                            max-height: 90vh; 
                            object-fit: contain;
                            /* Ensures the shadow isn't clipped by the page edge */
                            filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1));
                        }
                        @page { size: auto; margin: 0mm; }
                    </style>
                </head>
                <body>
                    <img src="${dataUrl}" />
                    <script>
                        window.onload = () => { 
                            setTimeout(() => { 
                                window.print(); 
                                window.close(); 
                            }, 300); 
                        }
                    <\/script>
                </body>
            </html>
        `);
        popup.document.close();
    } catch (err) {
        console.error("Print failed:", err);
    }
};

const downloadQRCode = async () => {
    // We target the specific ID we added to your template: id="qr-poster-area"
    const node = document.getElementById('qr-poster-area');

    try {
        const dataUrl = await htmlToImage.toPng(node, {
            backgroundColor: '#ffffff', // Ensures the background isn't transparent
            pixelRatio: 3, // Doubles the resolution for a crisp, high-quality print
        });

        const link = document.createElement('a');
        link.download = `${props.business.name.replace(/\s+/g, "-")}-qr-poster.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Oops, something went wrong!', error);
    }
};

const shareQRCode = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: `Leave a review for ${props.business.name}`,
                text: `Share your experience with ${props.business.name}`,
                url: qr.value,
            });
        } catch (err) {
            console.error("Share failed:", err);
        }
    } else {
        await copyToClipboard();
    }
};
</script>

<style scoped>
.header {
    font-size: 140%;
    font-weight: bold;
    margin-bottom: 20px;
}
</style>