import { useState, useEffect } from 'react';
import { Bot, Cpu, Database, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiClient, Paper, AgentResult } from '../api/client';

export function AgentDashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<string>('');
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState<number>(0);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      const data = await apiClient.getPapers();
      setPapers(data.papers);
      if (data.papers.length > 0) setSelectedPaper(data.papers[0].id);
    } catch (error) {
      console.error('Failed to load papers:', error);
    }
  };

  const runAgentAnalysis = async () => {
    if (!selectedPaper) return;
    
    setIsRunning(true);
    setAgentResults([]);
    
    try {
      const result = await apiClient.runAgentAnalysis(selectedPaper);
      setAgentResults(result.results);
      setTotalTime(result.total_time);
    } catch (error) {
      console.error('Agent analysis failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getAgentIcon = (agentName: string) => {
    if (agentName.includes('Citation')) return Database;
    if (agentName.includes('Topic')) return Cpu;
    if (agentName.includes('Summary')) return Bot;
    if (agentName.includes('Trend')) return Activity;
    return Bot;
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-700 border-green-300';
    if (status === 'error') return 'bg-red-100 text-red-700 border-red-300';
    return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return CheckCircle;
    if (status === 'error') return XCircle;
    return Clock;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Bot className="w-8 h-8" />
          Multi-Agent Orchestration
        </h1>
        <p className="text-purple-100 mb-6">
          4 specialized agents running in parallel on isolated database forks
        </p>

        {/* Paper Selection */}
        <div className="flex gap-3 items-center">
          <label className="text-white font-medium">Select Paper:</label>
          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
          >
            {papers.map((paper) => (
              <option key={paper.id} value={paper.id}>
                {paper.title}
              </option>
            ))}
          </select>
          <button
            onClick={runAgentAnalysis}
            disabled={isRunning || !selectedPaper}
            className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Activity className="w-5 h-5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Bot className="w-5 h-5" />
                Run Agents
              </>
            )}
          </button>
        </div>

        {totalTime > 0 && (
          <div className="mt-4 text-sm text-purple-100">
            ⚡ Total execution time: {totalTime.toFixed(2)}ms (4x parallelization)
          </div>
        )}
      </div>

      {/* Agent Cards */}
      {agentResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agentResults.map((agent) => {
            const AgentIcon = getAgentIcon(agent.agent_name);
            const StatusIcon = getStatusIcon(agent.status);
            
            return (
              <div
                key={agent.fork_id}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all"
              >
                {/* Agent Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <AgentIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {agent.agent_name}
                      </h3>
                      <p className="text-sm text-gray-500">Fork: {agent.fork_id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border-2 ${getStatusColor(agent.status)} flex items-center gap-2`}>
                    <StatusIcon className="w-4 h-4" />
                    {agent.status}
                  </div>
                </div>

                {/* Execution Time */}
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Execution: {agent.execution_time.toFixed(2)}ms</span>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Results:</h4>
                  {agent.error ? (
                    <p className="text-red-600 text-sm">{agent.error}</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(agent.results || {}).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium text-gray-700">{key}:</span>{' '}
                          <span className="text-gray-600">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Agent Descriptions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Agent Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Citation Analyzer</h3>
              <p className="text-sm text-gray-600">Analyzes citation networks and impact metrics</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Cpu className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Topic Connector</h3>
              <p className="text-sm text-gray-600">Discovers cross-domain research connections</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Bot className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Summary Generator</h3>
              <p className="text-sm text-gray-600">Creates concise paper summaries and insights</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Activity className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Trend Detector</h3>
              <p className="text-sm text-gray-600">Identifies emerging research trends over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fork Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Fast Fork Technology
        </h3>
        <p className="text-blue-800 text-sm">
          Each agent runs on its own isolated database fork using Tiger Data's zero-copy, 
          copy-on-write technology. This enables true parallel execution without data conflicts 
          or performance degradation. Forks are created instantly and cleaned up automatically.
        </p>
      </div>
    </div>
  );
}
