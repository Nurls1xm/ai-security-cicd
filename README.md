# AI Security Analysis for CI/CD

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

AI-powered security analysis system that automatically scans your entire repository before deployment using n8n, LangChain, and Google Gemini.

## How It Works

After every `git push` to GitHub:

1. Jenkins automatically clones the repository
2. Scans ONLY the `tests/` directory for dangerous code patterns
3. Sends results to n8n via webhook
4. n8n passes data to AI (Gemini via LangChain)
5. AI analyzes and decides: YES (deploy) or NO (block)
6. Jenkins continues deployment (YES) or stops pipeline (NO)

## Architecture

```
Developer Push → GitHub
                   ↓
              Jenkins (auto-trigger)
                   ↓
         Clone Repository
                   ↓
    Security Scan (tests/ directory only)
                   ↓
         POST → n8n Webhook
                   ↓
    n8n → LangChain → Gemini AI
                   ↓
         AI Decision: YES/NO
                   ↓
              OPAL Policy Check
                   ↓
         Final Decision: Allow/Block
                   ↓
              Jenkins
         ↙              ↘
    YES: Deploy    NO: Block
```

## Features

- **Tests Directory Scan** - Scans only `tests/` directory for quick demonstrations
- **AI-Powered Decisions** - Gemini AI analyzes code and makes deployment decisions
- **Policy-Based Control** - OPAL manages security policies and access control
- **Automatic Blocking** - Stops deployment if dangerous code patterns found
- **LangChain Integration** - Uses AI Agent with Google Gemini Chat Model
- **Kazakh Language** - AI prompts and responses in Kazakh
- **GitHub Integration** - Automatic trigger on every push
- **Easy Demo** - Modify `tests/test.py` to show different scenarios

## What Gets Scanned

Jenkins scans ONLY the `tests/` directory for these dangerous patterns:

### Python
- `eval()` - arbitrary code execution
- `exec()` - code execution
- `os.system()` - system command execution
- `subprocess.call()` - subprocess execution

### JavaScript/TypeScript
- `eval()` - arbitrary code execution
- `exec()` - system command execution  
- `innerHTML` - XSS vulnerabilities

## AI Decision Logic

### AI Allows Deployment (YES)
- No dangerous code patterns found in `tests/`
- All files are safe

### AI Blocks Deployment (NO)
- Dangerous code detected (eval/exec/os.system/subprocess)
- Security risk found in `tests/` directory

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Google Gemini API key ([get it here](https://makersuite.google.com/app/apikey))
- GitHub repository
- 2GB RAM minimum

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ai-security-cicd.git
cd ai-security-cicd

# 2. Start services
docker-compose up -d

# 3. Configure n8n
# - Open http://localhost:5678
# - Import workflow: n8n-workflows/ai-security-langchain.json
# - Add Gemini API credential
# - Activate workflow

# 4. Configure Jenkins
# - Open http://localhost:8080
# - Create Pipeline from SCM
# - Repository: https://github.com/yourusername/ai-security-cicd.git
# - Script Path: jenkins/Jenkinsfile

# 5. Setup GitHub Webhook
# - Repository Settings → Webhooks → Add webhook
# - URL: http://your-jenkins-url:8080/github-webhook/
# - Content type: application/json
# - Events: Just the push event
```

## Configuration

### Jenkins Pipeline Setup

1. Open Jenkins: http://localhost:8080
2. New Item → Pipeline
3. Name: `AI-Security-CI-CD`
4. Pipeline from SCM:
   - SCM: Git
   - Repository URL: `https://github.com/yourusername/ai-security-cicd.git`
   - Branch: `*/main`
   - Script Path: `jenkins/Jenkinsfile`
5. Build Triggers:
   - Enable: GitHub hook trigger for GITScm polling
6. Save

### GitHub Webhook Setup

1. Go to: Repository → Settings → Webhooks
2. Add webhook:
   - Payload URL: `http://your-jenkins-url:8080/github-webhook/`
   - Content type: `application/json`
   - Events: Just the push event
   - Active: checked
3. Add webhook

### n8n Workflow Setup

1. Open n8n: http://localhost:5678
2. Import workflow: `n8n-workflows/ai-security-langchain.json`
3. Configure Google Gemini credential:
   - Click on "Google Gemini Chat Model" node
   - Add Credential
   - Enter your Gemini API key
4. Activate workflow (toggle ON in top-right corner)

## Example Workflow

### Scenario 1: Safe Code

Current `tests/test.py` is safe.

```bash
git push origin main
```

**Result:**
```
✓ Repository cloned
✓ Security scan: tests/ directory - 0 dangerous patterns
✓ AI Decision: YES
✓ Build successful
✓ Deploy successful
```

### Scenario 2: Dangerous Code

Add dangerous code to `tests/test.py`:

```python
def dangerous_function(user_input):
    eval(user_input)  # DANGEROUS!
```

```bash
git add tests/test.py
git commit -m "Add eval()"
git push origin main
```

**Result:**
```
✓ Repository cloned
⚠ Security scan: eval() found in tests/test.py
✗ AI Decision: NO
✗ Pipeline FAILURE
✗ Deploy BLOCKED
```

## Testing the Pipeline

### Test 1: Safe code (current state)

```bash
git add tests/test.py
git commit -m "Safe code"
git push origin main
```

Jenkins will:
1. Clone repository
2. Scan `tests/` directory
3. Find no dangerous patterns
4. AI approves deployment
5. Pipeline SUCCESS

### Test 2: Add dangerous code

```bash
# Edit tests/test.py and add:
# def dangerous(): eval(user_input)

git add tests/test.py
git commit -m "Add eval()"
git push origin main
```

Jenkins will:
1. Clone repository
2. Scan `tests/` directory
3. Find eval() pattern
4. AI blocks deployment
5. Pipeline FAILURE

See `tests/README.md` for more demo scenarios.

## Components

| Component | Technology | Port | Description |
|-----------|-----------|------|----------|
| **n8n** | Node.js | 5678 | Workflow automation and AI integration |
| **Jenkins** | Java | 8080 | CI/CD orchestration |
| **Gemini AI** | Google | - | AI security analysis via LangChain |
| **OPAL Server** | Python | 7002 | Policy management and distribution |
| **OPAL Client** | Python | 7000, 8181 | Policy enforcement (OPA) |
| **PostgreSQL** | Database | 5432 | OPAL data storage |

## Project Structure

```
ai-security-cicd/
├── docker-compose.yml          # Infrastructure
├── n8n-workflows/
│   └── ai-security-langchain.json    # AI workflow with LangChain
├── jenkins/
│   └── Jenkinsfile            # CI/CD pipeline
├── opal-policies/
│   ├── security.rego          # Security policies
│   ├── rbac.rego              # Access control policies
│   └── data.json              # Policy data
├── tests/
│   ├── README.md              # Demo scenarios
│   └── test.py                # Test file for demonstrations
├── scripts/
│   └── setup.js               # Setup script
├── .env.example               # Environment variables template
├── package.json               # Dependencies
├── LICENSE                    # MIT License
├── OPAL_INTEGRATION.md        # OPAL documentation
└── README.md                  # This file
```

## Environment Variables

Create `.env` file:

```env
N8N_PORT=5678
JENKINS_PORT=8080
GEMINI_API_KEY=your_api_key_here
```

## Troubleshooting

### Jenkins not triggering automatically

1. Check GitHub webhook: Settings → Webhooks → Recent Deliveries
2. Check Jenkins: Manage Jenkins → Configure System → GitHub
3. Check firewall/network settings

### n8n not responding

```bash
docker-compose restart ai-security-n8n
docker logs ai-security-n8n
```

### OPAL not working

```bash
# Check OPAL services
docker logs ai-security-opal-server
docker logs ai-security-opal-client

# Test OPAL endpoint
curl http://localhost:8181/v1/data

# Restart OPAL
docker-compose restart opal-server opal-client
```

### API Rate Limit

Wait 1-2 minutes or use paid Gemini API key for higher limits.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- n8n for workflow automation
- Google Gemini for AI analysis
- Jenkins for CI/CD orchestration
- LangChain for AI integration
- OPAL for policy management
- Open Policy Agent (OPA) for policy enforcement

## Support

If you have any questions or issues, please open an issue on GitHub.

---

Made with care for secure CI/CD pipelines


---

## OPAL Policy Management

OPAL (Open Policy Administration Layer) manages security policies and access control.

### Policy Files

- `opal-policies/security.rego` - Deployment security rules
- `opal-policies/rbac.rego` - Role-based access control  
- `opal-policies/data.json` - Policy configuration data

### How OPAL Works

1. **AI Analysis** - Gemini analyzes code and returns risk assessment
2. **OPAL Check** - Policies evaluate AI decision against rules
3. **Final Decision** - Allow or block deployment based on policies

### Policy Rules

**Allow Deployment:**
- LOW risk + confidence ≥ 0.8
- MEDIUM risk + confidence ≥ 0.9 + no critical issues
- Manual approval granted

**Block Deployment:**
- CRITICAL or HIGH risk
- Dangerous patterns detected
- Policy violations

### Testing OPAL Policies

```bash
# Test LOW risk (should allow)
curl -X POST http://localhost:8181/v1/data/security/deployment_decision \
  -H 'Content-Type: application/json' \
  -d '{
    "input": {
      "riskLevel": "LOW",
      "confidence": 0.95,
      "criticalIssues": [],
      "dangerousPatterns": 0
    }
  }'

# Test HIGH risk (should block)
curl -X POST http://localhost:8181/v1/data/security/deployment_decision \
  -H 'Content-Type: application/json' \
  -d '{
    "input": {
      "riskLevel": "HIGH",
      "confidence": 0.95,
      "criticalIssues": ["eval() found"],
      "dangerousPatterns": 1
    }
  }'
```

### Updating Policies

Policies are automatically updated from Git:

```bash
# Edit policy files
nano opal-policies/security.rego

# Commit and push
git add opal-policies/
git commit -m "Update security policies"
git push origin main

# OPAL Server automatically pulls and distributes updates
```

For more details, see [OPAL_INTEGRATION.md](OPAL_INTEGRATION.md)
