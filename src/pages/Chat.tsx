import { Navigation } from '@/components/layout/Navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Chat() {
  return (
    <div className="min-h-screen bg-divine flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto max-w-4xl h-[calc(100vh-4rem)]">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
