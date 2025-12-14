import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import { ToastProvider } from "./components/ui/Toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { Layout } from "./components/Layout";
import { AuthInitializer } from "./components/AuthInitializer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import CreateDevice from "./pages/CreateDevice";
import RepairItems from "./pages/RepairItems";
import CreateRepairItem from "./pages/CreateRepairItem";
import EditRepairItem from "./pages/EditRepairItem";
import DeviceDetailPage from "./pages/DeviceDetail";
import EditDevicePage from "./pages/EditDevice";
import TransactionsPage from "./pages/Transactions";
import TransactionDetailPage from "./pages/TransactionDetail";
import CreateTransactionPage from "./pages/CreateTransaction";
import EditTransactionPage from "./pages/EditTransaction";
import WarrantiesPage from "./pages/Warranties";
import WarrantyDetailPage from "./pages/WarrantyDetail";
import CreateWarrantyPage from "./pages/CreateWarranty";
import EditWarrantyPage from "./pages/EditWarranty";
import UsersPage from "./pages/Users";
import CreateUserPage from "./pages/CreateUser";
import EditUserPage from "./pages/EditUser";
import SettingsPage from "./pages/Settings";
import BrandsPage from "./pages/Brands";
import CreateBrandPage from "./pages/CreateBrand";
import EditBrandPage from "./pages/EditBrand";
import DeviceModelsPage from "./pages/DeviceModels";
import CreateDeviceModelPage from "./pages/CreateDeviceModel";
import EditDeviceModelPage from "./pages/EditDeviceModel";
import ServiceCatalogPage from "./pages/ServiceCatalog";
import CreateServiceCatalogPage from "./pages/CreateServiceCatalog";
import EditServiceCatalogPage from "./pages/EditServiceCatalog";
import CustomersPage from "./pages/Customers";
import CreateCustomerPage from "./pages/CreateCustomer";
import EditCustomerPage from "./pages/EditCustomer";
import RepairSessionsPage from "./pages/RepairSessions";
import CreateRepairSessionPage from "./pages/CreateRepairSession";
import EditRepairSessionPage from "./pages/EditRepairSession";
import RepairSessionDetailPage from "./pages/RepairSessionDetail";
import NotFoundPage from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ToastProvider>
          <AuthInitializer />
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
                  <Route
                    path="/devices/:id/edit"
                    element={<EditDevicePage />}
                  />
                  <Route path="/repair-items" element={<RepairItems />} />
                  <Route
                    path="/repair-items/new"
                    element={<CreateRepairItem />}
                  />
                  <Route
                    path="/repair-items/:id/edit"
                    element={<EditRepairItem />}
                  />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route
                    path="/transactions/new"
                    element={<CreateTransactionPage />}
                  />
                  <Route
                    path="/transactions/:id"
                    element={<TransactionDetailPage />}
                  />
                  <Route
                    path="/transactions/:id/edit"
                    element={<EditTransactionPage />}
                  />
                  <Route path="/warranties" element={<WarrantiesPage />} />
                  <Route
                    path="/warranties/new"
                    element={<CreateWarrantyPage />}
                  />
                  <Route
                    path="/warranties/:id"
                    element={<WarrantyDetailPage />}
                  />
                  <Route
                    path="/warranties/:id/edit"
                    element={<EditWarrantyPage />}
                  />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/users/new" element={<CreateUserPage />} />
                  <Route path="/users/:id/edit" element={<EditUserPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/brands" element={<BrandsPage />} />
                  <Route path="/brands/new" element={<CreateBrandPage />} />
                  <Route path="/brands/:id/edit" element={<EditBrandPage />} />
                  <Route path="/device-models" element={<DeviceModelsPage />} />
                  <Route
                    path="/device-models/new"
                    element={<CreateDeviceModelPage />}
                  />
                  <Route
                    path="/device-models/:id/edit"
                    element={<EditDeviceModelPage />}
                  />
                  <Route
                    path="/service-catalog"
                    element={<ServiceCatalogPage />}
                  />
                  <Route
                    path="/service-catalog/new"
                    element={<CreateServiceCatalogPage />}
                  />
                  <Route
                    path="/service-catalog/:id/edit"
                    element={<EditServiceCatalogPage />}
                  />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route
                    path="/customers/new"
                    element={<CreateCustomerPage />}
                  />
                  <Route
                    path="/customers/:id/edit"
                    element={<EditCustomerPage />}
                  />
                  <Route
                    path="/repair-sessions"
                    element={<RepairSessionsPage />}
                  />
                  <Route
                    path="/repair-sessions/new"
                    element={<CreateRepairSessionPage />}
                  />
                  <Route
                    path="/repair-sessions/:id"
                    element={<RepairSessionDetailPage />}
                  />
                  <Route
                    path="/repair-sessions/:id/edit"
                    element={<EditRepairSessionPage />}
                  />
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
