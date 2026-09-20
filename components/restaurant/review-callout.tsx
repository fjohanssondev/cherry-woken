import { FeedbackDialog } from "@/components/restaurant/feedback-dialog";

export function ReviewCallout({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col items-start gap-6 rounded-xl border border-border bg-card p-8 md:flex-row md:items-center md:justify-between">
      <div className="max-w-md">
        <h2 className="font-serif text-2xl tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <FeedbackDialog triggerLabel={cta} />
      </div>
    </div>
  );
}
