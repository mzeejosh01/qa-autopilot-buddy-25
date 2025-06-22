
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Github, GitBranch, Folder, ExternalLink } from 'lucide-react';

const GitHubIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [repoStructure, setRepoStructure] = useState<any>(null);

  const mockRepos = [
    { id: 1, name: 'my-webapp', full_name: 'user/my-webapp', private: false, language: 'TypeScript' },
    { id: 2, name: 'landing-page', full_name: 'user/landing-page', private: true, language: 'JavaScript' },
    { id: 3, name: 'api-backend', full_name: 'user/api-backend', private: false, language: 'Python' }
  ];

  const mockStructure = {
    components: [
      'src/components/Auth/LoginForm.tsx',
      'src/components/Auth/SignupForm.tsx',
      'src/components/Landing/BookDemoForm.tsx',
      'src/components/Dashboard/UserProfile.tsx'
    ],
    pages: [
      'src/pages/Login.tsx',
      'src/pages/Signup.tsx',
      'src/pages/Dashboard.tsx',
      'src/pages/BookDemo.tsx'
    ],
    routes: [
      { path: '/login', component: 'Login.tsx' },
      { path: '/signup', component: 'Signup.tsx' },
      { path: '/dashboard', component: 'Dashboard.tsx' },
      { path: '/book-demo', component: 'BookDemo.tsx' }
    ],
    apis: [
      'POST /api/auth/login',
      'POST /api/auth/signup',
      'POST /api/demo/book',
      'GET /api/user/profile'
    ]
  };

  const handleConnectGitHub = async () => {
    setIsLoading(true);
    
    // Simulate GitHub OAuth flow
    toast({ title: "Redirecting to GitHub...", description: "Please authorize QA Autopilot to access your repositories." });
    
    setTimeout(() => {
      setIsConnected(true);
      setRepositories(mockRepos);
      setIsLoading(false);
      toast({ title: "GitHub Connected!", description: "Successfully connected to your GitHub account." });
    }, 2000);
  };

  const handleAnalyzeRepository = async () => {
    if (!selectedRepo) {
      toast({ title: "Please select a repository to analyze" });
      return;
    }

    setIsLoading(true);
    toast({ title: "Analyzing repository...", description: "Scanning code structure and identifying testable components." });

    setTimeout(() => {
      setRepoStructure(mockStructure);
      setIsLoading(false);
      toast({ 
        title: "Repository Analyzed!", 
        description: `Found ${mockStructure.components.length} components and ${mockStructure.pages.length} pages ready for testing.`
      });
    }, 3000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setRepositories([]);
    setSelectedRepo('');
    setRepoStructure(null);
    toast({ title: "GitHub Disconnected", description: "Your GitHub connection has been removed." });
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Connect your GitHub account to analyze your repository structure and generate intelligent test cases based on your actual codebase.
          </p>
          <div className="space-y-2">
            <h4 className="font-medium">What we'll analyze:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• React components and their props</li>
              <li>• Form elements and interactive buttons</li>
              <li>• API endpoints and integrations</li>
              <li>• Route structure and navigation paths</li>
              <li>• State management and data flow</li>
            </ul>
          </div>
          <Button 
            onClick={handleConnectGitHub} 
            disabled={isLoading}
            className="bg-gray-900 hover:bg-gray-800"
          >
            <Github className="w-4 h-4 mr-2" />
            {isLoading ? 'Connecting...' : 'Connect GitHub'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Integration
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Connected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Connected to GitHub account. Select a repository to analyze for testing.
          </p>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </CardContent>
      </Card>

      {/* Repository Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Repository</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedRepo} onValueChange={setSelectedRepo}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a repository to analyze..." />
            </SelectTrigger>
            <SelectContent>
              {repositories.map((repo) => (
                <SelectItem key={repo.id} value={repo.full_name}>
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    <span>{repo.full_name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {repo.language}
                    </Badge>
                    {repo.private && (
                      <Badge variant="outline" className="text-xs">
                        Private
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleAnalyzeRepository} 
            disabled={!selectedRepo || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Repository'}
          </Button>
        </CardContent>
      </Card>

      {/* Repository Analysis Results */}
      {repoStructure && (
        <Card>
          <CardHeader>
            <CardTitle>Repository Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Components */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Testable Components ({repoStructure.components.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {repoStructure.components.map((component: string, index: number) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded border">
                    <span className="font-mono">{component}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pages */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Pages ({repoStructure.pages.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {repoStructure.pages.map((page: string, index: number) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded border">
                    <span className="font-mono">{page}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Routes */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Discovered Routes ({repoStructure.routes.length})
              </h4>
              <div className="space-y-2">
                {repoStructure.routes.map((route: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border">
                    <span className="font-mono">{route.path}</span>
                    <span className="text-gray-600">{route.component}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* APIs */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                API Endpoints ({repoStructure.apis.length})
              </h4>
              <div className="space-y-2">
                {repoStructure.apis.map((api: string, index: number) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded border">
                    <span className="font-mono">{api}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-4">
                Repository analysis complete! You can now generate intelligent tests based on your actual codebase structure.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Generate Smart Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GitHubIntegration;
