import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, Box } from 'lucide-react';
import { cn } from '../utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
];

const Sidebar = ({ isOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 hidden sm:flex",
        isOpen ? "translate-x-0 flex" : "-translate-x-full"
      )}>
        <div className="flex items-center h-16 px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Box size={20} className="text-white" />
            </div>
            <span className="text-slate-900">Inventry<span className="text-blue-600">.</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 text-blue-700 font-semibold" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={20} 
                    className={cn(
                      "mr-3 transition-colors", 
                      isActive ? "text-blue-600 cursor-default" : "text-slate-400 group-hover:text-slate-600"
                    )} 
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">Admin User</span>
              <span className="text-xs text-slate-500">admin@inventry.app</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
