<template>
  <div
    class="flex-none flex flex-col justify-start items-center p-8 w-[400px] overflow-y-auto"
  >
    <div v-if="volunteerStore.fetching" id="skeleton-loader"></div>
    <div class="w-full" v-if="volunteer">
      <div>
        <header class="flex flex-col items-center gap-3">
          <!-- Avatar -->

          <VolunteerDetailOverviewAvatar
            :src="avatarSrc"
            :alt="`Avatar von ${volunteer.person.firstname} ${volunteer.person.lastname}`"
            @fileSelected="editAvatar"
          />

          <!-- Name -->
          <div class="relative w-full flex justify-center items-center group">
            <div>
              <h2 class="p-2 text-lg font-medium flex flex-col items-center">
                <p>{{ volunteer.person.firstname }}</p>
                <p>{{ volunteer.person.lastname }}</p>
              </h2>
              <!-- Birthday and -place -->
              <p v-if="volunteer.birthday" class="text-sm">
                geboren am
                <span class="font-bold">{{
                  getPropperDateString(volunteer.birthday)
                }}</span>
                in
                <span class="font-bold">{{ volunteer.birthplace }}</span>
              </p>
            </div>
            <!-- pen to edit name, gender, birthdate -->
            <div
              class="flex absolute inset-0 justify-end items-center pointer-events-none"
            >
              <button
                class="hidden group-hover:inline p-4 -m-4 pointer-events-auto"
                @click="newNameModal = true"
              >
                <IconPenEdit />
              </button>
            </div>
          </div>
          <hr class="w-40" />
          <!-- Project -->
          <p class="text-sm" v-if="relevantContract">
            Einsatzstelle:
            <span class="font-medium">{{ relevantContract.project.name }}</span>
          </p>
          <!-- Status-Pill -->
          <div
            class="flex flex-row border-2 border-voloblue-100 rounded-lg text-sm"
          >
            <span
              class="px-1 pt-[1px] text-voloblue-100"
              v-if="relevantContract"
              >{{ relevantContract.program }}</span
            >
            <span class="px-1 pt-[1px] text-white bg-voloblue-100">{{
              volunteer.status
            }}</span>
          </div>
        </header>
        <article class="flex flex-col gap-8 w-full self-start mt-6">
          <!-- contact section -->

          <VolunteerDetailOverviewContact />

          <!-- address section -->
          <VolunteerDetailOverviewAddresses />
          <details v-if="false" class="mb-2">
            <summary class="font-medium cursor-pointer">
              FW-Dienstverlauf
            </summary>
            <ul class="flex flex-col gap-3 pt-3">
              <li>Station 1</li>
              <li>Station 2</li>
              <li>Station 3</li>
            </ul>
          </details>
        </article>
      </div>
    </div>
  </div>
  <ContainerModal v-if="newNameModal">
    <BasicPersonalDataFormular
      @saved="onNameSaved"
      @cancel="newNameModal = false"
      :lastnameCopy="volunteer.person.lastname"
      :firstnameCopy="volunteer.person.firstname"
      :birthdayCopy="volunteer.birthday"
      :birthplaceCopy="volunteer.birthplace"
      :genderCopy="volunteer.person.gender"
    />
  </ContainerModal>
</template>
<script setup>
import { useVolunteerStore } from "~/stores/VolunteerStore.js";
import ContainerModal from "@/components/ContainerModal.vue";
import { getPropperDateString } from "@/utils/dateAndTime";

const volunteerStore = useVolunteerStore();
const apiUrl = config.public.baseUrl;

const volunteer = ref(null);
const contacts = ref(null);
const addresses = ref(null);
const relevantContract = ref(null);
const hover = ref(false);
const newNameModal = ref(false);

const onNameSaved = async () => {
  newNameModal.value = false;
  await volunteerStore.getVolunteer(volunteerStore.selectedVolunteer.id);
  volunteer.value = volunteerStore.selectedVolunteer;
};

const editAvatar = async (event) => {
  const file = event.target.files[0];

  if (file) {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await volunteerStore.editVolunteerAvatar(
        formData,
        $route.params.volunteerId
      );
    } catch (error) {
      console.error("Error editing Avatar: ", error);
    } finally {
      await volunteerStore.getVolunteer($route.params.volunteerId);
      volunteer.value = volunteerStore.selectedVolunteer;
    }
  }
};

const avatarSrc = () => {
  return this.volunteer
    ? `${apiUrl}/files/${volunteer.avatar}?t=${Date.now()}`
    : "";
};

watch((volunteer, newValue) => {
  if (newValue) {
    volunteer.value = volunteerStore.selectedVolunteer;
  }
});
</script>
