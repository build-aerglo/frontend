<template>
    <Galleria v-model:visible="displayBasic" :value="images" :responsiveOptions="responsiveOptions" :numVisible="9"
        containerStyle="max-width: 50%" :circular="true" :fullScreen="true" :showItemNavigators="true">
        <template #item="slotProps">
            <img :src="slotProps.item" :alt="slotProps.item.alt"
                class="block w-full max-h-[500px] object-cover object-center" />
        </template>
        <template #thumbnail="slotProps">
            <img :src="slotProps.item" :alt="slotProps.item.alt"
                class="block w-full h-[75px] object-cover object-center" />
        </template>
    </Galleria>

    <div class="flex gap-[20px]">
        <div class="sm:flex-row flex-col flex-1" v-if="businessData">

            <Card>
                <template #content>
                    <div>
                        <div class="header">About the business</div>
                        <div>
                            {{ businessData?.businessDescription }}
                        </div>
                    </div>
                </template>
            </Card>

            <Divider class="my-[20px]" />

            <Card>
                <template #content>
                    <div>
                        <div class="header">Amenities</div>
                        <!-- <div class="mb-[20px] mt-[-20px]">Text here</div> -->
                        <div class="flex gap-[20px]">
                            <NuxtLink v-for="(i, idx) in businessData?.highlights" :key="idx">
                                <div class="flex gap-[5px] items-center">
                                    <i class="pi pi-verified text-[green]"></i>
                                    <span class="">{{ i }}</span>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </template>
            </Card>

            <Divider class="my-[20px]" />

            <Card>
                <template #content>
                    <div>
                        <div class="header">How's the vibe</div>
                        <!-- <div class="mb-[20px] mt-[-20px]">Text here</div> -->
                        <div v-if="businessData.media && businessData.media.length"
                            class="grid grid-cols-2 sm:grid-cols-4 gap-[20px]">
                            <div v-for="(img, index) in displayedImages" :key="index" class="relative cursor-pointer"
                                @click="onImageClick(index)">
                                <img :src="img" class="w-full h-[220px] object-cover rounded-md" />

                                <div v-if="showOverlay && index === 3" class="absolute inset-0 bg-black/60 flex items-center justify-center
                   text-white text-lg font-semibold rounded-md">
                                    +{{ remainingImages }}
                                </div>
                            </div>
                        </div>
                        <div v-else>No business media uploaded yet</div>

                    </div>
                </template>
            </Card>

            <Divider class="my-[20px]" />

            <Card>
                <template #content>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-[40px]">
                        <div>
                            <div class="header">Opening Hours</div>
                            <div>
                                <BusinessOpeningHours :business="business" :to-edit="toEdit" />
                            </div>
                        </div>
                        <div class="col-span-2">
                            <div class="header">Questions you might have:</div>
                            <Accordion :value="[0]" multiple class="border rounded-[10px]">
                                <AccordionPanel v-for="(i, idx) in businessData?.faqs" :key="idx" :value="idx">
                                    <AccordionHeader>{{ i.question }}</AccordionHeader>
                                    <AccordionContent>
                                        <p class="m-0">
                                            {{ i.answer }}
                                        </p>
                                    </AccordionContent>
                                </AccordionPanel>
                            </Accordion>
                        </div>
                    </div>
                </template>
            </Card>

            <Divider class="my-[20px]" />
        </div>
        <div class="sm:w-[30%] w-full border rounded-md flex flex-col gap-[20px]">
            <Card>
                <template #content>
                    <div>
                        <div class="text-center header">Quick Actions</div>
                        <div class="flex flex-col gap-[10px] mt-[20px]">
                            <!-- <ButtonCustom label="Call Business" icon="phone" :primary="true" size="lg" /> -->
                            <ButtonCustom label="Write a review" icon="pencil" size="lg" :primary="true" />
                            <!-- <ButtonCustom label="Get Directions" icon="map-marker" inputClass="!bg-[#f3f0ec]" size="lg" /> -->
                            <ButtonCustom v-if="!isBusiness" label="Save Business" icon="clipboard"
                                inputClass="!bg-[#f3f0ec]" size="lg" />
                            <ButtonCustom label="Share Business Profile" icon="share-alt" inputClass="!bg-[#f3f0ec]"
                                size="lg" />
                        </div>
                    </div>
                </template>
            </Card>

            <Card>
                <template #content>
                    <div>
                        <div class="text-center header">Business Review Summary</div>
                        <div class="flex flex-col gap-[10px]">

                            <div class="flex gap-[10px]">
                                <div>5 <i class="pi pi-star"></i></div>
                                <ProgressBar :value="50" class="bg-five_star"></ProgressBar>
                            </div>

                            <ProgressBar :value="30" class="bg-four_star"></ProgressBar>
                            <ProgressBar :value="15" class="bg-three_star"></ProgressBar>
                            <ProgressBar :value="10" class="bg-two_star"></ProgressBar>
                            <ProgressBar :value="5" class="bg-one_star"></ProgressBar>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BusinessProfileResponse } from '~/types/business';

const props = defineProps(['business', 'toEdit', 'isBusiness'])
const businessData = ref<BusinessProfileResponse>()
// const outsideImages = ref<string[]>([])
// const insideImages = ref<string[]>([])
const images = ref();

onBeforeMount(() => {
    if (props.business) {
        businessData.value = props.business;
        if (businessData.value?.media.length > 0) {
            // const { outside, inside } = splitBusinessImages(businessData.value?.media);
            // outsideImages.value = outside;
            // insideImages.value = inside;
            images.value = businessData.value?.media;
        }
    }
})

const displayedImages = computed(() =>
    businessData.value?.media.slice(0, 4)
);

const remainingImages = computed(() =>
    businessData.value?.media.length - 4
);

const showOverlay = computed(() =>
    businessData.value?.media.length > 4
);

const displayBasic = ref(false);

const onImageClick = (index: number) => {
    displayBasic.value = true
};

const responsiveOptions = ref([
    {
        breakpoint: '1500px',
        numVisible: 5
    },
    {
        breakpoint: '1024px',
        numVisible: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);
</script>
<style scoped>
.header {
    font-size: 140%;
    font-weight: bold;
    margin-bottom: 20px;
}
</style>