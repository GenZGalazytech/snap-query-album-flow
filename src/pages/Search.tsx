
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon, User, Text } from "lucide-react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("prompt");
  const [isSearching, setIsSearching] = useState(false);
  const [showPlaceholderResults, setShowPlaceholderResults] = useState(false);

  // Mock image data
  const mockImages = Array(8).fill(null).map((_, i) => ({
    id: i,
    url: `https://picsum.photos/400/300?random=${i}`,
    title: `Event Photo ${i + 1}`,
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setShowPlaceholderResults(true);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Search</h1>
        <p className="mt-1 text-gray-500">
          Find photos using face recognition or text prompts
        </p>
      </div>

      <Tabs defaultValue="prompt" onValueChange={setSearchType} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <Text className="h-4 w-4" />
            <span>Text Search</span>
          </TabsTrigger>
          <TabsTrigger value="face" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Face Recognition</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for 'people dancing', 'cake cutting', etc."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </form>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {["couple dancing", "group photo", "venue decoration", "food table"].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(term);
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="face">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold">Face Recognition</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a reference photo to find matching faces
                </p>
                <div className="mt-4">
                  <Button>
                    Upload Reference Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isSearching && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Searching for "{searchQuery}"...</p>
        </div>
      )}

      {showPlaceholderResults && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Search Results</h2>
            <p className="text-sm text-gray-500">Found {mockImages.length} matching photos</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mockImages.map((image) => (
              <div key={image.id} className="group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-900">{image.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
