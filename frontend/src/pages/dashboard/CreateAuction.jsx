import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAuction, reset } from '../../redux/auctionSlice';
import { toast } from 'react-toastify';

const CreateAuction = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    startingPrice: '',
    endTime: '',
    imageUrl: '', // Simple URL input
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auction);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Format data for backend
    const auctionData = {
      ...formData,
      images: [formData.imageUrl], // Backend expects array of strings
    };

    dispatch(createAuction(auctionData))
      .unwrap()
      .then(() => {
        toast.success('Auction Created Successfully!');
        navigate('/dashboard/seller');
        dispatch(reset());
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Listing</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Title</label>
          <input type="text" name="title" required onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bid-purple focus:ring-bid-purple border p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" required onChange={onChange} rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bid-purple focus:ring-bid-purple border p-2"></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-sm font-medium text-gray-700">Category</label>
             <select name="category" onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 border p-2">
               <option>Electronics</option>
               <option>Fashion</option>
               <option>Art</option>
               <option>Automotive</option>
               <option>Real Estate</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Starting Price ($)</label>
            <input type="number" name="startingPrice" required onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
          <input type="datetime-local" name="endTime" required onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="url" name="imageUrl" placeholder="https://example.com/image.jpg" required onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bid-purple hover:bg-indigo-700">
          {isLoading ? 'Creating...' : 'Launch Auction'}
        </button>
      </form>
    </div>
  );
};

export default CreateAuction;