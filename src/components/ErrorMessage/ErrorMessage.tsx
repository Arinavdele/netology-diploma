interface ErrorMessageProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorMessage({
  message = 'Произошла ошибка!',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="text-center my-4">
      <p className="text-danger">{message}</p>
      <button className="btn btn-outline-primary" onClick={onRetry}>
        Повторить запрос
      </button>
    </div>
  );
}