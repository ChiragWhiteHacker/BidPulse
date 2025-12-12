import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Clock, DollarSign, User, ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'react-toastify';

const AuctionDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');

  // Fetch auction data
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auctions/${id}`);
        setAuction(res.data);
        
        // Default bid is current price + 10 (or minimum increment)
        setBidAmount(res.data.currentPrice + 10);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching auction details');
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  const handlePlaceBid = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place a bid');
      return;
    }
    // TODO: Dispatch Redux action to place bid
    console.log(`Placing bid of $${bidAmount} on auction ${id}`);
    toast.info('Bidding logic coming in next phase!');
  };

  if (loading) return <div className="p-10 text-center">Loading Auction...</div>;
  if (!auction) return <div className="p-10 text-center">Auction not found.</div>;

  // --- LOGIC CHECKS ---
  const isOwner = user && (auction.seller._id === user._id || auction.seller === user._id);
  const isSeller = user && user.role === 'seller';
  const isAdmin = user && user.role === 'admin';
  
  // Who can bid? Only 'bidders' who are NOT the owner.
  // (If you want to allow Sellers to bid on OTHER items, remove the `|| isSeller` check)
  const canBid = user && !isOwner && !isSeller && !isAdmin;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-bid-purple mb-6 transition">
        <ArrowLeft size={20} className="mr-1" /> Back to Auctions
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left: Image Section */}
        <div className="h-96 lg:h-auto bg-gray-100 relative">
          <img 
            src={auction.images[0] || 'https://via.placeholder.com/600'} 
            alt={auction.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-bid-purple shadow-sm">
            {auction.category}
          </div>
        </div>

        {/* Right: Details & Bidding */}
        <div className="p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{auction.title}</h1>
              {/* If Owner, show Edit Button */}
              {isOwner && (
                <Link 
                  to={`/edit-auction/${auction._id}`}
                  className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition"
                >
                  <Edit size={16} /> Edit
                </Link>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {auction.description}
            </p>

            <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User size={18} /> Seller: <span className="font-medium text-gray-900">{auction.seller?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} /> Ends: <span className="font-medium text-gray-900">{new Date(auction.endTime).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <div className="text-sm text-gray-500 mb-1">Current Highest Bid</div>
              <div className="text-4xl font-bold text-bid-purple flex items-center">
                <DollarSign size={32} strokeWidth={3} />
                {auction.currentPrice}
              </div>
            </div>
          </div>

          {/* Bidding Section */}
          <div className="mt-8">
            {/* Case 1: Auction Ended */}
            {auction.status !== 'active' ? (
              <div className="bg-gray-100 text-gray-500 p-4 rounded-lg text-center font-medium">
                This auction has ended.
              </div>
            
            /* Case 2: User can bid (Bidder role + Not Owner) */
            ) : canBid ? (
              <form onSubmit={handlePlaceBid} className="flex gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-bid-purple focus:border-bid-purple"
                    placeholder="Enter amount"
                    min={auction.currentPrice + 1}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-bid-purple text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  Place Bid
                </button>
              </form>
            
            /* Case 3: User is Owner */
            ) : isOwner ? (
               <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-lg text-center font-medium">
                 This is your auction. You cannot place a bid.
               </div>

            /* Case 4: User is Seller (but not owner) or Admin */
            ) : isSeller || isAdmin ? (
               <div className="bg-gray-50 border border-gray-100 text-gray-500 p-4 rounded-lg text-center font-medium">
                 Log in as a Bidder to participate in this auction.
               </div>
            
            /* Case 5: Guest (Not logged in) */
            ) : (
                <div className="text-center">
                    <Link to="/login" className="text-bid-purple font-bold hover:underline">
                        Log in
                    </Link> to place a bid.
                </div>
            )}

            <p className="text-xs text-gray-400 mt-3 text-center">
              * By placing a bid, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;