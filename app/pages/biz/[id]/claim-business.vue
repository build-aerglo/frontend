<template>
    <GeneralLoader v-if="isLoading" />
    <div v-else>
        <div v-if="isClaimed">
            Business Claimed...
        </div>
        <div v-else class="min-h-screen flex justify-center items-center p-[20px]">
            <form @submit.prevent="claimBusiness(claimData)"
                class="flex flex-col gap-5 border rounded-md p-10 bg-white">
                <div class="text-primary mb-5 text-[200%] font-bold flex justify-between items-center">
                    Claim Business Profile:
                    <i class="text-[70%] pi pi-times cursor-pointer" @click="navigateTo('index')"></i>
                </div>
                <div>
                    <label>Fullname:</label>
                    <InputText fluid class="flex-auto" autocomplete="off" v-model="claimData.name" />
                </div>
                <div>
                    <label>Email Address:</label>
                    <InputText type="email" required fluid class="flex-auto" autocomplete="off"
                        v-model="claimData.email" />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <InputText fluid class="flex-auto" autocomplete="off" v-model="claimData.phone" />
                </div>
                <div>
                    <label>Role:</label>
                    <InputText fluid class="flex-auto" autocomplete="off" v-model="claimData.role" />
                </div>
                <div>
                    NOTICE: Due to high traffic, we'll verify your claim and contact you within 2-3 business days.
                </div>
                <div>
                    <ButtonCustom label="Claim Business" type="submit" input-class="w-full" primary="true" size="lg" />
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue"
import useBusinessMethods from '~/composables/business/useBusinessMethods';

import type { BusinessProfileResponse } from '~/types/business';

const route = useRoute()
const toast = useToast()
const { getBusinessProfile, getBusinessUser, claimBusinessAsync } = useBusinessMethods();

const isLoading = ref(true);
const business = ref<BusinessProfileResponse>()
const businessUser = getBusinessUser();

const isClaimed = ref(false)
const claimData = ref({
    name: '',
    id: route.params.id,
    phone: '',
    email: '',
    role: 'Manager'
})

const roles = [
    'Manager', 'Business Owner', 'Other'
]

const claimBusiness = async (data: any) => {
    const res = await claimBusinessAsync(data);
    console.log(res)
    if (res?.statusCode !== 200) {
        return toast.add({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data.error ?? 'An error occured',
            life: 3000
        });
    }

    return toast.add({
        severity: 'success',
        summary: 'SUCCESS',
        detail: "Business approval in progress.",
        life: 3000
    });
}

const loadBusinessData = async () => {
    const id = route.params.id;
    if (!id) {
        throw createError({
            statusCode: 404,
            statusMessage: "Business Not Found"
        })
    }

    try {
        isLoading.value = true;

        const [res] = await Promise.all([
            getBusinessProfile(id)
        ]);

        if (res?.statusCode === 200) {
            // if (businessUser.id && businessUser.id === id) {

            // }
            if (res.data.businessStatus === 'claimed') {
                isClaimed.value = true
            }

            business.value = res.data;
            return;
        }

        throw createError({
            statusCode: 404,
            statusMessage: "Business Not Found"
        })
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: "Business Not Found"
        })
    } finally {
        isLoading.value = false;
    }
}

const pageTitle = computed(() => `${business.value?.name ?? 'Business Profile'} - ${business.value?.categories[0]?.name ?? ''} | Clereview`);
useHead({
    title: pageTitle, meta: [
        { name: 'description', content: computed(() => business.value?.businessDescription ?? '') }
    ],
});

onBeforeMount(async () => {
    await loadBusinessData();
})
</script>
