"use client";
import TableOfContents from "@/packages/toc/TocComponent";
import { useRef } from "react";

const NewsClient = () => {
  const contentRef = useRef(null);

  return (
    <div className="flex flex-wrap gap-4 px-10 pt-8">
      {/* Cột mục lục */}
      <TableOfContents contentRef={contentRef} />

      {/* Cột nội dung bài viết */}
      <div ref={contentRef}>
        {/* Ví dụ nội dung với nhiều cấp tiêu đề */}
        <h1>Tiêu đề chính</h1>
        <p>Nội dung giới thiệu bài viết...</p>

        <h2>Phần 1: Tổng quan</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam
          quaerat vel nemo neque quis atque velit rem porro, expedita nobis, sit
          quae doloribus delectus perspiciatis perferendis repudiandae
          blanditiis, eos nisi maiores sint voluptas quia repellat cum enim.
          Adipisci aspernatur et voluptatibus accusamus voluptate, sunt minima
          iste modi reprehenderit libero numquam quam at vitae velit odio
          facilis consequatur harum suscipit ipsam dolorem totam architecto!
          Eligendi molestias suscipit deserunt recusandae similique, iusto cum,
          dolor sit animi in sed, excepturi nulla aliquam ipsum fugit nam
          sapiente consectetur incidunt libero illum minus soluta distinctio.
          Quos amet, debitis rem tempore recusandae distinctio sunt at rerum.
        </p>

        <h3>Chi tiết 1.1</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia vel sed
          reiciendis quasi unde, optio a placeat excepturi nam saepe hic dolorem
          ratione? Nulla mollitia optio inventore nostrum omnis ducimus
          molestiae vitae id autem, ut quis incidunt officia, ipsam perspiciatis
          deleniti aspernatur. Ipsam qui alias distinctio deleniti autem
          repudiandae commodi quasi itaque, possimus vel, sint molestias, beatae
          voluptate sunt earum maxime assumenda asperiores! Asperiores quos
          veritatis totam ratione voluptatibus nostrum itaque corrupti neque a
          necessitatibus ipsum eos ad eum harum minima excepturi delectus
          quibusdam dignissimos nesciunt repudiandae, tempora temporibus
          laboriosam. Maxime est, culpa accusantium minus ab, ipsa odio minima
          dolor molestiae quo ex veniam vitae quos corrupti quae repellat
          necessitatibus delectus neque eos sunt, fuga debitis! Nostrum ut
          cupiditate omnis iure, possimus quia a amet totam perferendis
          perspiciatis vel, id tempora nisi saepe iste. Natus autem accusantium
          nesciunt dolor illum beatae excepturi velit perspiciatis similique
          nemo repudiandae officia, deserunt quia maxime, minus dolores eligendi
          est? Debitis quis provident enim eius temporibus praesentium accusamus
          numquam ad molestias? Sunt ducimus reprehenderit quas harum modi
          voluptatum consequuntur consectetur illum ipsum maxime. Deleniti,
          sequi ducimus, dignissimos unde voluptas non hic ipsam odit blanditiis
          repellat error commodi temporibus amet quod molestias asperiores ea
          pariatur similique!
        </p>

        <h3>Chi tiết 1.2</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
          exercitationem quo eveniet quibusdam sapiente impedit, cum
          necessitatibus temporibus hic voluptates minima blanditiis, alias in
          libero aspernatur. Amet esse in eaque asperiores ipsum similique
          pariatur nobis doloremque quam nemo commodi, doloribus quisquam odio
          voluptates omnis quae iste, id quibusdam. Aspernatur, quaerat ab natus
          vero provident, eum ex, cumque dolor quam consequatur suscipit autem
          maxime? Porro harum sint repellat impedit quibusdam facilis tempora
          velit dolorem aut? Placeat esse modi odit officia! Nostrum culpa,
          nihil exercitationem quasi sed laboriosam ipsam assumenda cumque
          voluptatum, totam veniam consequatur, hic consequuntur! Sed ullam
          velit recusandae voluptatibus minus at quis adipisci, alias deleniti
          repellat sapiente facilis, aliquid, nisi rem. Laborum omnis
          exercitationem ex adipisci soluta harum, velit consectetur repudiandae
          assumenda ipsa id earum deleniti. Alias, iure! Veritatis eveniet earum
          at perferendis esse quam officiis laborum facere sint debitis et
          voluptate excepturi dolore, dignissimos, mollitia odit, consequatur
          velit minima numquam modi. Tempora nesciunt deleniti magnam suscipit.
          Sapiente totam, dolorum minima sequi ipsam accusamus qui nostrum atque
          libero. Non nulla, eaque odit in consequatur quo, qui iusto vero
          pariatur eum provident assumenda, dolorum esse voluptatem! Hic ad sed
          voluptatem ducimus in enim eos cum dolores mollitia, soluta nemo quasi
          sit aliquid consequatur quidem dicta, ipsa quae, officiis dolorem?
          Porro corrupti sequi consequatur at eveniet vero saepe nemo incidunt
          cupiditate asperiores atque, inventore, id culpa tenetur blanditiis
          rem cum alias. Illum nulla debitis sapiente deserunt, delectus,
          recusandae ducimus voluptatem ipsum quae minus, dolore magnam
          similique fuga hic perspiciatis sint doloremque accusamus eligendi
          corrupti! Assumenda dolorem dolor exercitationem eveniet illo nesciunt
          atque inventore beatae quae quas odio ipsum obcaecati omnis, ex
          aliquam tenetur nihil sunt recusandae quam sequi eos, quibusdam illum
          repellendus! Aperiam laboriosam totam corporis, veniam rem cumque
          quos, atque commodi ut nesciunt amet molestias soluta. Voluptatibus
          harum eligendi expedita.
        </p>

        <h2>Phần 2: Phân tích</h2>
        <p>Nội dung phần 2...</p>

        <h3>Chi tiết 2.1</h3>
        <p>...</p>

        <h4>Phân tích chuyên sâu</h4>
        <p>...</p>

        <h2>Phần 3: Kết luận</h2>
        <p>Nội dung kết luận...</p>
      </div>
    </div>
  );
};

export default NewsClient;