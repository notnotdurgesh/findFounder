"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GithubIcon, Globe, Mail, Linkedin, MapPin, Briefcase, GraduationCap, Award, Star } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DeveloperProfile({ params }) {
  const router = useRouter()
  const [developer, setDeveloper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contactStatus, setContactStatus] = useState("idle")

  useEffect(() => {
    const fetchDeveloperProfile = async () => {
      try {
        // Get the token from wherever you store it (localStorage, cookie, etc.)
        const token = localStorage.getItem('token') // Adjust based on your auth implementation
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/developer/developers/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })

        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Developer not found' : 'Failed to fetch developer profile')
        }

        const data = await response.json()
        setDeveloper(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDeveloperProfile()
    }
  }, [params.id])

  const handleContact = async () => {
    setContactStatus("loading")
    // Implement your contact logic here
    // For example, sending a message or connection request
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setContactStatus("success")
    } catch (err) {
      setContactStatus("error")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            Loading developer profile...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!developer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Developer profile not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={developer.avatar} alt={developer.name} />
              <AvatarFallback>{developer.name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{developer.name}</h1>
              <p className="text-xl text-muted-foreground mt-2">{developer.title}</p>
              {developer.location && (
                <div className="flex items-center justify-center md:justify-start mt-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{developer.location}</span>
                </div>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {developer.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{developer.bio}</p>
                  {developer.education?.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-2">Education</h3>
                      {developer.education.map((edu, index) => (
                        <div key={index} className="mb-2">
                          <div className="font-medium">{edu.degree}</div>
                          <div className="text-sm text-muted-foreground">
                            {edu.school}, {edu.year}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {developer.languages?.length > 0 && (
                    <>
                      <h3 className="font-semibold mt-4 mb-2">Languages</h3>
                      <ul className="list-disc list-inside">
                        {developer.languages.map((lang, index) => (
                          <li key={index}>{lang}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {developer.achievements?.length > 0 && (
                    <>
                      <h3 className="font-semibold mt-4 mb-2">Achievements</h3>
                      <ul className="list-disc list-inside">
                        {developer.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {developer.workExperience?.map((exp, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-semibold">{exp.title}</h3>
                      <div className="text-sm text-muted-foreground mb-2">
                        {exp.company} | {exp.duration}
                      </div>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {developer.projects?.map((project, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="mb-2">{project.description}</p>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Project
                      </a>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Top Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  {developer.topSkills?.map((skill) => (
                    <div key={skill.name} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {developer.email && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    <a
                      href={`mailto:${developer.email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {developer.email}
                    </a>
                  </div>
                )}
                {developer.personalWebsite && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    <a
                      href={developer.personalWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Personal Website
                    </a>
                  </div>
                )}
                {developer.githubUrl && (
                  <div className="flex items-center">
                    <GithubIcon className="w-5 h-5 mr-2" />
                    <a
                      href={developer.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
                {developer.linkedinUrl && (
                  <div className="flex items-center">
                    <Linkedin className="w-5 h-5 mr-2" />
                    <a
                      href={developer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Developer Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>{developer.yearsOfExperience} Years of Experience</span>
                </div>
                {developer.education?.[0] && (
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    <span>{developer.education[0].degree}</span>
                  </div>
                )}
                {developer.achievements?.length > 0 && (
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    <span>{developer.achievements.length} Achievements</span>
                  </div>
                )}
                {developer.projects?.length > 0 && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    <span>{developer.projects.length} Showcased Projects</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            onClick={handleContact}
            disabled={contactStatus !== "idle"}
          >
            {contactStatus === "idle" && "Contact Developer"}
            {contactStatus === "loading" && "Sending Request..."}
            {contactStatus === "success" && "Request Sent!"}
            {contactStatus === "error" && "Failed to Send"}
          </Button>
        </div>
      </div>
    </div>
  )
}