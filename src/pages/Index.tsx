import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Conference } from "@/types/conference";
import { ConferenceCard } from "@/components/ConferenceCard";
import { ConferenceModal } from "@/components/ConferenceModal";
import { AddConferenceForm } from "@/components/AddConferenceForm";
import { useToast } from "@/hooks/use-toast";
import { Train } from "lucide-react";

const Index = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      const { data, error } = await supabase
        .from("conferences")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConferences(data || []);
    } catch (error) {
      console.error("Error fetching conferences:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить конференции",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddConference = async (newConference: {
    title: string;
    date: string;
    format: string;
    cost: string;
    location: string;
    topic: string;
    description: string;
    university: string;
    source_url: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from("conferences")
        .insert([newConference])
        .select()
        .single();

      if (error) throw error;

      setConferences((prev) => [data, ...prev]);
      toast({
        title: "Успешно",
        description: "Конференция добавлена",
      });
    } catch (error) {
      console.error("Error adding conference:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить конференцию",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConference = async (id: string) => {
    try {
      const { error } = await supabase.from("conferences").delete().eq("id", id);

      if (error) throw error;

      setConferences((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: "Удалено",
        description: "Конференция удалена",
      });
    } catch (error) {
      console.error("Error deleting conference:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить конференцию",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (conference: Conference) => {
    setSelectedConference(conference);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Конференции транспортных вузов РФ
              </h1>
              <p className="text-sm text-muted-foreground">2025 год</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Список конференций
            </h2>
            <p className="text-sm text-muted-foreground">
              Найдено: {conferences.length}
            </p>
          </div>
          <AddConferenceForm onAdd={handleAddConference} />
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : conferences.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Конференции не найдены</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {conferences.map((conference) => (
              <ConferenceCard
                key={conference.id}
                conference={conference}
                onClick={() => handleCardClick(conference)}
                onDelete={handleDeleteConference}
              />
            ))}
          </div>
        )}
      </main>

      <ConferenceModal
        conference={selectedConference}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Index;
