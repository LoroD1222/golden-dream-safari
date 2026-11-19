import {createSocialShareCard} from "@/app/social-share-card";

export const alt = "Golden Dream Safaris logo and Tanzania safari travel";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

export default function TwitterImage() {
  return createSocialShareCard();
}
