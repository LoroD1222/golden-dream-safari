import assert from "node:assert/strict";
import test from "node:test";
import {createItineraryAccessToken, itineraryAccessCookieName, safeTripSlug, verifyItineraryAccessToken} from "../src/features/itinerary/access";

const secret = "test-only-itinerary-secret";
const now = Date.UTC(2026, 10, 17);

test("creates a safe, trip-specific cookie name", () => {
  assert.equal(safeTripSlug("Tarangire / Serengeti"), "tarangire-serengeti");
  assert.equal(itineraryAccessCookieName("tarangire-serengeti"), "trip_itinerary_access_tarangire-serengeti");
});

test("grants access only to the signed trip", () => {
  const token = createItineraryAccessToken("tarangire-serengeti-ngorongoro", now, secret);
  assert.equal(verifyItineraryAccessToken("tarangire-serengeti-ngorongoro", token, now, secret), true);
  assert.equal(verifyItineraryAccessToken("great-migration", token, now, secret), false);
});

test("rejects tampered and expired access", () => {
  const token = createItineraryAccessToken("tarangire-serengeti-ngorongoro", now, secret);
  assert.equal(verifyItineraryAccessToken("tarangire-serengeti-ngorongoro", `${token}tampered`, now, secret), false);
  assert.equal(verifyItineraryAccessToken("tarangire-serengeti-ngorongoro", token, now + 366 * 24 * 60 * 60 * 1000, secret), false);
});
