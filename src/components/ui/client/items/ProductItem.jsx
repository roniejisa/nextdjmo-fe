import LinkCustom from "@/packages/translation/Link";
import { chooseColorIndex, showImageUrl } from "@/utils/client/util";
import Image from "next/image";

const ProductItem = ({
  item,
  index,
}) => {

  const { name, slug, author, image, price } = item;
  const authorName = author?.name;
  const authorSlug = author?.slug;
  return (
    <div className="flex flex-col md:flex-[0_0_calc(100%/2)] lg:flex-[0_0_calc(100%/4)] flex-[0_0_calc(100%)] px-4 py-4">
      <LinkCustom
        href={"/tac-pham/" + slug}
        alt={name}
        className={`relative h-0 pt-[100%] bg-color mb-3 group`}
        style={{ "--productBg": chooseColorIndex(index) }}
      >
        <Image
          className="absolute top-0 left-0 w-full h-full object-contain p-8 group-hover:scale-90 transition-all duration-300 ease-in-out"
          src={showImageUrl(image)}
          fill={true}
          alt={name}
        />
      </LinkCustom>
      <div className="flex flex-col">
        <LinkCustom
          href={"/tac-pham/" + slug}
          alt={name}
          className="link-product"
        >
          <span>{name}</span>
        </LinkCustom>
        {authorSlug ? (
          <LinkCustom
            href={"/tac-gia/" + authorSlug}
            alt={authorName}
            className="mb-1 hover:text-blue-300 opacity-50 transition-all duration-300 ease-in-out hover:opacity-100"
          >
            {authorName}
          </LinkCustom>
        ): null}
        <span className="opacity-70">
          {Intl.NumberFormat().format(price)} VND
        </span>
      </div>
    </div>
  );
};

export default ProductItem;
