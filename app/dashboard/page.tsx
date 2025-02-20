"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart3, 
  Building2, 
  DollarSign, 
  Users, 
  UserPlus, 
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Welcome back! Here's what's happening today.
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Apr 2024
          </Button>
          <Button>
            <ArrowDownRight className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <div className="flex items-center pt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <p className="text-xs text-green-500">+20.1% from last month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center pt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <p className="text-xs text-green-500">+2 new this month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,345</div>
              <div className="flex items-center pt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <p className="text-xs text-green-500">+180 new leads</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5%</div>
              <div className="flex items-center pt-1">
                <ArrowDownRight className="h-4 w-4 text-red-500" />
                <p className="text-xs text-red-500">-2.4% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Overview and Tasks */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Project Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Website Redesign</div>
                    <div className="text-sm text-muted-foreground">75%</div>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Mobile App Development</div>
                    <div className="text-sm text-muted-foreground">32%</div>
                  </div>
                  <Progress value={32} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Marketing Campaign</div>
                    <div className="text-sm text-muted-foreground">90%</div>
                  </div>
                  <Progress value={90} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New lead assigned</p>
                    <p className="text-xs text-muted-foreground">John Doe from Acme Inc.</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    2h ago
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/02.png" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Project milestone completed</p>
                    <p className="text-xs text-muted-foreground">Website Redesign Phase 1</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    5h ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks and Calendar */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Client Meeting</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      Today, 2:00 PM
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Project Deadline</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      Tomorrow
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/03.png" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Sarah Adams</p>
                    <Progress value={92} className="h-2" />
                    <p className="text-xs text-muted-foreground">23 tasks completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/04.png" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Mike Ross</p>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-muted-foreground">18 tasks completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 