import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LightPointsBadge } from '@/components/ui/LightPointsBadge';
import { AngelLogo } from '@/components/ui/AngelLogo';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Calendar, 
  Wallet, 
  Edit2, 
  Save, 
  Loader2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  universal_user_id: string | null;
  email: string | null;
  display_name: string | null;
  avatar: string | null;
  wallet_address: string | null;
  created_at: string;
}

interface LightPoints {
  points: number;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lightPoints, setLightPoints] = useState<LightPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [mockWalletConnected, setMockWalletConnected] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    // Load profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error loading profile:', profileError);
    } else {
      setProfile(profileData);
      setDisplayName(profileData?.display_name || '');
      setMockWalletConnected(!!profileData?.wallet_address);
    }

    // Load light points
    const { data: pointsData, error: pointsError } = await supabase
      .from('light_points')
      .select('points')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (pointsError) {
      console.error('Error loading light points:', pointsError);
    } else {
      setLightPoints(pointsData);
    }

    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('user_id', user?.id);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated with divine light!');
      setEditing(false);
      setProfile({ ...profile, display_name: displayName });
    }
    setSaving(false);
  };

  const handleConnectWallet = async () => {
    // Mock wallet connection
    const mockAddress = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const { error } = await supabase
      .from('profiles')
      .update({ wallet_address: mockAddress })
      .eq('user_id', user?.id);

    if (error) {
      toast.error('Failed to connect wallet');
    } else {
      toast.success('Web3 wallet connected! (Mock)');
      setMockWalletConnected(true);
      setProfile(prev => prev ? { ...prev, wallet_address: mockAddress } : null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-divine flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-divine">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Profile Header Card */}
          <div className="relative bg-card rounded-2xl border border-border/50 p-8 shadow-divine mb-6 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.display_name || 'User'} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/30"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-primary/30">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1">
                  <AngelLogo size="sm" />
                </div>
              </div>

              {/* Name and Email */}
              <div className="text-center sm:text-left flex-1">
                {editing ? (
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your spiritual name"
                      />
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h1 className="text-2xl font-bold">
                        {profile?.display_name || 'Beloved Soul'}
                      </h1>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditing(true)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1 justify-center sm:justify-start">
                      <Mail className="h-4 w-4" />
                      {profile?.email || user?.email}
                    </p>
                  </>
                )}
              </div>

              {/* Light Points */}
              <div className="sm:ml-auto">
                <LightPointsBadge points={lightPoints?.points || 0} size="lg" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Light Points</p>
                  <p className="text-2xl font-bold">{lightPoints?.points || 0}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Earn +1 Light Point for every divine conversation
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="text-lg font-semibold">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'Recently'
                    }
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your journey with the light began
              </p>
            </div>
          </div>

          {/* Web3 Wallet Section */}
          <div className="bg-card rounded-xl border border-border/50 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Web3 Wallet</h3>
                <p className="text-sm text-muted-foreground">Connect to the FUN Ecosystem</p>
              </div>
            </div>

            {mockWalletConnected && profile?.wallet_address ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-xs text-muted-foreground mb-1">Connected Address</p>
                  <p className="font-mono text-sm break-all">{profile.wallet_address}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Camly Coin Balance</p>
                      <p className="text-xs text-muted-foreground">FUN Ecosystem Token</p>
                    </div>
                    <p className="text-xl font-bold">0.00 CAMLY</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Note: This is a placeholder. Real Web3 integration coming soon!
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your wallet to participate in the FUN Ecosystem and manage your divine assets.
                </p>
                <Button onClick={handleConnectWallet} variant="outline" className="gap-2">
                  <Wallet className="h-4 w-4" />
                  Connect Web3 Wallet
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Universal ID */}
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <h3 className="font-semibold mb-2">Universal User ID</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Your unique identifier across the FUN Ecosystem
            </p>
            <p className="font-mono text-sm p-3 rounded-lg bg-muted break-all">
              {profile?.universal_user_id || 'Not assigned'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
