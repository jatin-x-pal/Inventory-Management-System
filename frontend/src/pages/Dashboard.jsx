import { useState, useEffect } from 'react';
import api from '../api';
import { Package, Users, ShoppingCart, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          api.get('/products/'),
          api.get('/customers/'),
          api.get('/orders/')
        ]);
        
        const products = productsRes.data;
        const lowStock = products.filter(p => p.stock_quantity < 10).length;
        
        setStats({
          products: products.length,
          customers: customersRes.data.length,
          orders: ordersRes.data.length,
          lowStock
        });
        
        setRecentOrders(ordersRes.data.slice(-5).reverse());
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const kpis = [
    { name: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', trend: '+12%' },
    { name: 'Total Customers', value: stats.customers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', trend: '+5%' },
    { name: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', trend: '+28%' },
    { name: 'Low Stock Items', value: stats.lowStock, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100', trend: '-2%' },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your inventory and sales performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.name} className={`card-container p-5 flex flex-col justify-between group hover:shadow-md transition-all border ${kpi.border}`}>
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={22} />
              </div>
              <div className="flex items-center space-x-1 text-xs font-medium text-emerald-600 bg-emerald-50/80 px-2 py-1 rounded-full border border-emerald-100">
                <TrendingUp size={14} />
                <span>{kpi.trend}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{kpi.name}</p>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{kpi.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-container flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <Link to="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
              View all <ArrowUpRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-xs text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer ID</th>
                  <th className="px-6 py-4">Product ID</th>
                  <th className="px-6 py-4">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white rounded-b-xl">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4 text-slate-600">{order.customer_id}</td>
                    <td className="px-6 py-4 text-slate-600">{order.product_id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {order.quantity} units
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-container flex flex-col bg-white">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Inventory Health</h2>
            <p className="text-xs text-slate-500 mt-1">Status of your stock levels</p>
          </div>
          <div className="p-6 flex flex-col justify-center flex-1 space-y-8">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-slate-700 flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>Healthy Stock</span>
                <span className="text-slate-900 font-semibold">{stats.products - stats.lowStock}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner overflow-hidden">
                <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(stats.products === 0 ? 0 : (stats.products - stats.lowStock) / stats.products) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-slate-700 flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>Low Stock</span>
                <span className="text-slate-900 font-semibold">{stats.lowStock}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner overflow-hidden">
                <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(stats.products === 0 ? 0 : stats.lowStock / stats.products) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
