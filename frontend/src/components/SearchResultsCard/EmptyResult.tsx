type EmptyResultProps = {
  message: string;
};

export function EmptyResult({ message }: EmptyResultProps) {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground p-8">
      {message}
    </div>
  );
}
