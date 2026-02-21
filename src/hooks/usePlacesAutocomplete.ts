import { useEffect, useRef } from "react"
import { loadGoogleMaps } from "@/lib/googleMaps"

export type Place = {
  id: string
  address: string
  lat: number
  lng: number
}

export default function usePlacesAutocomplete(
  onSelect: (place: Place) => void
) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    let isMounted = true
    let listener: google.maps.MapsEventListener | undefined
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    let attempts = 0

    const setupAutocomplete = () => {
      if (!isMounted || autocompleteRef.current || !inputRef.current) return true
      if (!window.google?.maps?.places) return false

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { fields: ["place_id", "formatted_address", "geometry"] }
      )
      autocompleteRef.current = autocomplete

      listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()
        if (!place?.geometry?.location) return

        onSelectRef.current({
          id: place.place_id ?? "",
          address: place.formatted_address ?? "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        })
      })

      return true
    }

    const scheduleRetry = () => {
      if (!isMounted || autocompleteRef.current) return
      if (attempts >= 20) {
        console.warn("Places Autocomplete init timeout")
        return
      }
      attempts += 1
      retryTimer = setTimeout(() => {
        if (setupAutocomplete()) return
        scheduleRetry()
      }, 100)
    }

    const init = async () => {
      try {
        await loadGoogleMaps()
      } catch (error) {
        console.error("Google Maps load failed in usePlacesAutocomplete", error)
        return
      }

      if (setupAutocomplete()) return
      scheduleRetry()
    }

    init()

    return () => {
      isMounted = false
      if (retryTimer) clearTimeout(retryTimer)
      listener?.remove()
      autocompleteRef.current = null
    }
  }, [])

  return { inputRef }
}
