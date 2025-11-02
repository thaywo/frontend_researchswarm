import { useState } from 'react';
import { Search, Bot, TrendingUp, Database } from 'lucide-react';
import { HybridSearch } from './components/HybridSearch';
import { AgentDashboard } from './components/AgentDashboard';
import { TrendsAnalytics } from './components/TrendsAnalytics';

type Tab = 'search' | 'agents' | 'trends';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search');

  const tabs = [
    { id: 'search' as Tab, label: 'Hybrid Search', icon: Search },
    { id: 'agents' as Tab, label: 'Agent Orchestration', icon: Bot },
    { id: 'trends' as Tab, label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ResearchSwarm</h1>
                <p className="text-sm text-gray-500">AI-Powered Research Discovery Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                Agentic Postgres
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                Tiger Data
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'search' && <HybridSearch />}
        {activeTab === 'agents' && <AgentDashboard />}
        {activeTab === 'trends' && <TrendsAnalytics />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Technology Stack</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Agentic Postgres (Tiger Cloud)</li>
                <li>• Fast Database Forks (Zero-Copy)</li>
                <li>• Hybrid Search (BM25 + pgvector)</li>
                <li>• TimescaleDB Hypertables</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Multi-Agent Parallel Execution</li>
                <li>• Semantic Connection Discovery</li>
                <li>• Citation Network Analysis</li>
                <li>• Research Trend Detection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Challenge</h3>
              <p className="text-sm text-gray-600">
                Built for the Agentic Postgres Challenge by Tiger Data.
                Showcasing innovative use of database forks, hybrid search,
                and multi-agent coordination.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>ResearchSwarm - Powered by Agentic Postgres & Tiger Data</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
