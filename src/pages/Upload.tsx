
import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload as UploadIcon, X, Image, Check, FolderPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadPhoto } from "@/services/photoService";
import { getUserEvents } from "@/services/eventService";
import { Label } from "@/components/ui/label";

const Upload = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search);
  const eventIdFromQuery = query.get('eventId');
  
  const [files, setFiles] = useState<Array<File & { preview?: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(eventIdFromQuery);
  
  const { user } = useAuth();

  // Fetch user's events
  const { data: events } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await getUserEvents(user.id);
    },
    enabled: !!user
  });
  
  // Set selected event from URL query parameter
  useEffect(() => {
    if (eventIdFromQuery) {
      setSelectedEventId(eventIdFromQuery);
    }
  }, [eventIdFromQuery]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Add preview URLs to the accepted files
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview || '');
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("No files selected. Please select at least one image to upload.");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to upload files.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFiles([]);
    
    const totalFiles = files.length;
    let completedFiles = 0;
    const successfulUploads: string[] = [];
    
    for (const file of files) {
      try {
        const result = await uploadPhoto(file, user.id, selectedEventId || undefined);
        if (result) {
          successfulUploads.push(result.id);
        }
        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setUploadedFiles(successfulUploads);

    if (successfulUploads.length === totalFiles) {
      toast.success(`Successfully uploaded ${successfulUploads.length} files.`);
      
      // Redirect to event page if an event was selected
      if (selectedEventId) {
        const redirectToEvent = window.confirm("Would you like to view the event now?");
        if (redirectToEvent) {
          navigate(`/events/${selectedEventId}`);
          return;
        }
      }
    } else if (successfulUploads.length > 0) {
      toast.warning(`Uploaded ${successfulUploads.length} of ${totalFiles} files. Some uploads failed.`);
    } else {
      toast.error("Failed to upload files. Please try again.");
    }

    setIsUploading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Photos</h1>
        <p className="mt-1 text-muted-foreground">
          Drag and drop your event photos to get started
        </p>
      </div>
      
      {/* Event Selection */}
      <div className="space-y-2">
        <Label htmlFor="event-select">Choose an event (optional)</Label>
        <div className="flex gap-2 items-center">
          <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an event (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No specific event</SelectItem>
              {events?.map(event => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/events')}
            title="Create new event"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-lg font-medium text-foreground">
          {isDragActive ? "Drop the files here..." : "Drag & drop images here"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or click to select files from your computer
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          Select Files
        </Button>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">
              Selected Photos ({files.length})
            </h2>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                Clear All
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload All"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  {uploadedFiles.includes(file.name) && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="mt-1 text-xs text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
