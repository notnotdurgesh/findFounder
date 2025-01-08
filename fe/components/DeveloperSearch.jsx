import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';


const DeveloperSearch = () => {
  const router = useRouter(); // Use Next.js router

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sort: 'recent',
    minExperience: '',
    maxExperience: '',
    location: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0
  });

  const handleProfileView = (id) => {
    if (router) {
      router.push(`/developer/${id}`);
    }
  };


  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      const queryParams = new URLSearchParams({
        ...filters,
        search: searchQuery
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/founder/developers/all?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch developers');
      }

      const data = await response.json();
      setDevelopers(data.developers);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchDevelopers();
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Developers</CardTitle>
        <CardDescription>Find potential technical co-founders based on skills and experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search and Filters */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Search by name, skills, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                value={filters.sort}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value, page: 1 }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Min Experience (years)"
                value={filters.minExperience}
                onChange={(e) => setFilters(prev => ({ ...prev, minExperience: e.target.value, page: 1 }))}
              />
              <Input
                type="number"
                placeholder="Max Experience (years)"
                value={filters.maxExperience}
                onChange={(e) => setFilters(prev => ({ ...prev, maxExperience: e.target.value, page: 1 }))}
              />
            </div>
            <Button type="submit" className="w-full md:w-auto">Search</Button>
          </form>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <div className="space-y-4">
              {/* Developers List */}
              <div className="grid gap-4">
                {developers.map((dev) => (
                  <Card key={dev._id} className="p-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{dev.name}</h3>
                        <p className="text-sm text-gray-500">{dev.title}</p>
                        <p className="text-sm">{dev.location}</p>
                        <p className="mt-2">{dev.bio}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {dev.skills?.map((skill, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button variant="outline" onClick={() => handleProfileView(dev._id)} >View Profile</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange(filters.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {filters.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={filters.page === pagination.pages}
                    onClick={() => handlePageChange(filters.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


export default DeveloperSearch;