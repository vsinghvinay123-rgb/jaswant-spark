const AAdsBanner = () => {
  return (
    <div className="w-full my-2" style={{ position: "relative", zIndex: 1 }}>
      <iframe
        data-aa="2443685"
        src="//acceptable.a-ads.com/2443685/?size=Adaptive"
        title="A-ADS"
        style={{
          border: 0,
          padding: 0,
          width: "70%",
          height: 90,
          overflow: "hidden",
          display: "block",
          margin: "auto",
        }}
      />
    </div>
  );
};

export default AAdsBanner;
