import { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Clock, 
  DollarSign,
  Tag,
  Grid,
  List as ListIcon
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { toast } from "sonner";

const INITIAL_SERVICES = [
  { id: 1, name: "Luxury Facial", category: "Skin Care", duration: "60 min", price: 85, active: true },
  { id: 2, name: "Deep Tissue Massage", category: "Massage", duration: "90 min", price: 120, active: true },
  { id: 3, name: "Designer Haircut", category: "Hair", duration: "45 min", price: 65, active: true },
  { id: 4, name: "Manicure & Pedicure", category: "Nails", duration: "75 min", price: 75, active: true },
  { id: 5, name: "Hot Stone Therapy", category: "Massage", duration: "90 min", price: 140, active: true },
  { id: 6, name: "Beard Trim & Shape", category: "Grooming", duration: "30 min", price: 35, active: true },
];

export function AdminServices() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter(s => s.id !== id));
      toast.success("Service deleted successfully");
    }
  };

  const toggleStatus = (id: number) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
    toast.info("Service status updated");
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
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-neutral-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-neutral-500'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2">
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
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-6 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
          <option>All Categories</option>
          <option>Skin Care</option>
          <option>Massage</option>
          <option>Hair</option>
          <option>Nails</option>
          <option>Grooming</option>
        </select>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="p-6 border-none shadow-sm bg-white rounded-[32px] hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Tag className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-indigo-400 tracking-wider">{service.category}</span>
                  <div className={`w-2 h-2 rounded-full ${service.active ? 'bg-green-500' : 'bg-neutral-300'}`} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{service.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-50">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{service.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-900 justify-end">
                  <DollarSign className="w-4 h-4 text-neutral-400" />
                  <span className="text-lg font-bold">{service.price}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className={`w-full rounded-xl h-11 text-sm font-bold ${service.active ? 'border-neutral-200 text-neutral-600' : 'border-indigo-600 text-indigo-600'}`}
                  onClick={() => toggleStatus(service.id)}
                >
                  {service.active ? "Disable Service" : "Enable Service"}
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
                <tr key={service.id} className="border-b border-neutral-50 last:border-none group hover:bg-neutral-50/50 transition-colors">
                  <td className="px-8 py-4 font-bold text-neutral-900">{service.name}</td>
                  <td className="px-8 py-4 text-neutral-500">{service.category}</td>
                  <td className="px-8 py-4 text-neutral-500">{service.duration}</td>
                  <td className="px-8 py-4 font-bold text-indigo-600">${service.price}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${service.active ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-400'}`}>
                      {service.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-neutral-400 hover:text-indigo-600">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-neutral-400 hover:text-red-600" onClick={() => handleDelete(service.id)}>
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
    </div>
  );
}
