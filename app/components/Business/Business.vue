<template>
    <Dialog v-model:visible="addSocial" :draggable="false" modal header="Add Social Media Handle"
        :style="{ width: '25rem' }">
        <form @submit.prevent="saveSocial(social.name, social.url)">
            <div class="flex gap-[10px]">
                <select v-model="social.name" class="border">
                    <option v-for="(i, idx) in availableSocials" :key="idx"
                        class="capitalize flex gap-[10px] items-center">
                        {{ i }}
                    </option>
                </select>
                <InputText type="url" fluid class="flex-auto" autocomplete="off" v-model="social.url" />
            </div>
            <div class="flex justify-end gap-2 mt-[20px]">
                <Button type="button" label="Cancel" severity="secondary" @click="resetAddSocial"></Button>
                <Button type="submit" label="Save Social Handle"></Button>
            </div>
        </form>
    </Dialog>

    <Dialog v-model:visible="addFaq" :draggable="false" modal header="Add FAQ" :style="{ width: '35rem' }">
        <form @submit.prevent="saveFaq(businessData?.faqs.length)">
            <div class="flex flex-col gap-[10px]">
                <InputText v-model="faq.question" placeholder="Question" fluid />
                <Textarea v-model="faq.answer" placeholder="Answer" rows="3" fluid />
            </div>
            <div class="flex justify-end gap-2 mt-[20px]">
                <Button type="button" label="Cancel" severity="secondary" @click="resetAddFaq"></Button>
                <Button type="submit" label="Save FAQ"></Button>
            </div>
        </form>
    </Dialog>

    <Dialog v-model:visible="addImage" :draggable="false" modal header="Add Business Media" :style="{ width: '20rem' }">
        <div class="flex justify-center items-center pb-[30px]">
            <BusinessMedia @uploaded="insertImage" @deleted="removeImage" path="media" :url="null" />
        </div>
    </Dialog>

    <Dialog v-model:visible="editBusiness" position="top" :draggable="false" modal header="Update Business Profile"
        :style="{ width: '50rem' }">
        <div v-if="businessData" class="flex flex-col gap-[20px]">
            <!-- profile -->
            <Panel toggleable :collapsed="true">
                <template #header>
                    <div class="text-[120%] font-bold">Profile</div>
                </template>
                <div class="m-0 flex flex-col gap-[20px]">
                    <div>
                        <BusinessMedia @uploaded="insertImageLogo" @deleted="removeImageLogo" path="profile"
                            :url="businessData.logo" />

                        logo: {{ businessData.logo }}
                    </div>
                    <div>
                        <label>Business Name:</label>
                        <InputText fluid class="flex-auto" autocomplete="off" v-model="businessData.name" />
                    </div>
                    <div>
                        <label>Business Description</label>
                        <Textarea fluid :rows="5" v-model="businessData.businessDescription"></Textarea>
                    </div>
                    <div>
                        <label>Business Category</label>
                        <Select fluid v-model="business_category" :options="props.categories" filter optionLabel="name"
                            placeholder="Business Category">
                        </Select>
                        <small class="block mt-[10px]">Notice: updating your business category resets your tags!</small>
                    </div>
                    <div>
                        <label class="flex justify-between gap-[10px] items-center">
                            <span>Business Tags</span>
                            <span>
                                {{ selected_tags.length }} / {{ MAX_TAGS }}
                            </span>
                        </label>
                        <div class="flex flex-wrap gap-2 mt-[10px]">
                            <Chip v-for="tag in business_tags" :key="tag" :label="tag"
                                class="cursor-pointer transition-all !text-[90%] !py-[5px]" :class="{
                                    'bg-gold text-white': isSelected(tag),
                                    'bg-surface-200': !isSelected(tag),
                                    'opacity-50 pointer-events-none':
                                        !isSelected(tag) && selected_tags.length >= MAX_TAGS
                                }">
                                <span @click="addTag(tag)">{{ tag }}</span>
                                <i v-if="isSelected(tag)" class="pi pi-times text-[90%] cursor-pointer"
                                    @click="removeTag(tag)" />
                            </Chip>

                        </div>
                    </div>
                </div>
            </Panel>

            <!-- contact -->
            <Panel toggleable :collapsed="true">
                <template #header>
                    <div class="text-[120%] font-bold">Contact Information</div>
                </template>
                <div class="m-0 flex flex-col gap-[20px]">
                    <div>
                        <label>Business Location:</label>
                        <InputText class="flex-auto" fluid autocomplete="off" v-model="businessData.businessAddress" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                        <div>
                            <label>Business Phone Number:</label>
                            <InputText class="flex-auto" fluid autocomplete="off"
                                v-model="businessData.businessPhoneNumber" />
                        </div>
                        <div>
                            <label>Business Email Address:</label>
                            <InputText class="flex-auto" fluid autocomplete="off"
                                v-model="businessData.businessEmail" />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
                        <div>
                            <label for="email">Street</label>
                            <InputText fluid class="flex-auto" autocomplete="off" v-model="address.street" />
                        </div>
                        <div>
                            <label for="email">City / Town</label>
                            <InputText fluid class="flex-auto" autocomplete="off" v-model="address.city_town" />
                        </div>
                        <div>
                            <label for="email">Country</label>
                            <Select fluid v-model="address.country" :options="countries" optionLabel="name"
                                placeholder="Country" />
                        </div>
                    </div>
                </div>
            </Panel>

            <!-- socials -->
            <Panel toggleable :collapsed="true">
                <template #header>
                    <div class="text-[120%] font-bold">Socials</div>
                </template>
                <div class="m-0 flex flex-col gap-[20px]">
                    <div>
                        <label>Business Website:</label>
                        <InputText fluid class="flex-auto" autocomplete="off" v-model="businessData.website" />
                    </div>
                    <div class="mt-[10px]">
                        <div class="flex justify-end">
                            <ButtonCustom icon="plus" input-class="w-max" primary="true" @click="addSocial = true" />
                        </div>

                        <div class="flex flex-col gap-[10px] mt-[10px]">
                            <div v-for="(url, name) in businessData.socialMediaLinks" :key="name"
                                class="flex items-center gap-[5px]">
                                <div class="capitalize items-center flex gap-[10px]">
                                    <i :class="`pi pi-${name}`"></i>
                                    {{ name }}
                                </div>
                                <div class="flex-1">
                                    <InputText fluid class="flex-auto" autocomplete="off"
                                        v-model="businessData.socialMediaLinks[name]" />
                                </div>
                                <div>
                                    <i class="pi pi-trash text-red p-[5px] cursor-pointer"
                                        @click="deleteSocial(name)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>

            <!-- opening hours -->
            <Panel toggleable :collapsed="true">
                <template #header>
                    <div class="text-[120%] font-bold">Opening Hours</div>
                </template>
                {{ businessData.openingHours }}
            </Panel>

            <!-- media -->
            <Panel toggleable :collapsed="true">
                <template #header>
                    <div class="text-[120%] font-bold">Business Media</div>
                </template>
                <div class="flex justify-start mb-[20px]">
                    <ButtonCustom icon="plus" label="Add Media" primary="true" @click="initImage" />
                </div>
                <div class="m-0 grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
                    <BusinessMedia v-for="i in businessData.media" :key="i" @deleted="removeImage" path="media"
                        :url="i" />
                </div>
            </Panel>

            <!-- faq -->
            <Panel toggleable :collapsed="true">
                <template #header>
                    <div>
                        <div class="text-[120%] font-bold">FAQ's</div>
                    </div>
                </template>
                <div class="m-0 flex flex-col gap-[20px]">
                    <div class="flex justify-start">
                        <ButtonCustom icon="plus" label="Add Question" primary="true" @click="addFaq = true" />
                    </div>
                    <div v-for="(faq, index) in businessData.faqs" :key="index" class="border rounded-md p-4">
                        <div class="flex justify-end mb-[10px]">
                            <i class="pi pi-trash text-[red] cursor-pointer" @click="removeFaqs(index)"></i>
                        </div>
                        <InputText v-model="businessData.faqs[index].question" placeholder="Question"
                            class="w-full mb-2" />

                        <Textarea v-model="businessData.faqs[index].answer" placeholder="Answer" rows="3"
                            class="w-full" />
                    </div>
                </div>
            </Panel>
        </div>
        <template #footer>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="resetBusiness"></Button>
                <Button :loading="isLoading" type="submit" :label="isLoading ? 'Updating Business Profile...'
                    : 'Save'" @click="updateProfile"></Button>
            </div>
        </template>
    </Dialog>

    <section class="mg py-[50px]" v-if="business">
        <Card class="w-full">
            <template #content>
                <div class="flex sm:flex-row flex-col gap-[20px]">
                    <div
                        class="relative p-[5px] rounded-[10px] border h-auto w-[210px] flex flex-col gap-[10px] items-center">
                        <div class="absolute top-0 right-0">
                            <img v-if="badge" :src="`/svg/badges/${badge.badge}.svg`" v-tooltip="badge.status"
                                class="w-[40px] h-[40px]" />
                        </div>
                        <img :src="business?.logo ?? '/images/store.jpeg'"
                            class="object-cover object-center h-full w-full" />
                        <div class="flex flex-col gap-2.5 justify-center w-[150px]">
                            <Star :count="business?.avgRating ?? 0" />
                            <div class="text-center mt-[-10px]">
                                {{ business?.reviewCount }}
                                Review(s)
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex flex-col gap-[10px]">
                            <div class="text-[200%] font-bold flex justify-between">
                                {{ business?.name }}
                                <div>
                                    <ButtonCustom v-if="isBusiness" @click="editBusiness = true"
                                        label="Edit Business Profile" size="lg" primary="true" />
                                    <ButtonCustom v-else label="Write a review" size="lg" primary="true" />
                                </div>
                            </div>
                            <div>
                                <NuxtLink :to="`/category/${i.id}`" v-for="(i, idx) in business?.categories" :key="idx">
                                    {{
                                        i.name }}
                                </NuxtLink>
                            </div>
                        </div>

                        <div class="w-full sm:w-[20px] border my-[10px]"></div>

                        <div class="flex gap-2.5">
                            <NuxtLink v-for="(i, idx) in business?.tags" :to="`/tags/${i}`" :key="idx">
                                <Chip
                                    class="hover:bg-primary hover:text-white !border !border-primary !py-[5px] !px-[10px]">
                                    <span class="text-[80%]">{{ i }}</span>
                                </Chip>
                            </NuxtLink>
                        </div>

                        <div class="w-full sm:w-[20px] border my-[10px]"></div>

                        <div class="flex flex-col gap-[5px]">
                            <!-- <div class="font-bold text-[110%] mb-[10px] underline">Contact Information:</div> -->
                            <div class="flex gap-2.5 items-center">
                                <div v-if="business.businessPhoneNumber" class="flex items-center gap-[5px] mb-[5px]">
                                    <i class="pi pi-phone"></i>
                                    {{ business.businessPhoneNumber }}
                                </div>
                                <div>•</div>
                                <a :href="business.website" target="_blank" v-if="business.website"
                                    class="flex items-center gap-[5px] mb-[5px]">
                                    <i class="pi pi-globe"></i>
                                    {{ business.website }}
                                </a>
                            </div>
                            <div v-if="business.businessAddress" class="flex items-center gap-[5px] mb-[5px]">
                                <i class="pi pi-map-marker"></i>
                                {{ business.businessAddress }}
                            </div>
                            <div class="flex gap-2.5 socials" v-if="business.socialMediaLinks">
                                <a :href="url" target="_blank" v-for="(url, name) in business.socialMediaLinks"
                                    :key="name" class="flex items-center gap-[5px]">
                                    <i :class="`pi pi-${name} ${name}`"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>

        <Divider class="mt-[10px]" />

        <div class="flex gap-2.5">
            <ButtonCustom label="Business Profile" inputClass="w-max"
                :primary="currentPage === 'profile' ? true : false" @clicked="setSection('profile')" />
            <ButtonCustom label="Reviews" inputClass="w-max" :primary="currentPage === 'review' ? true : false"
                @clicked="setSection('review')" />
            <ButtonCustom v-if="isBusiness" label="Get Reviews" inputClass="w-max"
                :primary="currentPage === 'qr' ? true : false" @clicked="setSection('qr')" />
        </div>

        <Divider class="mb-[20px]" />

        <BusinessProfile v-if="currentPage === 'profile'" :isBusiness="isBusiness" :business="business"
            @edit="emit('edit')" />
        <BusinessReviews v-if="currentPage === 'review'" :reviews="reviews" :business="business"
            :isBusiness="isBusiness" />
        <BusinessQr v-if="isBusiness && currentPage === 'qr'" :business="business" />

        <!-- {{ business }} -->
    </section>
</template>

<script setup lang="ts">
import type { BusinessProfileResponse } from '~/types/business';
import useBusinessMethods from '~/composables/business/useBusinessMethods';

const props = defineProps(['business', 'toEdit', 'page', 'isBusiness', 'categories', 'reviews', 'status'])
const emit = defineEmits(['edit'])
const currentPage = ref()
const businessData = ref<BusinessProfileResponse>()
const editBusiness = ref(false)
const addSocial = ref(false)
const addFaq = ref(false)
const addImage = ref(false)
const isLoading = ref(false);

const { saveBusinessProfile, getCategoryTags } = useBusinessMethods()
const toast = useToast()

const insertImage = (url: string) => {
    if (!businessData.value) return;
    addImage.value = false
    businessData.value.media.push(url);
}

const insertImageLogo = (url: string) => {
    if (!businessData.value) return;
    businessData.value.logo = url;
}

const removeImage = (url: string) => {
    if (!businessData.value) return;
    businessData.value.media =
        businessData.value.media = businessData.value.media.filter((item: string) => item !== url);
}

const removeImageLogo = (url: string) => {
    if (!businessData.value) return;
    businessData.value.logo = ''
}

const MAX_TAGS = 5;
const MAX_FAQS = 6;
const MAX_MEDIA = 5;

const initImage = () => {
    if (!businessData.value) return;
    if (businessData.value.media.length >= MAX_MEDIA) {
        return toast.add({
            severity: 'info',
            summary: 'INFO',
            detail: 'Maximum number of media uploaded!',
            life: 3000
        });
    }

    addImage.value = true;
}

const setSection = (s: string) => {
    currentPage.value = s;
}

const address = ref({
    street: '',
    country: { name: "Nigeria", code: "ngn" },
    city_town: ''
})
const availableSocials = ref()

const social = ref({
    name: '',
    url: ''
})

const faq = ref({
    question: '',
    answer: ''
})

const business_category = ref();
const business_tags = ref()
const selected_tags = ref<string[]>([])

const fetchTags = async (id: string) => {
    const res = await getCategoryTags(id);
    if (res?.statusCode === 200) {
        business_tags.value = res.data ?? [];
    }
}

onMounted(() => {
    watch(
        business_category,
        async () => {
            if (!businessData.value) return;

            businessData.value.tags = [];
            selected_tags.value = [];
            await fetchTags(business_category.value.id);
        }
    );
});


const removeFaqs = (index: number) => {
    if (!businessData.value) return;
    businessData.value.faqs = removeByIndex(businessData.value.faqs, index);
}

const removeByIndex = <T>(arr: T[], index: number): T[] => {
    return arr.filter((_, i) => i !== index);
};

const isSelected = (tag: string) => {
    return selected_tags.value.includes(tag) ? true : false;
}

const addTag = (tag: string) => {

    if (isSelected(tag)) return;

    if (selected_tags.value.length >= MAX_TAGS) {
        alert(`You can select up to ${MAX_TAGS} tags only`);
        return;
    }

    selected_tags.value.push(tag);
};

const removeTag = (tag: string) => {
    selected_tags.value = selected_tags.value.filter(
        (t: string) => t !== tag
    );
};

const badge = ref<{
    status: string,
    badge: string
}>()

onBeforeMount(async () => {
    currentPage.value = props.page ?? 'review';
    if (props.business) {
        businessData.value = props.business;
        availableSocials.value = SOCIAL_HANDLES.filter(
            social => !(social in businessData.value?.socialMediaLinks)
        );
        social.value.name = availableSocials.value[0] ?? ''
        business_category.value = businessData.value?.categories[0];
        selected_tags.value = businessData.value?.tags;

        await fetchTags(businessData.value?.categories[0]?.id!);

        //@ts-ignore
        businessData.value.openingHours = {
            "same_time": {
                "open": "2025-03-20T09:00:00.918Z",
                "close": "2025-03-20T21:00:00.451Z",
                "closed": false
            },
            "monday": {
                "open": null,
                "close": null,
                "closed": true
            },
            "tuesday": {
                "open": null,
                "close": null,
                "closed": true
            },
            "wednesday": {
                "open": null,
                "close": null,
                "closed": true
            },
            "thursday": {
                "open": null,
                "close": null,
                "closed": true
            },
            "friday": {
                "open": null,
                "close": null,
                "closed": true
            },
            "saturday": {
                "open": null,
                "close": null,
                "closed": true
            },
            "sunday": {
                "open": null,
                "close": null,
                "closed": true
            },
            "same": true
        }

        badge.value = getBadge(props.status);
    }
})

const resetBusiness = () => {
    businessData.value = props.business;
    editBusiness.value = false;
}

const resetAddSocial = () => {
    addSocial.value = false;
    social.value.name = ''
    social.value.url = ''
}

const saveFaq = (count: number) => {
    if (businessData.value === null || businessData.value === undefined) return;
    if (businessData.value.faqs.length >= MAX_FAQS) {
        return toast.add({
            severity: 'info',
            summary: 'INFO',
            detail: 'Maximum number of questions reached!',
            life: 3000
        });
    }

    if (!faq.value.answer || !faq.value.question) {
        return toast.add({
            severity: 'info',
            summary: 'INFO',
            detail: 'FAQ question and answer required!',
            life: 3000
        });
    }

    businessData.value.faqs.push({ ...faq.value });
    resetAddFaq()
}

const resetAddFaq = () => {
    addFaq.value = false;
    faq.value.question = ''
    faq.value.answer = ''
}

const deleteSocial = (id: any) => {
    if (businessData.value === null || businessData.value === undefined) return;
    delete businessData.value.socialMediaLinks[id];
    availableSocials.value = SOCIAL_HANDLES.filter(
        social => !(social in businessData.value?.socialMediaLinks)
    );
    social.value.name = availableSocials.value[0] ?? ''
}

const saveSocial = (name: string, url: string) => {
    if (businessData.value === null || businessData.value === undefined) return;
    businessData.value.socialMediaLinks[name] = url;
    addSocial.value = false;
}

const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
]
const weekends = [
    'saturday', 'sunday'
]
const allDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
]

const updateProfile = async () => {
    try {
        if (!businessData.value?.id!) {
            return toast.add({
                severity: 'error',
                summary: 'ERROR',
                detail: 'Business ID is missing',
                life: 3000
            });
        }

        if (selected_tags.value.length <= 0) {
            return toast.add({
                severity: 'info',
                summary: 'INFO',
                detail: 'Business must select at least one tag!',
                life: 3000
            });
        }

        const newCategory = { ...business_category.value };
        businessData.value.categories = [];
        businessData.value.categories.push(newCategory)
        businessData.value.tags = selected_tags.value;

        if (businessData.value.logo === null) businessData.value.logo = "/images/store.jpeg"

        isLoading.value = true;
        // @ts-ignore
        const res = await saveBusinessProfile(businessData.value.id, businessData.value);
        if (res) {
            emit('edit', res);
            return toast.add({
                severity: 'success',
                summary: 'SUCCESS',
                detail: 'Profile Updated',
                life: 3000
            });
        }
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false;
    }

}
</script>

<style scoped>
.socials a+a::before {
    content: "•";
}

i.facebook {
    color: #1877F2;
}

i.whatsapp {
    color: green;
}

i.twitter {
    color: #1DA1F2;
}

i.linkedin {
    color: #0077B5;
}

i.instagram {
    color: #B03DB5;
}

label {
    font-weight: 400;
    color: gray;
    font-size: 90%;
}
</style>