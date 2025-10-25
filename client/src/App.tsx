import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Vehicles from "@/pages/vehicles";
import VehicleDetail from "@/pages/vehicle-detail";
import Regions from "@/pages/regions";
import AdminPanel from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import PartnerRegister from "@/pages/partner-register";
import PartnerLogin from "@/pages/partner-login";
import PartnerDashboard from "@/pages/partner-dashboard";
import Login from "@/pages/login";
import HostPortal from "@/pages/host-portal";
// import Checkout from "@/pages/checkout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vehicles" component={Vehicles} />
      <Route path="/vehicle/:id" component={VehicleDetail} />
      <Route path="/regions" component={Regions} />
      <Route path="/host-portal" component={HostPortal} />
      <Route path="/partners/register" component={PartnerRegister} />
      <Route path="/partner-register" component={PartnerRegister} />
      <Route path="/partner-login" component={PartnerLogin} />
      <Route path="/partner-dashboard" component={PartnerDashboard} />
      <Route path="/login" component={Login} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={AdminPanel} />
      {/* <Route path="/checkout" component={Checkout} /> */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="rtl min-h-screen">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
