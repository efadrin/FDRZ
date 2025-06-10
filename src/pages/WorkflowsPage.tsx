import React, { useState } from 'react';
import { useGetWorkflowsQuery } from '../store/api/workflowApi';
import WorkflowList from '../components/WorkflowList';

const WorkflowsPage: React.FC = () => {
  const { data: workflows, isLoading, error, refetch } = useGetWorkflowsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkflows = workflows?.filter(workflow =>
    workflow.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="workflows-page">
      <div className="page-header">
        <h1>Workflows</h1>
        <div className="page-actions">
          <button onClick={handleRefresh} className="btn btn-secondary">
            Refresh
          </button>
          <button className="btn btn-primary">
            Create New Workflow
          </button>
        </div>
      </div>

      <div className="workflows-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>      </div>

      <div className="workflows-content">
        <>
          {isLoading && (
            <div className="loading-state">
              <p>Loading workflows...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <p className="error">Failed to load workflows. Please try again.</p>
              <button onClick={handleRefresh} className="btn btn-primary">
                Retry
            </button>
          </div>
        )}
        
        {!isLoading && !error && (
          <div className="workflows-list-container">
            {filteredWorkflows && filteredWorkflows.length > 0 ? (
              <>
                <div className="workflows-stats">
                  <p>Showing {filteredWorkflows.length} of {workflows?.length} workflows</p>
                </div>
                <WorkflowList workflows={filteredWorkflows} />
              </>
            ) : (
              <div className="empty-state">
                <h3>No workflows found</h3>
                {searchTerm ? (
                  <p>No workflows match your search criteria.</p>
                ) : (
                  <p>You haven't created any workflows yet.</p>
                )}
                <button className="btn btn-primary">
                  Create Your First Workflow
                </button>            </div>
            )}
          </div>
        )}
        </>
      </div>
    </div>
  );
};

export default WorkflowsPage;
