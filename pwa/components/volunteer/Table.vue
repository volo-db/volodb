<template>
  <div v-bind="$attrs">
    <div v-if="volunteerStore.volunteersPage">
      <table class="table-fixed w-full">
        <col class="w-56" />
        <thead class="text-nowrap">
          <tr>
            <td
              v-for="(title, index) in tableHead"
              @click="sortVolunteersList(sortParameter[index])"
              :key="index"
              class="text-sm cursor-pointer pb-3 pl-4"
              :class="{
                'pl-4': index === 0,
                'text-voloblue-200': sortBy === sortParameter[index],
                'text-black opacity-80': !(sortBy === sortParameter[index]),
              }"
            >
              {{ title }}
              <IconTableSortArrows
                :upArrowColor="
                  sortParameter[index] === sortBy && sortOrder === 'asc'
                    ? '#0025FF'
                    : 'darkgray'
                "
                :downArrowColor="
                  sortParameter[index] === sortBy && sortOrder === 'desc'
                    ? '#0025FF'
                    : 'darkgray'
                "
                class="w-5 inline pl-2"
              />
            </td>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="(volunteer, index) of volunteerStore.volunteersPage.content"
            class="border-b h-14 cursor-pointer hover:bg-gray-50 hover:text-voloblue-100"
            :key="volunteer.person.id"
            @click="goToDetails(volunteer.person.id)"
          >
            <td
              class="font-bold pl-4 truncate"
              :class="{ 'rounded-tl-md': index === 0 }"
              :title="volunteer.person.lastname"
            >
              {{ volunteer.person.lastname }}
            </td>
            <td
              class="font-bold pl-4 truncate"
              :title="volunteer.person.firstname"
            >
              {{ volunteer.person.firstname }}
            </td>
            <td class="pl-4 truncate" :title="volunteer.birthplace">
              {{ volunteer.birthplace }}
            </td>
            <td class="pl-4 truncate">2023/24</td>
            <td class="pl-4 truncate">2/5</td>
            <td class="pl-4 truncate">25/25</td>
            <td
              class="text-voloblue-200 md:pr-1"
              :class="{ 'rounded-tr-md ': index === 0 }"
            >
              <IconArrowGoto
                class="text-voloblue-200 ml-auto mr-2 opacity-50"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- </div> -->
      <PaginationController
        class="mt-[2px]"
        :currentPage="volunteerStore.volunteersPage.pageable.pageNumber"
        :totalPages="volunteerStore.volunteersPage.totalPages"
        :pageLength="pageSize"
        @updatePage="updateVolunteerPage"
        @updateLength="(length) => updateVolunteerListLenght(length)"
      />
    </div>
  </div>
  <!-- <ContainerModal v-if="volunteerStore.fetching" :delay="500">
    <div class="flex flex-row p-4 text-md gap-2 items-center"><IconSpinner />loading ...</div>
  </ContainerModal> -->
</template>

<script setup lang="ts">
import { useVolunteerStore } from "~/stores/VolunteerStore";

// import { ref, watch, computed } from "vue";
// import { useRouter } from "vue-router";

const router = useRouter();
const volunteerStore = useVolunteerStore();

// const searchQuery = ref({ type: string, default: "" });
const tableHead = ref([
  "Name",
  "Vorname",
  "Einsatzstelle",
  "Jahrgang",
  "Unterlagen",
  "gebuchte Seminare",
]);

const sortParameter = [
  "person.lastname",
  "person.firstname",
  "project",
  "year",
  "documents",
  "seminars",
];

let sortOrder = ref<"asc" | "desc">("asc");
let sortBy = ref<string>("person.lastname");
let page = ref<number>(0);
let pageSize = ref<number>(15);

const props = defineProps<{ searchQuery: string }>();

const goToDetails = (volunteerId: number) => {
  console.log(volunteerId);
  navigateTo({ name: "volunteerdetail-id", params: { id: volunteerId } });
  // router.push(`volunteerdetail/${volunteerId}`);
};

const updateVolunteerPage = (pageNumber: number): void => {
  if (!volunteerStore.volunteersPage) return;
  if (!volunteerStore.volunteersPage.pageable) return;

  volunteerStore.volunteersPage.pageable.pageNumber = pageNumber;
  let params = {
    sortOrder: sortOrder.value,
    sortBy: sortBy.value,
    page: pageNumber,
    pageSize: pageSize.value,
  };
  volunteerStore.getVolunteers(params);
};

const updateVolunteerListLenght = (length: number): void => {
  pageSize.value = length;
  volunteerStore.volunteersPage?.pageable.pageNumber ?? 0;
  let params = {
    sortOrder: sortOrder.value,
    sortBy: sortBy.value,
    page: volunteerStore.volunteersPage?.pageable.pageNumber ?? 0,
    pageSize: length,
  };
  volunteerStore.getVolunteers(params);
};

const sortVolunteersList = (sortKey: string): void => {
  if (sortBy.value === sortKey) {
    // Toggle sort order if the sortBy is the same
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    // Keep the current sort order when changing the sortBy
    sortBy.value = sortKey;
  }

  getVolunteers();
};

const getVolunteers = async (params?: QueryObj) => {
  if (!params)
    params = {
      sortOrder: sortOrder.value,
      sortBy: sortBy.value,
      page: page.value,
      pageSize: pageSize.value,
      search: props.searchQuery,
    };

  try {
    await volunteerStore.getVolunteers({
      sortOrder: params.sortOrder,
      sortBy: params.sortBy,
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
  }
};

watch(
  () => props.searchQuery,
  async () => {
    await getVolunteers();
  },
  { immediate: true }
);
</script>
