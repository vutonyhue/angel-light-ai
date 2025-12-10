import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Loader2, Search, BookOpen } from 'lucide-react';

interface KnowledgeTopic {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  created_at: string;
}

export default function Knowledge() {
  const [topics, setTopics] = useState<KnowledgeTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    const { data, error } = await supabase
      .from('knowledge_topics')
      .select('id, title, description, category, icon, created_at')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading topics:', error);
    } else {
      setTopics(data || []);
    }
    setLoading(false);
  };

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(topics.map(t => t.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-divine">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Sacred Library</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Divine Knowledge Base</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the wisdom teachings of Father Universe, sacred mantras, 
              meditation guides, and cosmic knowledge to illuminate your path.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-12">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for wisdom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {categories.map(category => {
                const categoryTopics = filteredTopics.filter(t => t.category === category);
                if (categoryTopics.length === 0) return null;

                return (
                  <div key={category} className="mb-12">
                    <h2 className="text-xl font-semibold mb-6 capitalize flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">
                        {categoryTopics[0]?.icon || '✨'}
                      </span>
                      {category}
                    </h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryTopics.map((topic, index) => (
                        <Link
                          key={topic.id}
                          to={`/knowledge/${topic.id}`}
                          className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-divine-lg transition-all duration-300 animate-fade-up"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="text-3xl mb-4">{topic.icon || '✨'}</div>
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                            {topic.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {topic.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredTopics.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No topics found matching your search.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
