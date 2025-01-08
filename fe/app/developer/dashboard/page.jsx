"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import SearchStartups from '@/components/SearchStartups'
import ApplicationsList from "@/components/ApplicationsList"
import { Loader2 } from "lucide-react";


export default function DeveloperDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    title: "",
    location: "",
    yearsOfExperience: 0,
    bio: "",
    skills: [],
    topSkills: [],
    githubUrl: "",
    linkedinUrl: "",
    personalWebsite: "",
    education: [],
    workExperience: [],
    projects: [],
    achievements: [],
    languages: []
  })

  // State for managing arrays
  const [newSkill, setNewSkill] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newAchievement, setNewAchievement] = useState("")

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/developer`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },

      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfile(data)
      setIsLoading(false)
    } catch (error) {
        console.error(error)
      setIsLoading(false)
    }
  }

  // Handlers for arrays
  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const addLanguage = () => {
    if (newLanguage && !profile.languages.includes(newLanguage)) {
      setProfile({ ...profile, languages: [...profile.languages, newLanguage] })
      setNewLanguage("")
    }
  }

  const addAchievement = () => {
    if (newAchievement && !profile.achievements.includes(newAchievement)) {
      setProfile({ ...profile, achievements: [...profile.achievements, newAchievement] })
      setNewAchievement("")
    }
  }

  // Handlers for nested arrays
  const updateEducation = (index, field, value) => {
    const newEducation = [...profile.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setProfile({ ...profile, education: newEducation })
  }

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { degree: "", school: "", year: "" }]
    })
  }

  const updateWorkExperience = (index, field, value) => {
    const newWorkExperience = [...profile.workExperience]
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value }
    setProfile({ ...profile, workExperience: newWorkExperience })
  }

  const addWorkExperience = () => {
    setProfile({
      ...profile,
      workExperience: [...profile.workExperience, { title: "", company: "", duration: "", description: "" }]
    })
  }

  const updateProject = (index, field, value) => {
    const newProjects = [...profile.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setProfile({ ...profile, projects: newProjects })
  }

  const addProject = () => {
    setProfile({
      ...profile,
      projects: [...profile.projects, { name: "", description: "", link: "" }]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/developer/developers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 /></div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Developer Dashboard</h1>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="search">Search Startups</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your skills and portfolio</CardDescription>
            </CardHeader>
            <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input 
                id="title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input 
                id="experience"
                type="number"
                value={profile.yearsOfExperience}
                onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <div className="flex space-x-2">
              <Input
                id="skills"
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <Button type="button" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                  <button
                    className="ml-1 text-xs"
                    onClick={() => removeSkill(skill)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile</Label>
              <Input 
                id="github"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input 
                id="linkedin"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Personal Website</Label>
              <Input 
                id="website"
                value={profile.personalWebsite}
                onChange={(e) => setProfile({ ...profile, personalWebsite: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Education</Label>
            {profile.education.map((edu, index) => (
              <div key={index} className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                />
                <Input
                  placeholder="School"
                  value={edu.school}
                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                />
                <Input
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEducation}>Add Education</Button>
          </div>

          <div className="space-y-4">
            <Label>Work Experience</Label>
            {profile.workExperience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <Input
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                  />
                  <Input
                    placeholder="Duration"
                    value={exp.duration}
                    onChange={(e) => updateWorkExperience(index, 'duration', e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addWorkExperience}>Add Work Experience</Button>
          </div>

          <div className="space-y-4">
            <Label>Projects</Label>
            {profile.projects.map((project, index) => (
              <div key={index} className="space-y-2">
                <Input
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                />
                <Textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                />
                <Input
                  placeholder="Project Link"
                  value={project.link}
                  onChange={(e) => updateProject(index, 'link', e.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addProject}>Add Project</Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="languages">Languages</Label>
            <div className="flex space-x-2">
              <Input
                id="languages"
                placeholder="Add a language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
              />
              <Button type="button" onClick={addLanguage}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.languages.map((language, index) => (
                <Badge key={index} variant="secondary">
                  {language}
                  <button
                    className="ml-1 text-xs"
                    onClick={() => setProfile({
                      ...profile,
                      languages: profile.languages.filter((_, i) => i !== index)
                    })}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements</Label>
            <div className="flex space-x-2">
              <Input
                id="achievements"
                placeholder="Add an achievement"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
              />
              <Button type="button" onClick={addAchievement}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary">
                  {achievement}
                  <button
                    className="ml-1 text-xs"
                    onClick={() => setProfile({
                      ...profile,
                      achievements: profile.achievements.filter((_, i) => i !== index)
                    })}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" onClick={handleSubmit}>Save Changes</Button>
        </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search Startups</CardTitle>
              <CardDescription>Find startup ideas that match your skills and interests</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchStartups />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track the status of your startup applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

