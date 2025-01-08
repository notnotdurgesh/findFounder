"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ApplicationsTab from '@/components/ApplicationsTab';
import DeveloperSearch from '@/components/DeveloperSearch'

export default function FounderDashboard() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    startupName: "",
    tagline: "",
    website: "",
    logo: "",
    stage: "",
    fundingAmount: "",
    fundingStage: "",
    employeeCount: "",
    founded: "",
    location: "",
    industry: [],
    description: "",
    problem: "",
    solution: "",
    traction: "",
    businessModel: "",
    market: "",
    competition: "",
    teamMembers: [{ name: "", role: "", image: "" }],
    techStack: [],
    openPositions: [],
    equity: "",
    salary: "",
    benefits: [],
    culture: "",
    vision: "",
    missionStatement: "",
    values: [],
    productRoadmap: "",
    investorDeck: "",
    pitchVideo: "",
    patents: "",
    awards: [],
    pressLinks: [],
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
    founderBio: "",
    cofounderRequirements: "",
    idealCofounderDescription: "",
    equityOffered: "",
    decisionMakingProcess: "",
    exitStrategy: "",
    remoteFriendly: false,
    diversityInitiatives: "",
    sustainabilityEfforts: "",
    mentorship: false,
    networkingOpportunities: "",
    workLifeBalance: "",
    learningDevelopmentPrograms: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name) => (value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name) => (checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleArrayInput = (name) => (e) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        [name]: [...(prev[name]), e.currentTarget.value]
      }))
      e.currentTarget.value = ''
    }
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   // Here you would typically send the formData to your server
  //   console.log(formData)
  //   // Redirect or show success message
  //   router.push('/founder/profile')
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/founder/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      // Show success message or handle success case
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Fetch founder profile on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/founder/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        
        // Map the received data to form fields
        setFormData(prev => ({
          ...prev,
          ...data,
          // Ensure arrays are initialized even if not present in response
          industry: data.industry || [],
          techStack: data.techStack || [],
          openPositions: data.openPositions || [],
          benefits: data.benefits || [],
          teamMembers: data.teamMembers || [],
          // Ensure socialLinks object is initialized
          socialLinks: {
            ...prev.socialLinks,
            ...(data.socialLinks || {})
          }
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }



  return (
    (<div className="space-y-8">
      <h1 className="text-3xl font-bold">Founder Dashboard</h1>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="search">Search Developers</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Startup Profile</CardTitle>
              <CardDescription>Provide comprehensive details about your startup to attract the right co-founder</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Founder Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startupName">Startup Name</Label>
                    <Input id="startupName" name="startupName" value={formData.startupName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" name="tagline" value={formData.tagline} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" type="url" value={formData.website} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input id="logo" name="logo" type="url" value={formData.logo} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Startup Stage</Label>
                    <Select onValueChange={handleSelectChange("stage")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">Idea Stage</SelectItem>
                        <SelectItem value="mvp">MVP</SelectItem>
                        <SelectItem value="early-stage">Early Stage</SelectItem>
                        <SelectItem value="growth">Growth Stage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundingAmount">Funding Amount</Label>
                    <Input id="fundingAmount" name="fundingAmount" value={formData.fundingAmount} onChange={handleInputChange} placeholder="e.g. $500,000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundingStage">Funding Stage</Label>
                    <Select onValueChange={handleSelectChange("fundingStage")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-seed">Pre-seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B</SelectItem>
                        <SelectItem value="series-c">Series C+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Number of Employees</Label>
                    <Input id="employeeCount" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange} placeholder="e.g. 1-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Date</Label>
                    <Input id="founded" name="founded" type="date" value={formData.founded} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="City, Country" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    placeholder="Press Enter to add multiple industries" 
                    onKeyPress={handleArrayInput("industry")} 
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.industry.map((ind, index) => (
                      <span key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Startup Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Provide a detailed description of your startup"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem">Problem Statement</Label>
                  <Textarea 
                    id="problem" 
                    name="problem" 
                    value={formData.problem} 
                    onChange={handleInputChange} 
                    placeholder="What problem does your startup solve?"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">Solution</Label>
                  <Textarea 
                    id="solution" 
                    name="solution" 
                    value={formData.solution} 
                    onChange={handleInputChange} 
                    placeholder="How does your startup solve the problem?"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traction">Traction</Label>
                  <Textarea 
                    id="traction" 
                    name="traction" 
                    value={formData.traction} 
                    onChange={handleInputChange} 
                    placeholder="Describe your startup's traction (e.g., user growth, revenue)"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessModel">Business Model</Label>
                  <Textarea 
                    id="businessModel" 
                    name="businessModel" 
                    value={formData.businessModel} 
                    onChange={handleInputChange} 
                    placeholder="Explain your business model"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="market">Target Market</Label>
                  <Textarea 
                    id="market" 
                    name="market" 
                    value={formData.market} 
                    onChange={handleInputChange} 
                    placeholder="Describe your target market and its size"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competition">Competition</Label>
                  <Textarea 
                    id="competition" 
                    name="competition" 
                    value={formData.competition} 
                    onChange={handleInputChange} 
                    placeholder="Who are your main competitors?"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <Input 
                    id="techStack" 
                    placeholder="Press Enter to add technologies" 
                    onKeyPress={handleArrayInput("techStack")} 
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.techStack.map((tech, index) => (
                      <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openPositions">Open Positions</Label>
                  <Input 
                    id="openPositions" 
                    placeholder="Press Enter to add positions" 
                    onKeyPress={handleArrayInput("openPositions")} 
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.openPositions.map((position, index) => (
                      <span key={index} className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm">
                        {position}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equity">Equity Offered</Label>
                    <Input id="equity" name="equity" value={formData.equity} onChange={handleInputChange} placeholder="e.g. 5-10%" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input id="salary" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="e.g. $80,000 - $120,000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Input 
                    id="benefits" 
                    placeholder="Press Enter to add benefits" 
                    onKeyPress={handleArrayInput("benefits")} 
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.benefits.map((benefit, index) => (
                      <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culture">Company Culture</Label>
                  <Textarea 
                    id="culture" 
                    name="culture" 
                    value={formData.culture} 
                    onChange={handleInputChange} 
                    placeholder="Describe your company culture"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vision">Company Vision</Label>
                  <Textarea 
                    id="vision" 
                    name="vision" 
                    value={formData.vision} 
                    onChange={handleInputChange} 
                    placeholder="What is your company's long-term vision?"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="missionStatement">Mission Statement</Label>
                  <Textarea 
                    id="missionStatement" 
                    name="missionStatement" 
                    value={formData.missionStatement} 
                    onChange={handleInputChange} 
                    placeholder="What is your company's mission?"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="values">Company Values</Label>
                  <Input 
                    id="values" 
                    placeholder="Press Enter to add values" 
                    onKeyPress={handleArrayInput("values")} 
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.values.map((value, index) => (
                      <span key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productRoadmap">Product Roadmap</Label>
                  <Textarea 
                    id="productRoadmap" 
                    name="productRoadmap" 
                    value={formData.productRoadmap} 
                    onChange={handleInputChange} 
                    placeholder="Outline your product roadmap"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investorDeck">Investor Deck URL</Label>
                  <Input id="investorDeck" name="investorDeck" type="url" value={formData.investorDeck} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pitchVideo">Pitch Video URL</Label>
                  <Input id="pitchVideo" name="pitchVideo" type="url" value={formData.pitchVideo} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patents">Patents</Label>
                  <Input id="patents" name="patents" value={formData.patents} onChange={handleInputChange} placeholder="List any patents or pending patents" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="awards">Awards and Recognition</Label>
                  <Input 
                    id="awards" 
                    placeholder="Press Enter to add awards" 
                    onKeyPress={handleArrayInput("awards")} 
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.awards.map((award, index) => (
                      <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                        {award}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pressLinks">Press Links</Label>
                  <Input 
                    id="pressLinks" 
                    placeholder="Press Enter to add press links" 
                    onKeyPress={handleArrayInput("pressLinks")} 
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.pressLinks.map((link, index) => (
                      <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {link}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" name="linkedin" type="url" value={formData.socialLinks.linkedin} onChange={(e) => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: e.target.value } }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input id="twitter" name="twitter" type="url" value={formData.socialLinks.twitter} onChange={(e) => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, twitter: e.target.value } }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input id="facebook" name="facebook" type="url" value={formData.socialLinks.facebook} onChange={(e) => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, facebook: e.target.value } }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" name="instagram" type="url" value={formData.socialLinks.instagram} onChange={(e) => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, instagram: e.target.value } }))} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founderBio">Founder Bio</Label>
                  <Textarea 
                    id="founderBio" 
                    name="founderBio" 
                    value={formData.founderBio} 
                    onChange={handleInputChange} 
                    placeholder="Tell us about yourself and your background"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cofounderRequirements">Co-founder Requirements</Label>
                  <Textarea 
                    id="cofounderRequirements" 
                    name="cofounderRequirements" 
                    value={formData.cofounderRequirements} 
                    onChange={handleInputChange} 
                    placeholder="What are you looking for in a co-founder?"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idealCofounderDescription">Ideal Co-founder Description</Label>
                  <Textarea 
                    id="idealCofounderDescription" 
                    name="idealCofounderDescription" 
                    value={formData.idealCofounderDescription} 
                    onChange={handleInputChange} 
                    placeholder="Describe your ideal co-founder"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equityOffered">Equity Offered to Co-founder</Label>
                  <Input id="equityOffered" name="equityOffered" value={formData.equityOffered} onChange={handleInputChange} placeholder="e.g. 20-30%" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decisionMakingProcess">Decision Making Process</Label>
                  <Textarea 
                    id="decisionMakingProcess" 
                    name="decisionMakingProcess" 
                    value={formData.decisionMakingProcess} 
                    onChange={handleInputChange} 
                    placeholder="How do you envision making decisions with your co-founder?"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exitStrategy">Exit Strategy</Label>
                  <Textarea 
                    id="exitStrategy" 
                    name="exitStrategy" 
                    value={formData.exitStrategy} 
                    onChange={handleInputChange} 
                    placeholder="What is your long-term exit strategy?"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="remoteFriendly"
                    checked={formData.remoteFriendly}
                    onCheckedChange={handleSwitchChange("remoteFriendly")}
                  />
                  <Label htmlFor="remoteFriendly">Remote Friendly</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diversityInitiatives">Diversity Initiatives</Label>
                  <Textarea 
                    id="diversityInitiatives" 
                    name="diversityInitiatives" 
                    value={formData.diversityInitiatives} 
                    onChange={handleInputChange} 
                    placeholder="Describe any diversity and inclusion initiatives"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sustainabilityEfforts">Sustainability Efforts</Label>
                  <Textarea 
                    id="sustainabilityEfforts" 
                    name="sustainabilityEfforts" 
                    value={formData.sustainabilityEfforts} 
                    onChange={handleInputChange} 
                    placeholder="Describe any sustainability or environmental efforts"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="mentorship"
                    checked={formData.mentorship}
                    onCheckedChange={handleSwitchChange("mentorship")}
                  />
                  <Label htmlFor="mentorship">Mentorship Opportunities Available</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="networkingOpportunities">Networking Opportunities</Label>
                  <Textarea 
                    id="networkingOpportunities" 
                    name="networkingOpportunities" 
                    value={formData.networkingOpportunities} 
                    onChange={handleInputChange} 
                    placeholder="Describe networking opportunities within your startup"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workLifeBalance">Work-Life Balance</Label>
                  <Textarea 
                    id="workLifeBalance" 
                    name="workLifeBalance" 
                    value={formData.workLifeBalance} 
                    onChange={handleInputChange} 
                    placeholder="Describe your approach to work-life balance"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learningDevelopmentPrograms">Learning and Development Programs</Label>
                  <Textarea 
                    id="learningDevelopmentPrograms" 
                    name="learningDevelopmentPrograms" 
                    value={formData.learningDevelopmentPrograms} 
                    onChange={handleInputChange} 
                    placeholder="Describe any learning and development programs or opportunities"
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={saving}
                  onClick = {handleSubmit}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="applications">
          <ApplicationsTab />
        </TabsContent>
        <TabsContent value="search">
          <DeveloperSearch />
        </TabsContent>
      </Tabs>
    </div>)
  );
}

