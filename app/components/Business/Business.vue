<template>
  <Dialog
    v-model:visible="addSocial"
    :draggable="false"
    modal
    header="Add Social Media Handle"
    :style="{ width: '25rem' }"
  >
    <form @submit.prevent="saveSocial(social.name, social.url)">
      <div class="flex gap-[10px]">
        <select v-model="social.name" class="border">
          <option
            v-for="(i, idx) in availableSocials"
            :key="idx"
            class="capitalize flex gap-[10px] items-center"
          >
            {{ i }}
          </option>
        </select>
        <InputText
          type="url"
          fluid
          class="flex-auto"
          autocomplete="off"
          v-model="social.url"
        />
      </div>
      <div class="flex justify-end gap-2 mt-[20px]">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="resetAddSocial"
        ></Button>
        <Button type="submit" label="Save Social Handle"></Button>
      </div>
    </form>
  </Dialog>

  <Dialog
    v-model:visible="addFaq"
    :draggable="false"
    modal
    header="Add FAQ"
    :style="{ width: '35rem' }"
  >
    <form @submit.prevent="saveFaq(businessData?.faqs.length)">
      <div class="flex flex-col gap-[10px]">
        <InputText v-model="faq.question" placeholder="Question" fluid />
        <Textarea v-model="faq.answer" placeholder="Answer" rows="3" fluid />
      </div>
      <div class="flex justify-end gap-2 mt-[20px]">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="resetAddFaq"
        ></Button>
        <Button type="submit" label="Save FAQ"></Button>
      </div>
    </form>
  </Dialog>

  <Dialog
    v-model:visible="addImage"
    :draggable="false"
    modal
    header="Add Business Media"
    :style="{ width: '20rem' }"
  >
    <div class="flex justify-center items-center pb-[30px]">
      <BusinessMedia
        @uploaded="insertImage"
        @deleted="removeImage"
        path="media"
        :url="null"
      />
    </div>
  </Dialog>

  <Dialog
    v-model:visible="addLogo"
    :draggable="false"
    modal
    header="Update Business Logo"
    :style="{ width: '20rem' }"
  >
    <div class="flex justify-center items-center pb-[30px]">
      <BusinessMedia
        @uploaded="insertImageLogo"
        @deleted="removeImageLogo"
        path="profile"
        :url="null"
      />
    </div>
  </Dialog>

  <Dialog
    v-model:visible="editBusiness"
    position="top"
    :draggable="false"
    modal
    header="Update Business Profile"
    :style="{ width: '50rem' }"
  >
    <div v-if="businessData" class="flex flex-col gap-[20px]">
      <!-- profile -->
      <Panel toggleable :collapsed="true">
        <template #header>
          <div class="text-[120%] font-bold">Profile</div>
        </template>
        <div class="m-0 flex flex-col gap-[20px]">
          <div>
            <label>Business Name:</label>
            <InputText
              fluid
              class="flex-auto"
              autocomplete="off"
              v-model="businessData.name"
            />
          </div>
          <div>
            <label>Business Description</label>
            <Textarea
              fluid
              :rows="5"
              v-model="businessData.businessDescription"
            ></Textarea>
          </div>
          <div>
            <label>Business Category</label>
            <Select
              fluid
              v-model="business_category"
              :options="props.categories"
              filter
              optionLabel="name"
              placeholder="Business Category"
            >
            </Select>
            <small class="block mt-[10px]"
              >Notice: updating your business category resets your tags!</small
            >
          </div>
          <div>
            <label class="flex justify-between gap-[10px] items-center">
              <span>Business Tags</span>
              <span> {{ selected_tags.length }} / {{ MAX_TAGS }} </span>
            </label>

            <div
              v-if="business_tags && business_tags.length > 0"
              class="flex flex-wrap gap-2 mt-[10px]"
            >
              <Chip
                v-for="tag in business_tags"
                :key="tag"
                :label="tag"
                class="cursor-pointer transition-all !text-[90%] !py-[5px]"
                :class="{
                  'bg-gold text-white': isSelected(tag),
                  'bg-surface-200': !isSelected(tag),
                  'opacity-50 pointer-events-none':
                    !isSelected(tag) && selected_tags.length >= MAX_TAGS,
                }"
              >
                <span @click="addTag(tag)">{{ tag }}</span>
                <i
                  v-if="isSelected(tag)"
                  class="pi pi-times text-[90%] cursor-pointer"
                  @click="removeTag(tag)"
                />
              </Chip>
            </div>
            <small class="mt-2.5" v-else
              >No tags added for this category yet.</small
            >
          </div>
          <div>
            <label>Business Highlights</label>
            <div class="flex flex-wrap gap-2 mt-1">
              <div
                v-for="(i, idx) in highlights"
                :key="idx"
                :class="{
                  'border-primary':
                    businessData.highlights &&
                    businessData.highlights.includes(i.title),
                }"
                class="flex gap-2.5 p-2.5 border rounded-md"
              >
                <Checkbox
                  binary
                  :modelValue="isChecked(i.title)"
                  @update:modelValue="(val: boolean) => toggleHighlight(val, i.title)"
                />
                <span>{{ i.title }}</span>
              </div>
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
            <div>
              {{ businessData.businessStreet }}
              {{ businessData.businessCityTown }}
              <span v-if="businessData.businessState">, </span>
              {{ businessData.businessState }}
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
            <div>
              <label>Business Phone Number:</label>
              <InputText
                class="flex-auto"
                fluid
                autocomplete="off"
                v-model="businessData.businessPhoneNumber"
              />
            </div>
            <div>
              <label>Business Email Address:</label>
              <InputText
                class="flex-auto"
                fluid
                autocomplete="off"
                v-model="businessData.businessEmail"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
            <div>
              <label for="email">Street</label>
              <InputText
                fluid
                class="flex-auto"
                required
                autocomplete="off"
                v-model="businessData.businessStreet"
              />
            </div>
            <div>
              <label for="email">City / Town</label>
              <InputText
                fluid
                class="flex-auto"
                required
                autocomplete="off"
                v-model="businessData.businessCityTown"
              />
            </div>
            <div>
              <label for="email">State</label>
              <InputText
                fluid
                class="flex-auto"
                required
                autocomplete="off"
                v-model="businessData.businessState"
              />
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
            <InputText
              fluid
              class="flex-auto"
              autocomplete="off"
              v-model="businessData.website"
            />
          </div>
          <div class="mt-[10px]">
            <div class="flex justify-between gap-2.5 items-center">
              <div>Manage Social Handles:</div>
              <ButtonCustom
                icon="plus"
                input-class="w-max"
                primary="true"
                @click="addSocial = true"
              />
            </div>

            <div class="flex flex-col gap-[10px] mt-[10px]">
              <div
                v-for="(url, name) in businessData.socialMediaLinks"
                :key="name"
                class="flex items-center gap-[5px]"
              >
                <div class="capitalize items-center flex gap-[10px]">
                  <i :class="`pi pi-${name}`"></i>
                  {{ name }}
                </div>
                <div class="flex-1">
                  <InputText
                    fluid
                    class="flex-auto"
                    autocomplete="off"
                    v-model="businessData.socialMediaLinks[name]"
                  />
                </div>
                <div>
                  <i
                    class="pi pi-trash text-red p-[5px] cursor-pointer"
                    @click="deleteSocial(name)"
                  ></i>
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
        <div>
          <div class="flex gap-[20px] justify-between items-center mb-[30px]">
            <h1 class="font-bold"></h1>
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <RadioButton
                  v-model="businessData.openingHours.same"
                  inputId="gen"
                  name="time"
                  :value="true"
                />
                <label for="gen">General Time For All Days</label>
              </div>
              <div class="flex items-center gap-2">
                <RadioButton
                  v-model="businessData.openingHours.same"
                  inputId="spec"
                  name="time"
                  :value="false"
                />
                <label for="spec">Specific Time Per Day</label>
              </div>
            </div>
          </div>
          <div
            v-if="businessData?.openingHours.same"
            class="flex flex-col gap-[10px]"
          >
            <div class="flex justify-between items-start gap-[20px]">
              <div class="flex items-center gap-[20px]">
                Mon - Fri
                <div class="flex items-center gap-[5px]">
                  (
                  <Checkbox
                    v-model="businessData.openingHours.same_time.closed"
                    inputId="same_closed_mon_to_fri"
                    name="same_closed_mon_to_fri"
                    :binary="true"
                  />
                  <label for="same_closed_mon_to_fri" class="ml-[5px]"
                    >Closed</label
                  >
                  )
                </div>
              </div>
              <div v-if="businessData?.openingHours.same_time.closed !== true">
                <div class="flex gap-[10px] items-end">
                  <div>
                    <label class="label">Opens:</label>
                    <DatePicker
                      id="datepicker-timeonly"
                      hourFormat="12"
                      v-model="businessData.openingHours.same_time.open"
                      timeOnly
                      fluid
                    />
                  </div>
                  <div>
                    <label class="label">Closes:</label>
                    <DatePicker
                      id="datepicker-timeonly"
                      hourFormat="12"
                      v-model="businessData.openingHours.same_time.close"
                      timeOnly
                      fluid
                    />
                  </div>
                </div>
              </div>
              <div v-else>Closed on Mondays to Fridays!</div>
            </div>
            <!-- weekend -->
            <div
              class="flex justify-between items-start gap-[20px]"
              v-for="item in weekends"
              :key="genRand()"
            >
              <div class="flex items-center gap-[20px]">
                <div class="capitalize">{{ item }}</div>
                <div class="flex items-center gap-[5px]">
                  (
                  <Checkbox
                    v-model="businessData.openingHours[item].closed"
                    :name="item"
                    :binary="true"
                  />
                  <label :for="item" class="ml-[5px]">Closed</label>
                  )
                </div>
              </div>
              <div v-if="businessData?.openingHours[item].closed !== true">
                <div class="flex gap-[10px] items-end">
                  <div>
                    <label class="label">Opens:</label>
                    <DatePicker
                      hourFormat="12"
                      v-model="businessData.openingHours[item].open"
                      timeOnly
                      fluid
                    />
                  </div>
                  <div>
                    <label class="label">Closes:</label>
                    <DatePicker
                      hourFormat="12"
                      v-model="businessData.openingHours[item].close"
                      timeOnly
                      fluid
                    />
                  </div>
                </div>
              </div>
              <div v-else class="capitalize">Closed on {{ item }}!</div>
            </div>
          </div>
          <div v-else class="flex flex-col gap-[10px]">
            <div
              class="flex justify-between items-start gap-[20px]"
              v-for="item in allDays"
              :key="genRand()"
            >
              <div class="flex items-center gap-[20px]">
                <div class="capitalize">{{ item }}</div>
                <div class="flex items-center gap-[5px]">
                  (
                  <Checkbox
                    v-model="businessData.openingHours[item].closed"
                    :name="item"
                    :binary="true"
                    :inputId="item"
                  />
                  <label :for="item" class="ml-[5px]">Closed</label>
                  )
                </div>
              </div>
              <div v-if="businessData?.openingHours[item].closed !== true">
                <div class="flex gap-[10px] items-end">
                  <div>
                    <label class="label">Opens:</label>
                    <DatePicker
                      hourFormat="12"
                      v-model="businessData.openingHours[item].open"
                      timeOnly
                      fluid
                    />
                  </div>
                  <div>
                    <label class="label">Closes:</label>
                    <DatePicker
                      hourFormat="12"
                      v-model="businessData.openingHours[item].close"
                      timeOnly
                      fluid
                    />
                  </div>
                </div>
              </div>
              <div v-else class="capitalize">Closed on {{ item }}!</div>
            </div>
          </div>
        </div>
      </Panel>

      <!-- media -->
      <Panel toggleable :collapsed="true">
        <template #header>
          <div class="text-[120%] font-bold">Business Media</div>
        </template>
        <div class="flex justify-between gap-2.5 mb-[20px]">
          <ButtonCustom
            icon="pencil"
            label="Update Logo"
            input-class="!w-max"
            @clicked="addLogo = true"
          />
          <ButtonCustom
            icon="plus"
            class="flex-1"
            label="Add Media"
            primary="true"
            @clicked="initImage"
          />
        </div>
        <div class="m-0 grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
          <img
            v-if="businessData.logo"
            class="border rounded-md h-[210px] w-[210px] object-center object-cover"
            :src="businessData.logo"
            :alt="`${businessData.name} Logo`"
          />
          <div
            v-else
            class="h-[210px] w-[210px] flex justify-center items-center p-[20px] border rounded-md shadow-md"
          >
            NO LOGO UPLOADED!
          </div>
          <BusinessMedia
            v-for="i in businessData.media"
            :key="i"
            @deleted="removeImage"
            path="media"
            :url="i"
          />
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
            <ButtonCustom
              icon="plus"
              label="Add Question"
              primary="true"
              @click="addFaq = true"
            />
          </div>
          <div
            v-for="(faq, index) in businessData.faqs"
            :key="index"
            class="border rounded-md p-4"
          >
            <div class="flex justify-end mb-[10px]">
              <i
                class="pi pi-trash text-[red] cursor-pointer"
                @click="removeFaqs(Number(index))"
              ></i>
            </div>
            <InputText
              v-model="businessData.faqs[index].question"
              placeholder="Question"
              class="w-full mb-2"
            />

            <Textarea
              v-model="businessData.faqs[index].answer"
              placeholder="Answer"
              rows="3"
              class="w-full"
            />
          </div>
        </div>
      </Panel>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="resetBusiness"
        ></Button>
        <Button
          :loading="isLoading"
          type="submit"
          :label="isLoading ? 'Updating Business Profile...' : 'Save'"
          @click="updateProfile"
        ></Button>
      </div>
    </template>
  </Dialog>

  <section class="..mg ..py-[50px]" v-if="business">
    <div class="breadcrumb flex gap-2.5 flex-wrap pb-[20px]">
      <NuxtLink to="/">Home</NuxtLink>
      <a>|</a>
      <NuxtLink
        :to="{
          path: '/explore',
          query: {
            categoryId: i.id,
            categoryName: i.name,
          },
        }"
        v-for="(i, idx) in business?.categories"
        :key="idx"
      >
        {{ i.name }}
      </NuxtLink>
    </div>

    <Card class="w-full">
      <template #content>
        <div class="flex sm:flex-row flex-col gap-[5px]">
            <div class="relative p-[2px] rounded-[10px] border h-auto sm:w-[210px] w-full flex flex-col gap-[2px] items-center">
              <!-- BADGE / LOGO WRAPPER -->
              <div class="relative w-full flex items-center justify-center p-[10px] sm:p-[15px]">
                
                <!-- Badge Container - fixed max width on mobile -->
                <div class="relative w-full h-full max-w-[180px] sm:max-w-[160px] aspect-square">
                  
                  <!-- LOGO - sits behind badge, centered -->
                  <div class="absolute inset-0 flex items-center justify-center py-[0] px-[5%] z-0">
                    <img
                      :src="business?.logo ?? '/images/default-business-logo.png'"
                      class="w-full h-full object-contain"
                      :alt="business?.name"
                    />
                  </div>
                  
                  <!-- STATUS BADGE/FRAME with Claim Status - positioned absolutely on top -->
                  <BusinessStatusFrame
                    v-if="businessBadgeStatus"
                    :status="businessBadgeStatus"
                    :claimStatus="business?.businessStatus"
                    class="absolute inset-2 z-20"
                  />
                                    
                </div>
              </div>

                    <!-- Star ratings and reviews -->
            <div class="flex flex-col gap-1.5 justify-center w-full px-[20px] sm:w-auto sm:px-0">
              <div class="flex justify-center scale-75 sm:scale-90">
                <Star v-for="n in 5" :key="n" :value="(business.avgRating ?? 0) - (n - 1)" class="w-8 h-8" :color-level="Math.floor(business.avgRating ?? 0)" />
              </div>
              <div class="text-center text-xs sm:text-sm">
                {{ business?.reviewCount ?? 0 }}
                Review{{ business?.reviewCount !== 1 ? 's' : '' }}
              </div>
            </div>
            </div>
          <div class="flex-1">
            <div class="flex flex-col ml-2 gap-[10px]">
              <div class="flex items-center justify-between">
                <div class="flex flex-col gap-2">

                  <div class="flex gap-1 items-center flex-wrap">
                    <span class="text-xl sm:text-2xl font-bold">
                      {{ business?.name }}
                    </span>
                  </div>
                  <div class="sm:hidden block">
                    <a
                      class="text-sm cursor-pointer text-primary underline"
                      v-if="isBusiness && canEdit"
                      @click="editBusiness = true"
                    >
                      Edit Business Profile
                    </a>
                    <NuxtLink
                      class="text-sm cursor-pointer text-primary underline"
                      to="claim-business"
                      v-if="business?.businessStatus === 'unclaimed'"
                    >
                      Claim Business
                    </NuxtLink>
                  </div>
                </div>
                <div class="flex gap-2.5">
                  <NuxtLink
                    class="sm:block hidden"
                    to="claim-business"
                    v-if="business?.businessStatus === 'unclaimed'"
                  >
                    <ButtonCustom
                      label="Claim Business"
                      size="lg"
                      input-class="!w-max"
                    />
                  </NuxtLink>
                  <div class="sm:block hidden" v-if="canEdit">
                    <ButtonCustom
                      v-if="isBusiness"
                      @click="editBusiness = true"
                      label="Edit Business Profile"
                      size="lg"
                      primary="true"
                      input-class="!w-max"
                    />
                  </div>
                </div>
              </div>
              <div>
                <NuxtLink
                  :to="{
                    path: '../../end-user/landing/explore',
                    query: {
                      categoryId: i.id,
                      categoryName: i.name,
                    },
                  }"
                  v-for="(i, idx) in business?.categories"
                  :key="idx"
                >
                  {{ i.name }}
                </NuxtLink>
              </div>
            </div>

            <div class="w-[20px] border my-[10px]"></div>

            <div class="flex gap-2.5" v-if="business?.tags">
              <NuxtLink
                v-for="(i, idx) in business?.tags"
                :to="{
                  path: '../../end-user/landing/explore',
                  query: {
                    tagId: i.id || i,
                    tagName: i.name || i,
                  },
                }"
                :key="idx"
              >
                <Chip
                  class="hover:bg-primary hover:text-white !border !border-primary sm:!py-[5px] sm:!px-[10px] !py-[3px] !px-[5px]"
                >
                  <span class="sm:text-[80%] text-[70%]">{{ i.name }}</span>
                </Chip>
              </NuxtLink>
            </div>
            <div v-else>No business tags added yet.</div>

            <div class="w-[20px] border my-[10px]"></div>

            <div class="flex flex-col gap-[5px]">
              <!-- <div class="font-bold text-[110%] mb-[10px] underline">Contact Information:</div> -->
              <div class="flex gap-2.5 items-center">
                <div class="flex items-center gap-[5px] mb-[5px]">
                  <i class="pi pi-phone"></i>
                  {{ business.businessPhoneNumber ?? "-" }}
                </div>
                <div>•</div>
                <a
                  :href="business.website"
                  target="_blank"
                  class="flex items-center gap-[5px] mb-[5px]"
                >
                  <i class="pi pi-globe"></i>
                  {{ business.website ?? "-" }}
                </a>
              </div>
              <div class="flex items-center gap-[5px] mb-[5px]">
                <i class="pi pi-map-marker"></i>
                {{ business.businessAddress ?? "-" }}
              </div>
              <div
                class="flex gap-2.5 socials"
                v-if="business.socialMediaLinks"
              >
                <a
                  :href="url"
                  target="_blank"
                  v-for="(url, name) in business.socialMediaLinks"
                  :key="name"
                  class="flex items-center gap-[5px]"
                >
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
      <ButtonCustom
        label="Business Profile"
        inputClass="w-max"
        :primary="currentPage === 'profile' ? true : false"
        @clicked="setSection('profile')"
      />
      <ButtonCustom
        label="Reviews"
        inputClass="w-max"
        :primary="currentPage === 'review' ? true : false"
        @clicked="setSection('review')"
      />
      <ButtonCustom
        v-if="isBusiness && canEdit"
        label="Get Reviews"
        inputClass="w-max"
        :primary="currentPage === 'qr' ? true : false"
        @clicked="setSection('qr')"
      />
    </div>

    <Divider class="mb-[20px]" />

    <BusinessProfile
      v-if="currentPage === 'profile'"
      :isBusiness="isBusiness"
      :business="business"
      @edit="emit('edit')"
    />
    <BusinessReviews
      v-if="currentPage === 'review'"
      :reviews="reviews"
      :business="business"
      :isBusiness="isBusiness"
    />
    <BusinessQr
      v-if="isBusiness && currentPage === 'qr'"
      :business="business"
    />

    <!-- {{ business }} -->
  </section>
</template>

<script setup lang="ts">
import Star from '~/components/Stars.vue'
import type { BusinessProfileResponse } from "~/types/business";
import useBusinessMethods from "~/composables/business/useBusinessMethods";
import BusinessStatusFrame from '~/components/Business/BusinessStatusFrame.vue';

const businessBadgeStatus = computed(() => {
  if (props.status === 'trusted') return 'trusted'
  if (props.status === 'verified') return 'verified'
  return null
})

const props = defineProps([
  "business",
  "toEdit",
  "page",
  "isBusiness",
  "categories",
  "reviews",
  "status",
  "canEdit",
]);
const emit = defineEmits(["edit"]);
const currentPage = ref();
const businessData = ref<BusinessProfileResponse>();
const editBusiness = ref(false);
const addSocial = ref(false);
const addFaq = ref(false);
const addImage = ref(false);
const addLogo = ref(false);
const isLoading = ref(false);

const { saveBusinessProfile, getCategoryTags } = useBusinessMethods();
const toast = useToast();

function isChecked(title: string): boolean {
  if (!businessData.value || !businessData.value.highlights) return false;
  return businessData.value.highlights.includes(title);
}

function toggleHighlight(val: boolean, title: string): void {
  if (!businessData.value) return;
  if (val) {
    if (!businessData.value.highlights.includes(title)) {
      businessData.value.highlights.push(title);
    }
  } else {
    businessData.value.highlights = businessData.value.highlights.filter(
      (t: string) => t !== title
    );
  }
}

const insertImage = (url: string) => {
  if (!businessData.value) return;
  addImage.value = false;
  businessData.value.media.push(url);
};

const insertImageLogo = (url: string) => {
  if (!businessData.value) return;
  businessData.value.logo = url;
};

const removeImage = (url: string) => {
  if (!businessData.value) return;
  businessData.value.media = businessData.value.media =
    businessData.value.media.filter((item: string) => item !== url);
};

const removeImageLogo = (url: string) => {
  if (!businessData.value) return;
  businessData.value.logo = null;
};

const MAX_TAGS = 5;
const MAX_FAQS = 6;
const MAX_MEDIA = 5;

const initImage = () => {
  if (!businessData.value) return;
  if (businessData.value.media.length >= MAX_MEDIA) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Maximum number of media uploaded!",
      life: 3000,
    });
  }

  addImage.value = true;
};

const setSection = (s: string) => {
  currentPage.value = s;
};

const availableSocials = ref();

const social = ref({
  name: "",
  url: "",
});

const faq = ref({
  question: "",
  answer: "",
});

const business_category = ref();
const business_tags = ref();
const selected_tags = ref<string[]>([]);

const fetchTags = async (id: string) => {
  const res = await getCategoryTags(id);
  if (res?.statusCode === 200) {
    business_tags.value = res.data ?? [];
  }
};

onMounted(() => {
  watch(business_category, async () => {
    if (!businessData.value) return;

    businessData.value.tags = [];
    selected_tags.value = [];
    await fetchTags(business_category.value.id);
  });
});

const removeFaqs = (index: number) => {
  if (!businessData.value) return;
  businessData.value.faqs = removeByIndex(businessData.value.faqs, index);
};

const removeByIndex = <T>(arr: T[], index: number): T[] => {
  return arr.filter((_, i) => i !== index);
};

const isSelected = (tag: string) => {
  return selected_tags.value.includes(tag) ? true : false;
};

const addTag = (tag: string) => {
  if (isSelected(tag)) return;

  if (selected_tags.value.length >= MAX_TAGS) {
    alert(`You can select up to ${MAX_TAGS} tags only`);
    return;
  }

  selected_tags.value.push(tag);
};

const removeTag = (tag: string) => {
  selected_tags.value = selected_tags.value.filter((t: string) => t !== tag);
};

const badge = ref<{
  status: string;
  badge: string;
}>();

function parseOpeningHours(raw: any) {
  const h = raw;

  if (h.same_time.open) h.same_time.open = new Date(h.same_time.open);
  if (h.same_time.close) h.same_time.close = new Date(h.same_time.close);

  for (const d of allDays) {
    if (h[d].open) h[d].open = new Date(h[d].open);
    if (h[d].close) h[d].close = new Date(h[d].close);
  }
  return h;
}

onBeforeMount(async () => {
  currentPage.value = props.page ?? "review";
  if (props.business) {
    businessData.value = props.business;
    if (businessData.value?.socialMediaLinks) {
      availableSocials.value = SOCIAL_HANDLES.filter(
        (social) => !(social in businessData.value?.socialMediaLinks)
      );
    } else {
      availableSocials.value = SOCIAL_HANDLES;
    }
    social.value.name = availableSocials.value[0] ?? "";
    business_category.value = businessData.value?.categories[0];
    selected_tags.value = businessData.value?.tags ?? [];

    await fetchTags(businessData.value?.categories[0]?.id!);
    if (businessData.value) {
      if (props.business.highlights === null) {
        businessData.value.highlights = [];
      }

      if (
        !props.business.openingHours ||
        props.business.openingHours === null
      ) {
        businessData.value.openingHours = parseOpeningHours(
          rawToNormalized({
            monday: "00:00 - 00:00",
            tuesday: "00:00 - 00:00",
            wednesday: "00:00 - 00:00",
            thursday: "00:00 - 00:00",
            friday: "00:00 - 00:00",
            saturday: "00:00 - 00:00",
            sunday: "00:00 - 00:00",
          })
        );
      } else {
        businessData.value.openingHours = parseOpeningHours(
          rawToNormalized(props.business.openingHours)
        );
      }
    }

    badge.value = getBadge(props.status);
  }
});

const resetBusiness = () => {
  businessData.value = props.business;
  editBusiness.value = false;
};

const resetAddSocial = () => {
  addSocial.value = false;
  social.value.name = "";
  social.value.url = "";
};

const saveFaq = (count: number) => {
  if (businessData.value === null || businessData.value === undefined) return;
  if (businessData.value.faqs.length >= MAX_FAQS) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "Maximum number of questions reached!",
      life: 3000,
    });
  }

  if (!faq.value.answer || !faq.value.question) {
    return toast.add({
      severity: "info",
      summary: "INFO",
      detail: "FAQ question and answer required!",
      life: 3000,
    });
  }

  businessData.value.faqs.push({ ...faq.value });
  resetAddFaq();
};

const resetAddFaq = () => {
  addFaq.value = false;
  faq.value.question = "";
  faq.value.answer = "";
};

const deleteSocial = (id: any) => {
  if (businessData.value === null || businessData.value === undefined) return;
  delete businessData.value.socialMediaLinks[id];
  availableSocials.value = SOCIAL_HANDLES.filter(
    (social) => !(social in businessData.value?.socialMediaLinks)
  );
  social.value.name = availableSocials.value[0] ?? "";
};

const saveSocial = (name: string, url: string) => {
  if (businessData.value === null || businessData.value === undefined) return;
  businessData.value.socialMediaLinks[name] = url;
  addSocial.value = false;
};

const allDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const weekends = ["saturday", "sunday"];

const updateProfile = async () => {
  try {
    if (!businessData.value?.id!) {
      return toast.add({
        severity: "error",
        summary: "ERROR",
        detail: "Business ID is missing",
        life: 3000,
      });
    }

    if (selected_tags.value.length <= 0) {
      return toast.add({
        severity: "info",
        summary: "INFO",
        detail: "Business must select at least one tag!",
        life: 3000,
      });
    }

    businessData.value.tags = selected_tags.value;

    if (businessData.value.logo === null) {
      return toast.add({
        severity: "info",
        summary: "INFO",
        detail: "Business logo must be selected!",
        life: 3000,
      });
    }

    isLoading.value = true;
    const category = [];
    category.push(business_category.value.id);
    const businessDataToSubmit = {
      ...businessData.value,
      logo: businessData.value.logo ?? null,
      categoryIds: category,
    };
    businessDataToSubmit.openingHours = normalizedToRaw(
      businessData.value.openingHours
    );

    const res = await saveBusinessProfile(
      businessData.value.id,
      businessDataToSubmit
    );
    if (res) {
      emit("edit", res);
      return toast.add({
        severity: "success",
        summary: "SUCCESS",
        detail: "Profile Updated",
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
.socials a + a::before {
  content: "•";
}

i.facebook {
  color: #1877f2;
}

i.whatsapp {
  color: green;
}

i.twitter {
  color: #1da1f2;
}

i.linkedin {
  color: #0077b5;
}

i.instagram {
  color: #b03db5;
}

label {
  font-weight: 400;
  color: gray;
  font-size: 90%;
}
.breadcrumb a {
  font-size: 75%;
}
</style>
