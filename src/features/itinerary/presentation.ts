import type {Itinerary} from "@/features/itinerary/model";

export function formatItineraryDuration(itinerary: Pick<Itinerary, "durationDays" | "tripType">) {
  if (itinerary.tripType === "Day trip") return "Full day";
  if (itinerary.tripType === "Kilimanjaro trek" || itinerary.tripType === "Mount Meru trek") {
    return `${itinerary.durationDays} mountain days`;
  }
  const nights = Math.max(0, itinerary.durationDays - 1);
  return `${itinerary.durationDays} ${itinerary.durationDays === 1 ? "day" : "days"} · ${nights} ${nights === 1 ? "night" : "nights"}`;
}

export function itineraryPriceSuffix(itinerary: Pick<Itinerary, "tripType">) {
  return itinerary.tripType === "Wildlife safari" ? "/pp/day" : "/pp";
}

export function formatItineraryPrice(
  itinerary: Pick<Itinerary, "startingPrice" | "currency" | "tripType">,
  options: {prefix?: "From" | "from"; unavailable?: string} = {},
) {
  if (typeof itinerary.startingPrice !== "number") return options.unavailable || "Price on request";
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: itinerary.currency,
    maximumFractionDigits: 0,
  }).format(itinerary.startingPrice);
  return `${options.prefix || "From"} ${amount}${itineraryPriceSuffix(itinerary)}`;
}
