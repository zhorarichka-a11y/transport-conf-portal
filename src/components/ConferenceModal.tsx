import { Conference } from "@/types/conference";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Building2, CreditCard, Tag, ExternalLink } from "lucide-react";

interface ConferenceModalProps {
  conference: Conference | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConferenceModal = ({ conference, open, onOpenChange }: ConferenceModalProps) => {
  if (!conference) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl leading-tight text-foreground">
            {conference.title}
          </DialogTitle>
          <Badge variant="secondary" className="w-fit mt-2">
            {conference.university}
          </Badge>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Дата</p>
                <p className="text-muted-foreground">{conference.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Формат</p>
                <p className="text-muted-foreground">{conference.format}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Стоимость</p>
                <p className="text-muted-foreground">{conference.cost}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Место проведения</p>
                <p className="text-muted-foreground">{conference.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Тематика</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {conference.topic.split(", ").map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {conference.description && (
            <div className="pt-2 border-t">
              <p className="font-medium text-foreground mb-2">Описание</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {conference.description}
              </p>
            </div>
          )}

          {conference.source_url && (
            <div className="pt-2">
              <Button variant="outline" asChild className="w-full">
                <a href={conference.source_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Перейти на сайт вуза
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
