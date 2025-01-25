import React, { useEffect, useState } from "react";
import { NetworkConnection } from "../types";
import { Activity, AlertCircle, CheckCircle, Clock, FileText, Wifi, WifiOff } from "react-feather";
import Cookies from "js-cookie";
import { useUserPermissions } from "../../../UserPermissionsContext";

interface Props {
  connections: NetworkConnection[];
}

interface DashboardData {
  total_connections: number;
  active_connections: number;
  total_tickets: number;
  pending_tickets: number
  solved_tickets: number
  pending_payments: number
  // Add other properties as needed
}

const AdminDashboard: React.FC<Props> = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const jwtToken = Cookies.get('authToken');
  const { userPermissions,webApi } = useUserPermissions();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Adjust the breakpoint as needed
  const [maxHeight, setMaxHeight] = useState('550px');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        // Set maxHeight based on the viewport height
        setMaxHeight(`${window.innerHeight * 0.8}px`); // 80% of the viewport height
      } else {
        setMaxHeight('none'); // No maxHeight for larger screens
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call it initially to set the correct state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async (fetchOptions: { dashboard?: boolean }) => {
    if (!jwtToken) {
      setError('No authentication token found');
      return;
    }
  
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      };
  
      const promises = [];
  
      if (fetchOptions.dashboard) {
        promises.push(fetch(`${webApi}/provider/dashboard/`, options));
      }
  
      const results = await Promise.all(promises);
  
      if (fetchOptions.dashboard) {
        const dashboardResponse = results[0];
        if (!dashboardResponse.ok) {
          const errorData = await dashboardResponse.json();
          throw new Error(errorData.message || 'Network response was not ok');
        }
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  
  useEffect(() => {
    fetchData({ dashboard: true });
  }, []);
  
  return (
    <div style={{ backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)', minHeight: '100vh' }}>
    <div className="page-wrapper">
      <div className="content blank-page" style={{ backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)', minHeight: '85%', margin: '5px', marginTop: '15px', position: 'fixed', minWidth: '85%' }}>
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
            width: '100%',
            overflowY: isMobile ? 'auto' : 'visible', // Enable vertical scrolling on mobile
            maxHeight: maxHeight,
          }}>
            {[
              { title: 'Total Connections', value: dashboardData ? dashboardData.total_connections : 'Loading...', color: '#1F2937', icon: <Activity style={{ width: '32px', height: '32px', color: '#3B82F6' }} /> },
              { title: 'Active Connections', value: dashboardData ? dashboardData.active_connections : 'Loading...', color: '#10B981', icon: <Wifi style={{ width: '32px', height: '32px', color: '#10B981' }} /> },
              { title: 'Inactive Connections', value: dashboardData ? dashboardData.total_connections - dashboardData.active_connections : 'Loading...', color: 'red', icon: <WifiOff style={{ width: '32px', height: '32px', color: '#EF4444' }} /> },
              { title: 'Pending Payments', value: dashboardData ? dashboardData.pending_payments : 'Loading...', color: '#F59E0B', icon: <AlertCircle style={{ width: '32px', height: '32px', color: '#F59E0B' }} /> },
              { title: 'Total Tickets', value: dashboardData ? dashboardData.total_tickets : 'Loading...', color: '#3B82F6', icon: <FileText style={{ width: '32px', height: '32px', color: '#3B82F6' }} /> },
              { title: 'Pending Tickets', value: dashboardData ? dashboardData.pending_tickets : 'Loading...', color: '#F59E0B', icon: <Clock style={{ width: '32px', height: '32px', color: '#F59E0B' }} /> },
              { title: 'Solved Tickets', value: dashboardData ? dashboardData.solved_tickets : 'Loading...', color: '#10B981', icon: <CheckCircle style={{ width: '32px', height: '32px', color: '#10B981' }} /> },
            ].map((card, index) => (
              <div key={index} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '16px', width: '100%', maxWidth: '350px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  < div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563' }}>{card.title}</p>
                    <p style={{ fontSize: '24px', fontWeight: '600', color: card.color }}>{card.value}</p>
                  </div>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* /Page Header */}
      </div>
    </div>
  </div>
  );
};

export default AdminDashboard;
function setError(message: any) {
  throw new Error("Function not implemented.");
}