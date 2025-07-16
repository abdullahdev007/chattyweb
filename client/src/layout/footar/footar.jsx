const Footar = () => {
  return (
    <footer className="footer flex justify-center mb-5">
      <span className="copyright text-white z-10  flex  justify-center font-bold  text-md">
        © This site was developed by{" "}
        <a
          href={`${import.meta.env.VITE_DEVELOPER_PORTFOLIO}`}
          className="text-blue-500 hover:scale-105 transition"
        >
          Abdullah Shaban
        </a>
      </span>
    </footer>
  );
};

export default Footar;
