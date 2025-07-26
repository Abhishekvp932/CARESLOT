
 import { Button } from '@/components/ui/button'
 import { ArrowLeft } from 'lucide-react'
 import { useNavigate } from 'react-router-dom'
 
 function BackButton() {
    const navigate = useNavigate()
   return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-b">
        {/* <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
             
              <div>
                <h1 className="text-2xl font-bold">Doctor Management</h1>
                <p className="text-primary-foreground/80">Admin Dashboard - Doctor Profile & Schedule Management</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
              <Settings className="w-3 h-3 mr-1" />
              Admin View
            </Badge>
          </div>
        </div> */}
           <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
      </div>    
   )
 }
 
 export default BackButton