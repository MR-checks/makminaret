import { getPrograms, getUniversities } from "@/lib/content/reader";

/**
 * Reads the first number out of a band string such as "$5,000 to $8,000".
 * Used only to keep the tuition filter working now that content stores bands
 * rather than exact figures. The band string is what gets displayed.
 */
function parseBandFloor(band: string | null | undefined): number {
  if (!band) return 0;
  const match = band.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export type JoinedProgram = {
  slug: string;
  title: string;
  level: string;
  fieldSlug: string | null;
  language: string;
  durationYears: number;
  /** Display value, e.g. "$5,000 to $8,000". Bands, not figures (HANDOVER §4.1). */
  tuitionBand: string;
  /** Lower bound of the band, parsed for filtering only. Never displayed. */
  tuitionFrom: number;
  scholarshipAvailable: boolean;

  // Joined university data
  universitySlug: string | null;
  universityName: string;
  city: string;
  universityType: string;
  yosRequired: boolean;
  satAccepted: boolean;
};

/**
 * Fetches all programs and joins them with their associated university data.
 * This allows us to filter programs by university-level properties (city, type, yosRequired).
 */
export async function getJoinedPrograms(): Promise<JoinedProgram[]> {
  const [allPrograms, allUniversities] = await Promise.all([
    getPrograms(),
    getUniversities(),
  ]);

  // Create a quick lookup map for universities
  const uniMap = new Map(allUniversities.map((u) => [u.slug, u.entry]));

  return allPrograms.map((p) => {
    const uniSlug = p.entry.university;
    const uniEntry = uniSlug ? uniMap.get(uniSlug) : null;

    return {
      slug: p.slug,
      title: p.entry.title,
      level: p.entry.level,
      fieldSlug: p.entry.field,
      language: p.entry.language || "English",
      durationYears: p.entry.durationYears || 4,
      tuitionBand: p.entry.tuitionBand || "On request",
      tuitionFrom: parseBandFloor(p.entry.tuitionBand),
      scholarshipAvailable: p.entry.scholarshipAvailable ?? true,

      universitySlug: uniSlug,
      universityName: uniEntry
        ? uniEntry.name
        : uniSlug
          ? uniSlug.replace(/-/g, " ")
          : "Unknown University",
      city: uniEntry?.city || "Istanbul",
      universityType: uniEntry?.type || "private",
      yosRequired: uniEntry?.yosRequired ?? false,
      satAccepted: uniEntry?.satAccepted ?? true,
    };
  });
}

/**
 * Fetches programs specifically for a given university slug.
 */
export async function getProgramsByUniversity(
  universitySlug: string
): Promise<JoinedProgram[]> {
  const allJoined = await getJoinedPrograms();
  return allJoined.filter((p) => p.universitySlug === universitySlug);
}
