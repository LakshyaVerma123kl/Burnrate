"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function LeadCaptureModal({ auditId, highSavings }: { auditId: string; highSavings: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    role: "",
    honeypot: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Simple abuse protection

    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, auditId, highSavings })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (err) {
      alert("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-orange-500 hover:bg-orange-600 text-white">
        {highSavings ? "Book Credex Consultation" : "Get Notified of Savings"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{highSavings ? "Capture Your Savings" : "Stay Optimized"}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {highSavings 
              ? "Leave your details and the Credex team will reach out to help you restructure your AI spend."
              : "We'll email you when new pricing tiers or cheaper alternatives drop for your stack."}
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="py-6 text-center text-green-400 font-medium">
            Thanks! We've received your information.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Honeypot field - hidden from users */}
            <div className="hidden" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} value={formData.honeypot} onChange={(e) => setFormData({...formData, honeypot: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email <span className="text-red-500">*</span></Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-black border-white/10"
                placeholder="founder@startup.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input 
                id="companyName" 
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="bg-black border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role (Optional)</Label>
              <Input 
                id="role" 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="bg-black border-white/10"
                placeholder="e.g. CTO, Founder"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200 mt-4">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
