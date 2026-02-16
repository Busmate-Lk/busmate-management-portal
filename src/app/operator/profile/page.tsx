import { Header } from "@/components/shared/header"
import { OperatorProfile } from "@/components/operator/profile"

export default function ProfilePage() {
  return (
    <div className="p-0">
      <Header pageTitle="Fleet Operator Profile" pageDescription="Manage your operator account settings, business information, and fleet preferences" />
      <div className="p-6">
        <OperatorProfile />
      </div>
    </div>
  )
}
