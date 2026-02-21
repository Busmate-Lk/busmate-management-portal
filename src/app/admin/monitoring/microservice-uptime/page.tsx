"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { MicroserviceUptime } from "@/components/admin/monitoring"

export default function MicroserviceUptimePage() {
  // Set page metadata
  useSetPageMetadata({
    title: "Microservice Uptime",
    description: "Monitor microservice health and uptime statistics",
    activeItem: "monitoring"
  })

  return <MicroserviceUptime />
}
