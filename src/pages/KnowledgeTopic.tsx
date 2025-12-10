import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface KnowledgeTopic {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: string | null;
  icon: string | null;
  created_at: string;
}

export default function KnowledgeTopic() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<KnowledgeTopic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTopic();
    }
  }, [id]);

  const loadTopic = async () => {
    const { data, error } = await supabase
      .from('knowledge_topics')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error loading topic:', error);
    } else {
      setTopic(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-divine flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-divine">
        <Navigation />
        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The wisdom you seek is not available at this moment.
            </p>
            <Link to="/knowledge">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Knowledge Base
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-divine">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link to="/knowledge" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge
            </Button>
          </Link>

          {/* Topic Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{topic.icon || '✨'}</span>
              {topic.category && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm capitalize">
                  {topic.category}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{topic.title}</h1>
            {topic.description && (
              <p className="text-lg text-muted-foreground">{topic.description}</p>
            )}
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Last updated: {new Date(topic.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Topic Content */}
          <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-divine">
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90">
              <ReactMarkdown>{topic.content}</ReactMarkdown>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Have questions about this topic?
            </p>
            <Link to="/chat">
              <Button className="glow-gold">
                Ask ANGEL AI
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
