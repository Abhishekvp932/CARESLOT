import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DoctorSidebar } from "@/layout/doctor/sideBar"
import { useGetDoctorWalletQuery } from "@/features/docotr/doctorApi"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { useEffect } from "react"

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}

export default function DoctorWalletPage() {
  const doctor = useSelector((state: RootState) => state.doctor.doctor)
  const doctorId = doctor?._id as string
  const { data = {} , refetch} = useGetDoctorWalletQuery({ doctorId })
   

  useEffect (()=>{
    refetch()
  },[])
  const transactions = data?.history || []
  const balance = data?.balance ?? 0

  return (
    <main className="mx-auto w-full max-w-5xl p-4 md:p-6 lg:p-8">
      <DoctorSidebar />

      <header className="mb-6 flex flex-col gap-2 md:mb-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">Wallet</h1>
          <p className="text-sm text-muted-foreground">
            View your balance and transaction history for appointments and payouts.
          </p>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Available balance</CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">₹{balance}</div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="transactions-heading" className="space-y-4">
        <h2 id="transactions-heading" className="sr-only">
          Transaction history
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(transactions) &&
              transactions.map((t) => (
                <TableRow key={t?._id ?? Math.random()}>
                  <TableCell className="whitespace-nowrap">
                    {t?.createdAt ? formatDate(t?.createdAt) : "-"}
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate">{t?.source ?? "-"}</TableCell>
                  <TableCell className="capitalize">{t?.type ?? "-"}</TableCell>
                  <TableCell className="text-right font-medium">₹{t?.amount ?? 0}</TableCell>
                  <TableCell>
                    <Badge className="capitalize">{t?.status ?? "unknown"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </section>
    </main>
  )
}
