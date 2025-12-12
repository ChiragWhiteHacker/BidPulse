import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllAuctions, deleteAuction } from '../../redux/auctionSlice';
import { Trash2, Plus, Pencil, Eye } from 'lucide-react'; // Added Pencil & Eye

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { auctions, isLoading } = useSelector((state) => state.auction);

  useEffect(() => {
    dispatch(getAllAuctions());
  }, [dispatch]);

  // Filter only THIS seller's auctions
  const myAuctions = auctions.filter((a) => a.seller._id === user._id || a.seller === user._id);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      dispatch(deleteAuction(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <Link to="/create-auction" 
          className="flex items-center gap-2 bg-bid-green text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition shadow-sm">
          <Plus size={20} /> Create New Listing
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">My Active Listings</h2>
        </div>
        
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Loading your inventory...</div>
        ) : myAuctions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-medium">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Current Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Ends In</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myAuctions.map((auction) => (
                  <tr key={auction._id} className="hover:bg-gray-50 transition-colors">
                    {/* 1. Image Column */}
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200">
                         <img 
                           src={auction.images[0] || 'https://via.placeholder.com/150'} 
                           alt={auction.title}
                           className="h-full w-full object-cover"
                         />
                      </div>
                    </td>

                    {/* 2. Title & Description Snippet */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{auction.title}</div>
                      <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                        {auction.description}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-bid-purple">
                      ${auction.currentPrice}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        auction.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {auction.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(auction.endTime).toLocaleDateString()}
                    </td>

                    {/* 3. Actions: Edit & Delete */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {/* Placeholder for Edit - We will build this page next */}
                          <Link 
  to={`/edit-auction/${auction._id}`} 
  className="text-blue-500 hover:text-blue-700 transition" 
  title="Edit"
>
  <Pencil size={18} />
                          </Link>
                        
                        {/* Placeholder for View Details */}
                        <Link 
                          to={`/auction/${auction._id}`} 
                          className="text-gray-400 hover:text-bid-purple transition"
                          title="View Public Page"
                        >
                           <Eye size={18} />
                        </Link>

                        <button 
                          onClick={() => handleDelete(auction._id)} 
                          className="text-red-400 hover:text-red-600 transition" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
               <Plus className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products listed</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new auction.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;