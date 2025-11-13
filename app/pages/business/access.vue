<template>
  <div class="card">
    <div class="px-6 py-5">
      
      <div class="flex justify-between items-center mb-5">
        <span class="text-[150%] text-contrast font-bold">Access Management</span>
        </div>

      <p class="text-[100%] text-gray-500 mb-6">
        Manage the sub-logins for your business, such as branch managers or key staff.
      </p>

      <ButtonCustom
        label="Add New Access"
        icon="pi pi-plus"
        :primary="true"
        size="lg"
        input-class="mb-6 w-auto"
        @click="showAddAccessDialog"
      />

      <hr class="border-gray-200" />

      <div v-if="accesses.length > 0" class="flex flex-col">
        <div 
          v-for="(access, index) in accesses" 
          :key="access.email"
        >
          <div
            class="flex items-center justify-between py-4"
          >
            <div class="flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg bg-blue-500 flex-shrink-0"
              >
                {{ getFirstLetter(access.fullName) }}
              </span>
              
              <div class="flex flex-col">
                <span class="font-semibold text-gray-800">{{ access.fullName }}</span>
                <span class="text-sm text-gray-500">{{ access.email }}</span>
              </div>
            </div>
            
            <div class="flex gap-1">
              <Button
                label="Unlock"
                severity="secondary"
                text
                icon="pi pi-lock-open"
                size="small"
                class="mobile-icon-only"
                @click="showConfirmUnlockDialog(access)"
              />
              <Button
                label="Edit"
                severity="secondary"
                text
                icon="pi pi-pencil"
                size="small"
                class="mobile-icon-only"
                @click="showEditAccessDialog(access)"
              />
              <Button
                label="Remove"
                severity="danger"
                text
                icon="pi pi-trash"
                size="small"
                class="mobile-icon-only"
                @click="showConfirmDeleteDialog(access)"
              />
            </div>
            
          </div>
          
          <hr v-if="index < accesses.length - 1" class="border-gray-200" />
        </div>
      </div>
      
      <div v-else class="text-center p-8 text-gray-500 italic">
        No access users have been added yet.
      </div>
    </div>
  </div>

  <Dialog v-model:visible="isAddAccessVisible" modal header="Add New Access User" :style="{ width: '30rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">
      Enter the full name and email for the new access user.
    </span>
    
    <div class="flex flex-col gap-4 mb-4">
      <div class="flex items-center gap-4">
        <label for="fullName" class="font-semibold w-24">Full Name</label>
        <InputTextCustom id="fullName" v-model="newAccess.fullName" class="flex-auto" autocomplete="name" />
      </div>
      
      <div class="flex items-center gap-4">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputTextCustom id="email" v-model="newAccess.email" class="flex-auto" autocomplete="email" />
      </div>
    </div>
    
    <div class="flex justify-end gap-2 mt-4">
      <Button 
        type="button" 
        label="Cancel" 
        severity="danger" 
        @click="isAddAccessVisible = false"
      />
      <ButtonCustom 
        type="button" 
        :primary="true"
        size="lg"
        label="Add Access" 
        :disabled="!newAccess.fullName || !newAccess.email || !isValidEmail(newAccess.email)"
        @click="addNewAccess"
        input-class="w-auto"
      />
    </div>
  </Dialog>

  <Dialog v-model:visible="isEditAccessVisible" modal header="Edit Access User" :style="{ width: '30rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">
      Update the name and/or email for <span class="font-bold">{{ accessToEdit?.fullName }}</span>.
    </span>
    
    <div class="flex flex-col gap-4 mb-4" v-if="accessToEdit">
      <div class="flex items-center gap-4">
        <label for="editFullName" class="font-semibold w-24">Full Name</label>
        <InputTextCustom id="editFullName" v-model="accessToEdit.fullName" class="flex-auto" autocomplete="name" />
      </div>
      
      <div class="flex items-center gap-4">
        <label for="editEmail" class="font-semibold w-24">Email</label>
        <InputTextCustom id="editEmail" v-model="accessToEdit.email" class="flex-auto" autocomplete="email" />
      </div>
    </div>
    
    <div class="flex justify-end gap-2 mt-4">
      <Button 
        type="button" 
        label="Cancel" 
        severity="secondary" 
        @click="isEditAccessVisible = false"
      />
      <ButtonCustom 
        type="button" 
        :primary="true"
        size="lg"
        label="Save Changes" 
        :disabled="!accessToEdit?.fullName || !accessToEdit?.email || !isValidEmail(accessToEdit.email)"
        @click="saveEditChanges"
        input-class="w-auto"
      />
    </div>
  </Dialog>
  
  <Dialog v-model:visible="isConfirmUnlockVisible" modal header="Confirm Access Unlock" :style="{ width: '25rem' }">
    <div class="flex items-center gap-3">
      <i class="pi pi-lock-open text-blue-500 text-2xl" />
      <span class="text-surface-500 dark:text-surface-400">
        Are you sure you want to **unlock** access for 
        <span class="font-bold">{{ accessToUnlock?.fullName }}</span>? This may send a reset notification.
      </span>
    </div>
    
    <div class="flex justify-end gap-2 mt-6">
      <Button 
        type="button" 
        label="Cancel" 
        severity="secondary" 
        @click="isConfirmUnlockVisible = false"
      />
      <ButtonCustom 
        :primary="true"
        size="lg"
        label="Unlock Access" 
        @click="unlockAccess"
        input-class="w-auto"
      />
    </div>
  </Dialog>

  <Dialog v-model:visible="isConfirmDeleteVisible" modal header="Confirm Removal" :style="{ width: '25rem' }">
    <div class="flex items-center gap-3">
      <i class="pi pi-exclamation-triangle text-red-500 text-2xl" />
      <span class="text-surface-500 dark:text-surface-400">
        Are you sure you want to remove access for 
        <span class="font-bold">{{ accessToDelete?.fullName }}?</span>
        This action cannot be undone.
      </span>
    </div>
    
    <div class="flex justify-end gap-2 mt-6">
      <Button 
        type="button" 
        label="Cancel" 
        severity="secondary" 
        @click="isConfirmDeleteVisible = false"
      />
      <Button 
        type="button" 
        label="Remove" 
        severity="danger"
        @click="deleteAccess"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

definePageMeta({
	layout: 'business'
})

interface AccessUser {
	fullName: string;
	email: string;
}

const initialAccesses: AccessUser[] = [
	{ fullName: 'Jane Doe', email: 'jane.doe@branch1.com' },
	{ fullName: 'John Smith', email: 'john.smith@branch2.com' },
];

const accesses = ref<AccessUser[]>([...initialAccesses]);

const isAddAccessVisible = ref(false);
const isEditAccessVisible = ref(false);
const isConfirmUnlockVisible = ref(false);
const isConfirmDeleteVisible = ref(false);

const newAccess = reactive<AccessUser>({ fullName: '', email: '' });
const accessToEdit = ref<AccessUser | null>(null);
const accessToUnlock = ref<AccessUser | null>(null);
const accessToDelete = ref<AccessUser | null>(null);

const getFirstLetter = (name: string): string => {
	return name.charAt(0).toUpperCase();
};

const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

const showAddAccessDialog = () => {
	newAccess.fullName = '';
	newAccess.email = '';
	isAddAccessVisible.value = true;
};

const addNewAccess = () => {
	if (!newAccess.fullName || !isValidEmail(newAccess.email)) return;
	if (accesses.value.some(a => a.email === newAccess.email)) {
		alert(`Access with email ${newAccess.email} already exists.`);
		return;
	}

	console.log('API: Creating new access user:', newAccess); 
	accesses.value.push({ ...newAccess });
	isAddAccessVisible.value = false;
};

const showEditAccessDialog = (access: AccessUser) => {
    accessToEdit.value = JSON.parse(JSON.stringify(access));
    isEditAccessVisible.value = true;
};

const saveEditChanges = () => {
    if (!accessToEdit.value) return;
    console.log('API: Saving changes for access user:', accessToEdit.value);
  
    const index = accesses.value.findIndex(a => a.email === accessToEdit.value!.email);
    
    if (index !== -1) {
        const originalAccess = accesses.value[index];
        if (originalAccess) {
            originalAccess.fullName = accessToEdit.value!.fullName;
            originalAccess.email = accessToEdit.value!.email;
        }
    }
    
    isEditAccessVisible.value = false;
    accessToEdit.value = null;
};

const showConfirmUnlockDialog = (access: AccessUser) => {
    accessToUnlock.value = access;
    isConfirmUnlockVisible.value = true;
};

const unlockAccess = () => {
    if (!accessToUnlock.value) return;
    console.log('API: Requesting unlock/password reset for:', accessToUnlock.value.email);
    console.log(`Success: Unlock request sent for ${accessToUnlock.value.fullName}.`);
    
    isConfirmUnlockVisible.value = false;
    accessToUnlock.value = null;
};

const showConfirmDeleteDialog = (access: AccessUser) => {
	accessToDelete.value = access;
	isConfirmDeleteVisible.value = true;
};

const deleteAccess = () => {
	if (accessToDelete.value) {
		console.log('API: Deleting access user:', accessToDelete.value.email);
		const index = accesses.value.findIndex(a => a.email === accessToDelete.value!.email);
		if (index !== -1) {
			accesses.value.splice(index, 1);
		}
	}
	isConfirmDeleteVisible.value = false;
	accessToDelete.value = null;
};
</script>

<style scoped>

@media (max-width: 767px) {
    .mobile-icon-only {
        padding-left: 0.5rem !important; 
        padding-right: 0.5rem !important;
        min-width: unset !important; 
    }
    
    .mobile-icon-only :deep(.p-button-label) {
        display: none;
    }
}
</style>