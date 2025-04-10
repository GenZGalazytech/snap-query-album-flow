
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Download, 
  Share, 
  MoreHorizontal, 
  ChevronLeft, 
  Trash,
  Edit,
  CalendarIcon,
  MapPin,
  Image as ImageIcon,
  GridIcon,
  ColumnsIcon,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getEventById, getEventPhotos, createShareableLink, deleteEvent } from "@/services/eventService";
import { deletePhoto, downloadEventPhotos } from "@/services/photoService";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const EventView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [requiresFaceAuth, setRequiresFaceAuth] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "columns">("grid");
  const [downloadingZip, setDownloadingZip] = useState(false);
  
  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) return null;
      return await getEventById(id);
    },
    enabled: !!id
  });
  
  // Fetch event photos
  const { data: photos, isLoading: photosLoading } = useQuery({
    queryKey: ['eventPhotos', id],
    queryFn: async () => {
      if (!id) return [];
      return await getEventPhotos(id);
    },
    enabled: !!id
  });
  
  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: async ({ photoId, storagePath }: { photoId: string, storagePath: string }) => {
      return await deletePhoto(photoId, storagePath, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventPhotos', id] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success("Photo deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete photo");
    }
  });
  
  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async () => {
      if (!id) return false;
      return await deleteEvent(id);
    },
    onSuccess: (success) => {
      if (success) {
        toast.success("Event deleted successfully");
        navigate("/events");
      }
    },
    onError: () => {
      toast.error("Failed to delete event");
    }
  });
  
  // Create shareable link
  const createShareLinkMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) return null;
      
      return await createShareableLink(id, user.id, requiresFaceAuth);
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
  
  const handlePhotoDelete = (photoId: string, storagePath: string) => {
    deletePhotoMutation.mutate({ photoId, storagePath });
  };
  
  const handleEventDelete = () => {
    if (window.confirm("Are you sure you want to delete this event? This will also delete all photos in this event.")) {
      deleteEventMutation.mutate();
    }
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
  
  const handleDownloadAll = async () => {
    if (!id) return;
    
    setDownloadingZip(true);
    try {
      const downloadUrl = await downloadEventPhotos(id);
      
      if (downloadUrl) {
        // Create a temporary link and trigger the download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${event?.name || 'event'}_photos.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast.success("Download started!");
      } else {
        toast.error("Failed to generate download link");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download photos");
    } finally {
      setDownloadingZip(false);
    }
  };
  
  if (eventLoading || photosLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Event not found</h2>
        <p className="text-muted-foreground mt-2">The event you're looking for doesn't exist or you don't have access to it.</p>
        <Button className="mt-4" onClick={() => navigate("/events")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/events")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{event.name}</h1>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/events/${id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEventDelete} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline"
            onClick={() => setShareDialogOpen(true)}
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          
          <Button
            variant="default"
            onClick={handleDownloadAll}
            disabled={downloadingZip || (photos?.length || 0) === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {downloadingZip ? "Preparing..." : "Download All"}
          </Button>
        </div>
      </div>
      
      {/* Event details */}
      <div className="flex flex-wrap gap-4">
        <Badge variant="outline" className="flex items-center">
          <CalendarIcon className="mr-1 h-3 w-3" />
          {format(new Date(event.date), "PPP")}
        </Badge>
        
        {event.location && (
          <Badge variant="outline" className="flex items-center">
            <MapPin className="mr-1 h-3 w-3" />
            {event.location}
          </Badge>
        )}
        
        <Badge variant="outline" className="flex items-center">
          <ImageIcon className="mr-1 h-3 w-3" />
          {event.photo_count} {event.photo_count === 1 ? "photo" : "photos"}
        </Badge>
        
        {event.is_public && (
          <Badge variant="outline" className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            Public event
          </Badge>
        )}
      </div>
      
      {/* Photos section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Photos</h2>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={viewMode === "grid" ? "bg-muted" : ""}
              onClick={() => setViewMode("grid")}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={viewMode === "columns" ? "bg-muted" : ""}
              onClick={() => setViewMode("columns")}
            >
              <ColumnsIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(`/upload?eventId=${id}`)}
            >
              Add Photos
            </Button>
          </div>
        </div>
        
        {photos && photos.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" 
            : "columns-2 sm:columns-3 md:columns-4 gap-4"
          }>
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className={`group relative ${viewMode === "columns" ? "mb-4 break-inside-avoid" : ""}`}
              >
                <div className={`${viewMode === "grid" ? "aspect-square" : ""} rounded-lg overflow-hidden bg-muted border border-border`}>
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover transition-all group-hover:scale-105"
                    style={viewMode === "grid" ? { objectFit: "cover" } : {}}
                  />
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
                    <a href={photo.url} download={photo.name}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8"
                    onClick={() => handlePhotoDelete(photo.id, photo.storage_path)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No photos yet</h3>
            <p className="mt-1 text-muted-foreground">Upload photos to this event</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate(`/upload?eventId=${id}`)}
            >
              Upload Photos
            </Button>
          </div>
        )}
      </div>
      
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
                  <input
                    type="checkbox"
                    id="face-auth"
                    checked={requiresFaceAuth}
                    onChange={(e) => setRequiresFaceAuth(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="face-auth">
                    Require face authentication
                  </label>
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
                  <input
                    value={shareLink}
                    readOnly
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2"
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

export default EventView;
