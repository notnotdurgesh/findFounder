import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Building2, Briefcase, Users, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchStartups = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [founders, setFounders] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    limit: 10
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (id) => {
    router.push(`/company/${id}`);
  };

  const fetchFounders = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        search: searchQuery,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/developer/founders?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch founders");

      const data = await response.json();
      setFounders(data.founders);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching founders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFounders();
  }, [searchQuery, page]);

  const EmptyState = () => (
    <div className="text-center py-12">
      <Building2 className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No startups found</h3>
      <p className="mt-2 text-sm text-gray-500">
        Try adjusting your search terms or browse all available startups
      </p>
    </div>
  );

  const LoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search startups by name, industry, or tech stack..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {pagination.total > 0 && (
        <div className="text-sm text-gray-500">
          Showing {founders.length} of {pagination.total} startups
        </div>
      )}

      {isLoading ? (
        <LoadingState />
      ) : founders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {founders.map((founder) => (
            <Card key={founder._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="font-semibold text-xl text-gray-50">
                        {founder.startupName}
                      </h3>
                      <p className="text-sm text-gray-500">{founder.name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {founder.industry?.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {founder.industry.join(", ")}
                          </span>
                        </div>
                      )}
                      
                      {founder.teamMembers?.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {founder.teamMembers.length} team members
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {founder.logo ? (
                    <img
                      src={founder.logo}
                      alt={`${founder.startupName} logo`}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-400 p-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-black" />
                    <span className="text-sm text-black">
                      Joined {new Date(founder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button variant="outline" onClick={() => {handleNavigate(founder._id)}}>View Company</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(pagination.pages, prev + 1))}
            disabled={page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchStartups;