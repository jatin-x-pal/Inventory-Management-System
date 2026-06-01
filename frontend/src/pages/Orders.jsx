import { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { Plus, X, ShoppingBag, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', product_id: '', quantity: 1 });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, custRes] = await Promise.all([
        api.get('/orders/'),
        api.get('/products/'),
        api.get('/customers/')
      ]);
      setOrders(ordersRes.data.reverse()); // latest first
      setProducts(productsRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orders/', {
        customer_id: parseInt(formData.customer_id),
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity)
      });
      toast.success('Order placed successfully');
      setShowModal(false);
      setFormData({ customer_id: '', product_id: '', quantity: 1 });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getCustomer = (id) => customers.find(c => c.id === id) || { name: 'Unknown' };
  const getProduct = (id) => products.find(p => p.id === id) || { name: 'Unknown', price: 0 };
  
  const filteredOrders = orders.filter(order => {
    const cust = getCustomer(order.customer_id).name.toLowerCase();
    const prod = getProduct(order.product_id).name.toLowerCase();
    const qr = searchQuery.toLowerCase();
    return cust.includes(qr) || prod.includes(qr) || order.id.toString().includes(qr);
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Review your order history and place new transactions.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary px-4 py-2">
          <Plus size={18} className="mr-2" />
          Create Order
        </button>
      </div>

      <div className="card-container overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, customer, or product..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-xs text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredOrders.map((order) => {
                const product = getProduct(order.product_id);
                const total = product.price * order.quantity;
                
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{getCustomer(order.customer_id).name}</td>
                    <td className="px-6 py-4 text-slate-600">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {order.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">${total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Completed
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingBag size={48} className="text-slate-300 mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-1">No orders found</h3>
                      <p className="text-slate-500">Create your first order or clear search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">Create New Order</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-6 border-b border-slate-100 border-t border-transparent">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Customer</label>
                  <select 
                    required 
                    value={formData.customer_id} 
                    onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                    className="input-field bg-white"
                  >
                    <option value="" disabled>Select a customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Product</label>
                  <select 
                    required 
                    value={formData.product_id} 
                    onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                    className="input-field bg-white"
                  >
                    <option value="" disabled>Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id} disabled={p.stock_quantity === 0}>
                        {p.name} - ${parseFloat(p.price).toFixed(2)} {p.stock_quantity === 0 ? '(Out of Stock)' : `(${p.stock_quantity} available)`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={formData.product_id ? getProduct(parseInt(formData.product_id)).stock_quantity : undefined}
                    required 
                    value={formData.quantity} 
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                    className="input-field" 
                  />
                  {formData.product_id && (
                    <p className="text-xs text-slate-500 mt-1">
                      Available stock: {getProduct(parseInt(formData.product_id)).stock_quantity}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary px-4 py-2">Cancel</button>
                <button type="submit" className="btn btn-primary px-4 py-2">Complete Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
