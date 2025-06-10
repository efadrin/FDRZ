import React from 'react';
import { useAppSelector } from '../store/hooks';
import { useGetWorkflowsQuery } from '../store/api/workflowApi';
import WorkflowList from '../components/WorkflowList';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: workflows, isLoading, error } = useGetWorkflowsQuery();

  return (
    <div className="dashboard">
      <h1>Welcome to FDRZ Dashboard</h1>
      {user && (
        <div className="user-info">
          <h2>User Information</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.department && <p><strong>Department:</strong> {user.department}</p>}
        </div>      )}
      
      <div className="dashboard-content">
        <>
          <h3>Your Workflows</h3>
          {isLoading && <p>Loading workflows...</p>}
          {error && <p className="error">Failed to load workflows</p>}
          {workflows && <WorkflowList workflows={workflows} />}
        </>
      </div>
    </div>
  );
};

export default Dashboard;