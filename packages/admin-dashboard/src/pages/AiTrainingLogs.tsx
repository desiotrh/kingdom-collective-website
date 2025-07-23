import { useEffect, useState } from 'react';
import TrainingDataTable from '../components/TrainingDataTable';

export default function AiTrainingLogs() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📊 AI Training Data Viewer</h1>
            <TrainingDataTable />
        </div>
    );
} 