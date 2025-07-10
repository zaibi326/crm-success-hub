
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CurrentDeals = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new leads page
    navigate('/leads', { replace: true });
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to Seller Leads...</p>
      </div>
    </div>
  );
};

export default CurrentDeals;
