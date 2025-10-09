import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/components/common/Contact-form"
import Header from "@/layout/Header"
import Footer from "@/layout/Footer"
export default function ContactPage() {
  return (
    <main>
       
      <header className="border-b border-border">
         <Header/>
      </header>

      <section>
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Send a message</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Clinic details</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  <li>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">Abhishek vp</div>
                  </li>
                  <li>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">careslot@gmail.com</div>
                  </li>
                  <li>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">kakkancheri calicut kerala 673634</div>
                  </li>
                  <li>
                    <div className="text-sm text-muted-foreground">Hours</div>
                    <div className="font-medium">Mon–Fri: 8:00 AM–6:00 PM</div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  )
}
