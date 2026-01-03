"use client";

// Force dynamic rendering to prevent build-time Firebase initialization
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import { Report, ReportStatus, UrgencyLevel } from "@/types";
import { LogOut, Eye, Filter, X, FileText, Clock, AlertCircle, LayoutGrid, List as ListIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Card from "../../components/Card";
import Button from "../../components/Button";

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "All">("All");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | "All">("All");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

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
        return "bg-red-100 text-red-800 border-red-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-[#e6f4f8] text-[#116aae]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyIcon = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case "High":
        return <AlertCircle className="w-4 h-4" />;
      case "Medium":
        return <Clock className="w-4 h-4" />;
      case "Low":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const clearFilters = () => {
    setStatusFilter("All");
    setUrgencyFilter("All");
  };

  const hasActiveFilters = statusFilter !== "All" || urgencyFilter !== "All";

  const stats = {
    total: reports.length,
    new: reports.filter(r => r.status === "New").length,
    inProgress: reports.filter(r => r.status === "In Progress").length,
    resolved: reports.filter(r => r.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0f9fc] to-[#e6f4f8] background-pattern background-grid flex flex-col">
      {/* Single Header with Dashboard Info */}
      <header className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
              <Image
                src="/OpenLine (Icon and Word Logo).png"
                alt="OpenLine Logo"
                width={180}
                height={50}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </Link>
            
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden md:block text-right">
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-600">
                  Welcome, <span className="font-medium text-[#116aae]">{user?.email}</span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Dashboard Title */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome, <span className="font-medium text-[#116aae]">{user?.email}</span>
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-[#116aae]/5 to-[#0da2cb]/5 border border-[#116aae]/20">
              <div className="text-3xl font-bold text-[#116aae] mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600 font-medium">Total Reports</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-1">{stats.new}</div>
              <div className="text-sm text-gray-600 font-medium">New</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.inProgress}</div>
              <div className="text-sm text-gray-600 font-medium">In Progress</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.resolved}</div>
              <div className="text-sm text-gray-600 font-medium">Resolved</div>
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <Card variant="elevated" className="p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">Filters:</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "All")}
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-sm bg-white"
                >
                  <option value="All">All</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Urgency:</label>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value as UrgencyLevel | "All")}
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-sm bg-white"
                >
                  <option value="All">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}

              <div className="text-sm text-gray-600">
                Showing {filteredReports.length} of {reports.length} reports
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-[#116aae] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                aria-label="List view"
              >
                <ListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "card"
                    ? "bg-white text-[#116aae] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                aria-label="Card view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Reports Display */}
        {loading ? (
          <Card variant="elevated" className="p-12 text-center">
            <p className="text-gray-600">Loading reports...</p>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card variant="elevated" className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No reports found</p>
            <p className="text-gray-500 text-sm mt-2">
              {hasActiveFilters ? "Try adjusting your filters" : "Reports will appear here once submitted"}
            </p>
          </Card>
        ) : viewMode === "list" ? (
          /* List View */
          <Card variant="elevated" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Access Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Urgency</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono font-semibold text-gray-900">{report.accessCode}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{report.category}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                          {report.urgency}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <Link href={`/admin/reports/${report.id}`}>
                          <Button size="sm" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id} variant="elevated" hover className="p-5 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-bold text-[#116aae] text-sm">{report.accessCode}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                        {getUrgencyIcon(report.urgency)}
                        {report.urgency}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{report.category}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(report.createdAt)}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold whitespace-nowrap ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {formatDate(report.createdAt)}
                  </div>
                  <Link href={`/admin/reports/${report.id}`}>
                    <Button size="sm" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
