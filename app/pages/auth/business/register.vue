<template>
  <div class="min-h-screen bg-secondaryLinen">
    <div class="flex gap-[30px] items-center justify-center max-w-[80%] mx-auto">
      
      <div class="flex-col p-[30px] flex-[1.3]"> 
        <div class="w-full">
          <h2 class="text-[300%] font-bold mb-6 text-primary"> 
            Engage more users & supercharge your landing conversion rates
          </h2>
          <p class="text-[130%] text-gray-600">
            Launch your campaign and benefit from our expertise on designing and managing conversion centered landing pages.
          </p>
        </div>
      </div>
  
      <!-- <div class=" p-4 sm:p-12 flex-1"> -->
        <div class="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8 mt-10 sm:p-10 border border-gray-100 flex-1">
          
          <h3 class="text-[170%] font-semibold text-center mb-6 text-matte-black">
            Start Your Business Registration
          </h3>
          
          <form @submit.prevent="submitForm" class="flex flex-col">
            
            <div class="max-h-[500px] overflow-y-auto pr-4 pb-4">
              
              <div 
                v-for="(fields, sectionTitle) in groupedFields" 
                :key="sectionTitle" 
                class="mb-6 p-4 border border-gray-200 rounded-lg last:mb-0"
              >
                <h4 class="text-[130%] font-semibold text-matte-black mb-4 border-b pb-2">
                  {{ sectionTitle }}
                </h4>
                
                <div v-for="field in fields" :key="field.fieldName">
                  <BusinessInput
                    v-if="['text', 'email', 'tel', 'url'].includes(field.type)"
                    v-model="formState[field.fieldName]"
                    :label="field.label"
                    :id="field.fieldName"
                    :type="field.type"
                    :required="field.mandatory"
                    :placeholder="`Enter your ${field.label.toLowerCase()}`"
                    :desc="field.desc"
                    :hasError="false" 
                  />
                  
                  <BusinessTextArea
                    v-else-if="field.type === 'textarea'"
                    v-model="formState[field.fieldName]"
                    :label="field.label"
                    :id="field.fieldName"
                    :required="field.mandatory"
                    :placeholder="`Enter your ${field.label}`"
                    :desc="field.desc"
                    :rows="5" 
                    :hasError="false"
                  />
  
                  <BusinessDropdown
                    v-else-if="field.type === 'dropdown'"
                    v-model="formState[field.fieldName]"
                    :label="field.label"
                    :options="sectorOptions" 
                    :id="field.fieldName"
                    :required="field.mandatory"
                    :desc="field.desc"
                    :hasError="false"
                  />
  
                  <Fileupload
                    v-else-if="field.type === 'file'"
                    v-model="formState[field.fieldName]"
                    :label="field.label"
                    :id="field.fieldName"
                    :fieldName="field.fieldName" 
                    :required="field.mandatory"
                    :desc="field.desc"
                    :accept="field.fieldName === 'logo' ? 'image/*' : undefined"
                    :multiple="field.fieldName === 'mediaFiles'" 
                    :hasError="false"
                  />
  
                  <SelectButton
                    v-else-if="field.type === 'selectbutton'"
                    v-model="formState[field.fieldName]"
                    :label="field.label"
                    :id="field.fieldName"
                    :required="field.mandatory"
                    :desc="field.desc"
                    :options="contactModeOptions" 
                    :hasError="false"
                  />
  
                  <VerifiedBadge
                    v-else-if="field.type === 'checkbox'"
                    v-model="formState[field.fieldName]"
                    :label="field.label"
                    :id="field.fieldName"
                    :required="field.mandatory"
                    :desc="field.desc"
                    :hasError="false"
                  />
                  
                </div>
              </div>
              
            </div> 
            
            <ButtonCustom
              type="submit" 
              label="Register Business" 
            />
            
          </form>
          </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import BusinessInput from '~/components/Input/BusinessInput.vue';
import BusinessDropdown from '~/components/Input/BusinessDropdown.vue';
import BusinessTextArea from '~/components/Input/BusinessTextArea.vue';
import Fileupload from '~/components/Input/Fileupload.vue';
import SelectButton from '~/components/Input/SelectButton.vue';
import VerifiedBadge from '~/components/Input/VerifiedBadge.vue';
import useMethods from '~/composables/useMethods';
import type { BusinessRegistrationForm, FormField } from '~/types/business'

const formState = ref<BusinessRegistrationForm>({
  businessName: '', 
  businessAddress: '',
  logo: '',
  openingDaysTime: '',
  businessEmail: '',
  businessPhoneNum: '', 
  cacNum: '', 
  branchNumber: '',
  socialMediaLinks: '',
  websiteLink: '', 
  businessDescription: '',
  sector: '',
  mediaFiles: [], 
  verifiedBadge: false, 
  reviewLink: '',
  preferredModeOfContact: '',
  branchUsername: '',
});

const contactModeOptions = [
    { label: 'Business Email', value: 'EMAIL' },
    { label: 'Business Phone', value: 'PHONE' },
    { label: 'In-App Chat', value: 'CHAT' },
];

const sectorOptions = [
    { label: 'Technology & IT', value: 'IT' },
    { label: 'Retail & E-commerce', value: 'RETAIL' },
    { label: 'Education & Training', value: 'EDUCATION' },
    { label: 'Healthcare & Wellness', value: 'HEALTH' },
    { label: 'Finance & Banking', value: 'FINANCE' },
    { label: 'Other', value: 'OTHER' },
];

const formFields: FormField[] = [
    // SECTION 1: CORE BUSINESS IDENTIFICATION
    {
        label: "Business Name",
        fieldName: "businessName",
        type: "text",
        mandatory: true,
        desc: 'This is the name that will appear on your public profile.'
    },
    {
        label: "CAC Number",
        fieldName: "cacNum",
        type: "text",
        mandatory: true,
        desc: 'Verifiable: Enter your official Company Registration Number.'
    },
    {
        label: "Branch Username",
        fieldName: "branchUsername",
        type: "text",
        mandatory: true,
    },
    
    // SECTION 2: CONTACT INFORMATION 
    {
        label: "Business Address",
        fieldName: "businessAddress",
        type: "text", 
        mandatory: true,
        
    },
    {
        label: "Business Phone Number",
        fieldName: "businessPhoneNum",
        type: "tel",
        mandatory: true,
        desc: 'Must be a Nigerian number (234).'
    },
    {
        label: "Branch Phone Number",
        fieldName: "branchPhoneNum",
        type: "text",
        mandatory: true,
    },
    {
        label: "Business Email",
        fieldName: "businessEmail",
        type: "email",
        mandatory: true,
    },
    
    // SECTION 3: SOCIAL PRESENCE
    {
        label: "Website Link",
        fieldName: "websiteLink",
        type: "url",
        mandatory: false,
    },
    {
        label: "Social Media Links",
        fieldName: "socialMediaLinks",
        type: "text", 
        mandatory: false,
    },
    {
        label: "Review Link",
        fieldName: "reviewLink",
        type: "url",
        mandatory: false,
    },
    
    // SECTION 4: CUSTOM FIELDS
    {
        label: "Sector",
        fieldName: "sector",
        type: "dropdown", 
        mandatory: true,
        desc: 'Select the primary sector your business operates in.'
    },
    {
        label: "Business Description",
        fieldName: "businessDescription",
        type: "textarea",
        mandatory: true,
    },
    // SECTION 4: MEDIA 
    {
        label: "Company Logo",
        fieldName: "logo",
        type: "file", 
        mandatory: true,
       
    },
    {
        label: "Business Media Files",
        fieldName: "mediaFiles",
        type: "file", 
        mandatory: false,
    },
    // SECTION 5: CONTACT PREFERENCES
    {
        label: "Opening Days & Time",
        fieldName: "openingDaysTime",
        type: "text", // i will simplify to text for now, then upgrade to date input later
        mandatory: true,
    },
    {
        label: "Preferred Mode of Contact",
        fieldName: "preferredModeOfContact",
        type: "selectbutton", 
        mandatory: true,
    },
    {
        label: "Verified Badge Status",
        fieldName: "verifiedBadge",
        type: "checkbox", 
        mandatory: false,
    },

];

const getFieldSection = (fieldName: keyof BusinessRegistrationForm): string => {
    if (['businessName', 'cacNum', 'branchUsername'].includes(fieldName as string)) {
        return 'Core Business Identification';
    }
    if (['businessAddress', 'businessPhoneNum', 'branchPhoneNum', 'businessEmail'].includes(fieldName as string)) {
        return 'Physical & Contact Information';
    }
    if (['websiteLink', 'socialMediaLinks', 'reviewLink'].includes(fieldName as string)) {
        return 'Web & Social Presence';
    }
    return 'Platform Configuration & Custom Fields'; // Default group for remaining fields
};
const groupedFields = computed(() => {
    return formFields.reduce((acc, field) => {
        const section = getFieldSection(field.fieldName);
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(field);
        return acc;
    }, {} as Record<string, FormField[]>);
});
const { submitRegistrationForm } = useMethods();
const submitForm = async () => {
  const payload = {
    ...formState
  };

  const res = await submitRegistrationForm(payload);

  if (res.success) {
    alert("Registration Successful!");
  } else {
    alert(`Error: ${res.error || 'Please check input data.'}`);
  }
};
</script>

<style scoped>

</style>