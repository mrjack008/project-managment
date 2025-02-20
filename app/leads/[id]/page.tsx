"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Calendar, Mail, MapPin, Phone, Plus, Send, User, Check, Pencil } from "lucide-react"
import { useState } from "react"

// Mock initial data
const initialNotes = [
  {
    id: 1,
    author: "John Doe",
    avatar: "/placeholder.svg",
    initials: "JD",
    content: "Initial meeting went well. Client is interested in our enterprise solution. Need to prepare proposal by next week.",
    date: "2 days ago"
  },
  {
    id: 2,
    author: "Alice Smith",
    avatar: "/placeholder.svg",
    initials: "AS",
    content: "Discussed technical requirements. Client needs: - API integration - Custom reporting - 24/7 support",
    date: "5 days ago"
  }
]

const initialTasks = [
  {
    id: 1,
    title: "Prepare Proposal",
    dueDate: "3 days",
    status: "pending"
  },
  {
    id: 2,
    title: "Technical Review",
    dueDate: "5 days",
    status: "in-progress"
  }
]

const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "In Progress",
    progress: 75
  },
  {
    id: 2,
    name: "Mobile App Development",
    status: "Planning Phase",
    progress: 25
  }
]

export default function LeadDetails() {
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState("")
  const [tasks, setTasks] = useState(initialTasks)
  const [projects, setProjects] = useState(initialProjects)
  const [newTask, setNewTask] = useState({ title: "", dueDate: "" })
  const [newProject, setNewProject] = useState({ name: "", status: "" })
  
  const [leadData, setLeadData] = useState({
    name: "John Smith",
    title: "Senior Manager",
    company: "Acme Inc",
    status: "Hot Lead",
    email: "john.smith@acme.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Suite 100, New York, NY 10001",
    clientSince: "Jan 2024",
    leadScore: "85/100",
    totalValue: "$45,000",
    lastContact: "2 days ago",
    openTasks: "3"
  })

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: notes.length + 1,
        author: "Current User",
        avatar: "/placeholder.svg",
        initials: "CU",
        content: newNote,
        date: "Just now"
      }
      setNotes([note, ...notes])
      setNewNote("")
    }
  }

  const handleAddTask = () => {
    if (newTask.title && newTask.dueDate) {
      setTasks([...tasks, { id: tasks.length + 1, ...newTask, status: "pending" }])
      setNewTask({ title: "", dueDate: "" })
    }
  }

  const handleAddProject = () => {
    if (newProject.name && newProject.status) {
      setProjects([...projects, { id: projects.length + 1, ...newProject, progress: 0 }])
      setNewProject({ name: "", status: "" })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Input
                value={leadData.name}
                onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                className="text-2xl font-semibold h-auto w-[300px]"
              />
            ) : (
              <h1 className="text-2xl font-semibold">{leadData.name}</h1>
            )}
            <Badge>{leadData.status}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {isEditing ? (
              <Input
                value={leadData.title}
                onChange={(e) => setLeadData({...leadData, title: e.target.value})}
                className="h-auto"
              />
            ) : (
              `${leadData.title} at ${leadData.company}`
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isEditing ? (
            <Button onClick={() => setIsEditing(false)}>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Lead
            </Button>
          )}
          <Button>Convert to Customer</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 h-[calc(100vh-5rem)]">
        <div className="col-span-2 border-r">
          <Tabs defaultValue="overview" className="h-full">
            <div className="border-b">
              <TabsList className="px-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6">
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Lead Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">85/100</div>
                      <p className="text-xs text-muted-foreground">High probability</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$45,000</div>
                      <p className="text-xs text-muted-foreground">Potential deal size</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Last Contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2 days ago</div>
                      <p className="text-xs text-muted-foreground">Via email</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">Due this week</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        {isEditing ? (
                          <>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input
                                value={leadData.email}
                                onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input
                                value={leadData.phone}
                                onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Company</Label>
                              <Input
                                value={leadData.company}
                                onChange={(e) => setLeadData({...leadData, company: e.target.value})}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{leadData.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{leadData.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{leadData.company}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="space-y-4">
                        {isEditing ? (
                          <>
                            <div className="space-y-2">
                              <Label>Address</Label>
                              <Input
                                value={leadData.address}
                                onChange={(e) => setLeadData({...leadData, address: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={leadData.title}
                                onChange={(e) => setLeadData({...leadData, title: e.target.value})}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{leadData.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{leadData.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Client since {leadData.clientSince}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="p-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>CU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Add a note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <Button onClick={handleAddNote}>
                          <Send className="mr-2 h-4 w-4" /> Add Note
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    {notes.map((note) => (
                      <div key={note.id} className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={note.avatar} />
                          <AvatarFallback>{note.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{note.author}</div>
                            <div className="text-sm text-muted-foreground">{note.date}</div>
                          </div>
                          <p className="text-sm text-muted-foreground">{note.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="p-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Task title..."
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        />
                        <Input
                          placeholder="Due date..."
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        />
                        <Button onClick={handleAddTask}>
                          <Plus className="mr-2 h-4 w-4" /> Add Task
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">Due in {task.dueDate}</div>
                        </div>
                        <Badge>{task.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="p-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Project name..."
                          value={newProject.name}
                          onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        />
                        <Select
                          value={newProject.status}
                          onValueChange={(value) => setNewProject({...newProject, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddProject}>
                          <Plus className="mr-2 h-4 w-4" /> Add Project
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    {projects.map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.status} - {project.progress}% Complete
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="border-l">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Upcoming Tasks</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Prepare Proposal</div>
                  <div className="text-sm text-muted-foreground">Due in 3 days</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Technical Review</div>
                  <div className="text-sm text-muted-foreground">Due in 5 days</div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-4">Related Projects</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Website Redesign</div>
                  <div className="text-sm text-muted-foreground">In Progress - 75% Complete</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Mobile App Development</div>
                  <div className="text-sm text-muted-foreground">Planning Phase</div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-4">Communication History</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">2 days ago</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Proposal follow-up</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Phone Call</div>
                    <div className="text-sm text-muted-foreground">5 days ago</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Initial consultation</div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Log Communication
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

