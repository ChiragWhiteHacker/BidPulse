const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Auction = require('../models/Auction');
const User = require('../models/User');

// @desc    Create Stripe Checkout Session (Winner pays Platform)
// @route   POST /api/payment/checkout/:auctionId
// @access  Private (Winner only)
exports.createCheckoutSession = async (req, res) => {
  console.log("1. Payment Request Received for Auction:", req.params.auctionId); // <--- DEBUG LOG

  try {
    // Check if API Key is loaded
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error("CRITICAL: STRIPE_SECRET_KEY is missing in .env");
        return res.status(500).json({ message: "Server Error: Stripe Key Missing" });
    }

    const auction = await Auction.findById(req.params.auctionId);
    console.log("2. Auction Found:", auction ? "Yes" : "No");

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Security Check
    console.log(`3. Winner Check: Auction Winner (${auction.winner}) vs User (${req.user.id})`);
    if (auction.winner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the winner can pay for this auction' });
    }

    console.log("4. Creating Stripe Session...");

    // Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: auction.title,
              description: auction.description ? auction.description.substring(0, 400) : "Auction Item", // Limit length to be safe
              // We intentionally leave out 'images' for now to prevent URL errors
            },
            unit_amount: Math.round(auction.currentPrice * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auction/${auction._id}`,
      metadata: {
        auctionId: auction._id.toString(),
        winnerId: req.user.id.toString(),
      },
    });

    console.log("5. Stripe Session Created! ID:", session.id);
    res.status(200).json({ id: session.id, url: session.url });

  } catch (error) {
    console.error("!!! STRIPE ERROR !!!");
    console.error(error); // This prints the full error object
    res.status(500).json({ message: error.message || "Payment Processing Failed" });
  }
};

// @desc    Buyer confirms receipt -> Release funds to Seller
exports.releaseFunds = async (req, res) => {
  // ... (Keep existing releaseFunds logic, it is fine) ...
  try {
    const auction = await Auction.findById(req.params.auctionId).populate('seller');
    if (auction.winner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (auction.status !== 'paid_held_in_escrow') return res.status(400).json({ message: 'Funds cannot be released yet' });

    const totalAmount = auction.currentPrice;
    const commission = totalAmount * 0.08;
    const sellerPayout = totalAmount - commission;

    if (auction.seller.stripeAccountId) {
      try {
        await stripe.transfers.create({
          amount: Math.round(sellerPayout * 100),
          currency: 'usd',
          destination: auction.seller.stripeAccountId,
        });
      } catch (stripeError) {
        console.error('Stripe Transfer Failed:', stripeError.message);
      }
    }
    auction.status = 'completed';
    await auction.save();
    res.status(200).json({ message: 'Funds released to seller.' });
  } catch (error) {
    console.error("Release Error:", error);
    res.status(500).json({ message: error.message });
  }
};