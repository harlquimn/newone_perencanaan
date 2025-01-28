import React from "react";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-medium text-gray-500">Total Urusan</h3>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-medium text-gray-500">Total Program</h3>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-medium text-gray-500">Total Kegiatan</h3>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-medium text-gray-500">Total Sub-Kegiatan</h3>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
