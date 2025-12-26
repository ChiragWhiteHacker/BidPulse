const Auction = require('../models/Auction');
const User = require('../models/User');

// @desc    Get Platform Stats (Admin Only)
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAuctions = await Auction.countDocuments();

    // Calculate Financials from 'closed' auctions
    const closedAuctions = await Auction.find({ status: 'closed' });
    
    const totalVolume = closedAuctions.reduce((acc, item) => acc + item.currentPrice, 0);
    const totalCommission = totalVolume * 0.08; // 8% Profit
    const totalPayouts = totalVolume - totalCommission; // 92% Sent to Sellers

    // Calculate Money currently held in Escrow
    const escrowAuctions = await Auction.find({ status: 'paid_held_in_escrow' });
    const fundsInEscrow = escrowAuctions.reduce((acc, item) => acc + item.currentPrice, 0);

    res.status(200).json({
      totalUsers,
      totalAuctions,
      totalVolume,
      totalCommission, // Admin Profit
      totalPayouts,
      fundsInEscrow,
      recentTransactions: closedAuctions.slice(0, 5) // Last 5 finished deals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};