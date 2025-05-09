import { useState } from 'react';
import Card from '../common/card/Card';
import CardHeader from '../common/card/CardHeader';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  priority?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'primary':
      return 'from-theme to-theme-light';
    case 'secondary':
      return 'from-gray-500 to-gray-600';
    case 'success':
      return 'from-green-500 to-green-600';
    case 'warning':
      return 'from-amber-500 to-amber-600';
    case 'danger':
      return 'from-red-500 to-red-600';
    default:
      return 'from-theme to-theme-light';
  }
};

const StatCard = ({ title, value, subtitle, icon, trend, priority = 'primary' }: StatCardProps) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Card className="transition-all duration-300 hover:shadow-lg overflow-hidden relative group">
      <div 
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getPriorityColor(priority)}`}
      ></div>
      <CardHeader priority={priority} displayText={title} />
      <div className="p-20 text-center relative">
        {icon && (
          <div className={`mb-8 transform transition-transform duration-500 ${hovered ? 'scale-110' : ''}`}
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
          >
            {icon}
          </div>
        )}
        <div className="text-36 font-bold group-hover:scale-105 transition-transform duration-300">{value}</div>
        {subtitle && <div className="text-14 mt-4 text-gray-600">{subtitle}</div>}
        {trend && (
          <div className={`mt-4 flex items-center justify-center text-14 font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <div className={`flex items-center px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className="mr-1">{trend.isPositive ? '↑' : '↓'}</span>
              <span>{trend.value}%</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
