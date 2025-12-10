import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddConferenceFormProps {
  onAdd: (conference: {
    title: string;
    date: string;
    format: string;
    cost: string;
    location: string;
    topic: string;
    description: string;
    university: string;
    source_url: string;
  }) => void;
}

export const AddConferenceForm = ({ onAdd }: AddConferenceFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    format: "",
    cost: "",
    location: "",
    topic: "",
    description: "",
    university: "",
    source_url: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.university) {
      return;
    }
    onAdd(formData);
    setFormData({
      title: "",
      date: "",
      format: "",
      cost: "",
      location: "",
      topic: "",
      description: "",
      university: "",
      source_url: "",
    });
    setOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить конференцию
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить новую конференцию</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Название конференции"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="university">Университет *</Label>
            <Input
              id="university"
              value={formData.university}
              onChange={(e) => handleChange("university", e.target.value)}
              placeholder="Например: ПГУПС"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Дата *</Label>
            <Input
              id="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              placeholder="Например: 14-18 апреля 2025"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Формат</Label>
              <Input
                id="format"
                value={formData.format}
                onChange={(e) => handleChange("format", e.target.value)}
                placeholder="Очный / Онлайн"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Стоимость</Label>
              <Input
                id="cost"
                value={formData.cost}
                onChange={(e) => handleChange("cost", e.target.value)}
                placeholder="Бесплатно"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Место проведения</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Город, адрес"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Тематика</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => handleChange("topic", e.target.value)}
              placeholder="Транспорт, Логистика, Инженерия"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Подробное описание конференции"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source_url">Ссылка на источник</Label>
            <Input
              id="source_url"
              type="url"
              value={formData.source_url}
              onChange={(e) => handleChange("source_url", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Добавить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
