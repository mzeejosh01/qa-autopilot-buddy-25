
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TestRun {
  run_id: string;
  date: string;
  time: string;
  tests: number;
  passed: number;
  failed: number;
  environment: string;
  project: string;
  duration: string;
  trigger: string;
}

const History = () => {
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  const mockHistory: TestRun[] = [
    {
      run_id: "run_008",
      date: "2025-06-22",
      time: "14:30",
      tests: 4,
      passed: 3,
      failed: 1,
      environment: "staging",
      project: "auth-service",
      duration: "45s",
      trigger: "Manual"
    },
    {
      run_id: "run_007",
      date: "2025-06-22",
      time: "11:15",
      tests: 8,
      passed: 7,
      failed: 1,
      environment: "local",
      project: "user-dashboard",
      duration: "1m 23s",
      trigger: "GitHub PR #156"
    },
    {
      run_id: "run_006",
      date: "2025-06-21",
      time: "16:45",
      tests: 12,
      passed: 12,
      failed: 0,
      environment: "prod",
      project: "payment-api",
      duration: "2m 12s",
      trigger: "Scheduled"
    },
    {
      run_id: "run_005",
      date: "2025-06-21",
      time: "10:30",
      tests: 6,
      passed: 4,
      failed: 2,
      environment: "staging",
      project: "auth-service",
      duration: "58s",
      trigger: "Manual"
    },
    {
      run_id: "run_004",
      date: "2025-06-20",
      time: "15:20",
      tests: 5,
      passed: 5,
      failed: 0,
      environment: "local",
      project: "user-dashboard",
      duration: "42s",
      trigger: "GitHub PR #154"
    },
    {
      run_id: "run_003",
      date: "2025-06-20",
      time: "09:45",
      tests: 15,
      passed: 13,
      failed: 2,
      environment: "staging",
      project: "payment-api",
      duration: "3m 5s",
      trigger: "Manual"
    },
    {
      run_id: "run_002",
      date: "2025-06-19",
      time: "14:10",
      tests: 3,
      passed: 2,
      failed: 1,
      environment: "local",
      project: "auth-service",
      duration: "28s",
      trigger: "Manual"
    },
    {
      run_id: "run_001",
      date: "2025-06-19",
      time: "11:00",
      tests: 7,
      passed: 6,
      failed: 1,
      environment: "staging",
      project: "user-dashboard",
      duration: "1m 15s",
      trigger: "GitHub PR #152"
    }
  ];

  const mockTestDetails = {
    run_008: [
      { test_name: "Login_ValidCredentials", status: "Pass", duration: "2.3s" },
      { test_name: "Login_InvalidEmail", status: "Pass", duration: "1.8s" },
      { test_name: "Login_EmptyCredentials", status: "Fail", duration: "5.1s" },
      { test_name: "Login_WrongPassword", status: "Pass", duration: "2.7s" }
    ],
    run_007: [
      { test_name: "Dashboard_LoadUserData", status: "Pass", duration: "3.2s" },
      { test_name: "Dashboard_FilterData", status: "Pass", duration: "2.1s" },
      { test_name: "Dashboard_ExportCSV", status: "Fail", duration: "8.5s" },
      { test_name: "Profile_UpdateInfo", status: "Pass", duration: "1.9s" }
    ]
  };

  const filteredHistory = mockHistory.filter(run => {
    const matchesEnvironment = environmentFilter === 'all' || run.environment === environmentFilter;
    const matchesProject = projectFilter === 'all' || run.project === projectFilter;
    const matchesSearch = searchTerm === '' || 
      run.run_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesEnvironment && matchesProject && matchesSearch;
  });

  const toggleExpanded = (runId: string) => {
    setExpandedRun(expandedRun === runId ? null : runId);
  };

  const getSuccessRate = (passed: number, total: number) => {
    return Math.round((passed / total) * 100);
  };

  const projects = Array.from(new Set(mockHistory.map(run => run.project)));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Test History</h1>
        <div className="text-sm text-gray-500">
          {filteredHistory.length} of {mockHistory.length} runs
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Search:</label>
              <Input
                placeholder="Run ID or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Environment:</label>
              <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="prod">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Project:</label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project} value={project}>{project}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {filteredHistory.length}
            </div>
            <div className="text-sm text-gray-600">Total Runs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                filteredHistory.reduce((acc, run) => acc + getSuccessRate(run.passed, run.tests), 0) / 
                (filteredHistory.length || 1)
              )}%
            </div>
            <div className="text-sm text-gray-600">Avg Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">
              {filteredHistory.reduce((acc, run) => acc + run.tests, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {filteredHistory.reduce((acc, run) => acc + run.failed, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Failures</div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Test Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredHistory.map((run) => (
              <div key={run.run_id} className="border rounded-lg">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpanded(run.run_id)}
                >
                  <div className="flex items-center space-x-4">
                    {expandedRun === run.run_id ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <div>
                      <div className="font-medium">{run.run_id}</div>
                      <div className="text-sm text-gray-500">{run.project}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <div className="font-medium">{run.date} {run.time}</div>
                      <div className="text-gray-500">{run.trigger}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{run.tests} tests</div>
                      <div className="text-gray-500">{run.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">{run.passed} passed</div>
                      <div className="text-red-600">{run.failed} failed</div>
                    </div>
                    <div className="text-center">
                      <span className={`px-2 py-1 text-xs rounded ${
                        run.environment === 'prod' ? 'bg-red-100 text-red-800' :
                        run.environment === 'staging' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {run.environment}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {getSuccessRate(run.passed, run.tests)}%
                      </div>
                      <div className="text-xs text-gray-500">success</div>
                    </div>
                  </div>
                </div>
                
                {expandedRun === run.run_id && (
                  <div className="border-t p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Test Details</h4>
                    {mockTestDetails[run.run_id as keyof typeof mockTestDetails] ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Test Name</th>
                              <th className="text-left p-2">Status</th>
                              <th className="text-left p-2">Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockTestDetails[run.run_id as keyof typeof mockTestDetails].map((test) => (
                              <tr key={test.test_name} className="border-b">
                                <td className="p-2 font-medium">{test.test_name}</td>
                                <td className="p-2">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    test.status === 'Pass' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {test.status}
                                  </span>
                                </td>
                                <td className="p-2 text-gray-600">{test.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        Test details not available for this run.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
