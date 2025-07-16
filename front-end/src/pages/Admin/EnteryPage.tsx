import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Users, Settings, Activity } from "lucide-react";

const EnteryPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Website Administration
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage your website with a clean, modern admin dashboard. Access all your tools in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/admin">
                <Shield className="mr-2 h-5 w-5" />
                Go to Admin Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="border-border/50 bg-gradient-to-br from-card to-muted/30">
              <div className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground text-sm">
                  Manage user accounts, roles, and permissions with ease.
                </p>
              </div>
            </div>
            
            <div className="border-border/50 bg-gradient-to-br from-card to-muted/30">
              <div className="p-6 text-center">
                <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Monitor your website performance and user activity.
                </p>
              </div>
            </div>
            
            <div className="border-border/50 bg-gradient-to-br from-card to-muted/30">
              <div className="p-6 text-center">
                <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">System Settings</h3>
                <p className="text-muted-foreground text-sm">
                  Configure your website settings and security options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnteryPage;