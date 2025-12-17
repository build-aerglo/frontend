<template>
    <Card>
        <template #content>
            <div class="p-[20px]">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-[50px]">
                    <div class="flex justify-center items-center">
                        <img class="w-full h-full shadow-md rounded-md" v-if="business.qrCodeBase64"
                            :src="business.qrCodeBase64" />
                        <Qrcode class="w-full h-full shadow-md rounded-md"
                            :value="`https://clereview.com/biz/${business?.id}`" />
                    </div>
                    <div class="col-span-2">
                        <div class="flex-1">Business Review Link:</div>
                        <div class="flex mb-[50px] gap-[10px]">
                            <InputText disabled v-model="qr" fluid />
                            <ButtonCustom :label="copied ? 'Copied' : 'Copy'" icon="copy" @clicked="copyToClipboard"
                                input-class="w-max" primary="true" size="lg" />
                        </div>
                        <div class="header">Share Your QR Code</div>
                        <div class="mt-[-20px]">Download or print your QR code to display at your business location
                        </div>

                        <div class="flex flex-col gap-[10px] mt-[40px]">
                            <ButtonCustom size="lg" :primary="true" icon="download" @clicked="downloadQRCode"
                                label="Download QR Code" />
                            <ButtonCustom size="lg" label="Print QR Code" icon="print" @clicked="printQRCode" />
                            <ButtonCustom size="lg" label="Share QR Code" icon="share-alt" @clicked="shareQRCode" />
                        </div>
                    </div>
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
        </template>
    </Card>

</template>

<script setup>
const props = defineProps(['business'])
const qr = ref("")

const qrUrl = useQrcode(`https://clereview.com/biz/${props.business?.id}`, {
    toBase64: true,
})

const qrCodeBase64 = ref(null)

const copied = ref(false)
const tips = [
    "Print the QR code and display it at your checkout counter or entrance",
    "Include the review link in follow - up emails or text messages",
    "Add the QR code to receipts, business cards, or promotional materials"
]

onBeforeMount(() => {
    if (props.business) {
        qr.value = `https://clereview.com/biz/${props.business?.id}`
        if (props.business.qrCodeBase64) {
            qrCodeBase64.value = props.business.qrCodeBase64;
        }
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

const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeBase64.value ?? qrUrl.value;
    link.download = `${props.business.name.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`;
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
        <title>Print QR Code - ${props.business.name}</title>
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
        <h1>${props.business.name}</h1>
        <div class="qr-box">
          <img src="${qrCodeBase64.value ?? qrUrl.value}" width="400" height="400" />
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