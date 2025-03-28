import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`);
        setUsers(response.data.data);
        setTotalPages(response.data.total_pages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, navigate]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      setError('');
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User List</h2>
        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {filteredUsers.map(user => (
          <div key={user.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={user.avatar} className="card-img-top" alt="Avatar" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{user.first_name} {user.last_name}</h5>
                <p className="card-text">{user.email}</p>
                <div className="mt-auto d-flex justify-content-between">
                  <Link 
                    to={`/users/${user.id}/edit`}
                    className="btn btn-primary"
                  >
                    Edit
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-secondary mx-2"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2">Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-secondary mx-2"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;