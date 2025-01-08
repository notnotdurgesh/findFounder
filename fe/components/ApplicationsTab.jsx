import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, FileText, User, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


export default function ApplicationsTab() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applications/received-applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (application, action) => {
    setSelectedApplication(application);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setApplicationDialogOpen(true);
  };

  const handleViewProfile = (candidateId) => {
    router.push(`/developer/${candidateId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const submitAction = async () => {
    setUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/applications/update-status/${selectedApplication.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: actionType === 'accept' ? 'accepted' : 'rejected',
            notes: notes
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      setApplications(applications.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, application: { ...app.application, status: actionType === 'accept' ? 'accepted' : 'rejected' } }
          : app
      ));
      
      setDialogOpen(false);
      setNotes("");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const ContactInfo = ({ contactInfo }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-gray-500" />
        <a href={`mailto:${contactInfo.email}`} className="text-sm text-blue-600 hover:underline">
          {contactInfo.email}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-gray-500" />
        <a href={`tel:${contactInfo.phone}`} className="text-sm text-blue-600 hover:underline">
          {contactInfo.phone}
        </a>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
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

  const getStatusClass = (status) => {
    const classes = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return classes[status] || classes.pending;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Applications</CardTitle>
        <CardDescription>Review and manage applications from developers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg space-y-4 md:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{app.candidate.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(app.application.status)}`}>
                    {app.application.status}
                  </span>
                  {app.application.status === 'accepted' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          <h4 className="font-medium">Contact Information</h4>
                          <ContactInfo contactInfo={app.candidate.contactInfo} />
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <p className="text-sm text-gray-500">{app.candidate.title}</p>
                <p className="text-sm text-gray-500">Experience: {app.candidate.experience} years</p>
                <p className="text-sm text-gray-500">Location: {app.candidate.location}</p>
                <div className="flex flex-wrap gap-2">
                  {app.candidate.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleViewProfile(app.candidate.id)}
                >
                  <User className="w-4 h-4" />
                  View Profile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleViewApplication(app)}
                >
                  <FileText className="w-4 h-4" />
                  View Application
                </Button>
                {app.application.status === "pending" && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction(app, 'accept')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleAction(app, 'reject')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Status Update Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'accept' ? 'Accept' : 'Reject'} Application
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Add optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitAction}
              disabled={updating}
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Details Dialog */}
      <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Position</h3>
                  <p className="mt-1">{selectedApplication.application.position}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cover Letter</h3>
                  <p className="mt-1 whitespace-pre-wrap">{selectedApplication.application.coverLetter}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Expected Salary</h3>
                    <p className="mt-1">${selectedApplication.application.expectedSalary.toLocaleString()}/year</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                    <p className="mt-1">{formatDate(selectedApplication.application.startDate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Applied Date</h3>
                    <p className="mt-1">{formatDate(selectedApplication.application.appliedDate)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className={`mt-1 inline-flex px-2 py-1 rounded-full text-sm ${getStatusClass(selectedApplication.application.status)}`}>
                      {selectedApplication.application.status}
                    </p>
                  </div>
                </div>

                {selectedApplication.application.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1 whitespace-pre-wrap">{selectedApplication.application.notes}</p>
                  </div>
                )}

                {selectedApplication.application.resume && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Resume</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1"
                      onClick={() => window.open(selectedApplication.application.resume, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplicationDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}