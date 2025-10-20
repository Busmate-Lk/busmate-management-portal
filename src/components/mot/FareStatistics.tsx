import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface FareStructure {
  id: string;
  status: string;
  perKmRate: number;
}

interface FareStatisticsProps {
  fareStructures: FareStructure[];
}

export default function FareStatistics({
  fareStructures,
}: FareStatisticsProps) {
  const activeFares = fareStructures.filter(
    (f) => f.status === 'Active'
  ).length;
  const expiredFares = fareStructures.filter(
    (f) => f.status === 'Expired'
  ).length;
  const averageFare =
    fareStructures.length > 0
      ? fareStructures.reduce((sum, f) => sum + f.perKmRate, 0) /
        fareStructures.length
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Fare Structures
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {fareStructures.length}
            </p>
            <p className="text-sm text-blue-600">All routes covered</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl border-2 border-green-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center">
          <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Active Fares
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {activeFares}
            </p>
            <p className="text-sm text-green-600">Currently in effect</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center">
          <div className="bg-red-100 text-red-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Expired Fares
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {expiredFares}
            </p>
            <p className="text-sm text-red-600">No longer valid</p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-xl border-2 border-purple-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center">
          <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Average Rate
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              Rs. {averageFare.toFixed(4)}
            </p>
            <p className="text-sm text-purple-600">Per kilometer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
