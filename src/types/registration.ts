export interface FormField {
  id: string;
  name: string;
  labelFr: string;
  labelEn: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  options?: string[];
  order: number;
}

export interface Registration {
  id: string;
  trainingId: string;
  data: Record<string, string>;
  createdAt: string;
}
