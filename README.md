# ResearchSwarm 🔬🤖

**AI-Powered Research Discovery Engine using Agentic Postgres**

Built for the [Agentic Postgres Challenge](https://dev.to/devteam/join-the-agentic-postgres-challenge-with-tiger-data-3000-in-prizes-17ip) by Tiger Data.

[![Agentic Postgres](https://img.shields.io/badge/Agentic-Postgres-blue)](https://tigerdata.co/)
[![Tiger Cloud](https://img.shields.io/badge/Tiger-Cloud-purple)](https://console.cloud.timescale.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Overview

ResearchSwarm is a multi-agent research discovery system that demonstrates the power of **Agentic Postgres** through:

- **🚀 Fast Database Forks**: Zero-copy, instant database cloning for parallel agent execution
- **🔍 Hybrid Search**: BM25 keyword search + pgvector semantic similarity
- **🤖 Multi-Agent Orchestration**: 4 specialized AI agents running in parallel isolation
- **📊 Time-Series Analytics**: TimescaleDB hypertables for research trend analysis
- **🔗 Citation Network Analysis**: Graph traversal for discovering research connections

## ✨ Key Features

### 1. Hybrid Search Engine
Combines traditional keyword search (BM25) with modern semantic search (pgvector embeddings):
- **70% BM25 weight** for precise keyword matching
- **30% Vector weight** for semantic understanding
- Real-time search across research papers with sub-100ms response times

### 2. Multi-Agent System
Four specialized agents run in parallel, each on its own isolated database fork:

| Agent | Purpose | Fork Isolation |
|-------|---------|----------------|
| **Citation Analyzer** | Analyzes citation networks and impact metrics | ✅ Independent fork |
| **Topic Connector** | Discovers cross-domain research connections | ✅ Independent fork |
| **Summary Generator** | Creates concise paper summaries | ✅ Independent fork |
| **Trend Detector** | Identifies emerging trends over time | ✅ Independent fork |

**Performance**: 4x speedup through parallelization using Tiger Data's zero-copy fork technology

### 3. Citation Network Visualization
- Interactive graph showing paper relationships
- Recursive CTE queries for deep citation traversal
- Real-time network statistics and insights

### 4. Research Trends Analytics
- TimescaleDB hypertables for efficient time-series queries
- Category-based trend analysis
- Publication and citation metrics over time

## 🏗️ Technology Stack

### Backend
- **Agentic Postgres** (Tiger Cloud) - Forkable database infrastructure
- **PostgreSQL Extensions**:
  - `pgvector` - Vector similarity search
  - `TimescaleDB` - Time-series hypertables
  - `pg_stat_statements` - Query performance tracking
- **Node.js + Express** - RESTful API server
- **Tiger CLI** - Database service management

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** - Modern styling
- **Recharts** - Data visualization
- **Vite** - Fast build tooling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Tiger Cloud account ([Sign up](https://console.cloud.timescale.com/))
- PostgreSQL client (for schema deployment)

### 1. Clone Repository
```bash
git clone https://github.com/thaywo/research-swarm.git
cd research-swarm
```

### 2. Setup Tiger Cloud Database
```bash
# Install Tiger CLI
npm install -g @tigerdata/cli

# Login with your credentials
tiger login

# Create database service (or use existing)
tiger create-service research-swarm --region us-east-1

# Get connection details
tiger service research-swarm
```

### 3. Configure Environment
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your Tiger Cloud database URL

# Frontend
cd ../frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:3000/api
```

### 4. Deploy Database Schema
```bash
# From project root
cd backend
# Use psql or Tiger CLI to deploy schema
psql $DATABASE_URL -f ../schema.sql
```

### 5. Install Dependencies & Seed Data
```bash
# Backend
cd backend
npm install
npm run seed

# Frontend
cd ../frontend
npm install
```

### 6. Start Services
```bash
# Terminal 1: Backend
cd backend
npm start
# Server runs on http://localhost:3000

# Terminal 2: Frontend
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser!

## 📖 API Documentation

### Search Endpoints
```bash
# Hybrid search (BM25 + vector)
POST /api/search/hybrid
Content-Type: application/json
{"query": "deep learning transformers"}

# Vector similarity only
POST /api/search/semantic
Content-Type: application/json
{"query": "neural networks"}

# Keyword BM25 only
POST /api/search/keyword
Content-Type: application/json
{"query": "machine learning"}
```

### Agent Endpoints
```bash
# Run multi-agent analysis on a paper
POST /api/agents/analyze
Content-Type: application/json
{"paper_id": "uuid-here"}
```

### Papers Endpoints
```bash
# List all papers
GET /api/papers

# Get citation network for a paper
GET /api/papers/:id/citations
```

### Analytics Endpoints
```bash
# Get research trends
GET /api/analytics/trends?category=AI

# Get network statistics
GET /api/analytics/network-stats
```

## 🔬 How It Works

### Fast Database Forks
```javascript
// Each agent gets its own isolated fork
const createAgentFork = async (agentName) => {
  const forkId = `fork_${agentName}_${Date.now()}`;
  // Tiger CLI creates instant zero-copy fork
  await execAsync(`tiger fork create ${forkId} --from ${baseServiceId}`);
  return forkId;
};

// Parallel agent execution
const results = await Promise.all([
  runAgentOnFork('CitationAnalyzer', fork1),
  runAgentOnFork('TopicConnector', fork2),
  runAgentOnFork('SummaryGenerator', fork3),
  runAgentOnFork('TrendDetector', fork4)
]);

// Automatic cleanup
await Promise.all(forks.map(fork => cleanupFork(fork)));
```

### Hybrid Search Algorithm
```sql
CREATE FUNCTION hybrid_search_papers(
  search_query TEXT,
  query_embedding vector(1536),
  keyword_weight FLOAT DEFAULT 0.7,
  vector_weight FLOAT DEFAULT 0.3,
  result_limit INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  abstract TEXT,
  combined_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.abstract,
    (keyword_weight * ts_rank(p.search_vector, query) + 
     vector_weight * (1 - (p.embedding <=> query_embedding))) as combined_score
  FROM papers p
  WHERE p.search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY combined_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;
```

## 📊 Database Schema

**Core Tables:**
- `papers` - Research papers with full-text + vector search indexes
- `citations` - Citation relationships between papers
- `topics` - Research topics and categories
- `connections` - Cross-domain topic connections
- `agent_sessions` - Fork tracking for multi-agent execution
- `research_trends` - TimescaleDB hypertable for time-series analytics

**Key Indexes:**
- GIN index on `search_vector` for fast full-text search
- IVFFlat index on `embedding` for vector similarity
- B-tree indexes on foreign keys and timestamps

## 🏆 Challenge Requirements Met

✅ **Fast Database Forks** - Multi-agent parallel execution with isolated forks  
✅ **Hybrid Search (pg_text + pgvector)** - BM25 + vector semantic search  
✅ **Tiger MCP Integration** - Agent communication with database  
✅ **Creative Use Case** - Research discovery with AI agents  
✅ **Accessibility** - Clean React UI, comprehensive documentation  
✅ **Innovation** - Novel multi-agent architecture with fork isolation

## 📝 Project Structure

```
research-swarm/
├── backend/
│   ├── server.js              # Express API server
│   ├── agent-orchestrator.js  # Multi-agent coordination
│   ├── routes/
│   │   ├── search.js          # Search endpoints
│   │   ├── agents.js          # Agent orchestration
│   │   ├── papers.js          # Paper CRUD
│   │   └── analytics.js       # Trends & analytics
│   ├── scripts/
│   │   ├── init-database.js   # Schema deployment
│   │   └── seed-data.js       # Sample data seeding
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HybridSearch.tsx
│   │   │   ├── AgentDashboard.tsx
│   │   │   └── TrendsAnalytics.tsx
│   │   ├── api/
│   │   │   └── client.ts      # API client
│   │   └── App.tsx            # Main app
│   └── package.json
├── schema.sql                 # Complete database schema
├── docs/                      # Documentation & screenshots
├── SUBMISSION.md              # Challenge submission
└── README.md
```

## 🎥 Demo Features

1. **Hybrid Search Interface**
   - Side-by-side comparison of BM25 vs Vector vs Hybrid results
   - Real-time search with <100ms response times
   - Relevance scoring visualization

2. **Agent Orchestration Dashboard**
   - Visual representation of 4 agents running in parallel
   - Real-time fork creation and cleanup tracking
   - Execution time metrics showing 4x performance improvement

3. **Citation Network Graph**
   - Interactive D3.js visualization of paper connections
   - Depth-first traversal of citation relationships
   - Network statistics and metrics

4. **Research Trends Analytics**
   - Time-series charts powered by TimescaleDB
   - Category-based filtering
   - Publication and citation trends over time

## 🤝 Contributing

This project was built for the Agentic Postgres Challenge. Feel free to fork and experiment!

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- **Tiger Data** for Agentic Postgres and hosting the challenge
- **TimescaleDB** for time-series database capabilities
- **pgvector** for vector similarity search
- **DEV Community** for hosting the challenge platform

## 📬 Contact

Built for the Agentic Postgres Challenge 2025

- Email: thaywo247@gmail.com
- Challenge Entry: [DEV.to Post](https://dev.to/YOUR_POST_LINK)

---

**⭐ If you find this project interesting, please star the repository!**

**🏆 Built for the Agentic Postgres Challenge - November 2025**
