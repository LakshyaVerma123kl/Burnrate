"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PRICING_DATA, UseCase } from "@/lib/pricing-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, ArrowRight, Loader2 } from "lucide-react";

interface FormTool {
  id: string; // unique ID for the list item
  toolId: string;
  planId: string;
  monthlySpend: number | "";
  seats: number | "";
}

export function SpendForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamSize, setTeamSize] = useState<number | "">("");
  const [useCase, setUseCase] = useState<UseCase | "">("");
  const [tools, setTools] = useState<FormTool[]>([]);

  useEffect(() => {
    // Load from local storage on mount
    const savedTools = localStorage.getItem("burnrate_tools");
    const savedTeamSize = localStorage.getItem("burnrate_teamSize");
    const savedUseCase = localStorage.getItem("burnrate_useCase");

    const initialTools = savedTools ? JSON.parse(savedTools) as FormTool[] : [];
    const initialTeamSize = savedTeamSize ? Number(savedTeamSize) : "";
    const initialUseCase = savedUseCase ? (savedUseCase as UseCase) : "";

    // Batch into a single render via startTransition
    React.startTransition(() => {
      setTools(initialTools);
      setTeamSize(initialTeamSize);
      setUseCase(initialUseCase);
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("burnrate_tools", JSON.stringify(tools));
      localStorage.setItem("burnrate_teamSize", teamSize.toString());
      localStorage.setItem("burnrate_useCase", useCase);
    }
  }, [tools, teamSize, useCase, mounted]);

  const addTool = () => {
    setTools([
      ...tools,
      { id: Math.random().toString(36).substr(2, 9), toolId: "", planId: "", monthlySpend: "", seats: 1 }
    ]);
  };

  const removeTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  const updateTool = (id: string, field: keyof FormTool, value: string | number | null) => {
    setTools(tools.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        // Reset plan if tool changes
        if (field === "toolId") {
          updated.planId = "";
        }
        return updated;
      }
      return t;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamSize || !useCase || tools.length === 0) return;
    
    // Validate tools
    const isValid = tools.every(t => t.toolId && t.planId && t.monthlySpend !== "" && t.seats !== "");
    if (!isValid) return alert("Please fill out all fields for your tools.");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamSize,
          useCase,
          tools: tools.map(t => ({
            toolId: t.toolId,
            planId: t.planId,
            monthlySpend: Number(t.monthlySpend),
            seats: Number(t.seats)
          }))
        })
      });
      
      const data = await res.json();
      if (data.id) {
        // Cache results in sessionStorage so the results page can display immediately
        sessionStorage.setItem(`burnrate_audit_${data.id}`, JSON.stringify(data));
        router.push(`/audit/${data.id}`);
      } else {
        alert(data.error || "An error occurred");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit audit.");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto w-full">
      <Card className="bg-black/50 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Team Context</CardTitle>
          <CardDescription>Tell us about your organization to get accurate recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="teamSize">Total Team Size</Label>
            <Input 
              id="teamSize" 
              type="number" 
              min="1" 
              value={teamSize} 
              onChange={(e) => setTeamSize(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 15" 
              required 
              className="bg-black border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="useCase">Primary Use Case</Label>
            <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)} required>
              <SelectTrigger id="useCase" className="bg-black border-white/10">
                <SelectValue placeholder="Select primary use case" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white">
                <SelectItem value="coding">Software Engineering / Coding</SelectItem>
                <SelectItem value="writing">Content / Copywriting</SelectItem>
                <SelectItem value="data">Data Analysis</SelectItem>
                <SelectItem value="research">Research & Strategy</SelectItem>
                <SelectItem value="mixed">Mixed / General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/50 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>AI Tools Stack</CardTitle>
          <CardDescription>Add every AI tool you currently pay for.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {tools.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 border border-dashed border-white/10 rounded-lg">
              No tools added yet. Click below to add your first tool.
            </div>
          ) : (
            tools.map((t, index) => {
              const selectedTool = PRICING_DATA.find(pt => pt.id === t.toolId);
              
              return (
                <div key={t.id} className="relative grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-white/10 rounded-lg bg-black/40">
                  <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-zinc-800 text-xs flex items-center justify-center border border-white/10">
                    {index + 1}
                  </div>
                  
                  <div className="md:col-span-3 space-y-2">
                    <Label>Tool</Label>
                    <Select value={t.toolId} onValueChange={(v) => updateTool(t.id, "toolId", v)}>
                      <SelectTrigger className="bg-black border-white/10">
                        <SelectValue placeholder="Select tool" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-white/10 text-white">
                        {PRICING_DATA.map(pt => (
                          <SelectItem key={pt.id} value={pt.id}>{pt.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-3 space-y-2">
                    <Label>Current Plan</Label>
                    <Select disabled={!t.toolId} value={t.planId} onValueChange={(v) => updateTool(t.id, "planId", v)}>
                      <SelectTrigger className="bg-black border-white/10">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-white/10 text-white">
                        {selectedTool?.plans.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label>Seats</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      value={t.seats} 
                      onChange={(e) => updateTool(t.id, "seats", e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="1" 
                      className="bg-black border-white/10"
                    />
                  </div>
                  
                  <div className="md:col-span-3 space-y-2">
                    <Label>Monthly Spend ($)</Label>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      value={t.monthlySpend} 
                      onChange={(e) => updateTool(t.id, "monthlySpend", e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 20" 
                      className="bg-black border-white/10"
                    />
                  </div>
                  
                  <div className="md:col-span-1 flex items-end justify-end pb-1">
                    <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => removeTool(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
          
          <Button type="button" variant="outline" className="w-full border-dashed border-white/20 bg-transparent hover:bg-white/5" onClick={addTool}>
            <Plus className="mr-2 h-4 w-4" /> Add Tool
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="lg" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12"
          disabled={isSubmitting || tools.length === 0 || !teamSize || !useCase}
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Audit...</>
          ) : (
            <>Run Instant Audit <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </form>
  );
}
