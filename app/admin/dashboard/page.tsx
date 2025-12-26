"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Report, ReportStatus, UrgencyLevel } from "@/types";
import { LogOut, Eye, Filter, X, Home } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "All">("All");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | "All">("All");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const reportsData: Report[] = [];
        querySnapshot.forEach((doc) => {
          reportsData.push({
            id: doc.id,
            ...doc.data(),
          } as Report);
        });

        setReports(reportsData);
      } catch (error: any) {
        console.error("Error fetching reports:", error);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/admin/login");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const filteredReports = reports.filter((report) => {
    const statusMatch = statusFilter === "All" || report.status === statusFilter;
    const urgencyMatch = urgencyFilter === "All" || report.urgency === urgencyFilter;
    return statusMatch && urgencyMatch;
  });

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "New":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearFilters = () => {
    setStatusFilter("All");
    setUrgencyFilter("All");
  };

  const hasActiveFilters = statusFilter !== "All" || urgencyFilter !== "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-xs md:text-sm transition-colors"
            >
              <Home className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Back to Home</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-xs md:text-sm"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
                Welcome, {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-4 md:py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 mb-4 md:mb-5">
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <span className="text-xs md:text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <div>
              <label className="text-xs md:text-sm text-gray-600 mr-1.5 md:mr-2">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "All")}
                className="px-2.5 md:px-3 py-1 md:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs md:text-sm"
              >
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="text-xs md:text-sm text-gray-600 mr-1.5 md:mr-2">Urgency:</label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value as UrgencyLevel | "All")}
                className="px-2.5 md:px-3 py-1 md:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs md:text-sm"
              >
                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2.5 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Clear
              </button>
            )}

            <div className="ml-auto text-xs md:text-sm text-gray-600">
              Showing {filteredReports.length} of {reports.length} reports
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 md:p-12 text-center">
              <p className="text-sm md:text-base text-gray-600">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <p className="text-sm md:text-base text-gray-600">No reports found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Access Code
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Urgency
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-900">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 whitespace-nowrap">
                        <span className="font-mono text-xs md:text-sm font-medium text-gray-900">
                          {report.accessCode}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-900">
                        {report.category}
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 whitespace-nowrap">
                        <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                          {report.urgency}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 whitespace-nowrap">
                        <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/admin/reports/${report.id}`)}
                          className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs md:text-sm"
                        >
                          <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

