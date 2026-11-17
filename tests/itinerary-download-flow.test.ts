import assert from "node:assert/strict";
import test from "node:test";
import {decideItineraryDownload, failedSubmissionEffect, mobileDownloadStateAt, successfulSubmissionEffect} from "../src/features/itinerary/download-flow";

test("first click requests the form and no download begins", () => {
  assert.equal(decideItineraryDownload(true, false), "request-form");
});

test("returning access downloads immediately while disabled trips remain blocked", () => {
  assert.equal(decideItineraryDownload(true, true), "download");
  assert.equal(decideItineraryDownload(false, true), "disabled");
});

test("pending success grants access and begins the PDF automatically", () => {
  assert.deepEqual(successfulSubmissionEffect(true), {grantAccess: true, beginDownload: true, pendingDownload: false});
  assert.deepEqual(successfulSubmissionEffect(false), {grantAccess: true, beginDownload: false, pendingDownload: false});
});

test("form failure preserves pending intent without granting access", () => {
  assert.deepEqual(failedSubmissionEffect(true), {grantAccess: false, beginDownload: false, pendingDownload: true});
});

test("mobile prompt delays, expands, and becomes a permanent compact control", () => {
  assert.equal(mobileDownloadStateAt(699), "hidden");
  assert.equal(mobileDownloadStateAt(700), "expanded");
  assert.equal(mobileDownloadStateAt(7_199), "expanded");
  assert.equal(mobileDownloadStateAt(7_200), "compact");
  assert.equal(mobileDownloadStateAt(60_000), "compact");
});
