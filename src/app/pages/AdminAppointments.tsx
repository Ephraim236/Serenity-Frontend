import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Search, 
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const APPOINTMENTS = [
  { id: 1, client: "Alice Freeman", service: "Luxury Facial", time: "09:00 AM", specialist: "Sarah J.", status: "completed", price: "$85", email: "alice@example.com", phone: "(555) 001-2233" },
  { id: 2, client: "John Doe", service: "Designer Haircut", time: "10:30 AM", specialist: "Emma W.", status: "confirmed", price: "$65", email: "john@example.com", phone: "(555) 001-4455" },
  { id: 3, client: "Samanta Smith", service: "Deep Tissue", time: "11:45 AM", specialist: "Michael C.", status: "confirmed", price: "$120", email: "sam@example.com", phone: "(555) 001-6677" },
  { id: 4, client: "Robert Pattinson", service: "Hot Stone Therapy", time: "01:30 PM", specialist: "Michael C.", status: "pending", price: "$140", email: "rob@example.com", phone: "(555) 001-8899" },
  { id: 5, client: "Emily Blunt", service: "Manicure", time: "03:00 PM", specialist: "David L.", status: "confirmed", price: "$45", email: "emily@example.com", phone: "(555) 002-1122" },
  { id: 6, client: "Tom Hardy", service: "Beard Trim", time: "04:15 PM", specialist: "Emma W.", status: "cancelled", price: "$35", email: "tom@example.com", phone: "(555) 002-3344" },
];

export function AdminAppointments() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = APPOINTMENTS.filter(apt => 
    apt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - Calendar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="p-4 border-none shadow-sm bg-white rounded-3xl overflow-hidden">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
            />
          </Card>

          <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
            <h4 className="font-bold mb-4">Summary for Today</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Total Bookings</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Confirmed</span>
                <span className="font-bold text-green-600">8</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Pending</span>
                <span className="font-bold text-amber-600">3</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Cancelled</span>
                <span className="font-bold text-red-600">1</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Content - Appointments List */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {date ? format(date, 'MMMM do, yyyy') : "Appointments"}
              </h1>
              <p className="text-neutral-500">Manage and view all bookings for this day</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search client..." 
                  className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-xl shrink-0">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => (
                <Card key={apt.id} className="p-6 border-none shadow-sm bg-white rounded-3xl group hover:ring-2 hover:ring-indigo-100 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] uppercase font-bold text-indigo-400">Time</span>
                        <span className="font-bold text-indigo-700 text-xs">{apt.time.split(' ')[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{apt.client}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-neutral-500">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {apt.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {apt.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Service</p>
                        <p className="font-bold text-sm">{apt.service}</p>
                        <p className="text-neutral-500 text-xs">{apt.price}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Specialist</p>
                        <p className="font-bold text-sm">{apt.specialist}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Status</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                          apt.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          apt.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl h-10 px-4">Edit</Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-neutral-100">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="font-bold text-xl mb-2">No appointments found</h3>
                <p className="text-neutral-400">Try adjusting your search or selected date</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
