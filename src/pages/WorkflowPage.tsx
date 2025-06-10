import React, { useState } from 'react';
import { useGetWorkflowsQuery, useCreateWorkflowMutation } from '../store/api/workflowApi';
import WorkflowList from '../components/WorkflowList';
import './WorkflowsPage.css';

const WorkflowsPage: React.FC = () => {
  const { data: workflows, isLoading } = useGetWorkflowsQuery();
  const [createWorkflow, { isLoading: isCreating }] = useCreateWorkflowMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWorkflow({
        name: formData.name,
        description: formData.description,
        status: 'pending',
      }).unwrap();
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  return (
    <div className="workflows-page">
      <div className="page-header">
        <h1>Workflows</h1>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create New Workflow'}
        </button>
      </div>

      {showCreateForm && (
        <form className="create-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Workflow Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Workflow'}
          </button>
        </form>
      )}

      {isLoading ? (
        <p>Loading workflows...</p>
      ) : (
        workflows && <WorkflowList workflows={workflows} />
      )}
    </div>
  );
};

export default WorkflowsPage;
