<template>
  <div class="flex overflow-hidden">
    <VolunteerDetailOverview />

    <div class="flex-1 bg-vologray-100 p-8 overflow-auto">
      <VolunteerDetailNavigationbar
        :navigation="['Dokumentation', 'Dokumente', 'Vereinbarung']"
        :active="selectedContextTab"
        @navLinkClick="openTab"
      />

      <VolunteerDetailDocuments
        class="mt-8"
        v-if="selectedContextTab === 'dokumente'"
      />
      <VolunteerDetailNotes
        class="mt-8"
        v-if="selectedContextTab === 'dokumentation'"
      />
      <VolunteerDetailContracts
        class="mt-8"
        v-if="selectedContextTab === 'vereinbarung'"
      />
    </div>
  </div>
</template>
<script setup>
import { useVolunteerStore } from "@/stores/VolunteerStore.js";

// import debounce from "lodash.debounce";

const route = useRoute();
const router = useRouter();
const volunteerStore = useVolunteerStore();

const selectedContextTab = computed(() => {
  return route.params.contextTab?.toLowerCase();
});

const openTab = (tabName) => {
  router.push({
    name: "VolunteerDetailViewWithContext", // Optional: Oder lieber per Pfad
    params: {
      volunteerId: route.params.volunteerId,
      contextTab: String(tabName).toLowerCase(),
    },
  });
};
const getNotes = async () => {
  const params = { volunteerId: route.params.volunteerId };
  try {
    await volunteerStore.getVolunteerNotes(params);
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
};
// const debouncedSearch = debounce((input, searchFunction) => {
//   searchFunction(input)
// }, 1000)

//   watch: {
//     searchQuery(newValue) {
//       this.$router.push({ query: { search: newValue } });
//       this.debouncedSearch(this.searchQuery, (input) => {
//         this.debouncedSearchQuery = input;
//       });
//     },
//   },

onBeforeUnmount(() => {
  volunteerStore.clearVolunteer();
});
</script>
