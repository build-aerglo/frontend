<template>
  <div class="card">
    <div class="px-6 py-5">
      
      <div class="flex justify-between items-center mb-5">
        <span class="text-[150%] text-contrast font-bold">Access Management</span>
        <div class="flex gap-3">
          <ButtonCustom
            v-if="isEditing"
            label="Save Changes"
            size="lg"
            :primary="true"
            @click="saveChanges"
            input-class="text-[15px] w-auto"
          />
          
          <Button
            :label="isEditing ? 'Cancel' : 'Edit'"
            :icon="isEditing ? 'pi pi-times' : 'pi pi-pencil'"
            :severity="isEditing ? 'danger' : 'secondary'"
            text
            size="md"
            class="w-auto text-[14px]"
            @click="toggleEdit"
          />
        </div>
      </div>

      <p class="text-[100%] text-gray-500 mb-6">
        Manage the sub-logins for your business, such as branch managers or key staff.
      </p>

      <ButtonCustom
        label="Add New Access"
        icon="pi pi-plus"
        :disabled="!isEditing"
        :primary="true"
        size="lg"
        input-class="mb-6 w-auto"
        :class="{ 'opacity-50 cursor-not-allowed': !isEditing }"
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
            
            <Button
              label="Remove"
              severity="danger"
              text
              icon="pi pi-trash"
              size="small"
              :disabled="!isEditing"
              @click="showConfirmDeleteDialog(access)"
            />
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
definePageMeta({
  layout: 'business'
})

interface AccessUser {
  fullName: string;
  email: string;
}

// --- State Management ---

const isEditing = ref(false);
const initialAccesses: AccessUser[] = [
  { fullName: 'Jane Doe', email: 'jane.doe@branch1.com' },
  { fullName: 'John Smith', email: 'john.smith@branch2.com' },
];

const accesses = ref<AccessUser[]>([...initialAccesses]); // Current working list
const tempAccesses = ref<AccessUser[]>([...initialAccesses]); // Backup for cancel

// State for the Add Access Dialog
const isAddAccessVisible = ref(false);
const newAccess = reactive<AccessUser>({ fullName: '', email: '' });

// State for the Delete Confirmation Dialog
const isConfirmDeleteVisible = ref(false);
const accessToDelete = ref<AccessUser | null>(null);

// --- Utility Functions ---

const getFirstLetter = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const toggleEdit = () => {
    isEditing.value = !isEditing.value;
    
    if (isEditing.value) {
        tempAccesses.value = JSON.parse(JSON.stringify(accesses.value));
    } else {
        accesses.value = tempAccesses.value;
    }
};

const saveChanges = () => {
    //will Send final 'accesses.value' list to API 
    console.log('Final list saved to API:', accesses.value);
    
    // 2. Update backup state
    tempAccesses.value = JSON.parse(JSON.stringify(accesses.value));
    
    // 3. Exit editing mode
    isEditing.value = false;
};


const showAddAccessDialog = () => {
  if (!isEditing.value) return;
  newAccess.fullName = '';
  newAccess.email = '';
  isAddAccessVisible.value = true;
};

const addNewAccess = () => {
  if (!newAccess.fullName || !isValidEmail(newAccess.email)) return;
  
  // 1. will Send data to API for user creation
  // 2. Add to local list 
  accesses.value.push({ ...newAccess });
  isAddAccessVisible.value = false;
};


// --- DELETE ACCESS LOGIC ---

const showConfirmDeleteDialog = (access: AccessUser) => {
  if (!isEditing.value) return;
  accessToDelete.value = access;
  isConfirmDeleteVisible.value = true;
};

const deleteAccess = () => {
  if (accessToDelete.value) {
    // 1. Update local list 
    const index = accesses.value.findIndex(a => a.email === accessToDelete.value!.email);
    if (index !== -1) {
      accesses.value.splice(index, 1);
    }
  }
  
  // 2. Close dialog and reset state
  isConfirmDeleteVisible.value = false;
  accessToDelete.value = null;
};
</script>

<style scoped>

</style>