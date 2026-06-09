import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found (404) — Bharat AI</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist on Bharat AI. Return to the home page to access Fasal Doctor, mandi prices, and farming calculators."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://jaswant-spark.lovable.app${location.pathname}`} />
        <meta property="og:title" content="Page Not Found (404) — Bharat AI" />
        <meta property="og:description" content="This page doesn't exist on Bharat AI. Head back home to keep farming smart." />
        <meta property="og:url" content={`https://jaswant-spark.lovable.app${location.pathname}`} />
      </Helmet>
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="mb-4 text-5xl font-heading font-bold text-saffron">404</h1>
          <p className="mb-2 text-xl font-semibold text-foreground">Page Not Found</p>
          <p className="mb-6 text-muted-foreground">
            The crop or page you are looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </main>
    </>
  );
};

export default NotFound;
