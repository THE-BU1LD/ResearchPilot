import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageCircle,
  Video,
  Share2,
  UserPlus,
  Bell,
  Check,
  X,
  Clock,
  FileText,
  Eye,
  Edit3,
  Send,
  AtSign,
  Sparkles,
  Crown,
  Shield,
} from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "editor" | "viewer";
  status: "online" | "offline" | "away";
  lastActive?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  resolved: boolean;
}

const mockCollaborators: Collaborator[] = [
  { id: "1", name: "Ryan Gomez", email: "ryan@researchlab.com", avatar: "RG", role: "owner", status: "online" },
  { id: "2", name: "Sarah Chen", email: "sarah@university.edu", avatar: "SC", role: "editor", status: "online" },
  { id: "3", name: "James Wilson", email: "james@lab.org", avatar: "JW", role: "editor", status: "away", lastActive: "5 min ago" },
  { id: "4", name: "Priya Sharma", email: "priya@school.edu", avatar: "PS", role: "viewer", status: "offline", lastActive: "2 hours ago" },
];

const mockComments: Comment[] = [
  { id: "1", author: "Sarah Chen", content: "Great analysis! Should we add more data points?", timestamp: "10 min ago", resolved: false },
  { id: "2", author: "James Wilson", content: "The methodology section needs a citation for the chi-square test.", timestamp: "1 hour ago", resolved: false },
  { id: "3", author: "Ryan Gomez", content: "Added the references as requested.", timestamp: "2 hours ago", resolved: true },
];

const roleConfig = {
  owner: { icon: Crown, label: "Owner", color: "text-primary", bg: "bg-primary/10" },
  editor: { icon: Edit3, label: "Editor", color: "text-comic-blue", bg: "bg-comic-blue/10" },
  viewer: { icon: Eye, label: "Viewer", color: "text-muted-foreground", bg: "bg-muted" },
};

const statusConfig = {
  online: { color: "bg-comic-green", label: "Online" },
  away: { color: "bg-accent", label: "Away" },
  offline: { color: "bg-muted-foreground", label: "Offline" },
};

const CollaborationHub = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(mockCollaborators);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"team" | "comments" | "activity">("team");

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newCollab: Collaborator = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      avatar: inviteEmail.substring(0, 2).toUpperCase(),
      role: inviteRole,
      status: "offline",
      lastActive: "Invited",
    };
    setCollaborators([...collaborators, newCollab]);
    setInviteEmail("");
    setShowInviteForm(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      content: newComment,
      timestamp: "Just now",
      resolved: false,
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const toggleResolve = (id: string) => {
    setComments(comments.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)));
  };

  const removeCollaborator = (id: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-comic-blue flex items-center justify-center border-3 border-foreground shadow-brutal">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground font-comic tracking-wide">COLLABORATION HUB</h2>
            <p className="text-sm text-muted-foreground">Team • Comments • Real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-2 border-foreground">
            <Video className="w-4 h-4 mr-2" />
            Meet
          </Button>
          <Button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="brutal-button bg-primary text-primary-foreground"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
      </div>

      {/* Invite Form */}
      <AnimatePresence>
        {showInviteForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-primary/5 border-3 border-primary/30 rounded-xl">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" />
                Invite Collaborator
              </h4>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@university.edu"
                  className="flex-1 px-4 py-2 border-2 border-foreground rounded-lg bg-card"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "editor" | "viewer")}
                  className="px-4 py-2 border-2 border-foreground rounded-lg bg-card"
                >
                  <option value="editor">Can Edit</option>
                  <option value="viewer">Can View</option>
                </select>
                <Button onClick={handleInvite} className="brutal-button bg-comic-green text-white">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 border-b-3 border-border pb-2">
        {[
          { id: "team", icon: Users, label: "Team" },
          { id: "comments", icon: MessageCircle, label: "Comments" },
          { id: "activity", icon: Bell, label: "Activity" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-brutal-sm"
                : "bg-card hover:bg-secondary text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === "comments" && (
              <span className="w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center">
                {comments.filter((c) => !c.resolved).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="space-y-3">
          {collaborators.map((collab) => {
            const role = roleConfig[collab.role];
            const status = statusConfig[collab.status];
            const RoleIcon = role.icon;

            return (
              <motion.div
                key={collab.id}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 border-3 border-foreground bg-card rounded-xl group"
                style={{ boxShadow: "var(--shadow-brutal-sm)" }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-secondary border-2 border-foreground flex items-center justify-center font-bold text-foreground">
                      {collab.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${status.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{collab.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${role.bg} ${role.color} flex items-center gap-1`}>
                        <RoleIcon className="w-3 h-3" />
                        {role.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{collab.email}</p>
                    {collab.lastActive && collab.status !== "online" && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {collab.lastActive}
                      </p>
                    )}
                  </div>
                </div>
                {collab.role !== "owner" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCollaborator(collab.id)}
                    className="opacity-0 group-hover:opacity-100 text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          {/* Add Comment */}
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment or @mention someone..."
              className="flex-1 px-4 py-3 border-2 border-foreground rounded-lg bg-card"
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button onClick={handleAddComment} className="brutal-button bg-primary text-primary-foreground">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Comment List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border-2 rounded-xl ${
                  comment.resolved
                    ? "border-comic-green/30 bg-comic-green/5"
                    : "border-foreground bg-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center text-xs font-bold">
                      {comment.author.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-foreground">{comment.author}</span>
                      <span className="text-xs text-muted-foreground ml-2">{comment.timestamp}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleResolve(comment.id)}
                    className={`p-1 rounded ${comment.resolved ? "text-comic-green" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
                <p className={`text-foreground ${comment.resolved ? "line-through opacity-60" : ""}`}>
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className="space-y-3">
          {[
            { icon: Edit3, text: "Sarah Chen edited the methodology section", time: "5 min ago", color: "text-comic-blue" },
            { icon: FileText, text: "James Wilson added 3 new citations", time: "1 hour ago", color: "text-primary" },
            { icon: Sparkles, text: "AI analysis completed on dataset", time: "2 hours ago", color: "text-accent" },
            { icon: UserPlus, text: "Priya Sharma joined as viewer", time: "Yesterday", color: "text-comic-green" },
          ].map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-3 bg-card rounded-lg border-2 border-border"
            >
              <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${activity.color}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.text}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborationHub;