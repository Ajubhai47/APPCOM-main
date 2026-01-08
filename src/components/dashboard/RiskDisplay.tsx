
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Info, Copy, Eye } from 'lucide-react';

interface RiskDisplayProps {
  riskLevel: 'low' | 'medium' | 'high';
  totalRiskScore: number;
  consecutiveCopyAttempts?: number;
  consecutiveFocusChanges?: number;
}

export const RiskDisplay = ({ 
  riskLevel, 
  totalRiskScore,
  consecutiveCopyAttempts = 0,
  consecutiveFocusChanges = 0
}: RiskDisplayProps) => {
  // UI color based on risk level
  const getRiskColor = () => {
    if (riskLevel === 'low') return 'text-green-500';
    if (riskLevel === 'medium') return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">CURRENT RISK LEVEL</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className={`text-2xl font-bold capitalize ${getRiskColor()}`}>
            {riskLevel}
          </span>
          {riskLevel === 'high' ? (
            <AlertTriangle size={20} className="text-red-500" />
          ) : riskLevel === 'medium' ? (
            <Info size={20} className="text-yellow-500" />
          ) : (
            <Shield size={20} className="text-green-500" />
          )}
        </div>
        
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-500">Risk Score</span>
            <span className={`text-sm font-medium ${getRiskColor()}`}>{totalRiskScore.toFixed(0)}%</span>
          </div>
          <Progress value={totalRiskScore} className="h-2" />
        </div>
        
        {/* Display consecutive activities if there are any */}
        {(consecutiveCopyAttempts > 0 || consecutiveFocusChanges > 0) && (
          <div className="mt-3 space-y-2 text-sm">
            <h4 className="font-medium text-gray-600">Recent patterns:</h4>
            
            {consecutiveCopyAttempts > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <Copy size={14} />
                <span>{consecutiveCopyAttempts} consecutive copy/paste attempts</span>
              </div>
            )}
            
            {consecutiveFocusChanges > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <Eye size={14} />
                <span>{consecutiveFocusChanges} consecutive focus changes</span>
              </div>
            )}
          </div>
        )}
        
        <p className="text-sm mt-4">
          {riskLevel === 'high' 
            ? 'Your current behavior may be flagged as suspicious.' 
            : riskLevel === 'medium'
            ? 'Some unusual activity detected. Continue normally.'
            : 'Everything looks good. Continue your exam.'}
        </p>
      </CardContent>
    </Card>
  );
};
