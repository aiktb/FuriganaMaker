import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  let message: string;
  if (isRouteErrorResponse(error)) {
    message = error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = "Unknown error";
  }

  return (
    <div className="prose prose-slate dark:prose-invert mx-auto flex min-h-screen flex-col items-center justify-center">
      <p>
        <i className="i-tabler-alert-triangle size-20 text-sky-500" />
      </p>
      <h1>Oops!</h1>
      <Link to="/">Go back to the Home Page</Link>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{message}</i>
      </p>
    </div>
  );
}
