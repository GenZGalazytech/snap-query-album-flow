
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { CalendarIcon, Plus, MoreHorizontal, Share, Trash, Edit, Calendar as CalendarIcon2, MapPin, Image, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { createEvent, getUserEvents, deleteEvent, createShareableLink } from "@/services/eventService";
import { toast } from "sonner";

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [requiresFaceAuth, setRequiresFaceAuth] = useState(false);
  
  // Form state
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [isPublic, setIsPublic] = useState(false);
  
  // Fetch user's events
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getUserEvents(user.id);
    },
    enabled: !!user
  });
  
  // Create new event
  const createEventMutation = useMutation({
    mutationFn: async () => {
      if (!user || !eventName || !eventDate) return null;
      
      return await createEvent(
        eventName,
        eventDate.toISOString(),
        user.id,
        eventDescription,
        eventLocation,
        isPublic
      );
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['events', user?.id] });
        toast.success("Event created successfully!");
        resetForm();
        setNewEventOpen(false);
      }
    },
    onError: (error) => {
      console.error("Create event error:", error);
      toast.error("Failed to create event. Please try again.");
    }
  });
  
  // Delete event
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return await deleteEvent(eventId);
    },
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['events', user?.id] });
        toast.success("Event deleted successfully!");
      }
    },
    onError: (error) => {
      console.error("Delete event error:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  });
  
  // Create shareable link
  const createShareLinkMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedEvent) return null;
      
      return await createShareableLink(selectedEvent, user.id, requiresFaceAuth);
    },
    onSuccess: (shareCode) => {
      if (shareCode) {
        const link = `${window.location.origin}/shared/${shareCode}`;
        setShareLink(link);
        toast.success("Shareable link created!");
      }
    },
    onError: (error) => {
      console.error("Create share link error:", error);
      toast.error("Failed to create shareable link. Please try again.");
    }
  });
  
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate();
  };
  
  const handleOpenShareDialog = (eventId: string) => {
    setSelectedEvent(eventId);
    setShareLink(null);
    setRequiresFaceAuth(false);
    setShareDialogOpen(true);
  };
  
  const handleCreateShareLink = () => {
    createShareLinkMutation.mutate();
  };
  
  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    }
  };
  
  const resetForm = () => {
    setEventName("");
    setEventDescription("");
    setEventLocation("");
    setEventDate(new Date());
    setIsPublic(false);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="mt-1 text-muted-foreground">
            Organize and manage your photo events
          </p>
        </div>
        
        <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateEvent}>
              <DialogHeader>
                <DialogTitle>Create new event</DialogTitle>
                <DialogDescription>
                  Enter the details for your new photo event.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="name" className="col-span-4">
                    Event Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Wedding, Birthday, Vacation, etc."
                    className="col-span-4"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="date" className="col-span-4">
                    Event Date
                  </Label>
                  <div className="col-span-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !eventDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={eventDate}
                          onSelect={setEventDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="location" className="col-span-4">
                    Location (optional)
                  </Label>
                  <Input
                    id="location"
                    placeholder="Event location"
                    className="col-span-4"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="description" className="col-span-4">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Event description"
                    className="col-span-4"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="public">Make this event public</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNewEventOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!eventName || !eventDate || createEventMutation.isPending}
                >
                  {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden group">
              <div className="relative h-48 bg-muted">
                {event.cover_image_url ? (
                  <img
                    src={event.cover_image_url}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenShareDialog(event.id)}
                      >
                        <Share className="mr-2 h-4 w-4" />
                        Share Event
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteEventMutation.mutate(event.id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                {event.description && (
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon2 className="mr-2 h-4 w-4" />
                    {format(new Date(event.date), "PPP")}
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Image className="mr-2 h-4 w-4" />
                    {event.photo_count} {event.photo_count === 1 ? "photo" : "photos"}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex justify-between items-center w-full">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/upload?eventId=${event.id}`)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Photos
                  </Button>
                  
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Event
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <CalendarIcon2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No events yet</h3>
          <p className="mt-1 text-muted-foreground">Create your first event to start organizing photos</p>
          <Button className="mt-4" onClick={() => setNewEventOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create an Event
          </Button>
        </div>
      )}
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Event</DialogTitle>
            <DialogDescription>
              Create a shareable link to let others view this event.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!shareLink ? (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="face-auth"
                    checked={requiresFaceAuth}
                    onCheckedChange={setRequiresFaceAuth}
                  />
                  <Label htmlFor="face-auth">
                    Require face authentication
                  </Label>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {requiresFaceAuth 
                    ? "Viewers will need to upload a selfie to access photos that have their face in them."
                    : "Anyone with the link can view all photos in this event."}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyShareLink}
                  >
                    Copy
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {requiresFaceAuth 
                    ? "This link will require face authentication for photo access."
                    : "Anyone with this link can view all photos in this event."}
                </p>
              </>
            )}
          </div>
          
          <DialogFooter>
            {!shareLink ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setShareDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateShareLink}
                  disabled={createShareLinkMutation.isPending}
                >
                  {createShareLinkMutation.isPending ? "Creating..." : "Create Link"}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setShareDialogOpen(false)}
              >
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
