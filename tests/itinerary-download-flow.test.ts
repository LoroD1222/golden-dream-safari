import assert from "node:assert/strict";
import test from "node:test";
import {decideItineraryDownload, mobileDownloadStateAt} from "../src/features/itinerary/download-flow";

test("enabled itineraries download freely while disabled trips remain blocked", () => {
  assert.equal(decideItineraryDownload(true), "download");
  assert.equal(decideItineraryDownload(false), "disabled");
});

test("mobile prompt delays, expands, and becomes a permanent compact control", () => {
  assert.equal(mobileDownloadStateAt(699), "hidden");
  assert.equal(mobileDownloadStateAt(700), "expanded");
  assert.equal(mobileDownloadStateAt(7_199), "expanded");
  assert.equal(mobileDownloadStateAt(7_200), "compact");
  assert.equal(mobileDownloadStateAt(60_000), "compact");
});
