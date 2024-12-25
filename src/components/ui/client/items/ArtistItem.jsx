import LinkCustom from "@/packages/translation/Link";
import { chooseColorIndex, showImageUrl } from "@/utils/client/util";
import Image from "next/image";

const ArtistItem = ({
  item: { name: artistName, slug: artistSlug, image, short_description },
  index,
}) => {
  return (
    <LinkCustom
      href={"/tac-gia/" + artistSlug}
      alt={artistName}
      className="flex flex-col md:flex-[0_0_calc(100%/2)] lg:flex-[0_0_calc(100%/4)] flex-[0_0_calc(100%)] px-4 py-4 link-product"
    >
      <div
        className="bg-color h-full"
        style={{ "--productBg": chooseColorIndex(index) }}
      >
        <div className="relative h-0 pt-[100%] w-full mb-3">
          <Image
            src={showImageUrl(image)}
            alt={artistName}
            fill={true}
            className="mb-3 w-full h-full object-contain"
          />
        </div>
        <div className="px-4 pb-4">
          <span className="text-2xl">{artistName}</span>
          <p className="flex-1 line-clamp-6">{short_description}</p>
        </div>
      </div>
    </LinkCustom>
  );
};

export default ArtistItem;
