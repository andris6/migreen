
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { TherapySession } from '@/types';
import { getStoredSessions, deleteStoredSession } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Button, buttonVariants } from '@/components/ui/button';
import { Download, Filter, Trash2 } from 'lucide-react';
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
import { useToast } from "@/hooks/use-toast";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"; // Tooltip from recharts aliased to avoid conflict
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  painIntensity: { label: "Pain Intensity", color: "hsl(var(--chart-1))" },
  reliefScore: { label: "Relief Score", color: "hsl(var(--chart-2))" },
  actualDuration: { label: "Duration (min)", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;


export default function HistoryPage() {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TherapySession[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [painFilter, setPainFilter] = useState<string>("all");
  const [reliefFilter, setReliefFilter] = useState<string>("all");
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadedSessions = getStoredSessions();
    setSessions(loadedSessions);
  }, []);

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
        if (reliefFilter === "low") return s.reliefScore <= 3;
        if (reliefFilter === "medium") return s.reliefScore >= 4 && s.reliefScore <= 7;
        if (reliefFilter === "high") return s.reliefScore >= 8;
        return true;
      });
    }

    setFilteredSessions(tempSessions);
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
    const headers = ["ID", "Start Time", "Pain Intensity", "Affected Areas", "Triggers", "Pre-Session Notes", "Recommended Duration", "Actual Duration", "End Time", "Relief Score", "Medication Taken", "Post-Session Notes"];
    const rows = filteredSessions.map(s => [
      s.id,
      format(parseISO(s.startTime), 'yyyy-MM-dd HH:mm'),
      s.painIntensity,
      s.affectedAreas.join(', '),
      s.triggers.join(', '),
      s.preSessionNotes || '',
      s.recommendedDuration,
      s.actualDuration,
      s.endTime ? format(parseISO(s.endTime), 'yyyy-MM-dd HH:mm') : 'N/A',
      s.reliefScore,
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
      deleteStoredSession(sessionToDelete);
      setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionToDelete));
      setSessionToDelete(null);
      toast({ title: "Session Deleted", description: "The session has been removed from your history." });
    }
    setIsAlertOpen(false);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Session History & Analytics</CardTitle>
          <CardDescription>Review your past therapy sessions and analyze trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1 min-w-[150px]">
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
            <div className="flex-1 min-w-[150px]">
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
            <div className="flex-1 min-w-[150px]">
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
          </div>

          {filteredSessions.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end mb-4">
            <Button onClick={exportToCSV} variant="outline" disabled={filteredSessions.length === 0}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>

          {filteredSessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Pain (Pre)</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Relief (Post)</TableHead>
                  <TableHead>Meds</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{format(parseISO(session.startTime), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell>{session.painIntensity}</TableCell>
                    <TableCell>{session.actualDuration} min</TableCell>
                    <TableCell>{session.reliefScore}</TableCell>
                    <TableCell>{session.medicationTaken ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <Button variant="link" size="sm" onClick={() => alert(JSON.stringify(session, null, 2))}>View</Button>
                    </TableCell>
                    <TableCell>
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
            <p className="text-center text-muted-foreground py-8">No sessions found matching your criteria. Try adjusting filters or log a new session.</p>
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
    </div>
  );
}
