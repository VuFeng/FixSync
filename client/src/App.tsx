import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import { ToastProvider } from "./components/ui/Toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import CreateDevice from "./pages/CreateDevice";
import RepairItems from "./pages/RepairItems";
import CreateRepairItem from "./pages/CreateRepairItem";
import DeviceDetailPage from "./pages/DeviceDetail";
import TransactionsPage from "./pages/Transactions";
import WarrantiesPage from "./pages/Warranties";
import UsersPage from "./pages/Users";
import BrandsPage from "./pages/Brands";
import CreateBrandPage from "./pages/CreateBrand";
import EditBrandPage from "./pages/EditBrand";

function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/devices/new" element={<CreateDevice />} />
                <Route path="/devices/:id" element={<DeviceDetailPage />} />
                <Route path="/repair-items" element={<RepairItems />} />
                <Route path="/repair-items/new" element={<CreateRepairItem />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/warranties" element={<WarrantiesPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/brands/new" element={<CreateBrandPage />} />
                <Route path="/brands/:id/edit" element={<EditBrandPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryProvider>
  );
}

export default App;
