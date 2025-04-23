import { defineStore } from "pinia";
// import { useRouter } from "vue-router";
// import { useRuntimeConfig } from "#app";
import { vdbFetchData, vdbFetchFormData } from "@/api/api";

let mostRecentRequest: string = "";

export const useVolunteerStore = defineStore("volunteerStore", () => {
  // const config = useRuntimeConfig();
  // const apiUrl = config.public.baseUrl;
  // const router = useRouter();

  const fetchingDocuments = ref<boolean>(false);
  const fetching = ref<boolean>(false);
  const volunteersPage = ref(null as volunteersPage | null);
  const volunteerNotes = ref(null);
  const selectedVolunteer = ref<Record<string, number | string> | null>(null);
  const selectedVolunteerContacts = ref<Record<string, number | string> | null>(
    null
  );
  const selectedVolunteerAddresses = ref<Record<
    string,
    number | string
  > | null>(null);
  const selectedVolunteerRelevantContract = ref<Record<
    string,
    number | string
  > | null>(null);
  const volunteerDocuments = ref<Record<string, number | string> | null>(null);
  const volunteerDocumentTypes = ref<DocumentsType[]>([]);

  const clearVolunteer = () => {
    volunteerNotes.value = null;
    selectedVolunteer.value = null;
    selectedVolunteerContacts.value = null;
    selectedVolunteerAddresses.value = null;
    selectedVolunteerRelevantContract.value = null;
    volunteerDocuments.value = null;
  };

  async function setVolunteer(volunteer: Record<string, number | string>) {
    fetching.value = true;
    try {
      selectedVolunteer.value = await vdbFetchData(
        "volunteers",
        "POST",
        volunteer
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteer(volunteerId: number) {
    //clear selected volunteer
    selectedVolunteer.value = null;

    fetching.value = true;
    try {
      selectedVolunteer.value = await vdbFetchData(
        `volunteers/${volunteerId}`,
        "GET"
      );

      selectedVolunteerContacts.value = await vdbFetchData(
        `volunteers/${volunteerId}/contacts`,
        "GET"
      );

      selectedVolunteerAddresses.value = await vdbFetchData(
        `volunteers/${volunteerId}/addresses`,
        "GET"
      );

      selectedVolunteerRelevantContract.value = await vdbFetchData(
        `volunteers/${volunteerId}/contracts/relevant`,
        "GET"
      );
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteers(queryObj: QueryObj) {
    const thisRequest = `volunteers?page=${queryObj.page || 0}&pageSize=${
      queryObj.pageSize || 10
    }&sortBy=${queryObj.sortBy || "person.lastname"}&sortOrder=${
      queryObj.sortOrder || "asc"
    }&search=${queryObj.search || ""}`;
    mostRecentRequest = thisRequest;

    fetching.value = true;

    try {
      const response = await vdbFetchData(thisRequest, "GET");
      if (mostRecentRequest != thisRequest) return;
      volunteersPage.value = response;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteerNotes(queryObj: QueryObj) {
    const thisRequest = `volunteers/${queryObj.volunteerId}/notes?sortBy=${
      queryObj.sortBy || "timestamp"
    }&sortOrder=${queryObj.sortOrder || "desc"}&search=${
      queryObj.search || ""
    }`;

    mostRecentRequest = thisRequest;

    fetching.value = true;

    try {
      const notes = await vdbFetchData(thisRequest, "GET");
      if (mostRecentRequest != thisRequest) return;
      volunteerNotes.value = notes;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteerDocuments(queryObj: QueryObj) {
    const thisRequest = `volunteers/${queryObj.volunteerId}/documents?sortBy=${
      queryObj.sortBy || "timestamp"
    }&sortOrder=${queryObj.sortOrder || "desc"}&search=${
      queryObj.search || ""
    }`;

    mostRecentRequest = thisRequest;

    fetching.value = true;
    try {
      const documents = await vdbFetchData(thisRequest, "GET");
      if (mostRecentRequest != thisRequest) return;
      volunteerDocuments.value = documents;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteerAddresses(volunteerId: number) {
    const thisRequest = `volunteers/${volunteerId}/addresses`;

    mostRecentRequest = thisRequest;

    fetching.value = true;

    try {
      const addresses = await vdbFetchData(thisRequest, "GET");
      if (mostRecentRequest != thisRequest) return;
      selectedVolunteerAddresses.value = addresses;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function setVolunteerAddresses(volunteerId: number, address: any) {
    const method = address.id ? "PATCH" : "POST";

    const thisRequest = `volunteers/${volunteerId}/addresses${
      method === "PATCH" ? "/" + address.id : ""
    }`;
    mostRecentRequest = thisRequest;

    fetching.value = true;

    try {
      const addresses = await vdbFetchData(thisRequest, method, address);
      if (mostRecentRequest != thisRequest) return;
      selectedVolunteerAddresses.value = addresses;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function deleteVolunteerAddress(addressId: number) {
    fetching.value = true;

    try {
      await vdbFetchData(
        `volunteers/${selectedVolunteer.value?.id}/addresses/${addressId}`,
        "DELETE"
      );
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function setNote(note: string, id: number) {
    fetching.value = true;
    if (id) {
      try {
        await vdbFetchData(
          "volunteers/" + selectedVolunteer.value?.id + "/notes/" + id,
          "PATCH",
          note
        );
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        fetching.value = false;
      }
    } else {
      try {
        await vdbFetchData(
          "volunteers/" + selectedVolunteer.value?.id + "/notes",
          "POST",
          note
        );
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        fetching.value = false;
      }
    }
  }

  async function setDocument(
    formData: Record<string, number | string>,
    id: number
  ) {
    fetchingDocuments.value = true;

    if (id) {
      try {
        await vdbFetchData(
          "volunteers/" + selectedVolunteer.value?.id + "/documents/" + id,
          "PATCH",
          formData
        );
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        fetchingDocuments.value = false;
      }
    } else {
      try {
        await vdbFetchFormData(
          "volunteers/" + selectedVolunteer.value?.id + "/documents",
          "POST",
          formData
        );
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        fetchingDocuments.value = false;
      }
    }
  }

  async function deleteNote(id: number) {
    fetching.value = true;
    try {
      await vdbFetchData(
        "volunteers/" + selectedVolunteer.value?.id + "/notes/" + id,
        "DELETE"
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function editVolunteer(
    volunteer: Record<string, number | string>,
    id: number
  ) {
    fetching.value = true;

    try {
      await vdbFetchData("volunteers/" + id, "PATCH", volunteer);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function editVolunteerAvatar(
    formData: Record<string, number | string>,
    id: number
  ) {
    fetching.value = true;

    try {
      await vdbFetchFormData(
        "volunteers/" + id + "/avatar/",
        "PATCH",
        formData
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function deleteDocument(id: number) {
    fetching.value = true;
    try {
      await vdbFetchFormData(
        "volunteers/" + selectedVolunteer.value?.id + "/documents/" + id,
        "DELETE"
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function getVolunteerDocumentTypes() {
    volunteerDocumentTypes.value = [];

    fetching.value = true;
    try {
      volunteerDocumentTypes.value = await vdbFetchData(
        `/documents/types`,
        "GET"
      );
    } catch (error) {
      console.error("Error fetching document types:", error);
    } finally {
      fetching.value = false;
    }
  }

  const getTypeList = () => {
    if (!volunteerDocumentTypes.value) return;

    let list = [];

    for (let key of Object.keys(volunteerDocumentTypes.value)) {
      const index = parseInt(key, 10);
      list.push(volunteerDocumentTypes.value[index].description);
    }

    return list;
  };

  const getTitlesList = () => {
    if (!volunteerDocumentTypes.value) return;

    let titles = [];

    for (let key of Object.keys(volunteerDocumentTypes.value)) {
      const index = parseInt(key, 10);
      titles.push(volunteerDocumentTypes.value[index].description);
    }
  };

  return {
    fetching,
    volunteersPage,
    volunteerNotes,
    selectedVolunteer,
    selectedVolunteerContacts,
    selectedVolunteerAddresses,
    selectedVolunteerRelevantContract,
    volunteerDocuments,
    volunteerDocumentTypes,
    clearVolunteer,
    setVolunteer,
    getVolunteer,
    getVolunteers,
    getVolunteerNotes,
    getVolunteerDocuments,
    getVolunteerAddresses,
    setVolunteerAddresses,
    deleteVolunteerAddress,
    setNote,
    setDocument,
    deleteNote,
    editVolunteer,
    editVolunteerAvatar,
    deleteDocument,
    getVolunteerDocumentTypes,
    getTypeList,
    getTitlesList,
  };
});
