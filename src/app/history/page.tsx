
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { TherapySession, HeadArea } from '@/types';
import { getStoredSessions, deleteStoredSession } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Button, buttonVariants } from '@/components/ui/button';
import { Download, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { availableTriggers } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const chartConfig = {
  painIntensity: { label: "Pain Intensity", color: "hsl(var(--chart-1))" },
  reliefScore: { label: "Relief Score", color: "hsl(var(--chart-2))" },
  actualDuration: { label: "Duration (min)", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

function formatHeadArea(area?: HeadArea): string {
  if (!area || area === 'none') return 'N/A';
  return area.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const getTriggerNames = (triggerIds: string[]): string => {
  if (!triggerIds || triggerIds.length === 0) return 'N/A';
  return triggerIds.map(id => {
    const trigger = availableTriggers.find(t => t.id === id);
    return trigger ? trigger.name : id;
  }).join(', ');
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TherapySession[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [painFilter, setPainFilter] = useState<string>("all");
  const [reliefFilter, setReliefFilter] = useState<string>("all");
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadedSessions = getStoredSessions(user?.id);
    setSessions(loadedSessions);
  }, [user]);

  useEffect(() => {
    let tempSessions = [...sessions];

    if (dateFilter !== "all") {
      const now = new Date();
      const daysToSubtract = parseInt(dateFilter.replace('last',''), 10);
      tempSessions = tempSessions.filter(s => {
        const sessionDate = parseISO(s.startTime);
        const diffDays = (now.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= daysToSubtract;
      });
    }

    if (painFilter !== "all") {
      tempSessions = tempSessions.filter(s => {
        if (painFilter === "low") return s.painIntensity <= 3;
        if (painFilter === "medium") return s.painIntensity >= 4 && s.painIntensity <= 6;
        if (painFilter === "high") return s.painIntensity >= 7;
        return true;
      });
    }
    
    if (reliefFilter !== "all") {
      tempSessions = tempSessions.filter(s => {
        if (!s.reliefScore) return false;
        if (reliefFilter === "low") return s.reliefScore <= 3;
        if (reliefFilter === "medium") return s.reliefScore >= 4 && s.reliefScore <= 7;
        if (reliefFilter === "high") return s.reliefScore >= 8;
        return true;
      });
    }

    setFilteredSessions(tempSessions.sort((a, b) => parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime()));
  }, [sessions, dateFilter, painFilter, reliefFilter]);

  const chartData = useMemo(() => {
    return filteredSessions.map(s => ({
      date: format(parseISO(s.startTime), 'MMM d'),
      painIntensity: s.painIntensity,
      reliefScore: s.reliefScore,
      actualDuration: s.actualDuration,
    })).reverse(); 
  }, [filteredSessions]);

  const exportToCSV = () => {
    if (filteredSessions.length === 0) return;
    const headers = ["ID", "Start Time", "Pain Intensity", "Affected Area", "Triggers", "Pre-Session Notes", "Recommended Duration", "Actual Duration", "End Time", "Relief Score", "Medication Taken", "Post-Session Notes"];
    const rows = filteredSessions.map(s => [
      s.id,
      format(parseISO(s.startTime), 'yyyy-MM-dd HH:mm'),
      s.painIntensity,
      s.affectedArea ? formatHeadArea(s.affectedArea) : '',
      getTriggerNames(s.triggers),
      s.preSessionNotes || '',
      s.recommendedDuration,
      s.actualDuration,
      s.endTime ? format(parseISO(s.endTime), 'yyyy-MM-dd HH:mm') : 'N/A',
      s.reliefScore ?? 'N/A',
      s.medicationTaken ? 'Yes' : 'No',
      s.postSessionNotes || ''
    ].map(String).map(v => v.replace(/"/g, '""'))
    .map(v => `"${v}"`)
    .join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "migreen_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteInitiation = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      deleteStoredSession(sessionToDelete, user?.id);
      setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionToDelete));
      setSessionToDelete(null);
      toast({ title: "Session Deleted", description: "The session has been removed from your history." });
    }
    setIsAlertOpen(false);
  };

  const handleViewDetails = (session: TherapySession) => {
    setSelectedSession(session);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Session History & Analytics</h1>
          <p className="text-muted-foreground">Review your past therapy sessions and analyze trends.</p>
        </div>
        <div className="flex items-center gap-2">
           <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFilter">Date Range</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger id="dateFilter"><SelectValue placeholder="Filter by date" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="last7">Last 7 Days</SelectItem>
                      <SelectItem value="last30">Last 30 Days</SelectItem>
                      <SelectItem value="last90">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="painFilter">Pain Level (Pre)</Label>
                  <Select value={painFilter} onValueChange={setPainFilter}>
                    <SelectTrigger id="painFilter"><SelectValue placeholder="Filter by pain" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pain Levels</SelectItem>
                      <SelectItem value="low">Low (0-3)</SelectItem>
                      <SelectItem value="medium">Medium (4-6)</SelectItem>
                      <SelectItem value="high">High (7-10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reliefFilter">Relief Score (Post)</Label>
                  <Select value={reliefFilter} onValueChange={setReliefFilter}>
                    <SelectTrigger id="reliefFilter"><SelectValue placeholder="Filter by relief" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Relief Scores</SelectItem>
                      <SelectItem value="low">Low (0-3)</SelectItem>
                      <SelectItem value="medium">Medium (4-7)</SelectItem>
                      <SelectItem value="high">High (8-10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </PopoverContent>
          </Popover>
          <Button onClick={exportToCSV} variant="outline" disabled={filteredSessions.length === 0}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSessions.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" domain={[0,10]}/>
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-3))" domain={[0,90]}/>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar yAxisId="left" dataKey="painIntensity" fill="var(--color-painIntensity)" radius={4} />
                  <Bar yAxisId="left" dataKey="reliefScore" fill="var(--color-reliefScore)" radius={4} />
                  <Bar yAxisId="right" dataKey="actualDuration" fill="var(--color-actualDuration)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">No sessions found matching your criteria. Try adjusting filters or log a new session.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
          <CardContent className="p-0">
          {filteredSessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Pain (Pre)</TableHead>
                  <TableHead>Affected Area</TableHead>
                  <TableHead className="text-center">Duration</TableHead>
                  <TableHead className="text-center">Relief (Post)</TableHead>
                  <TableHead className="text-center">Meds</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{format(parseISO(session.startTime), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell className="text-center">{session.painIntensity}</TableCell>
                    <TableCell>{formatHeadArea(session.affectedArea)}</TableCell>
                    <TableCell className="text-center">{session.actualDuration} min</TableCell>
                    <TableCell className="text-center">{session.reliefScore ?? 'N/A'}</TableCell>
                    <TableCell className="text-center">{session.medicationTaken ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(session)}>View</Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDeleteInitiation(session.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete session</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center p-16 text-muted-foreground">
              No sessions found matching your criteria. Try adjusting filters or log a new session.
            </div>
          )}
          </CardContent>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the session from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedSession && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                Session from {format(parseISO(selectedSession.startTime), 'MMMM d, yyyy \'at\' HH:mm')}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-[160px_1fr] items-center gap-x-4 gap-y-1">
                <span className="font-medium text-muted-foreground">Pain Intensity (Pre):</span>
                <span>{selectedSession.painIntensity}/10</span>

                <span className="font-medium text-muted-foreground">Affected Area:</span>
                <span>{formatHeadArea(selectedSession.affectedArea)}</span>

                <span className="font-medium text-muted-foreground">Triggers:</span>
                <span>{getTriggerNames(selectedSession.triggers)}</span>
                
                <span className="font-medium text-muted-foreground">Rec. Duration:</span>
                <span>{selectedSession.recommendedDuration} min</span>

                <span className="font-medium text-muted-foreground">Actual Duration:</span>
                <span>{selectedSession.actualDuration} min</span>
                
                <span className="font-medium text-muted-foreground">End Time:</span>
                <span>{selectedSession.endTime ? format(parseISO(selectedSession.endTime), 'MMM d, yyyy HH:mm') : "N/A"}</span>

                <span className="font-medium text-muted-foreground">Relief Score (Post):</span>
                <span>{selectedSession.reliefScore ?? 'N/A'}/10</span>

                <span className="font-medium text-muted-foreground">Medication Taken:</span>
                <span>{selectedSession.medicationTaken ? "Yes" : "No"}</span>
              </div>

              {selectedSession.preSessionNotes && (
                <div className="mt-2">
                  <span className="font-medium text-muted-foreground">Pre-Session Notes:</span>
                  <p className="mt-1 whitespace-pre-wrap p-2 bg-muted/50 rounded-md">{selectedSession.preSessionNotes}</p>
                </div>
              )}
              {selectedSession.postSessionNotes && (
                <div className="mt-2">
                  <span className="font-medium text-muted-foreground">Post-Session Notes:</span>
                  <p className="mt-1 whitespace-pre-wrap p-2 bg-muted/50 rounded-md">{selectedSession.postSessionNotes}</p>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-border">
                <span className="font-medium text-muted-foreground">Session ID:</span>
                <span className="block text-xs text-muted-foreground/80 truncate mt-1">{selectedSession.id}</span>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
