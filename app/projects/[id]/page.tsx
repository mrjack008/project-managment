"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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
import { Calendar, Clock, FileText, MessageSquare, Paperclip, Plus, Users, Save, Trash2, MoreHorizontal, Check, Pencil } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for tasks and team members
const initialTasks = [
  { id: 1, title: "Design Homepage", status: "completed", assignee: "Sarah Adams", dueDate: "2024-04-15" },
  { id: 2, title: "Implement Authentication", status: "in-progress", assignee: "Mike Ross", dueDate: "2024-04-20" },
]

const initialTeamMembers = [
  { id: 1, name: "Sarah Adams", role: "Lead Designer", avatar: "/avatars/01.png", initials: "SA" },
  { id: 2, name: "Mike Ross", role: "Frontend Developer", avatar: "/avatars/02.png", initials: "MR" },
]

const initialNotes = [
  { id: 1, content: "Client requested blue color scheme", date: "2024-04-10", author: "Sarah Adams" },
  { id: 2, content: "Need to schedule weekly progress meeting", date: "2024-04-11", author: "Mike Ross" },
]

export default function ProjectDetails() {
  const [isEditing, setIsEditing] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState("")
  const [editingTask, setEditingTask] = useState<number | null>(null)
  const [newTeamMember, setNewTeamMember] = useState({ name: "", role: "", initials: "" })
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", assignee: "", dueDate: "", status: "pending" })
  
  const [projectData, setProjectData] = useState({
    name: "Website Redesign",
    status: "in-progress",
    dueDate: "2024-12-20",
    description: "Complete website redesign for Acme Inc, including new branding implementation, improved user experience, and mobile responsiveness. The project includes multiple phases from discovery to deployment with continuous client feedback and testing.",
    budget: "24500",
    client: "Acme Inc"
  })

  const handleAddTask = () => {
    if (newTask.title && newTask.assignee && newTask.dueDate) {
      setTasks([...tasks, { ...newTask, id: tasks.length + 1 }])
      setNewTask({ title: "", assignee: "", dueDate: "", status: "pending" })
      setIsTaskDialogOpen(false)
    }
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: notes.length + 1,
        content: newNote,
        date: new Date().toISOString().split('T')[0],
        author: "Current User" // Replace with actual user
      }
      setNotes([...notes, note])
      setNewNote("")
    }
  }

  const handleAddTeamMember = () => {
    if (newTeamMember.name && newTeamMember.role) {
      const initials = newTeamMember.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()

      const member = {
        id: teamMembers.length + 1,
        name: newTeamMember.name,
        role: newTeamMember.role,
        avatar: "",
        initials
      }
      setTeamMembers([...teamMembers, member])
      setNewTeamMember({ name: "", role: "", initials: "" })
      setIsTeamDialogOpen(false)
    }
  }

  const handleUpdateTask = (taskId: number, updates: Partial<typeof tasks[0]>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
    setEditingTask(null)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Input 
                value={projectData.name}
                onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                className="text-2xl font-semibold h-auto w-[300px]"
              />
            ) : (
              <h1 className="text-2xl font-semibold">{projectData.name}</h1>
            )}
            {isEditing ? (
              <Select 
                value={projectData.status}
                onValueChange={(value) => setProjectData({...projectData, status: value})}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary">In Progress</Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {isEditing ? (
                <Input 
                  type="date"
                  value={projectData.dueDate}
                  onChange={(e) => setProjectData({...projectData, dueDate: e.target.value})}
                  className="w-[150px]"
                />
              ) : (
                `Due ${projectData.dueDate}`
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              32 days remaining
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isEditing ? (
            <Button onClick={() => setIsEditing(false)}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Project
            </Button>
          )}
          <Button>Add Task</Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 h-[calc(100vh-5rem)]">
        <div className="col-span-2 border-r">
          <Tabs defaultValue="overview" className="h-full">
            <div className="border-b">
              <TabsList className="px-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Client</Label>
                      {isEditing ? (
                        <Input 
                          value={projectData.client}
                          onChange={(e) => setProjectData({...projectData, client: e.target.value})}
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">{projectData.client}</div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      {isEditing ? (
                        <Textarea 
                          value={projectData.description}
                          onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{projectData.description}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label>Budget</Label>
                      {isEditing ? (
                        <Input 
                          type="number"
                          value={projectData.budget}
                          onChange={(e) => setProjectData({...projectData, budget: e.target.value})}
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">${projectData.budget}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">45</div>
                      <p className="text-xs text-muted-foreground">28 completed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">75%</div>
                      <Progress value={75} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">Active members</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Complete website redesign for Acme Inc, including new branding implementation, improved user
                    experience, and mobile responsiveness. The project includes multiple phases from discovery to
                    deployment with continuous client feedback and testing.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">John Doe</span> completed task{" "}
                            <span className="font-medium">Homepage Design</span>
                          </p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Alice Smith</span> added new file{" "}
                            <span className="font-medium">design-mockup.fig</span>
                          </p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tasks Tab with Edit Functionality */}
            <TabsContent value="tasks" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Project Tasks</h2>
                <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="assignee">Assignee</Label>
                        <Select
                          value={newTask.assignee}
                          onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select team member" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamMembers.map(member => (
                              <SelectItem key={member.id} value={member.name}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddTask}>Add Task</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      {editingTask === task.id ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={task.title}
                            onChange={(e) => handleUpdateTask(task.id, { title: e.target.value })}
                          />
                          <Select
                            value={task.assignee}
                            onValueChange={(value) => handleUpdateTask(task.id, { assignee: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map(member => (
                                <SelectItem key={member.id} value={member.name}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="date"
                            value={task.dueDate}
                            onChange={(e) => handleUpdateTask(task.id, { dueDate: e.target.value })}
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingTask(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => setEditingTask(null)}
                            >
                              <Check className="h-4 w-4 mr-1" /> Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Assigned to: {task.assignee}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Due: {task.dueDate}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={task.status}
                              onValueChange={(value) => handleUpdateTask(task.id, { status: value })}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingTask(task.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Team Tab with Add Member Dialog */}
            <TabsContent value="team" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Team Members</h2>
                <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Team Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newTeamMember.name}
                          onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={newTeamMember.role}
                          onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsTeamDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddTeamMember}>Add Member</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.role}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="p-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddNote}>Add Note</Button>
                </div>
                <div className="space-y-4">
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-sm">{note.author}</div>
                          <div className="text-xs text-muted-foreground">{note.date}</div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="border-l">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Project Progress</h3>
              <Progress value={75} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">75% Completed</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm">Sarah completed homepage design</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

