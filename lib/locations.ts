export type Location = {
  slug: string;
  city: string;
  county: string;
  state: string;
  nearbyAreas: string[];
  shortIntro: string;
  propertyTypes: string;
  targetSituations: string[];
};

const commonTargetSituations = [
  "Fixer-uppers and homes needing repairs",
  "Inherited properties and estate situations",
  "Tenant-occupied homes and tired landlord properties",
  "Vacant homes or properties with cleanout needs",
  "Off-market opportunities with rental or flip potential",
];

export const locations: Location[] = [
  {
    slug: "rochester-hills",
    city: "Rochester Hills",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Rochester", "Auburn Hills", "Oakland Township"],
    shortIntro:
      "Rochester Hills properties can be worth reviewing when repairs, vacancy, tenants, estate timing, or resale potential make a direct investor conversation practical.",
    propertyTypes:
      "Single-family homes, townhomes, condos, inherited properties, tenant-occupied houses, vacant homes, and properties with renovation needs may be submitted for review.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "rochester",
    city: "Rochester",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Rochester Hills", "Oakland Township", "Shelby Township"],
    shortIntro:
      "Rochester properties may be reviewed for rental, renovation, or off-market investor potential when condition, timing, or occupancy makes a public listing less straightforward.",
    propertyTypes:
      "Older homes, small lots, condos, inherited homes, tenant-occupied properties, vacant houses, and homes needing updates can be reviewed case by case.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "troy",
    city: "Troy",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Clawson", "Birmingham", "Rochester Hills"],
    shortIntro:
      "Troy properties with repair needs, tenants, vacancy, or landlord fatigue may fit a direct review for rental, renovation, or resale potential.",
    propertyTypes:
      "Single-family homes, condos, townhomes, tenant-occupied rentals, inherited homes, and dated properties needing repairs may be submitted for review.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "birmingham",
    city: "Birmingham",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Bloomfield Hills", "Troy", "Royal Oak"],
    shortIntro:
      "Birmingham properties can be reviewed when renovation scope, lot value, occupancy, or seller timing points toward a private investor conversation.",
    propertyTypes:
      "Homes needing major updates, estate properties, tenant-occupied houses, vacant properties, and potential renovation or resale opportunities may be reviewed.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "bloomfield-hills",
    city: "Bloomfield Hills",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Birmingham", "Bloomfield Township", "Pontiac"],
    shortIntro:
      "Bloomfield Hills properties may be worth reviewing when a home needs substantial work, has estate complexity, or may be better handled off market.",
    propertyTypes:
      "Large homes, dated properties, estate homes, vacant houses, tenant-occupied properties, and homes with repair or cleanout needs may be submitted.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "royal-oak",
    city: "Royal Oak",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Ferndale", "Berkley", "Madison Heights"],
    shortIntro:
      "Royal Oak properties can be reviewed for rental, renovation, or resale potential when repairs, tenants, vacancy, or timing create a need for a direct path.",
    propertyTypes:
      "Bungalows, ranches, small multifamily properties, inherited homes, tenant-occupied rentals, vacant homes, and properties needing updates may be reviewed.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "auburn-hills",
    city: "Auburn Hills",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Rochester Hills", "Pontiac", "Lake Orion"],
    shortIntro:
      "Auburn Hills properties may be a fit for review when repairs, tenants, vacancy, or rental potential make an investor conversation worth exploring.",
    propertyTypes:
      "Single-family homes, condos, tenant-occupied rentals, inherited homes, vacant houses, and homes needing repairs or cleanup can be submitted.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "pontiac",
    city: "Pontiac",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Auburn Hills", "Waterford", "Bloomfield Hills"],
    shortIntro:
      "Pontiac properties with repair needs, vacancy, tenants, inherited ownership, or rental potential may be reviewed for a direct investor path.",
    propertyTypes:
      "Single-family homes, duplexes, small multifamily properties, rentals, vacant homes, inherited properties, and homes needing significant repairs may be reviewed.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "southfield",
    city: "Southfield",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Oak Park", "Beverly Hills", "Lathrup Village"],
    shortIntro:
      "Southfield homes may be reviewed when landlord issues, deferred maintenance, vacancy, inheritance, or timing make a direct investor conversation useful.",
    propertyTypes:
      "Single-family homes, condos, tenant-occupied rentals, inherited homes, vacant houses, and properties needing repairs or updates can be submitted.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "waterford",
    city: "Waterford",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Pontiac", "Clarkston", "White Lake"],
    shortIntro:
      "Waterford properties may be reviewed for rental, renovation, or direct purchase potential when repairs, vacancy, tenants, or timing matter.",
    propertyTypes:
      "Single-family homes, lake-area properties, rentals, inherited homes, vacant houses, and repair-heavy properties may be submitted for review.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "sterling-heights",
    city: "Sterling Heights",
    county: "Macomb County",
    state: "MI",
    nearbyAreas: ["Troy", "Utica", "Warren"],
    shortIntro:
      "Sterling Heights properties can be reviewed when condition, occupancy, rental potential, or seller timing points toward an off-market investor conversation.",
    propertyTypes:
      "Single-family homes, condos, tenant-occupied rentals, inherited homes, vacant houses, and homes needing repairs or updates may be reviewed.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "oak-park",
    city: "Oak Park",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Ferndale", "Southfield", "Royal Oak Township"],
    shortIntro:
      "Oak Park properties may be worth submitting when repairs, tenants, vacancy, inherited ownership, or rental potential make a direct review useful.",
    propertyTypes:
      "Single-family homes, rentals, inherited properties, tenant-occupied homes, vacant houses, and properties needing updates may be submitted.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "ferndale",
    city: "Ferndale",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Royal Oak", "Oak Park", "Madison Heights"],
    shortIntro:
      "Ferndale properties can be reviewed when repair scope, tenant occupancy, vacancy, or resale potential makes a private investor path worth considering.",
    propertyTypes:
      "Bungalows, small homes, rentals, inherited houses, tenant-occupied properties, vacant homes, and homes needing updates may be reviewed.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "madison-heights",
    city: "Madison Heights",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Royal Oak", "Hazel Park", "Troy"],
    shortIntro:
      "Madison Heights homes may be submitted when repairs, tenants, vacancy, landlord fatigue, or rental potential point toward investor review.",
    propertyTypes:
      "Single-family homes, rentals, inherited homes, vacant houses, tenant-occupied properties, and homes needing repairs or cleanup may be reviewed.",
    targetSituations: commonTargetSituations,
  },
  {
    slug: "clawson",
    city: "Clawson",
    county: "Oakland County",
    state: "MI",
    nearbyAreas: ["Troy", "Royal Oak", "Birmingham"],
    shortIntro:
      "Clawson properties may be reviewed when condition, occupancy, estate timing, or renovation potential makes a direct investor conversation practical.",
    propertyTypes:
      "Single-family homes, small rentals, inherited properties, vacant homes, tenant-occupied houses, and homes needing repairs may be submitted.",
    targetSituations: commonTargetSituations,
  },
];

export function getLocationBySlug(slug: string) {
  return locations.find((location) => location.slug === slug);
}
