import React, { useEffect, useMemo, useRef, useState } from "react";
import { subDays, parseISO, format } from "date-fns";

import { TownJob } from "@/lib/towns";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const resourceCache = new Map<string, Promise<void>>();

type ResourceType = "css" | "js";

declare global {
  interface Window {
    L?: any;
  }
}

const loadResource = (url: string, type: ResourceType) => {
  if (!resourceCache.has(url)) {
    const promise = new Promise<void>((resolve, reject) => {
      if (type === "css") {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
        document.head.appendChild(link);
      } else {
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.body.appendChild(script);
      }
    });
    resourceCache.set(url, promise);
  }
  return resourceCache.get(url)!;
};

const ensureLeaflet = async () => {
  await Promise.all([
    loadResource("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "css"),
    loadResource(
      "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css",
      "css"
    ),
    loadResource(
      "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css",
      "css"
    ),
  ]);
  await loadResource("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "js");
  await loadResource(
    "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js",
    "js"
  );
  return window.L;
};

interface JobsMapProps {
  jobs: TownJob[];
  townCenter: { lat: number; lng: number };
  townName: string;
}

interface MappedJob extends TownJob {
  anonymizedCoordinates: { lat: number; lng: number };
}

const getJitter = (id: string) => {
  const seed = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const latOffset = ((seed % 13) - 6) * 0.0004;
  const lngOffset = (((seed >> 1) % 13) - 6) * 0.0004;
  return { latOffset, lngOffset };
};

const JobsMap: React.FC<JobsMapProps> = ({ jobs, townCenter, townName }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedService, setSelectedService] = useState("all");

  const recentJobs = useMemo(() => {
    const cutoff = subDays(new Date(), 90);
    return jobs.filter((job) => parseISO(job.date) >= cutoff);
  }, [jobs]);

  const mappedJobs: MappedJob[] = useMemo(
    () =>
      recentJobs.map((job) => {
        const { latOffset, lngOffset } = getJitter(job.id);
        return {
          ...job,
          anonymizedCoordinates: {
            lat: job.coordinates.lat + latOffset,
            lng: job.coordinates.lng + lngOffset,
          },
        };
      }),
    [recentJobs]
  );

  const serviceTypes = useMemo(() => {
    const set = new Set(mappedJobs.map((job) => job.serviceType));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [mappedJobs]);

  const filteredJobs = useMemo(
    () =>
      selectedService === "all"
        ? mappedJobs
        : mappedJobs.filter((job) => job.serviceType === selectedService),
    [mappedJobs, selectedService]
  );

  useEffect(() => {
    let isMounted = true;

    ensureLeaflet()
      .then((L) => {
        if (!isMounted || !mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapContainerRef.current, {
            center: [townCenter.lat, townCenter.lng],
            zoom: 13,
            scrollWheelZoom: false,
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(mapInstanceRef.current);
        }

        if (!markerLayerRef.current) {
          markerLayerRef.current = L.markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 60,
            spiderfyOnMaxZoom: true,
          });
          mapInstanceRef.current.addLayer(markerLayerRef.current);
        }

        setIsReady(true);
      })
      .catch(() => setIsReady(false));

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerLayerRef.current = null;
      }
    };
  }, [townCenter.lat, townCenter.lng]);

  useEffect(() => {
    if (!isReady || !mapInstanceRef.current || !markerLayerRef.current || !window.L) {
      return;
    }

    const L = window.L;
    markerLayerRef.current.clearLayers();

    if (filteredJobs.length === 0) {
      mapInstanceRef.current.setView([townCenter.lat, townCenter.lng], 13);
      return;
    }

    const bounds: any[] = [];

    filteredJobs.forEach((job) => {
      const { lat, lng } = job.anonymizedCoordinates;
      const marker = L.marker([lat, lng]);
      const stars = Array.from({ length: job.review.rating })
        .map(() => "&#9733;")
        .join(" ");
      const popupContent = `
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">${job.serviceType}</span>
            <span class="text-xs text-amber-500">${stars}</span>
          </div>
          <img src="${job.photo}" alt="${job.serviceType} project in ${townName}" class="h-28 w-full rounded-md object-cover" loading="lazy" />
          <p class="text-sm text-slate-700">“${job.review.quote}”</p>
          <p class="text-xs font-medium text-slate-500">— ${job.review.firstName}, ${job.review.service}</p>
          <p class="text-xs text-slate-400">Completed ${format(parseISO(job.date), "MMM d, yyyy")}</p>
        </div>
      `;
      marker.bindPopup(popupContent, { maxWidth: 260 });
      markerLayerRef.current.addLayer(marker);
      bounds.push([lat, lng]);
    });

    const latLngBounds = L.latLngBounds(bounds);
    mapInstanceRef.current.fitBounds(latLngBounds, { padding: [24, 24], maxZoom: 15 });
  }, [filteredJobs, isReady, townCenter.lat, townCenter.lng]);

  return (
    <section aria-label={`${townName} project map`} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            Recent Jobs Across {townName}
          </h3>
          <p className="text-sm text-slate-600">
            Pins represent anonymized locations for projects completed in the last 90 days.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Label htmlFor="service-filter" className="text-sm text-slate-700">
            Filter by service type
          </Label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger id="service-filter" className="mt-1 bg-white">
              <SelectValue placeholder="All services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All services</SelectItem>
              {serviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
        <div
          ref={mapContainerRef}
          className="h-[420px] w-full"
          aria-label={`${townName} electrical service map`}
        />
        {!isReady && (
          <div className="flex h-[420px] w-full items-center justify-center bg-slate-100">
            <span className="text-sm text-slate-500">Loading interactive map…</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsMap;
