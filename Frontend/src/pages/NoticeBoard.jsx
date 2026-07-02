import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/navbar";
import { FiCalendar, FiUser } from "react-icons/fi";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/api/supervisor/seeNotice");
        setNotices(res.data.notices || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch notices");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-richblue-5 to-pure-greys-5 pt-28 px-4 pb-10">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-richblue-400">
              Hostel Notice Board
            </h2>
            <p className="text-sm text-pure-greys-400 mt-1">
              Important announcements and hostel updates
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-pure-greys-400">Loading notices...</div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-pink-5 border border-pink-50 text-pink-400 p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && notices.length === 0 && (
            <div className="bg-white border border-pure-greys-25 p-6 text-center text-pure-greys-400 rounded-md">
              No notices available at the moment.
            </div>
          )}

          {/* Notices */}
          <div className="space-y-6">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white border border-pure-greys-25 rounded-md shadow-sm hover:shadow-md transition"
              >
                <div className="p-6">

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-richblue-400 break-words">
                    {notice.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-xs text-pure-greys-400 mt-2">
                    <span className="flex items-center gap-1">
                      <FiUser />
                      {notice.publishedBy?.name || "Hostel Administration"}
                    </span>

                    <span className="flex items-center gap-1">
                      <FiCalendar />
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>

                    {notice.expiryDate && (
                      <span className="text-pink-400 font-medium">
                        Expires on{" "}
                        {new Date(notice.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="
                    mt-4
                    text-sm
                    text-pure-greys-600
                    leading-relaxed
                    break-all
                    whitespace-pre-wrap
                    overflow-hidden
                  ">
                    {notice.description}
                  </p>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
