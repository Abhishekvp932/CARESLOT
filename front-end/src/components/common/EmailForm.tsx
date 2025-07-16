  import { SubmitButton } from "./SubmitButton";
  import { Input } from "@/components/ui/input";
  import { Mail, AlertCircle } from 'lucide-react';

  interface EmailFormProps {
    email: string;
    onEmailChange: (value: string) => void;
    onSubmit: ()=> void;
    error?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    
  }

  const EmailForm: React.FC<EmailFormProps> = ({
    email,
    onEmailChange,
    onSubmit,
    error,
    title = "Email Verification",
    subtitle = "Enter your email address to receive a verification code",
    buttonText = "Send Verification Code",
  }) => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600 text-sm">{subtitle}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="Enter your email address"
                    className={`pl-10 h-12 text-base transition-colors`}
                  />
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      error ? "text-red-400" : "text-gray-400"
                    }`}
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <SubmitButton
              label={buttonText}
              onClick={onSubmit}
              />
              
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                We'll send a verification code to your email address
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              Having trouble? Contact our support team
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default EmailForm;
