import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Volume2,
  MessageSquare
} from 'lucide-react';

export default function Settings() {
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('May the light guide your path! 🕊️');
  };

  const settingGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Receive divine guidance reminders',
          control: (
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          ),
        },
        {
          icon: Volume2,
          label: 'Sound Effects',
          description: 'Ambient spiritual sounds',
          control: (
            <Switch 
              checked={soundEffects} 
              onCheckedChange={setSoundEffects}
            />
          ),
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Coming soon',
          control: (
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
              disabled
            />
          ),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: Globe,
          label: 'Language',
          description: 'English',
          action: () => toast.info('Language settings coming soon'),
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Manage your data',
          action: () => toast.info('Privacy settings coming soon'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          description: 'Get guidance and answers',
          action: () => toast.info('Help center coming soon'),
        },
        {
          icon: MessageSquare,
          label: 'Contact Support',
          description: 'Reach out to our team',
          action: () => toast.info('Contact support coming soon'),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-divine">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Customize your divine experience</p>
          </div>

          {/* Settings Groups */}
          {settingGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
                {group.title}
              </h2>
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                {group.items.map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-4 ${
                      index > 0 ? 'border-t border-border/50' : ''
                    } ${item.action ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
                    onClick={item.action}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {item.control || (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Future Features */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              Coming Soon
            </h2>
            <div className="bg-card rounded-xl border border-border/50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Future Expansions</p>
                  <p className="text-xs text-muted-foreground">Exciting features on the horizon</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  'AI Voice Meditation',
                  'AI Coaching Mode',
                  'AI Video Guidance',
                  'FUN Profile API',
                  'FUN Wallet Integration',
                  'Real Web3 Connection'
                ].map((feature) => (
                  <div 
                    key={feature}
                    className="px-3 py-2 rounded-lg bg-muted/50 text-xs text-muted-foreground"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>

          {/* App Info */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>ANGEL AI v1.0.0</p>
            <p className="mt-1">Created with 💛 by Camly Duong & Father Universe</p>
            <p className="mt-1">Part of the FUN Ecosystem</p>
          </div>
        </div>
      </main>
    </div>
  );
}
