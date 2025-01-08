"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MatchesPage() {
  const [matches, setMatches] = useState([
    { id: 1, name: "TechInnovate", role: "Founder", idea: "AI-powered personal assistant" },
    { id: 2, name: "John Doe", role: "Developer", skills: ["React", "Node.js", "Python"] },
    { id: 3, name: "GreenEnergy", role: "Founder", idea: "Sustainable energy marketplace" },
  ])

  const handleAction = (id, action) => {
    setMatches(matches.filter(match => match.id !== id))
    // Handle accept/decline logic here
  }

  return (
    (<div className="space-y-8">
      <h1 className="text-3xl font-bold">Your Matches</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <Card key={match.id}>
            <CardHeader>
              <CardTitle>{match.name}</CardTitle>
              <CardDescription>{match.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {match.role === "Founder" ? `Idea: ${match.idea}` : `Skills: ${(match.skills).join(", ")}`}
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => handleAction(match.id, "accept")} className="flex-1">
                  Accept
                </Button>
                <Button
                  onClick={() => handleAction(match.id, "decline")}
                  variant="outline"
                  className="flex-1">
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>)
  );
}

