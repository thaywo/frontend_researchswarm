import { useState } from 'react';
import { Search, Sparkles, Database } from 'lucide-react';
import { apiClient, Paper } from '../api/client';

export function HybridSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hybridResults, setHybridResults] = useState<Paper[]>([]);
  const [semanticResults, setSemanticResults] = useState<Paper[]>([]);
  const [keywordResults, setKeywordResults] = useState<Paper[]>([]);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'hybrid' | 'semantic' | 'keyword'>('hybrid');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const hybrid = await apiClient.hybridSearch(query);

      setHybridResults(hybrid.results);
      setSemanticResults([]); // Only hybrid search is available
      setKeywordResults([]); // Only hybrid search is available
      setExecutionTime(hybrid.execution_time || 0);
    } catch (error) {
      console.error('Search failed:', error);
      setHybridResults([]);
      setSemanticResults([]);
      setKeywordResults([]);
      setExecutionTime(0);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentResults = () => {
    return hybridResults;
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          Hybrid Search Engine
        </h1>
        <p className="text-blue-100 mb-6">
          Powered by BM25 keyword search + pgvector semantic search
        </p>
        
        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search research papers... (e.g., 'transformer neural networks')"
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 border-2 border-blue-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {executionTime > 0 && (
          <div className="mt-4 text-sm text-blue-100">
            ⚡ Search completed in {executionTime.toFixed(2)}ms
          </div>
        )}
      </div>

      {/* Search Type Tabs */}
      {hybridResults.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('hybrid')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'hybrid'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Hybrid Search Results
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {hybridResults.length}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {getCurrentResults().map((paper, index) => (
          <div key={paper.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{paper.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {paper.authors?.join(', ') || 'Unknown authors'}
                </p>
                <p className="text-gray-700 line-clamp-3 mb-3">{paper.abstract}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {paper.category}
                  </span>
                  {paper.arxiv_id && (
                    <span className="text-gray-500">arXiv: {paper.arxiv_id}</span>
                  )}
                  {paper.published_date && (
                    <span className="text-gray-500">
                      {new Date(paper.published_date).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {paper.rank !== undefined && (
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    Rank: {paper.rank?.toFixed(3)}
                  </div>
                )}
                {paper.similarity !== undefined && (
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                    Similarity: {paper.similarity?.toFixed(3)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {!loading && hybridResults.length === 0 && query && (
          <div className="text-center py-12 text-gray-500">
            No results found. Try a different search query.
          </div>
        )}

        {!query && !loading && (
          <div className="text-center py-12 text-gray-400">
            <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Enter a search query to explore research papers</p>
          </div>
        )}
      </div>
    </div>
  );
}
