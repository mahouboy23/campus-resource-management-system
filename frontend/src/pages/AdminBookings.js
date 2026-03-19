import AdminNavbar from "../components/AdminNavbar";

function AdminBookings() {
    return (
        <div className="layout">
            <AdminNavbar />
            <div className="content">
                <h1>Admin Bookings</h1>
                <p>Approve / reject bookings here</p>
            </div>
        </div>
    );
}

export default AdminBookings;