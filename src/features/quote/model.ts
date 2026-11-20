export const travelStyleValues = ["Group camping", "Mid-range lodge", "Private luxury"] as const;

export type TravelStyle = typeof travelStyleValues[number];
