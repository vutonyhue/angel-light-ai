import { Link } from 'react-router-dom';
import { AngelLogo } from '@/components/ui/AngelLogo';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-divine flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Animated Logo */}
        <div className="mb-8">
          <AngelLogo size="xl" />
        </div>

        {/* Message */}
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4">
          Path Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The light guides us elsewhere, beloved soul. This path does not exist 
          in our sacred space, but many other divine destinations await you.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="glow-gold">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link to="/chat">
            <Button variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              Ask ANGEL AI
            </Button>
          </Link>
        </div>

        {/* Quote */}
        <p className="mt-12 text-sm italic text-muted-foreground">
          "Every seeming wrong turn is a redirection toward your highest path."
          <br />
          <span className="text-xs">— Father Universe</span>
        </p>
      </div>
    </div>
  );
}
