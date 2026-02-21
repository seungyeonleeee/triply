"use client"

import { useEffect, useRef } from "react"
import { loadGoogleMaps } from "@/lib/googleMaps"

interface Props {
  lat?: number
  lng?: number
}

export default function MapPreview({ lat, lng }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lat || !lng) return

    loadGoogleMaps().then(() => {
      const google = (window as any).google

      const map = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        disableDefaultUI: true,
      })

      new google.maps.Marker({
        position: { lat, lng },
        map,
      })
    })
  }, [lat, lng])

  return <div ref={mapRef} className="w-full h-40 rounded-xl bg-neutral-100" />
}