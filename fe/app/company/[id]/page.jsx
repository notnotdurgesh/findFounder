"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Users,
  Rocket,
  DollarSign,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Loader2,
} from 'lucide-react';
import ApplicationDialog from '@/components/ApplicationDialog';

export default function CompanyProfile({ params }) {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyStatus, setApplyStatus] = useState("idle");
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/founder/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch company data');
        }

        const founderData = await response.json();
        
        // Transform founder data with default values for missing fields
        setCompany({
          id: founderData._id || '',
          name: founderData.startupName || 'Unnamed Company',
          logo: founderData.logo || "/placeholder.svg?height=100&width=100",
          tagline: founderData.tagline || 'No tagline available',
          stage: founderData.stage || 'Not specified',
          fundingAmount: founderData.fundingAmount || 'Not disclosed',
          employeeCount: founderData.employeeCount || 'Not specified',
          founded: founderData.founded || 'Not specified',
          location: founderData.location || 'Location not specified',
          industry: founderData.industry || [],
          website: founderData.website || '#',
          description: founderData.description || 'No description available',
          problem: founderData.problem || 'Not specified',
          solution: founderData.solution || 'Not specified',
          traction: founderData.traction || 'Not specified',
          businessModel: founderData.businessModel || 'Not specified',
          market: founderData.market || 'Not specified',
          competition: founderData.competition || 'Not specified',
          teamMembers: founderData.teamMembers || [],
          techStack: founderData.techStack || [],
          openPositions: founderData.openPositions || [],
          equity: founderData.equity || 'Not specified',
          benefits: founderData.benefits || [],
          culture: founderData.culture || 'Not specified',
          vision: founderData.vision || 'Not specified',
          contactEmail: founderData.contactEmail || '',
          contactPhone: founderData.contactPhone || '',
          socialLinks: {
            linkedin: founderData.socialLinks?.linkedin || '#',
            twitter: founderData.socialLinks?.twitter || '#',
          },
        });
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [params.id]);

  const handleApply = async () => {
    setApplyStatus("loading");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setApplyStatus("success");
    } catch (error) {
      console.error('Error submitting application:', error);
      setApplyStatus("idle");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Company Not Found</h2>
              <p className="mt-2">The requested company profile could not be found.</p>
              <Button className="mt-4" onClick={() => router.push('/')}>
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to render social links only if they exist and are valid
  const renderSocialLink = (icon, label, url) => {
    if (!url || url === '#') return null;
    
    return (
      <div className="flex items-center">
        {icon}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline">
          {label}
        </a>
      </div>
    );
  };

  // Helper function to render contact links only if they exist
  const renderContactLink = (icon, type, value, href) => {
    if (!value) return null;
    
    return (
      <div className="flex items-center">
        {icon}
        <a href={href} className="text-blue-500 hover:underline">
          {value}
        </a>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={company.logo} alt={company.name} />
              <AvatarFallback>{company.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <p className="text-xl text-muted-foreground mt-2">{company.tagline}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {company.industry?.map((ind) => (
                  <Badge key={ind} variant="secondary">{ind}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{company.description}</p>
                  <div>
                    <h3 className="font-semibold">Problem</h3>
                    <p>{company.problem}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Solution</h3>
                    <p>{company.solution}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Traction</h3>
                    <p>{company.traction}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Model</h3>
                    <p>{company.businessModel}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Market</h3>
                    <p>{company.market}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Competition</h3>
                    <p>{company.competition}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {company.teamMembers.length > 0 ? (
                      company.teamMembers.map((member) => (
                        <div key={member.name} className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={member.image} alt={member.name} />
                            <AvatarFallback>{member.name?.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No team members listed yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tech Tab */}
            <TabsContent value="tech">
              <Card>
                <CardHeader>
                  <CardTitle>Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {company.techStack.length > 0 ? (
                      company.techStack.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))
                    ) : (
                      <p>No tech stack specified yet.</p>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">Open Positions</h3>
                  <ul className="list-disc list-inside">
                    {company.openPositions.length > 0 ? (
                      company.openPositions.map((position) => (
                        <li key={position}>{position}</li>
                      ))
                    ) : (
                      <p>No open positions at the moment.</p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Culture Tab */}
            <TabsContent value="culture">
              <Card>
                <CardHeader>
                  <CardTitle>Culture and Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Company Culture</h3>
                    <p>{company.culture}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Vision</h3>
                    <p>{company.vision}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Benefits</h3>
                    {company.benefits.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {company.benefits.map((benefit) => (
                          <li key={benefit}>{benefit}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Benefits information not available.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">Equity</h3>
                    <p>{company.equity}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  <span>Stage: {company.stage}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>Funding: {company.fundingAmount}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Employees: {company.employeeCount}</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span>Founded: {company.founded}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  <span>Location: {company.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {renderContactLink(
                  <Mail className="w-5 h-5 mr-2" />,
                  "email",
                  company.contactEmail,
                  `mailto:${company.contactEmail}`
                )}
                                
                {renderContactLink(
                  <Globe className="w-5 h-5 mr-2" />,
                  "website",
                  company.website,
                  company.website
                )}
                
                {renderSocialLink(
                  <Linkedin className="w-5 h-5 mr-2" />,
                  "LinkedIn",
                  company.socialLinks?.linkedin
                )}
                
                {renderSocialLink(
                  <Twitter className="w-5 h-5 mr-2" />,
                  "Twitter",
                  company.socialLinks?.twitter
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            onClick={() => setShowApplicationDialog(true)}
            disabled={applyStatus !== "idle"}>
            {applyStatus === "idle" && "Apply to Collaborate"}
            {applyStatus === "loading" && "Applying..."}
            {applyStatus === "success" && "Application Sent!"}          
          </Button>
        </div>
        <div className="flex justify-center items-center p-4">
        <ApplicationDialog
          isOpen={showApplicationDialog}
          onClose={() => setShowApplicationDialog(false)}
          companyId={company.id}
          companyName={company.name}
        />

        </div>

      </div>
    </div>)
}

