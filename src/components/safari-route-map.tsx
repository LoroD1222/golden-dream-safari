"use client";

import "leaflet/dist/leaflet.css";
import {useEffect, useRef} from "react";
import type {CircleMarker, Map as LeafletMap, Polyline} from "leaflet";
import type {SafariRouteStop} from "@/features/itinerary/route-data";

export function SafariRouteMap({
  stops,
  selectedIndex,
  onSelect,
  onExplore,
}: {
  stops: SafariRouteStop[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onExplore: (index: number) => void;
}) {
  const canvas = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<CircleMarker[]>([]);
  const route = useRef<Polyline | null>(null);
  const onSelectRef = useRef(onSelect);
  const onExploreRef = useRef(onExplore);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onExploreRef.current = onExplore;
    selectedIndexRef.current = selectedIndex;
  }, [onExplore, onSelect, selectedIndex]);

  useEffect(() => {
    if (!canvas.current || !stops.length) return;
    let disposed = false;

    import("leaflet").then((L) => {
      if (disposed || !canvas.current) return;

      const coordinates = stops.map(stop => [stop.coordinates.lat, stop.coordinates.lng] as [number, number]);
      const instance = L.map(canvas.current, {
        attributionControl: true,
        dragging: true,
        scrollWheelZoom: false,
        touchZoom: true,
        zoomControl: true,
      });
      map.current = instance;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(instance);

      route.current = L.polyline(coordinates, {
        color: "#ef8a33",
        dashArray: "7 8",
        lineCap: "round",
        opacity: .95,
        weight: 3,
      }).addTo(instance);
      instance.fitBounds(L.latLngBounds(coordinates).pad(.22), {maxZoom: 7});

      markers.current = stops.slice(0, -1).map((stop, index) => {
        const marker = L.circleMarker(coordinates[index], {
          color: "#fff",
          fillColor: index === selectedIndexRef.current ? "#ef8a33" : "#141210",
          fillOpacity: 1,
          radius: index === selectedIndexRef.current ? 13 : 10,
          weight: 3,
        }).addTo(instance);
        const popup = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = `${String(index + 1).padStart(2, "0")}. ${stop.name}`;
        const description = document.createElement("p");
        description.textContent = stop.description;
        const action = document.createElement("button");
        action.type = "button";
        action.textContent = "Explore this destination →";
        action.addEventListener("click", () => onExploreRef.current(index));
        popup.append(title, description, action);
        marker.bindPopup(popup, {
          autoPan: false,
          closeButton: false,
          maxWidth: 285,
          minWidth: 245,
          offset: [0, -4],
        });
        marker.on("click", () => onSelectRef.current(index));
        return marker;
      });

      const activeMarker = markers.current[Math.min(selectedIndexRef.current, markers.current.length - 1)];
      activeMarker?.openPopup();
      window.requestAnimationFrame(() => instance.invalidateSize());
    });

    return () => {
      disposed = true;
      map.current?.remove();
      map.current = null;
      markers.current = [];
      route.current = null;
    };
  }, [stops]);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !markers.current.length) return;
    const markerIndex = selectedIndex === stops.length - 1 ? 0 : selectedIndex;
    markers.current.forEach((marker, index) => {
      marker.setStyle({fillColor: index === markerIndex ? "#ef8a33" : "#141210"});
      marker.setRadius(index === markerIndex ? 13 : 10);
    });
    const selected = stops[selectedIndex];
    instance.setView([selected.coordinates.lat, selected.coordinates.lng], Math.max(7, instance.getZoom()), {animate: false});
    markers.current[markerIndex]?.openPopup();
  }, [selectedIndex, stops]);

  return <div
    ref={canvas}
    className="route-map-canvas"
    role="application"
    aria-label="Interactive map of the northern Tanzania safari route"
  />;
}
