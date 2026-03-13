import { ClientForm } from "@/components/clients/ClientForm"

export default function NewClientPage() {
  return (
    <div className="page-wrap">
      <div>
        <h1 className="text-xl text-foreground">New Client</h1>
      </div>
      <ClientForm />
    </div>
  )
}
