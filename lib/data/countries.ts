export type CountryBespokeData = {
  documentAuthBuilding: string;
  documentAuthLocation: string;
  documentAuthProcess: string;
  documentAuthTurnaround: string;

  embassyLocation: string;
  embassyAddress: string;
  embassyWaitTime: string;

  localContactName: string;
  localContactNumber: string;
};

export const bespokeCountryData: Record<string, CountryBespokeData> = {
  ghana: {
    documentAuthBuilding: "Ministry of Foreign Affairs and Regional Integration",
    documentAuthLocation: "Accra",
    documentAuthProcess:
      "Submit your original WAEC certificate and transcript for verification and stamping. Ensure documents are laminated only after stamping.",
    documentAuthTurnaround: "1 to 2 weeks",

    embassyLocation: "Accra",
    embassyAddress: "No. 14, Kenneth Kaunda Road, Airport Residential Area, Accra",
    embassyWaitTime:
      "Appointments typically book out 3-4 weeks in advance during peak season (July-August).",

    localContactName: "Our Accra Team",
    localContactNumber: "+233 53 979 9795",
  },
  nigeria: {
    documentAuthBuilding: "Ministry of Foreign Affairs & Ministry of Education",
    documentAuthLocation: "Abuja",
    documentAuthProcess:
      "Documents must first be authenticated at the Federal Ministry of Education, then legalized at the Ministry of Foreign Affairs in Abuja.",
    documentAuthTurnaround: "2 to 4 weeks",

    embassyLocation: "Abuja",
    embassyAddress: "Plot 333, Diplomatic Drive, Central Business District, Abuja",
    embassyWaitTime:
      "Appointments can take 4-6 weeks to secure. Early booking is critical for September intakes.",

    localContactName: "Our Regional Team",
    localContactNumber: "+233 53 979 9795", // Kept consistent as per Masterplan strategy (using the main WA number)
  },
};

export function getBespokeCountryData(slug: string): CountryBespokeData | null {
  return bespokeCountryData[slug] || null;
}
