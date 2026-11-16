export type SafariRouteStop = {
  name: string;
  label: string;
  description: string;
  dayNumber: number;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export const northernCircuitRouteStops: SafariRouteStop[] = [
  {
    name: "Arusha",
    label: "Day 1",
    description: "Arrival, briefing and the northern circuit starting point.",
    dayNumber: 1,
    coordinates: {lat: -3.3869, lng: 36.683},
  },
  {
    name: "Tarangire National Park",
    label: "Day 1",
    description: "Baobab trees, big elephant herds and the Tarangire River.",
    dayNumber: 1,
    coordinates: {lat: -3.8333, lng: 36},
  },
  {
    name: "Mto wa Mbu",
    label: "Night 1",
    description: "A lively safari town between Tarangire and the highlands.",
    dayNumber: 1,
    coordinates: {lat: -3.35, lng: 35.85},
  },
  {
    name: "Serengeti National Park",
    label: "Days 2–3",
    description: "Open plains, rocky kopjes and some of Tanzania's best wildlife viewing.",
    dayNumber: 2,
    coordinates: {lat: -2.3333, lng: 34.8333},
  },
  {
    name: "Ngorongoro Crater",
    label: "Days 3–4",
    description: "A wildlife-rich caldera with a picnic stop beside the hippo pool.",
    dayNumber: 3,
    coordinates: {lat: -3.1618, lng: 35.5877},
  },
  {
    name: "Arusha",
    label: "Day 4",
    description: "Return to your Arusha accommodation after the crater game drive.",
    dayNumber: 4,
    coordinates: {lat: -3.3869, lng: 36.683},
  },
];
