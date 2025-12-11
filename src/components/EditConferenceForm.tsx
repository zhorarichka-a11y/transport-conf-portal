import { useState, useEffect } from "react";
import { Conference } from "@/types/conference";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditConferenceFormProps {
  conference: Conference | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: Partial<Conference>) => void;
}

export const EditConferenceForm = ({
  conference,
  open,
  onOpenChange,
  onSave,
}: EditConferenceFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    university: "",
    format: "",
    cost: "",
    location: "",
    topic: "",
    description: "",
    source_url: "",
  });

  useEffect(() => {
    if (conference) {
      setFormData({
        title: conference.title,
        date: conference.date,
        university: conference.university,
        format: conference.format,
        cost: conference.cost,
        location: conference.location,
        topic: conference.topic,
        description: conference.description || "",
        source_url: conference.source_url || "",
      });
    }
  }, [conference]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conference) return;

    if (!formData.title || !formData.date || !formData.university) {
      return;
    }

    onSave(conference.id, formData);
    onOpenChange(false);
  };

  if (!conference) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать конференцию</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Дата *</Label>
            <Input
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="например: 15-17 апреля 2025"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">ВУЗ *</Label>
            <Input
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Формат</Label>
            <Input
              id="format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              placeholder="очный, онлайн, гибридный"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Стоимость</Label>
            <Input
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="бесплатно, 500 руб."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Место проведения</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Тематика</Label>
            <Input
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="разделяйте темы запятой"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source_url">Ссылка на источник</Label>
            <Input
              id="source_url"
              name="source_url"
              type="url"
              value={formData.source_url}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
