export {};

declare global {
  // type ProjectName = string;

  type ProjectId = number;

  interface QueryObj {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    volunteerId?: number;
  }

  interface ProjectState {
    fetching: boolean;
    projectsPage: ProjectsPage | null;
    selectedProject: string | null;
    sortOrder: string | null;
    activeSortProperty: string | null;
  }

  // interface VolunteerState {
  //   fetching: boolean;

  // }

  interface Volunteer {
    id: number;
    created: string; // Das Datum, wann der Volunteer erstellt wurde
    organisationalId: string; // Die organisatorische ID
    person: {
      id: number;
      lastname: string;
      firstname: string;
      gender: "male" | "female" | "diverse" | "not specified"; // Das Geschlecht des Volunteers
    };
    status: "IM EINSATZ" | string; // Der Status des Volunteers
    birthday: string; // Das Geburtsdatum des Volunteers im Format "YYYY-MM-DD"
    birthplace: string; // Der Geburtsort des Volunteers
    nationality: string; // Die Nationalität des Volunteers
    socialInsuranceNumber: string | null; // Sozialversicherungsnummer (optional)
    healthInsurance: string | null; // Krankenversicherung (optional)
    taxNumber: string | null; // Steueridentifikationsnummer (optional)
    religion: string; // Religion des Volunteers
    bankName: string; // Name der Bank
    iban: string; // IBAN des Volunteers
    bic: string; // BIC der Bank
    accountHolder: string; // Kontoinhaber
    levelOfSchoolEdu: string; // Schulbildung
    levelOfVocationalEdu: string; // Berufsausbildung
    ongoingLegalProceedings: "YES" | "NO"; // Gibt an, ob es laufende rechtliche Verfahren gibt
    avatar: string; // URL zum Avatar des Volunteers
  }

  interface volunteersPage {
    content: Volunteer[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    totalPages: number;
  }

  interface Project {
    id: number;
    name: string;
    city: string;
    email: string;
    capacity: number;
  }

  interface ProjectsPage {
    content: Project[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    totalPages: number;
  }

  interface DocumentsType {
    id: number;
    name: string;
    description: string;
  }
  // ++++++++++++++
  // ++++ user ++++
  // ++++++++++++++
  interface roles {
    id: number;
    name: string;
  }

  interface User {
    email: string;
    person: {
      id: number;
      firstname: string;
      lastname: string;
      gender: "male" | "female" | "diverse" | "not specified";
    };
    roles: roles[];
  }
}
