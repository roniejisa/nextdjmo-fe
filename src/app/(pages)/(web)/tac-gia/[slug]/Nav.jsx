"use client";

const Nav = ({ data }) => {
  const handleScroll = (position) => {
    const element = document.querySelector(`[data-id="${position}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div
      className="sticky top-0 bg-white z-10 pt-10 hidden lg:block"
      style={{
        alignSelf: "flex-start",
      }}
    >
      <ul className="flex flex-col gap-6 w-full">
        <li
          onClick={() => handleScroll("products")}
          className="text-3xl cursor-pointer"
        >
          <span className="animate-link">
            Tác phẩm
          </span>
        </li>
        <li
          onClick={() => handleScroll("cv")}
          className="text-3xl cursor-pointer"
        >
          <span className="animate-link">
            Tiểu sử và CV
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
