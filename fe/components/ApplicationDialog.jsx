import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ApplicationDialog({ isOpen, onClose, companyId, companyName }) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    position: '',
    coverLetter: '',
    resume: '',
    expectedSalary: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  const positions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "DevOps Engineer"
  ];

  const terms = [
    "Both parties agree to maintain confidentiality regarding the startup idea and any shared information.",
    "The developer agrees to contribute their skills and time to the project as discussed.",
    "The founder agrees to provide the agreed-upon compensation and/or equity as discussed.",
    "Both parties commit to regular communication and updates on the project's progress.",
    "Any intellectual property created during the collaboration will be owned by the startup, with the developer's contributions recognized as per the agreed terms.",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.coverLetter) newErrors.coverLetter = "Cover letter is required";
    if (!formData.expectedSalary) newErrors.expectedSalary = "Expected salary is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed || !validateForm()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applications/apply/${companyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      toast({
        title: "Application Submitted!",
        description: `Your application to ${companyName} has been sent successfully.`,
        duration: 5000,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-auto	max-h-[70%]">
        <DialogHeader>
          <DialogTitle>Apply to {companyName}</DialogTitle>
          <DialogDescription>
            Please fill out all required fields and agree to the terms to submit your application
          </DialogDescription>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Position Selection */}
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, position: value }));
                    if (errors.position) {
                      setErrors(prev => ({ ...prev, position: '' }));
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="min-h-32"
                  placeholder="Write your cover letter here..."
                />
                {errors.coverLetter && <p className="text-sm text-red-500">{errors.coverLetter}</p>}
              </div>

              {/* Expected Salary */}
              <div className="space-y-2">
                <Label htmlFor="expectedSalary">Expected Salary (USD/year)</Label>
                <Input
                  type="number"
                  id="expectedSalary"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  placeholder="e.g., 80000"
                />
                {errors.expectedSalary && <p className="text-sm text-red-500">{errors.expectedSalary}</p>}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Available Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                {terms.map((term, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-muted-foreground">•</span>
                    <p className="text-sm">{term}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={setAgreed}
                  disabled={submitting}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={!agreed || submitting} 
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  "Confirm & Submit Application"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}