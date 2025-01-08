import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage({
  params
}) {
  const { role, id } = params
  const isFounder = role === "founder"

  // Dummy data
  const founderData = {
    name: "Jane Doe",
    startup: "TechInnovate",
    idea: "AI-powered personal assistant",
    requirements: ["Machine Learning", "Natural Language Processing", "Mobile Development"],
    benefits: "Competitive salary, equity options, flexible work hours",
  }

  const developerData = {
    name: "John Smith",
    skills: ["React", "Node.js", "Python", "Machine Learning"],
    githubUrl: "https://github.com/johnsmith",
    portfolio: "https://johnsmith.dev",
  }

  const data = isFounder ? founderData : developerData

  return (
    (<div className="space-y-8">
      <h1 className="text-3xl font-bold">{isFounder ? "Founder" : "Developer"} Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>{isFounder ? data.startup : `GitHub: ${data.githubUrl}`}</CardDescription>
        </CardHeader>
        <CardContent>
          {isFounder ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Startup Idea</h3>
              <p>{data.idea}</p>
              <h3 className="text-lg font-semibold">Requirements</h3>
              <ul className="list-disc list-inside">
                {data.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold">Benefits</h3>
              <p>{data.benefits}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 text-sm bg-primary/10 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold">Portfolio</h3>
              <a
                href={data.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline">
                View Portfolio
              </a>
            </div>
          )}
        </CardContent>
      </Card>
      {!isFounder && (
        <Button className="w-full">Apply to Collaborate</Button>
      )}
    </div>)
  );
}

