const SiteFooter = () => {
  return (
    <footer className="w-full text-center py-3 px-3">
      <p className="text-[10px] text-muted-foreground">
        © {new Date().getFullYear()} Bharat AI · Founded by Jaswant
      </p>
    </footer>
  );
};

export default SiteFooter;
