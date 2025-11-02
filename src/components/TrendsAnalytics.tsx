import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { apiClient, TrendData } from '../api/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agentic-challenge-backend.onrender.com/api';

export function TrendsAnalytics() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [networkStats, setNetworkStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [selectedCategory]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // For now, use the analyze endpoint to get data based on category
      const analysisData = await apiClient.analyzeQuery(selectedCategory === 'all' ? 'research' : selectedCategory);
      // Transform the analysis data to fit TrendData interface
      const trendsData: TrendData[] = [
        {
          time_period: '2024-Q1',
          category: selectedCategory === 'all' ? 'All' : selectedCategory,
          paper_count: analysisData.databaseContext?.papersFound || 0,
          avg_citations: 0 // Placeholder
        }
      ];
      setTrends(trendsData);
      setNetworkStats(null); // Network stats endpoint not available
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setTrends([]);
      setNetworkStats(null);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'AI', 'ML', 'Deep Learning', 'Computer Vision', 'NLP', 'Quantum Computing'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <TrendingUp className="w-8 h-8" />
          Research Trends Analytics
        </h1>
        <p className="text-green-100 mb-6">
          Powered by TimescaleDB hypertables for time-series analysis
        </p>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-green-600'
                  : 'bg-green-700 text-white hover:bg-green-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Papers</p>
              <p className="text-3xl font-bold text-gray-900">{trends.length > 0 ? trends[0].paper_count : 0}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Citations</p>
              <p className="text-3xl font-bold text-gray-900">{trends.reduce((sum, t) => sum + (t.avg_citations || 0), 0)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Citations</p>
              <p className="text-3xl font-bold text-gray-900">{trends.length > 0 ? (trends.reduce((sum, t) => sum + (t.avg_citations || 0), 0) / trends.length).toFixed(1) : '0.0'}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-purple-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="text-xl font-bold text-gray-900 truncate">{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-pink-500" />
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Publication Trends Over Time</h2>
        {loading ? (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Loading trends...
          </div>
        ) : trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time_period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="paper_count" stroke="#8884d8" name="Paper Count" />
              <Line type="monotone" dataKey="avg_citations" stroke="#82ca9d" name="Avg Citations" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            No trend data available for the selected category
          </div>
        )}
      </div>

      {/* Category Distribution - Mock Data */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Research Categories Distribution</h2>
        <div className="h-96 flex items-center justify-center text-gray-500">
          Category distribution chart would be displayed here when available from the backend
        </div>
      </div>

      {/* TimescaleDB Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          TimescaleDB Hypertables
        </h3>
        <p className="text-teal-800 text-sm">
          Research trends are stored in TimescaleDB hypertables, optimized for time-series queries.
          This enables efficient aggregation and analysis of temporal patterns in research publications,
          citations, and cross-domain connections over time.
        </p>
      </div>
    </div>
  );
}
