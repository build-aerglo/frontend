<template>
    <Dialog v-model:visible="addBranch" :draggable="false" modal header="Create Business Branch"
        :style="{ width: '35rem' }">
        <form @submit.prevent="saveBranch(branch)">
            <div class="flex flex-col gap-[10px]">
                <InputText type="text" placeholder="Branch Name" fluid class="flex-auto" autocomplete="off" required
                    v-model="branch.name" />
                <InputText type="text" fluid class="flex-auto" placeholder="Branch Address" autocomplete="off" required
                    v-model="branch.address" />
                <Divider />
                <div class="mb-[10px] font-bold text-[120%]">Contact Information (optional)</div>
                <InputText type="text" placeholder="Contact Name" fluid class="flex-auto" autocomplete="off"
                    v-model="branch.contact.name" />
                <InputText type="text" fluid class="flex-auto" placeholder="Contact Email Address" autocomplete="off"
                    v-model="branch.contact.email" />
                <div class="flex gap-[10px]">
                    <InputText type="text" placeholder="Contact Role" fluid class="flex-auto" autocomplete="off"
                        v-model="branch.contact.role" />
                    <InputText type="text" fluid class="flex-auto" placeholder="Contact Phone Number" autocomplete="off"
                        v-model="branch.contact.phone" />
                </div>
            </div>
            <div class="flex justify-end gap-2 mt-[20px]">
                <Button type="button" label="Cancel" severity="secondary" @click="resetAddBranch"></Button>
                <Button type="submit" label="Save Branch"></Button>
            </div>
        </form>
    </Dialog>

    <div v-if="businessBranches.length > 0">
        <div class="flex justify-end">
            <ButtonCustom icon="plus" @clicked="addBranch = true" />
        </div>

        <div class="flex flex-col gap-[10px] mt-[20px]">
            <div v-for="(i, idx) in businessBranches" :key="idx">
                <div class="flex justify-between items-start gap-[10px]">
                    <div>
                        <div class="font-bold text-[120%]">{{ i.name }}</div>
                        <div>{{ i.address }}</div>
                    </div>
                    <div class="flex gap-[10px]">
                        <ButtonCustom icon="pencil" primary="true" />
                        <ButtonCustom icon="trash" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-col gap-[10px] justify-center items-center">
        No branches added yet!
        <ButtonCustom label="Add New Branch" icon="plus" @clicked="addBranch = true" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['branches', 'business', 'isBusiness'])
const addBranch = ref(false)
const branch = ref({
    name: '',
    address: '',
    contact: {
        name: '',
        role: '',
        phone: '',
        email: ''
    }
})
const businessBranches = ref<any[]>([])

const resetAddBranch = () => {
    addBranch.value = false;
    branch.value = {
        name: '',
        address: '',
        contact: {
            name: '',
            role: '',
            phone: '',
            email: ''
        }
    }
}

const saveBranch = (b: any) => {
    businessBranches.value.push(b);
    addBranch.value = false;
    resetAddBranch();
}

onBeforeMount(() => {
    if (props.branches) {
        businessBranches.value = props.branches;
    }
})
</script>
