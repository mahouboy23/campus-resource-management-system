import { useEffect, useState, useContext } from "react";
import UserNavbar from "../components/UserNavbar";
import { getAllResources } from "../services/resourceService";
import ResourceCard from "../components/ResourceCard";
import BookingModal from "../components/BookingModal";
import "../styles/resource.css";
import NotificationContext from "../context/NotificationContext";

function UserResources() {
    const [resources, setResources] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const notification = useContext(NotificationContext);

    const fetchResources = async () => {
        try {
            const data = await getAllResources();
            setResources(data);
            setFiltered(data);
        } catch (err) {
            notification?.showToast(err.message || "Failed to load resources", "error");
        } finally {
            setLoading(false);
        }
    };

    // 🔍 Search filter
    useEffect(() => {
        const result = resources.filter(r =>
            r.name.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(result);
    }, [search, resources]);

    return (
        <div className="layout">
            <UserNavbar />

            <div className="content">
                <h1>Resources</h1>

                <input
                    className="search-bar"
                    placeholder="Search resources..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid">
                        {filtered.map(r => (
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