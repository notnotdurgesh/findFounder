import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneIcon as WhatsappIcon } from 'lucide-react'

export default function ContactExchangePage({
  params
}) {
  // Dummy data
  const matchData = {
    name: "Jane Doe",
    role: "Developer",
    whatsapp: "+1234567890",
  }

  return (
    (<div className="space-y-8">
      <h1 className="text-3xl font-bold">Contact Exchange</h1>
      <Card>
        <CardHeader>
          <CardTitle>{matchData.name}</CardTitle>
          <CardDescription>{matchData.role}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You've both agreed to exchange contact information. Here's their WhatsApp number:</p>
          <div className="flex items-center space-x-2">
            <WhatsappIcon className="w-6 h-6 text-green-500" />
            <span className="text-lg font-semibold">{matchData.whatsapp}</span>
          </div>
          <Button className="mt-4 w-full">
            Open WhatsApp Chat
          </Button>
        </CardContent>
      </Card>
    </div>)
  );
}

