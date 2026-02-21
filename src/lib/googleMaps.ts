let isLoaded = false
let loadingPromise: Promise<void> | null = null

const SCRIPT_ID = "google-maps-sdk"

export async function loadGoogleMaps() {
  if (typeof window === "undefined") return

  if (isLoaded || (window as any).google?.maps?.places) {
    isLoaded = true
    return
  }

  if (loadingPromise) {
    await loadingPromise
    return
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  if (!apiKey) {
    throw new Error("Google Maps API key missing")
  }

  loadingPromise = new Promise<void>((resolve, reject) => {
    const markLoaded = () => {
      isLoaded = true
      resolve()
    }

    const onError = () => {
      loadingPromise = null
      reject(new Error("Failed to load Google Maps JavaScript API"))
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener("load", markLoaded, { once: true })
      existing.addEventListener("error", onError, { once: true })
      return
    }

    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = markLoaded
    script.onerror = onError
    document.head.appendChild(script)
  })

  await loadingPromise
}
