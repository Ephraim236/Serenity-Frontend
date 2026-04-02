import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Clock, 
  Tag,
  Grid,
  List as ListIcon,
  X,
  Upload,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { getAuthToken } from "../contexts/AuthContext";

// API URL helper - always use deployed API for reliability
const getApiUrl = () => {
  // For image uploads, use the deployed backend
  return 'https://serenity-gamma-two.vercel.app';
};

interface Service {
  _id: string;
  name: string;
  description?: string;
  category: string;
  duration: number;
  price: number;
  image?: string;
  isActive: boolean;
}

const CATEGORIES = [
  { value: 'spa', label: 'Spa' },
  { value: 'hair', label: 'Hair' },
  { value: 'nails', label: 'Nails' },
  { value: 'massage', label: 'Massage' },
  { value: 'skin', label: 'Skin Care' },
];

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'spa',
    duration: 60,
    price: 0,
    image: ''
  });
  
  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = getAuthToken();
      const response = await fetch(`${getApiUrl()}/api/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        setImagePreview(`${getApiUrl()}${data.url}`);
        toast.success('Image uploaded successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Clear uploaded image
  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview(null);
  };

  const fetchServices = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${getApiUrl()}/api/services`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${getApiUrl()}/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setServices(services.filter(s => s._id !== id));
        toast.success("Service deleted successfully");
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete service");
    }
  };

  const toggleStatus = async (service: Service) => {
    const newStatus = !service.isActive;
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${getApiUrl()}/api/services/${service._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: newStatus })
      });
      
      if (response.ok) {
        setServices(services.map(s => 
          s._id === service._id ? { ...s, isActive: newStatus } : s
        ));
        toast.success(newStatus ? "Service enabled" : "Service disabled");
      } else {
        toast.error("Failed to update service status");
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error("Failed to update service status");
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: 'spa',
      duration: 60,
      price: 0,
      image: ''
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      category: service.category,
      duration: service.duration,
      price: service.price,
      image: service.image || ''
    });
    // Set image preview if the service has an image
    if (service.image) {
      // Check if it's a URL or a local upload path
      if (service.image.startsWith('http') || service.image.startsWith('/uploads')) {
        setImagePreview(`${getApiUrl()}${service.image}`);
      } else {
        setImagePreview(service.image);
      }
    } else {
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      const url = editingService 
        ? `${getApiUrl()}/api/services/${editingService._id}`
        : `${getApiUrl()}/api/services`;
      
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedService = await response.json();
        
        if (editingService) {
          setServices(services.map(s => 
            s._id === editingService._id ? savedService : s
          ));
          toast.success("Service updated successfully");
        } else {
          setServices([...services, savedService]);
          toast.success("Service added successfully");
        }
        
        setIsModalOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save service");
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error("Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Service Management</h1>
          <p className="text-neutral-500">Add, edit, or disable your salon's services</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-100 p-1 rounded-xl mr-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm text-violet-600' : 'text-neutral-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm text-violet-600' : 'text-neutral-500'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          <Button 
            onClick={openAddModal}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Service
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search services by name or category..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-6 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium">
          <option>All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">Loading services...</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service._id} className="p-6 border-none shadow-sm bg-white rounded-[32px] hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600">
                  <Tag className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl text-neutral-400 hover:text-violet-600 hover:bg-violet-50"
                    onClick={() => openEditModal(service)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(service._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-violet-400 tracking-wider">{service.category}</span>
                  <div className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-neutral-300'}`} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-neutral-500 line-clamp-2">{service.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-50">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{service.duration} min</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-900 justify-end">
                  <span className="text-lg font-bold">₵{service.price}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className={`w-full rounded-xl h-11 text-sm font-bold ${service.isActive ? 'border-neutral-200 text-neutral-600' : 'border-violet-600 text-violet-600'}`}
                  onClick={() => toggleStatus(service)}
                >
                  {service.isActive ? "Disable Service" : "Enable Service"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr className="text-left text-neutral-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">Service</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Duration</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service._id} className="border-b border-neutral-50 last:border-none group hover:bg-neutral-50/50 transition-colors">
                  <td className="px-8 py-4 font-bold text-neutral-900">{service.name}</td>
                  <td className="px-8 py-4 text-neutral-500 capitalize">{service.category}</td>
                  <td className="px-8 py-4 text-neutral-500">{service.duration} min</td>
                  <td className="px-8 py-4 font-bold text-violet-600">₵{service.price}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${service.isActive ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-400'}`}>
                      {service.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl text-neutral-400 hover:text-violet-600"
                        onClick={() => openEditModal(service)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl text-neutral-400 hover:text-red-600" 
                        onClick={() => handleDelete(service._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Luxury Facial"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the service..."
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₵) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Service Image</Label>
              
              {/* Image Preview */}
              {(imagePreview || formData.image) ? (
                <div className="relative w-full h-40 bg-neutral-100 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview || formData.image} 
                    alt="Service preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* File Upload Area */
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-violet-500 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-sm text-neutral-500">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                        <span className="text-sm text-neutral-500">Click to upload image</span>
                        <span className="text-xs text-neutral-400 mt-1">PNG, JPG, GIF, WEBP (max 5MB)</span>
                      </div>
                    )}
                  </label>
                </div>
              )}
              
              {/* URL Input as fallback */}
              <div className="mt-2">
                <Label htmlFor="image-url" className="text-xs text-neutral-500">Or paste image URL:</Label>
                <Input
                  id="image-url"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-violet-600 hover:bg-violet-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
