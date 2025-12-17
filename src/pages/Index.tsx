import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Conference } from "@/types/conference";
import { ConferenceCard } from "@/components/ConferenceCard";
import { ConferenceModal } from "@/components/ConferenceModal";
import { AddConferenceForm } from "@/components/AddConferenceForm";
import { EditConferenceForm } from "@/components/EditConferenceForm";
import { ConferenceFilters } from "@/components/ConferenceFilters";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Train, LogIn, LogOut, Shield } from "lucide-react";

const Index = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConference, setEditingConference] = useState<Conference | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAdmin, signOut } = useAuth();

  // Filter states
  const [search, setSearch] = useState("");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");

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

  // Extract unique values for filters
  const universities = useMemo(() => {
    const uniqueUniversities = [...new Set(conferences.map((c) => c.university))];
    return uniqueUniversities.filter(Boolean).sort();
  }, [conferences]);

  const formats = useMemo(() => {
    const uniqueFormats = [...new Set(conferences.map((c) => c.format))];
    return uniqueFormats.filter(Boolean).sort();
  }, [conferences]);

  // Filtered conferences
  const filteredConferences = useMemo(() => {
    return conferences.filter((conference) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        conference.title.toLowerCase().includes(searchLower) ||
        conference.topic.toLowerCase().includes(searchLower) ||
        conference.description?.toLowerCase().includes(searchLower);

      const matchesUniversity =
        universityFilter === "all" || conference.university === universityFilter;

      const matchesFormat =
        formatFilter === "all" || conference.format === formatFilter;

      return matchesSearch && matchesUniversity && matchesFormat;
    });
  }, [conferences, search, universityFilter, formatFilter]);

  const resetFilters = () => {
    setSearch("");
    setUniversityFilter("all");
    setFormatFilter("all");
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
        description: "Не удалось добавить конференцию. Требуются права администратора.",
        variant: "destructive",
      });
    }
  };

  const handleEditConference = async (id: string, updatedData: Partial<Conference>) => {
    try {
      const { data, error } = await supabase
        .from("conferences")
        .update(updatedData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setConferences((prev) =>
        prev.map((c) => (c.id === id ? data : c))
      );
      toast({
        title: "Успешно",
        description: "Конференция обновлена",
      });
    } catch (error) {
      console.error("Error updating conference:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить конференцию. Требуются права администратора.",
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
        description: "Не удалось удалить конференцию. Требуются права администратора.",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (conference: Conference) => {
    setSelectedConference(conference);
    setModalOpen(true);
  };

  const handleEditClick = (conference: Conference) => {
    setEditingConference(conference);
    setEditModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Выход",
      description: "Вы вышли из системы",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Badge variant="default" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Администратор
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    Войти
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <ConferenceFilters
          search={search}
          onSearchChange={setSearch}
          university={universityFilter}
          onUniversityChange={setUniversityFilter}
          format={formatFilter}
          onFormatChange={setFormatFilter}
          universities={universities}
          formats={formats}
          onReset={resetFilters}
        />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Список конференций
            </h2>
            <p className="text-sm text-muted-foreground">
              Найдено: {filteredConferences.length} из {conferences.length}
            </p>
          </div>
          {isAdmin && <AddConferenceForm onAdd={handleAddConference} />}
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
        ) : filteredConferences.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {conferences.length === 0
                ? "Конференции не найдены"
                : "Нет конференций по выбранным фильтрам"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredConferences.map((conference) => (
              <ConferenceCard
                key={conference.id}
                conference={conference}
                onClick={() => handleCardClick(conference)}
                onDelete={handleDeleteConference}
                onEdit={handleEditClick}
                isAdmin={isAdmin}
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

      <EditConferenceForm
        conference={editingConference}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleEditConference}
      />
    </div>
  );
};

export default Index;
