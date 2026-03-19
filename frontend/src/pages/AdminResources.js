import AdminNavbar from "../components/AdminNavbar";

function AdminResources() {
    return (
        <div className="layout">
            <AdminNavbar />
            <div className="content">
                <h1>Admin Resources</h1>
                <p>Create / edit resources here</p>
            </div>
        </div>
    );
}

export default AdminResources;