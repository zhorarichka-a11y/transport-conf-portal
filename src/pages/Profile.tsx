import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Conference } from "@/types/conference";
import { ConferenceCard } from "@/components/ConferenceCard";
import { ConferenceModal } from "@/components/ConferenceModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [savedConferences, setSavedConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchSavedConferences();
  }, [user, navigate]);

  const fetchSavedConferences = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("saved_conferences")
      .select(`
        conference_id,
        conferences (*)
      `)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Ошибка загрузки сохранённых конференций");
      console.error(error);
    } else {
      const conferences = data
        ?.map((item: any) => item.conferences)
        .filter(Boolean) as Conference[];
      setSavedConferences(conferences || []);
    }
    setLoading(false);
  };

  const handleUnsave = async (conferenceId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("saved_conferences")
      .delete()
      .eq("user_id", user.id)
      .eq("conference_id", conferenceId);

    if (error) {
      toast.error("Ошибка при удалении из сохранённых");
    } else {
      toast.success("Конференция удалена из сохранённых");
      setSavedConferences(prev => prev.filter(c => c.id !== conferenceId));
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Личный кабинет</h1>
          </div>
          <Button 
            variant="secondary"
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-card rounded-lg p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-2">Информация о пользователе</h2>
          <p className="text-muted-foreground">Email: {user.email}</p>
          <p className="text-muted-foreground">
            Роль: {isAdmin ? "Администратор" : "Пользователь"}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <Bookmark className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Сохранённые конференции</h2>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Загрузка...</p>
          ) : savedConferences.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                У вас пока нет сохранённых конференций
              </p>
              <Button 
                variant="link" 
                onClick={() => navigate("/")}
                className="mt-2"
              >
                Перейти к списку конференций
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedConferences.map((conference) => (
                <ConferenceCard
                  key={conference.id}
                  conference={conference}
                  onClick={() => setSelectedConference(conference)}
                  isSaved={true}
                  onSaveToggle={() => handleUnsave(conference.id)}
                  showSaveButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ConferenceModal
        conference={selectedConference}
        open={!!selectedConference}
        onOpenChange={(open) => !open && setSelectedConference(null)}
      />
    </div>
  );
};

export default Profile;
