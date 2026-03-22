import { useEffect, useState, useContext } from "react";
import UserNavbar from "../components/UserNavbar";
import { getAllResources } from "../services/resourceService";
import ResourceCard from "../components/ResourceCard";
import BookingModal from "../components/BookingModal";
import "../styles/resource.css";
import NotificationContext from "../context/NotificationContext";

const CATEGORIES = ["all", "room", "equipment", "device", "other"];

function UserResources() {
    const [resources, setResources] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState(""); // "" | "availability" | "category"
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    const notification = useContext(NotificationContext);

    useEffect(() => {
        fetchResources();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, categoryFilter]);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const data = await getAllResources({
                sortBy: sortBy || undefined,
                category: categoryFilter !== "all" ? categoryFilter : undefined
            });
            setResources(data);
            setFiltered(data);
        } catch (err) {
            notification?.showToast(err.message || "Failed to load resources", "error");
        } finally {
            setLoading(false);
        }
    };

    // Client-side search filter (applied on top of server sort/filter)
    useEffect(() => {
        const result = resources.filter((r) =>
            r.name.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(result);
    }, [search, resources]);

    return (
        <div className="layout">
            <UserNavbar />

            <div className="content">
                <h1>Resources</h1>

                {/* Controls row */}
                <div className="resources-controls">
                    <input
                        className="search-bar"
                        placeholder="Search resources..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Sort by */}
                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Sort by: Default</option>
                        <option value="availability">Sort by: Availability</option>
                        <option value="category">Sort by: Category</option>
                    </select>

                    {/* Category filter */}
                    <div className="category-filters">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`category-btn ${categoryFilter === cat ? "active" : ""}`}
                                onClick={() => setCategoryFilter(cat)}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : filtered.length === 0 ? (
                    <p className="empty-state">No resources found</p>
                ) : (
                    <div className="grid">
                        {filtered.map((r) => (
                            <ResourceCard key={r._id} resource={r} onSelect={setSelected} />
                        ))}
                    </div>
                )}

                {selected && (
                    <BookingModal
                        resource={selected}
                        onClose={() => setSelected(null)}
                        onSuccess={fetchResources}
                    />
                )}
            </div>
        </div>
    );
}

export default UserResources;