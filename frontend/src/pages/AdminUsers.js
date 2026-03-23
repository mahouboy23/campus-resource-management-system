import AdminNavbar from "../components/AdminNavbar";

function AdminUsers() {
    return (
        <div className="layout">
            <AdminNavbar />
            <div className="content">
                <h1>Admin Users</h1>
                <p>Create / edit Users here</p>
            </div>
        </div>
    );
}

export default AdminUsers;