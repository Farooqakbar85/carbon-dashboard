import StatsCard from "../components/StatCard";
import MapView from "../components/MapView";
import TrendChart from "../components/TrendChart";
import LocationList from "../components/LocationList";
import useDashboardData from "../hooks/useDashboardData";

export default function DashboardPage() {
  const data = useDashboardData();

  if (!data) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl text-white mb-6 font-semibold">
        Real-Time Monitoring Dashboard
      </h1>

      <div className="bg-[#0b1c2c] rounded-2xl p-6 shadow-xl">
        <h2 className="text-green-400 text-xl mb-4">
          Punjab Carbon Offset Tracker
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <StatsCard title="Total Pods" value={data.total_pods} />
            <StatsCard title="Carbon Today" value={data.carbon_today} />
            <StatsCard title="Carbon Month" value={data.carbon_month} />
            <StatsCard title="Total Carbon" value={data.total_carbon} />

            <LocationList locations={data.locations} />
          </div>

          <div className="lg:col-span-3 bg-[#061521] rounded-2xl p-4 border border-green-500/20">
            <h3 className="text-gray-300 mb-2">Deployment Map</h3>
            <MapView locations={data.locations} />

            <div className="mt-4 bg-[#0b1c2c] p-4 rounded-xl">
              <h4 className="text-green-400 mb-2">Location Details</h4>
              <TrendChart trend={data.trend} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}