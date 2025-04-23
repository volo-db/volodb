import { vdbFetchData } from "@/api/api";
import { defineStore } from "pinia";

let mostRecentRequest: string = "";

export const useProjectStore = defineStore("ProjectStore", () => {
  const fetching = ref(false);
  const projectsPage = ref(null as ProjectsPage | null);
  const selectedProject = ref(null);
  const sortOrder = ref("asc");
  const activeSortProperty = ref(null);

  async function setProject(project: Project) {
    fetching.value = true;
    try {
      selectedProject.value = await vdbFetchData("projects", "POST", project);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      fetching.value = false;
    }
  }

  async function getProject(projectId: ProjectId) {
    // clear selected project
    selectedProject.value = null;

    fetching.value = true;
    try {
      selectedProject.value = await vdbFetchData(
        `projects/${projectId}`,
        "GET"
      );
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  async function getProjects(queryObj?: QueryObj): Promise<void> {
    if (!queryObj) {
      queryObj = {
        page: 1,
        pageSize: 10,
        sortBy: "name",
        sortOrder: "asc",
      };
    }

    const thisRequest = `projects?page=${queryObj.page || 0}&pageSize=${
      queryObj.pageSize || 10
    }&sortBy=${queryObj.sortBy || "name"}&sortOrder=${
      queryObj.sortOrder || "asc"
    }&search=${queryObj.search || ""}`;
    mostRecentRequest = thisRequest;

    fetching.value = true;

    try {
      const response = await vdbFetchData(thisRequest, "GET");
      if (mostRecentRequest != thisRequest) return;
      projectsPage.value = response;
    } catch (error) {
      console.error(error);
    } finally {
      fetching.value = false;
    }
  }

  return {
    fetching,
    projectsPage,
    selectedProject,
    sortOrder,
    activeSortProperty,
    setProject,
    getProject,
    getProjects,
  };
});
