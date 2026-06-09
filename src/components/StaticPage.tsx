import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

interface StaticPageProps {
  title: string;
  description: string;
  path: string;
  children: React.ReactNode;
}

const StaticPage = ({ title, description, path, children }: StaticPageProps) => {
  const url = `https://jaswant-spark.lovable.app${path}`;
  return (
    <>
      <Helmet>
        <title>{title} | Bharat AI</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${title} | Bharat AI`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
          {children}
        </main>
        <SiteFooter />
      </div>
    </>
  );
};

export default StaticPage;
