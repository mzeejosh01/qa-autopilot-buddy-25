
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const [githubToken, setGithubToken] = useState('ghp_xxxxxxxxxxxxxxxxxxxx');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/xxx/xxx/xxx');
  const [slackNotifications, setSlackNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const [defaultEnvironment, setDefaultEnvironment] = useState('staging');

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast({ 
      title: "Settings Saved", 
      description: "Your configuration has been updated successfully." 
    });
  };

  const handleTestSlack = () => {
    toast({ 
      title: "Testing Slack Integration", 
      description: "Sending test message..." 
    });
    
    setTimeout(() => {
      toast({ 
        title: "Slack Test Successful", 
        description: "Test message sent to #qa-alerts channel." 
      });
    }, 2000);
  };

  const handleTestGithub = () => {
    toast({ 
      title: "Testing GitHub Integration", 
      description: "Validating GitHub token..." 
    });
    
    setTimeout(() => {
      toast({ 
        title: "GitHub Test Successful", 
        description: "Successfully connected to GitHub API." 
      });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      {/* GitHub Integration */}
      <Card>
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub Personal Access Token</label>
            <div className="flex gap-2">
              <Input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="flex-1"
              />
              <Button variant="outline" onClick={handleTestGithub}>
                Test Connection
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Required permissions: repo, pull_requests. 
              <a href="https://github.com/settings/tokens" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Generate token
              </a>
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto-run tests on PR creation</div>
              <div className="text-sm text-gray-500">
                Automatically generate and run tests when a new PR is created
              </div>
            </div>
            <Switch checked={autoRun} onCheckedChange={setAutoRun} />
          </div>
        </CardContent>
      </Card>

      {/* Slack Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Slack Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Slack Webhook URL</label>
            <div className="flex gap-2">
              <Input
                type="password"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="flex-1"
              />
              <Button variant="outline" onClick={handleTestSlack}>
                Test Message
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Messages will be sent to the configured channel when tests complete.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enable Slack notifications</div>
              <div className="text-sm text-gray-500">
                Get notified in Slack when test runs complete
              </div>
            </div>
            <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Test Execution Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Test Execution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Default Environment</label>
            <select 
              value={defaultEnvironment}
              onChange={(e) => setDefaultEnvironment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="local">Local</option>
              <option value="staging">Staging</option>
              <option value="prod">Production</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Timeout (seconds)</label>
              <Input type="number" defaultValue="30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Parallel Tests</label>
              <Input type="number" defaultValue="5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Email notifications</div>
              <div className="text-sm text-gray-500">
                Receive email alerts for failed test runs
              </div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input 
              type="email" 
              placeholder="your-email@company.com"
              disabled={!emailNotifications}
              className={!emailNotifications ? 'bg-gray-100' : ''}
            />
          </div>
        </CardContent>
      </Card>

      {/* Environment URLs */}
      <Card>
        <CardHeader>
          <CardTitle>Environment URLs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Local Environment</label>
            <Input defaultValue="http://localhost:3000" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Staging Environment</label>
            <Input defaultValue="https://staging.yourapp.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Production Environment</label>
            <Input defaultValue="https://yourapp.com" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Version</div>
              <div className="text-gray-600">QA Autopilot v1.0.0</div>
            </div>
            <div>
              <div className="font-medium">Last Updated</div>
              <div className="text-gray-600">June 22, 2025</div>
            </div>
            <div>
              <div className="font-medium">Test Runner</div>
              <div className="text-gray-600">Selenium 4.15.0</div>
            </div>
            <div>
              <div className="font-medium">Status</div>
              <div className="text-green-600">●  Online</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
