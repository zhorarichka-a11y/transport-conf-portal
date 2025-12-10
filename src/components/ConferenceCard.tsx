import { Conference } from "@/types/conference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Building2, Trash2 } from "lucide-react";

interface ConferenceCardProps {
  conference: Conference;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export const ConferenceCard = ({ conference, onClick, onDelete }: ConferenceCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Удалить эту конференцию?")) {
      onDelete(conference.id);
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-shadow hover:shadow-lg border-border"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight text-foreground">
            {conference.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Badge variant="secondary" className="w-fit">
          {conference.university}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{conference.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{conference.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{conference.format}</span>
        </div>
        <div className="pt-2 flex flex-wrap gap-1">
          {conference.topic.split(", ").slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
