
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface TestCase {
  test_name: string;
  steps: Array<{
    action: string;
    expected_result: string;
  }>;
  test_data: Record<string, string>;
  priority: string;
}

interface TestResult {
  test_name: string;
  status: 'Pass' | 'Fail';
  error: string;
  duration: string;
}

const Dashboard = () => {
  const [input, setInput] = useState('');
  const [environment, setEnvironment] = useState('staging');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());
  const [runProgress, setRunProgress] = useState(0);

  const mockTestCases: TestCase[] = [
    {
      test_name: "Login_ValidCredentials",
      steps: [
        { action: "Navigate to login page", expected_result: "Login form displayed" },
        { action: "Enter valid email", expected_result: "Email field populated" },
        { action: "Enter valid password", expected_result: "Password field populated" },
        { action: "Click login button", expected_result: "Dashboard loads successfully" }
      ],
      test_data: { email: "user@example.com", password: "Pass123!" },
      priority: "High"
    },
    {
      test_name: "Login_InvalidEmail",
      steps: [
        { action: "Navigate to login page", expected_result: "Login form displayed" },
        { action: "Enter invalid email format", expected_result: "Email validation error shown" }
      ],
      test_data: { email: "@invalid.com", password: "Pass123!" },
      priority: "Medium"
    },
    {
      test_name: "Login_EmptyCredentials",
      steps: [
        { action: "Navigate to login page", expected_result: "Login form displayed" },
        { action: "Click login with empty fields", expected_result: "Required field errors shown" }
      ],
      test_data: { email: "", password: "" },
      priority: "High"
    },
    {
      test_name: "Login_WrongPassword",
      steps: [
        { action: "Enter valid email", expected_result: "Email field populated" },
        { action: "Enter incorrect password", expected_result: "Authentication error displayed" }
      ],
      test_data: { email: "user@example.com", password: "wrongpass" },
      priority: "Medium"
    }
  ];

  const mockResults: TestResult[] = [
    { test_name: "Login_ValidCredentials", status: "Pass", error: "", duration: "2.3s" },
    { test_name: "Login_InvalidEmail", status: "Pass", error: "", duration: "1.8s" },
    { test_name: "Login_EmptyCredentials", status: "Fail", error: "Element not found: #login-button", duration: "5.1s" },
    { test_name: "Login_WrongPassword", status: "Pass", error: "", duration: "2.7s" }
  ];

  const handleGenerateTests = async () => {
    if (!input.trim()) {
      toast({ title: "Please enter a feature description or GitHub PR URL" });
      return;
    }

    setIsGenerating(true);
    
    // Check if input looks like a GitHub PR URL
    if (input.includes('github.com') && input.includes('pull')) {
      toast({ title: "Fetching PR description..." });
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInput("Add login endpoint: POST /api/login expects email and password. Returns JWT token on success, 401 on invalid credentials.");
    }
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    setTestCases(mockTestCases);
    setTestResults([]);
    setIsGenerating(false);
    toast({ title: "Tests Generated!", description: `Generated ${mockTestCases.length} test cases` });
  };

  const handleRunTests = async () => {
    if (testCases.length === 0) {
      toast({ title: "No tests to run. Generate tests first." });
      return;
    }

    setIsRunning(true);
    setRunProgress(0);
    setTestResults([]);

    // Simulate test execution with progress
    for (let i = 0; i <= 100; i += 10) {
      setRunProgress(i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setTestResults(mockResults);
    setIsRunning(false);
    setRunProgress(0);

    const passedTests = mockResults.filter(r => r.status === 'Pass').length;
    const totalTests = mockResults.length;
    
    toast({ 
      title: "Test Run Complete", 
      description: `${passedTests}/${totalTests} tests passed on ${environment} environment` 
    });

    // Show mock Slack notification
    setTimeout(() => {
      toast({
        title: "Slack Notification Sent",
        description: `"QA Autopilot: ${passedTests}/${totalTests} tests passed on ${environment}"`
      });
    }, 1000);
  };

  const toggleTestExpansion = (testName: string) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testName)) {
      newExpanded.delete(testName);
    } else {
      newExpanded.add(testName);
    }
    setExpandedTests(newExpanded);
  };

  const handleExport = (format: 'selenium' | 'postman') => {
    if (testCases.length === 0) {
      toast({ title: "No tests to export. Generate tests first." });
      return;
    }

    let content = '';
    let filename = '';

    if (format === 'selenium') {
      content = `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class LoginTests(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("https://app.com/login")

    def test_login_validcredentials(self):
        driver = self.driver
        driver.find_element(By.ID, "email").send_keys("user@example.com")
        driver.find_element(By.ID, "password").send_keys("Pass123!")
        driver.find_element(By.ID, "login-button").click()
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "dashboard")))

    def test_login_invalidemail(self):
        driver = self.driver
        driver.find_element(By.ID, "email").send_keys("@invalid.com")
        driver.find_element(By.ID, "password").send_keys("Pass123!")
        driver.find_element(By.ID, "login-button").click()
        error = driver.find_element(By.CLASS_NAME, "error-message")
        assert error.is_displayed()

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()`;
      filename = 'qa_autopilot_tests.py';
    } else {
      content = JSON.stringify({
        info: {
          name: "QA Autopilot Tests",
          description: "Generated test collection"
        },
        item: [
          {
            name: "Login Valid Credentials",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({ email: "user@example.com", password: "Pass123!" })
              },
              url: {
                raw: "{{base_url}}/api/login",
                host: ["{{base_url}}"],
                path: ["api", "login"]
              }
            },
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test(\"Status code is 200\", function () {",
                    "    pm.response.to.have.status(200);",
                    "});",
                    "pm.test(\"Response has token\", function () {",
                    "    pm.expect(pm.response.json()).to.have.property('token');",
                    "});"
                  ]
                }
              }
            ]
          }
        ]
      }, null, 2);
      filename = 'qa_autopilot_tests.json';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: `${format === 'selenium' ? 'Selenium' : 'Postman'} tests exported!` });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Test Cases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter feature description or paste GitHub PR URL (e.g., https://github.com/user/repo/pull/123)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Environment:</label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="prod">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateTests} 
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? 'Generating...' : 'Generate Tests'}
            </Button>
            <Button 
              onClick={handleRunTests} 
              disabled={isRunning || testCases.length === 0}
              variant="outline"
            >
              {isRunning ? 'Running...' : 'Run Tests'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running tests on {environment}...</span>
                <span>{runProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${runProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Cases */}
      {testCases.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Test Cases ({testCases.length})</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('selenium')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Selenium
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('postman')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Postman
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testCases.map((test, index) => (
                <div key={test.test_name} className="border rounded-lg">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleTestExpansion(test.test_name)}
                  >
                    <div className="flex items-center space-x-4">
                      {expandedTests.has(test.test_name) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className="font-medium">{test.test_name}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        test.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.priority}
                      </span>
                    </div>
                    {testResults.length > 0 && (
                      <span className={`px-2 py-1 text-xs rounded ${
                        testResults.find(r => r.test_name === test.test_name)?.status === 'Pass'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {testResults.find(r => r.test_name === test.test_name)?.status || 'Not Run'}
                      </span>
                    )}
                  </div>
                  {expandedTests.has(test.test_name) && (
                    <div className="border-t p-4 bg-gray-50">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Test Steps:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            {test.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>
                                <span className="font-medium">{step.action}</span>
                                <span className="text-gray-600"> → {step.expected_result}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2">Test Data:</h4>
                          <div className="bg-white p-2 rounded border text-xs font-mono">
                            {JSON.stringify(test.test_data, null, 2)}
                          </div>
                        </div>
                        {testResults.find(r => r.test_name === test.test_name)?.error && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-red-600">Error:</h4>
                            <div className="bg-red-50 p-2 rounded border text-xs text-red-800">
                              {testResults.find(r => r.test_name === test.test_name)?.error}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter(r => r.status === 'Pass').length}
                </div>
                <div className="text-sm text-green-600">Passed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter(r => r.status === 'Fail').length}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{testResults.length}</div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{environment}</div>
                <div className="text-sm text-gray-600">Environment</div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Test Name</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Duration</th>
                    <th className="text-left p-3">Environment</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result) => (
                    <tr key={result.test_name} className="border-b">
                      <td className="p-3 font-medium">{result.test_name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          result.status === 'Pass' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{result.duration}</td>
                      <td className="p-3 text-gray-600">{environment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
