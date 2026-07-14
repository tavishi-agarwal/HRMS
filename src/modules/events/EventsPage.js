import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUpcomingEvents, createEvent, updateEvent, deleteEvent } from "@/services/event.service";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", eventDate: "", eventType: "", description: "" });

  const hasAccess = user?.role === "HR" || user?.role === "ADMIN";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getUpcomingEvents();
      setEvents(res || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch events");
    }
    setLoading(false);
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditMode(true);
      setFormData({
        id: event.id,
        name: event.name,
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : "",
        eventType: event.eventType,
        description: event.description,
      });
    } else {
      setEditMode(false);
      setFormData({ id: null, name: "", eventDate: "", eventType: "", description: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ id: null, name: "", eventDate: "", eventType: "", description: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null,
      };

      if (editMode) {
        await updateEvent(formData.id, payload);
      } else {
        await createEvent(payload);
      }
      handleCloseModal();
      fetchEvents();
    } catch (err) {
      console.error("Failed to save event:", err);
      alert("Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert("Failed to delete event");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="p-8 text-center">Loading events...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upcoming Events</h1>
        {hasAccess && (
          <button 
            onClick={() => handleOpenModal()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            + Add Event
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          No upcoming events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div key={evt.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{evt.name}</h3>
                  <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full mt-1">
                    {evt.eventType}
                  </span>
                </div>
                {hasAccess && (
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(evt)} className="text-gray-400 hover:text-indigo-600">
                      <span className="material-icons text-sm">edit</span>
                    </button>
                    <button onClick={() => handleDelete(evt.id)} className="text-gray-400 hover:text-red-600">
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="text-gray-600 text-sm mb-4 line-clamp-3">
                {evt.description}
              </div>
              
              <div className="flex items-center text-gray-500 text-sm mt-auto pt-4 border-t border-gray-50">
                <span className="material-icons text-base mr-2">event</span>
                {formatDate(evt.eventDate)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Event" : "Add Event"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input 
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input 
                  type="datetime-local" name="eventDate" required
                  value={formData.eventDate} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select 
                  name="eventType" required
                  value={formData.eventType} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Celebration">Celebration</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Training">Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" rows="3"
                  value={formData.description} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                ></textarea>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button 
                  type="button" onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
