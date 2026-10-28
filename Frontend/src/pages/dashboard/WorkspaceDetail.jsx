import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  MoreVertical,
  Plus,
  Users,
  Clock,
  ChevronRight,
  Pencil,
  X,
  Check,
  Shield,
  Tag,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const WorkspaceDetail = () => {
  const [cookies] = useCookies(["user", "token"]);
  const navigate = useNavigate();
  const { id } = useParams();

  const role = cookies.user?.role || "";
  const [userWorkspaceRole, setUserWorkspaceRole] = useState(null);
  const [workspace, setWorkspace] = useState({});
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);

  // Members & Users State
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", type: "" });
  const [openModal, setOpenModal] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  // Categories & Docs State
  const [documents, setallDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUserId, setLoadingUserId] = useState(null);

  // --- 1. FETCH Work Space Documents ---
  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const res = await axios.get(
          `https://documentation-hub-h5zv.vercel.app/api/documents/${id}`,
          { withCredentials: true },
        );
        setallDocuments(res.data);
      } catch (err) {
        console.log("Docs fetch error:", err.message);
      }
    };
    if (id) fetchAllDocuments();
  }, [id]);

  // --- 2. FETCH WORKSPACE ---
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await axios.get(
          `https://documentation-hub-h5zv.vercel.app/api/workspace/${id}`,
          { withCredentials: true },
        );
        const wsData = res.data.workspace || res.data;
        setWorkspace(wsData);

        const currentUserId = cookies.user?._id;
        const members = wsData.members || [];
        const membership = members.find(
          (m) => (m.userId?._id || m.userId) === currentUserId,
        );
        if (membership) setUserWorkspaceRole(membership.role);
      } catch (err) {
        console.log("WS fetch error:", err.message);
      } finally {
        setLoadingWorkspace(false);
      }
    };
    if (id) fetchWorkspace();
  }, [id, cookies.user?._id]);

  // --- 3. MEMBERS LOGIC ---
  useEffect(() => {
    if (!openModal) return;
    const fetchUsersAndMembers = async () => {
      try {
        setLoadingMembers(true);
        const usersRes = await axios.get(
          "https://documentation-hub-h5zv.vercel.app/user/all-users",
          { withCredentials: true },
        );
        const membersRes = await axios.get(
          `https://documentation-hub-h5zv.vercel.app/api/workspace/${id}`,
          { withCredentials: true },
        );

        const allUsersData = usersRes.data.users;
        const assignedMembers = membersRes.data.members || [];

        const updatedUsers = allUsersData.map((user) => ({
          ...user,
          isAssigned: assignedMembers.some(
            (m) => (m.userId?._id || m.userId) === user._id,
          ),
        }));

        setUsers(updatedUsers);
        setAllUsers(updatedUsers);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchUsersAndMembers();
  }, [openModal, id]);

  const handleAssign = async (email, userId) => {
    try {
      setLoadingUserId(userId);

      await axios.post(
        "https://documentation-hub-h5zv.vercel.app/api/workspace/add-member",
        { workspaceId: id, email, role: "editor" },
        { withCredentials: true },
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAssigned: true } : u)),
      );
    } catch (err) {
      alert("Assign failed");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleRemoveAssign = async (userId) => {
    try {
      setLoadingUserId(userId);

      await axios.delete("https://documentation-hub-h5zv.vercel.app/api/workspace/remove-member", {
        data: { workspaceId: id, userId },
        withCredentials: true,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAssigned: false } : u)),
      );
    } catch (err) {
      alert("Remove failed");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleInviteNewUser = async () => {
    if (!inviteEmail.trim()) return;
    try {
      setIsInviting(true);
      await axios.post(
        "https://documentation-hub-h5zv.vercel.app/api/workspace/add-member",
        { workspaceId: id, email: inviteEmail, role: "editor" },
        { withCredentials: true },
      );
      setModal({
        show: true,
        message: "Invitation sent successfully!",
        type: "success",
      });
      setInviteEmail("");
    } catch (err) {
      setModal({
        show: true,
        message: err.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setIsInviting(false);
    }
  };

  // --- 4. CATEGORIES LOGIC ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `https://documentation-hub-h5zv.vercel.app/api/categories/${id}`,
          { withCredentials: true },
        );
        setCategories(res.data || []);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (id) fetchCategories();
  }, [id]);

  const createCategory = async () => {
    if (!categoryInput.trim()) return;
    try {
      const res = await axios.post(
        "https://documentation-hub-h5zv.vercel.app/api/categories/",
        { name: categoryInput, workspaceId: id },
        { withCredentials: true },
      );
      setCategories((prev) => [...prev, res.data.category]);
      setCategoryInput("");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleUpdateCategory = async (catId) => {
    if (!editingValue.trim()) return;
    try {
      const res = await axios.put(
        `https://documentation-hub-h5zv.vercel.app/api/categories/${catId}`,
        { name: editingValue },
        { withCredentials: true },
      );
      setCategories((prev) =>
        prev.map((c) => (c._id === catId ? res.data.category : c)),
      );
      setEditingCategoryId(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteCategory = async (catId) => {
    try {
      await axios.delete(`https://documentation-hub-h5zv.vercel.app/api/categories/${catId}`, {
        withCredentials: true,
      });
      setCategories((prev) => prev.filter((c) => c._id !== catId));
    } catch (err) {
      console.log(err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  const isAdminOrOwner = role === "admin" || userWorkspaceRole === "admin";

  return (
    <main className="p-8 md:p-12 bg-[#f7f9fb] min-h-screen font-['Manrope'] selection:bg-[#e3dfff]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Header Section */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#a9b4b9]/10 pb-8">
          <div className="space-y-4">
            <button
              onClick={() => navigate("/workspaces")}
              className="flex items-center gap-2 text-xs font-semibold text-[#717c82] hover:text-[#5148d7] transition-colors uppercase tracking-widest outline-none"
            >
              <ArrowLeft size={14} /> Back to Spaces
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-light tracking-tight text-[#2a3439]">
                  {workspace?.name || "Initializing..."}
                </h1>
                <span className="px-3 py-1 bg-white border border-[#a9b4b9]/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#5148d7]">
                  {workspace?.visibility}
                </span>
              </div>
              <p className="text-[#566166] max-w-2xl font-light">
                {workspace?.description || "Workspace environment active."}
              </p>
            </div>

            {/* Categories List */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center gap-2 bg-white border border-[#a9b4b9]/15 px-3 py-1.5 rounded-lg text-xs shadow-sm group transition-all hover:border-[#a9b4b9]/30"
                >
                  {editingCategoryId === cat._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="bg-transparent border-none outline-none focus:ring-0 w-20 p-0 text-xs text-[#2a3439]"
                        autoFocus
                      />
                      <Check
                        size={14}
                        className="text-emerald-500 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleUpdateCategory(cat._id)}
                      />
                    </div>
                  ) : (
                    <>
                      <Tag size={12} className="text-[#a9b4b9]" />
                      <span className="text-[#2a3439] font-medium">
                        {cat.name}
                      </span>
                      {isAdminOrOwner && (
                        <div className="hidden group-hover:flex items-center gap-1.5 ml-2 border-l pl-2 border-[#a9b4b9]/20">
                          <Pencil
                            size={12}
                            className="text-[#717c82] cursor-pointer hover:text-[#5148d7]"
                            onClick={() => {
                              setEditingCategoryId(cat._id);
                              setEditingValue(cat.name);
                            }}
                          />
                          <X
                            size={12}
                            className="text-[#717c82] cursor-pointer hover:text-red-500"
                            onClick={() => deleteCategory(cat._id)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons & Premium Category Input */}
          <div className="flex flex-wrap items-center gap-3">
            {isAdminOrOwner && (
              <div className="group flex items-center gap-1 bg-white pl-4 pr-1.5 py-1.5 rounded-full border border-[#a9b4b9]/25 shadow-sm focus-within:border-[#5148d7] focus-within:ring-4 focus-within:ring-[#5148d7]/5 transition-all duration-200 w-full sm:w-auto">
                <Tag
                  size={14}
                  className="text-[#a9b4b9] group-focus-within:text-[#5148d7] transition-colors"
                />
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="New category..."
                  className="bg-transparent border-none outline-none focus:ring-0 text-xs px-2 w-28 placeholder:text-[#a9b4b9] text-[#2a3439]"
                />
                <button
                  onClick={createCategory}
                  disabled={!categoryInput.trim()}
                  className="bg-[#5148d7] hover:bg-[#4439cb] disabled:bg-[#f0f4f7] disabled:text-[#a9b4b9] text-white p-1.5 rounded-full transition-all flex items-center justify-center active:scale-90"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            {role !== "viewer" && role !== "editor" && (
              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#a9b4b9]/20 text-xs font-semibold text-[#2a3439] hover:bg-[#f7f9fb] shadow-sm transition-all active:scale-95 outline-none focus:ring-2 focus:ring-[#5148d7]/10"
              >
                <Users size={16} className="text-[#5148d7]" /> Members
              </button>
            )}

            {role !== "viewer" && (
              <button
                onClick={() => navigate(`/docCreate/${id}`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5148d7] text-white text-xs font-semibold hover:bg-[#4439cb] shadow-md shadow-indigo-100 transition-all active:scale-95 outline-none focus:ring-2 focus:ring-[#5148d7]/30"
              >
                <Plus size={16} /> New Doc
              </button>
            )}
          </div>
        </header>

        {/* 2. Members Modal */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a3439]/20 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-[#a9b4b9]/20 animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-medium text-[#2a3439]">
                  Manage Access
                </h3>
                <X
                  className="cursor-pointer text-[#717c82] hover:text-red-500 transition-colors"
                  onClick={() => setOpenModal(false)}
                />
              </div>

              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#a9b4b9]/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#717c82] mb-3">
                    Invite via Email
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="user@docuhub.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1 bg-white border border-[#a9b4b9]/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#5148d7] focus:ring-4 focus:ring-[#5148d7]/5 transition-all"
                    />
                    <button
                      onClick={handleInviteNewUser}
                      disabled={isInviting}
                      className="bg-[#5148d7] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#4439cb] transition-colors active:scale-95 disabled:opacity-70 flex items-center justify-center"
                    >
                      {isInviting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Invite"
                      )}
                    </button>
                  </div>

                  {/* Add simple modal */}
                  {modal.show && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                      <div className="bg-white rounded-xl p-6 w-[300px] shadow-lg text-center">
                        <p
                          className={`text-sm font-semibold ${
                            modal.type === "success"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {modal.message}
                        </p>

                        <button
                          onClick={() =>
                            setModal({ show: false, message: "", type: "" })
                          }
                          className="mt-4 px-4 py-2 text-xs bg-[#5148d7] text-white rounded-lg"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#717c82]">
                    Directory
                  </p>
                  {loadingMembers ? (
                    <div className="m-auto w-10 h-10 border-2 border-[#5148d7] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="divide-y divide-[#a9b4b9]/5">
                      {users.map((u) => (
                        <div
                          key={u._id}
                          className="py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e3dfff] flex items-center justify-center text-[10px] font-bold text-[#5148d7]">
                              {u.username?.[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#2a3439]">
                                {u.username}
                              </p>
                              <p className="text-[10px] text-[#717c82]">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          {loadingUserId === u._id ? (
                            <div className="w-4 h-4 border-2 border-[#5148d7] border-t-transparent rounded-full animate-spin"></div>
                          ) : u.isAssigned ? (
                            <button
                              onClick={() => handleRemoveAssign(u._id)}
                              className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-wider transition-colors"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAssign(u.email, u._id)}
                              className="text-[10px] font-bold text-[#5148d7] hover:underline uppercase tracking-wider"
                            >
                              Assign
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Search & Documents Table */}
        <div className="space-y-4">
          <div className="group flex items-center gap-4 bg-white p-2 rounded-xl border border-[#a9b4b9]/15 shadow-sm focus-within:border-[#5148d7] transition-all">
            <Search
              size={18}
              className="ml-2 text-[#a9b4b9] group-focus-within:text-[#5148d7] transition-colors"
            />
            <input
              type="text"
              placeholder="Filter by title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm py-2 text-[#2a3439]"
            />
          </div>

          <div className="bg-white rounded-xl border border-[#a9b4b9]/15 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f9fb] border-b border-[#a9b4b9]/10">
                  <th className="px-8 py-4 text-[10px] font-bold text-[#717c82] uppercase tracking-[0.2em]">
                    Document Name
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold text-[#717c82] uppercase tracking-[0.2em]">
                    Status
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold text-[#717c82] uppercase tracking-[0.2em]">
                    Author
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold text-[#717c82] uppercase tracking-[0.2em]">
                    Updated
                  </th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#a9b4b9]/5">
                {documents
                  .filter((doc) =>
                    (doc.title || "")
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  .map((doc) => (
                    <tr
                      key={doc._id}
                      onClick={() => navigate(`/doc/${doc._id}`)}
                      className="group hover:bg-[#f7f9fb] cursor-pointer transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 bg-[#f0f4f7] rounded-lg flex items-center justify-center text-[#717c82] group-hover:text-[#5148d7] group-hover:bg-[#e3dfff] transition-all">
                            <FileText size={16} />
                          </div>
                          <span className="text-sm font-medium text-[#2a3439]">
                            {doc.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider",
                            doc.status === "published"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600",
                          )}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-light text-[#566166]">
                        {doc.authorId?.username || "Admin"}
                      </td>
                      <td className="px-8 py-6 text-[11px] text-[#a9b4b9] font-medium uppercase tracking-widest">
                        {formatDate(doc.updatedAt)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <MoreVertical
                          size={14}
                          className="text-[#a9b4b9] inline opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};


  // --- 3. MEMBERS LOGIC ---
  // useEffect(() => {
  //   if (!openModal) return;
  //   const fetchUsersAndMembers = async () => {
  //     try {
  //       setLoadingMembers(true);
  //       const usersRes = await axios.get(
  //         "https://documentation-hub-h5zv.vercel.app/user/all-users",
  //         { withCredentials: true },
  //       );
  //       const membersRes = await axios.get(
  //         `https://documentation-hub-h5zv.vercel.app/api/workspace/${id}`,
  //         { withCredentials: true },
  //       );

  //       const allUsersData = usersRes.data.users;
  //       const assignedMembers = membersRes.data.members || [];

  //       const updatedUsers = allUsersData.map((user) => ({
  //         ...user,
  //         isAssigned: assignedMembers.some(
  //           (m) => (m.userId?._id || m.userId) === user._id,
  //         ),
  //       }));

  //       setUsers(updatedUsers);
  //       setAllUsers(updatedUsers);
  //     } catch (err) {
  //       console.log(err.message);
  //     } finally {
  //       setLoadingMembers(false);
  //     }
  //   };
  //   fetchUsersAndMembers();
  // }, [openModal, id]);



