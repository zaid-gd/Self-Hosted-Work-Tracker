import { ClientForm } from "@/components/clients/ClientForm"

export default function NewClientPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-zinc-900">New Client</h1>
        <p className="text-sm text-zinc-500">Add a client or studio you work with</p>
      </div>
      <ClientForm />
    </div>
  )
}
