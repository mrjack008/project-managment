"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Smartphone, Edit, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { io } from "socket.io-client"
import Image from "next/image"

interface Contact {
  name: string;
  number: string;
  isEditing?: boolean;
}

export function WhatsAppImport() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactLimit, setContactLimit] = useState(10)
  const { toast } = useToast()
  const socket = io("http://localhost:3001")

  useEffect(() => {
    console.log('Setting up socket listeners');
    
    socket.on('qrCode', (qrImage: string) => {
      console.log('Received QR code');
      setQrCode(qrImage)
      setIsConnecting(false)
    })

    socket.on('authenticated', (status: boolean) => {
      console.log('Received authentication status:', status)
      setIsAuthenticated(status)
      setIsConnecting(false)
      if (status) {
        fetchContacts()
      }
    })

    // Check initial status
    socket.emit('checkStatus')

    return () => {
      socket.off('qrCode')
      socket.off('authenticated')
    }
  }, [])

  const handleConnect = async () => {
    console.log('Connecting to WhatsApp...')
    setIsConnecting(true)
    try {
      const response = await fetch('http://localhost:3001/api/whatsapp/start', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to start WhatsApp connection')
      }
      
      const data = await response.json()
      console.log('Connection response:', data)
    } catch (error) {
      console.error('Connection error:', error)
      toast({
        title: "Error",
        description: "Failed to connect to WhatsApp",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/whatsapp/contacts?limit=${contactLimit}`)
      const data = await response.json()
      if (data.contacts) {
        setContacts(data.contacts.map((contact: Contact) => ({
          ...contact,
          isEditing: false
        })))
        toast({
          title: "Success",
          description: `Imported ${data.contacts.length} contacts from WhatsApp`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (index: number) => {
    setContacts(contacts.map((contact, i) => ({
      ...contact,
      isEditing: i === index ? !contact.isEditing : contact.isEditing
    })))
  }

  const handleUpdate = (index: number, field: 'name' | 'number', value: string) => {
    setContacts(contacts.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    ))
  }

  const handleAddNew = () => {
    setContacts([...contacts, { name: '', number: '', isEditing: true }])
  }

  // Save contacts locally
  const handleSaveContacts = () => {
    // Here you can implement any local storage logic if needed
    toast({
      title: "Success",
      description: "Contacts saved locally!",
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Smartphone className="mr-2 h-4 w-4" />
          Import from WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import WhatsApp Contacts</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isAuthenticated ? (
            <div className="grid gap-4">
              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>Connect WhatsApp</>
                )}
              </Button>
              {qrCode && (
                <div className="flex justify-center">
                  <Image src={qrCode} alt="QR Code" width={200} height={200} />
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="contactLimit">Number of Contacts</Label>
                  <Input
                    type="number"
                    id="contactLimit"
                    value={contactLimit}
                    onChange={(e) => setContactLimit(Number(e.target.value))}
                    min={1}
                    max={50}
                  />
                </div>
                <Button onClick={fetchContacts} className="mt-auto">
                  Fetch
                </Button>
              </div>

              {contacts.length > 0 && (
                <div className="grid gap-4 max-h-[300px] overflow-y-auto">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="grid gap-2 flex-1">
                        {contact.isEditing ? (
                          <>
                            <Input
                              value={contact.name}
                              onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                              placeholder="Name"
                            />
                            <Input
                              value={contact.number}
                              onChange={(e) => handleUpdate(index, 'number', e.target.value)}
                              placeholder="Number"
                            />
                          </>
                        ) : (
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-gray-500">{contact.number}</div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={handleAddNew} variant="outline" className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Add New Contact
              </Button>

              <Button onClick={handleSaveContacts} variant="default" className="mt-4">
                Save Contacts
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 