
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Share, Download, Grid, LayoutGrid, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Mock album data based on ID
const getAlbumData = (id: string) => {
  const albums = {
    "1": {
      id: "1",
      title: "Wedding of Sarah & John",
      date: "April 15, 2025",
      location: "Sunset Gardens, California",
      description: "Beautiful spring wedding with close family and friends.",
      photos: Array(16).fill(null).map((_, i) => ({
        id: `photo-${i}`,
        url: `https://picsum.photos/800/600?random=${i + 10}`,
        title: `Wedding Photo ${i + 1}`,
      })),
    },
    "2": {
      id: "2",
      title: "Corporate Event",
      date: "March 22, 2025",
      location: "Grand Hotel Conference Center",
      description: "Annual company meetup with presentations and team-building activities.",
      photos: Array(12).fill(null).map((_, i) => ({
        id: `photo-${i}`,
        url: `https://picsum.photos/800/600?random=${i + 30}`,
        title: `Corporate Event Photo ${i + 1}`,
      })),
    },
    "3": {
      id: "3",
      title: "Birthday Party",
      date: "February 10, 2025",
      location: "Central Park",
      description: "Outdoor birthday celebration with games and activities.",
      photos: Array(8).fill(null).map((_, i) => ({
        id: `photo-${i}`,
        url: `https://picsum.photos/800/600?random=${i + 50}`,
        title: `Birthday Photo ${i + 1}`,
      })),
    },
  };

  return albums[id as keyof typeof albums] || null;
};

const AlbumView = () => {
  const { id } = useParams<{ id: string }>();
  const album = getAlbumData(id || "");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const [showAddPhotosDialog, setShowAddPhotosDialog] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  if (!album) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Album not found</h2>
        <p className="mt-2 text-gray-500">
          The album you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/albums">
          <Button className="mt-4">Return to albums</Button>
        </Link>
      </div>
    );
  }

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId) 
        : [...prev, photoId]
    );
  };

  const handleShareAlbum = () => {
    // Simulate copying a share link to clipboard
    navigator.clipboard.writeText(`https://example.com/shared-albums/${album.id}`);
    toast({
      title: "Share link copied",
      description: "Album share link has been copied to clipboard",
    });
  };

  const handleDownloadSelected = () => {
    if (selectedPhotos.length === 0) {
      toast({
        title: "No photos selected",
        description: "Please select at least one photo to download",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Downloading photos",
      description: `${selectedPhotos.length} photos will be downloaded`,
    });

    // Clear selection after download
    setSelectedPhotos([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link to="/albums" className="mr-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{album.title}</h1>
            <p className="text-gray-500">{album.date} • {album.photos.length} photos</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleShareAlbum}>
                <Share className="mr-2 h-4 w-4" />
                <span>Share Album</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Coming soon", description: "This feature is under development" })}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download All</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="bg-gray-100 rounded-md p-1 flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "masonry" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("masonry")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <Dialog open={showAddPhotosDialog} onOpenChange={setShowAddPhotosDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Photos</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Photos to Album</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500">
                    Drag and drop photos here or click to browse
                  </p>
                  <Button className="mt-4" variant="outline">
                    Select Photos
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddPhotosDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setShowAddPhotosDialog(false);
                  toast({
                    title: "Coming soon",
                    description: "This feature is under development",
                  });
                }}>
                  Add to Album
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-700">{album.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          Location: {album.location}
        </p>
      </div>

      {selectedPhotos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
          <p className="text-blue-800">
            {selectedPhotos.length} photo{selectedPhotos.length > 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedPhotos([])}>
              Cancel
            </Button>
            <Button onClick={handleDownloadSelected}>
              <Download className="mr-2 h-4 w-4" />
              Download Selected
            </Button>
          </div>
        </div>
      )}

      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          : "columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4"
      }>
        {album.photos.map((photo) => (
          <div 
            key={photo.id} 
            className={`group relative ${viewMode === "masonry" ? "break-inside-avoid mb-4" : ""}`}
            onClick={() => togglePhotoSelection(photo.id)}
          >
            <div className={`
              relative rounded-lg overflow-hidden border border-gray-200
              ${selectedPhotos.includes(photo.id) ? "ring-2 ring-blue-500" : ""}
            `}>
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-auto object-cover"
              />
              <div className={`
                absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200
                ${selectedPhotos.includes(photo.id) ? "bg-opacity-10" : ""}
              `}></div>
              <div className={`
                absolute top-2 right-2 h-5 w-5 rounded-full border-2 border-white
                ${selectedPhotos.includes(photo.id) 
                  ? "bg-blue-500" 
                  : "bg-transparent group-hover:bg-white/50"}
              `}>
                {selectedPhotos.includes(photo.id) && (
                  <svg className="h-full w-full text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumView;
