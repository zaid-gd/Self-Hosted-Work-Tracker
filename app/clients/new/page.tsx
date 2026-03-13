import { ClientForm } from "@/components/clients/ClientForm"

export default function NewClientPage() {
  return (
    <div className="page-wrap">
      <h1 className="text-base font-medium text-foreground">New Client</h1>
      <ClientForm />
    </div>
  )
}
