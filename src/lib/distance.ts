import { loadGoogleMaps } from "./googleMaps"

export async function calculateDistance(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) {
  await loadGoogleMaps()

  return new Promise<{ distanceText: string; durationText: string }>((resolve) => {
    const service = new (window as any).google.maps.DistanceMatrixService()

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: "TRANSIT",
      },
      (response: any, status: string) => {
        if (status !== "OK") return resolve({ distanceText: "-", durationText: "-" })

        const result = response.rows[0].elements[0]
        resolve({
          distanceText: result.distance.text,
          durationText: result.duration.text,
        })
      }
    )
  })
}