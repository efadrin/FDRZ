import React from 'react';
import { Link } from 'react-router-dom';
import { Workflow } from '../store/api/workflowApi';
import './WorkflowList.css';

interface WorkflowListProps {
  workflows: Workflow[];
}

const WorkflowList: React.FC<WorkflowListProps> = ({ workflows }) => {
  if (workflows.length === 0) {
    return (
      <div className="empty-state">
        <p>No workflows found. Create your first workflow to get started!</p>
        <Link to="/workflows/new" className="create-btn">
          Create Workflow
        </Link>
      </div>
    );
  }

  return (
    <div className="workflow-list">
      {workflows.map((workflow) => (
        <div key={workflow.id} className="workflow-card">
          <h4>{workflow.name}</h4>
          <p>{workflow.description}</p>
          <div className="workflow-meta">
            <span className={`status ${workflow.status}`}>{workflow.status}</span>
            <span className="date">
              Updated: {new Date(workflow.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <Link to={`/workflows/${workflow.id}`} className="view-link">
            View Details →
          </Link>
        </div>
      ))}
    </div>
  );
};

export default WorkflowList;
