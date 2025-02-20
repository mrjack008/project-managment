"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for events
const initialEvents = [
  {
    id: 1,
    title: "Website Redesign Review",
    date: "2024-02-15",
    startTime: "10:00",
    endTime: "11:30",
    type: "meeting",
    project: "Website Redesign",
  },
  {
    id: 2,
    title: "Mobile App Sprint Planning",
    date: "2024-02-12",
    startTime: "14:00",
    endTime: "15:30",
    type: "internal",
    project: "Mobile App Dev",
  },
  {
    id: 3,
    title: "Marketing Campaign Launch",
    date: "2024-02-20",
    startTime: "09:00",
    endTime: "10:00",
    type: "meeting",
    project: "Marketing Campaign",
  }
]

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  type: string
  project: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isNewEventOpen, setIsNewEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    project: ""
  })

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.startTime && newEvent.endTime) {
      const event = {
        id: events.length + 1,
        ...newEvent,
      }
      setEvents([...events, event])
      setNewEvent({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        type: "",
        project: ""
      })
      setIsNewEventOpen(false)
    }
  }

  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <div className="text-sm text-muted-foreground">
            Schedule and manage your meetings, tasks, and events
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border">
            <Button variant="ghost" className="rounded-none rounded-l-lg">Month</Button>
            <Button variant="ghost" className="rounded-none border-l border-r">Week</Button>
            <Button variant="ghost" className="rounded-none rounded-r-lg">Day</Button>
          </div>
          <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-black/90">
                <Plus className="mr-2 h-4 w-4" /> New Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Event title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Project</Label>
                    <Select onValueChange={(value) => setNewEvent({ ...newEvent, project: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                        <SelectItem value="Mobile App Dev">Mobile App Dev</SelectItem>
                        <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsNewEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>Add Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex h-[calc(100vh-5rem)]">
        <div className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-background">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {getDaysInMonth().map((date, index) => {
              const dayEvents = getDayEvents(date)
              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    "min-h-[120px] p-2 border hover:bg-muted/50 cursor-pointer",
                    !isSameMonth(date, currentDate) && "text-muted-foreground bg-muted/50",
                    isSameDay(date, selectedDate) && "bg-muted"
                  )}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="text-sm">{format(date, "d")}</span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded bg-primary/10 truncate"
                      >
                        {event.startTime} - {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-80 border-l p-6">
          <h3 className="font-semibold mb-4">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          {getDayEvents(selectedDate).length > 0 ? (
            <div className="space-y-4">
              {getDayEvents(selectedDate).map((event) => (
                <Card key={event.id} className="p-3">
                  <div className="space-y-1">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.startTime} - {event.endTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Project: {event.project}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No events scheduled for this day
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 