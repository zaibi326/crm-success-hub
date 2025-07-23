
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Settings, BarChart3, Shield, UserCheck, Target } from 'lucide-react';

interface RoleBasedSettingsProps {
  userRole: 'Admin' | 'Manager' | 'Lead Manager' | 'Employee';
}

const RoleBasedSettings: React.FC<RoleBasedSettingsProps> = ({ userRole }) => {
  const renderEmployeeSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Employee Settings
          <Badge className="bg-green-100 text-green-800 border-green-200">Employee</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Task Notifications</Label>
            <p className="text-sm text-gray-600">Get notified about new task assignments</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Lead Updates</Label>
            <p className="text-sm text-gray-600">Receive updates on assigned leads</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Calendar Sync</Label>
            <p className="text-sm text-gray-600">Sync tasks with your calendar</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );

  const renderLeadManagerSettings = () => (
    <>
      {renderEmployeeSettings()}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Lead Manager Settings
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">Lead Manager</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Lead Assignment Alerts</Label>
              <p className="text-sm text-gray-600">Get notified when leads are assigned</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Lead Performance Reports</Label>
              <p className="text-sm text-gray-600">Weekly lead performance summaries</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Lead Quality Scoring</Label>
              <p className="text-sm text-gray-600">Auto-scoring of lead quality</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            <Target className="w-4 h-4 mr-2" />
            View Lead Analytics
          </Button>
        </CardContent>
      </Card>
    </>
  );

  const renderManagerSettings = () => (
    <>
      {renderLeadManagerSettings()}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manager Settings
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Manager</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Team Performance Reports</Label>
              <p className="text-sm text-gray-600">Weekly team performance summaries</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Campaign Management</Label>
              <p className="text-sm text-gray-600">Create and manage campaigns</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Team Activity Dashboard</Label>
              <p className="text-sm text-gray-600">Access to team activity analytics</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Team Analytics
          </Button>
        </CardContent>
      </Card>
    </>
  );

  const renderAdminSettings = () => (
    <>
      {renderManagerSettings()}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Admin Settings
            <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">System Alerts</Label>
              <p className="text-sm text-gray-600">Critical system notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">User Activity Monitoring</Label>
              <p className="text-sm text-gray-600">Monitor all user activities</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Backup Notifications</Label>
              <p className="text-sm text-gray-600">Daily backup status reports</p>
            </div>
            <Switch />
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-red-600 hover:bg-red-700">
              <Shield className="w-4 h-4 mr-2" />
              System Security
            </Button>
            <Button className="flex-1 bg-gray-600 hover:bg-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              System Config
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  switch (userRole) {
    case 'Admin':
      return <div className="space-y-6">{renderAdminSettings()}</div>;
    case 'Manager':
      return <div className="space-y-6">{renderManagerSettings()}</div>;
    case 'Lead Manager':
      return <div className="space-y-6">{renderLeadManagerSettings()}</div>;
    case 'Employee':
    default:
      return <div className="space-y-6">{renderEmployeeSettings()}</div>;
  }
};

export default RoleBasedSettings;
