import "../components/styles/button-3d-round.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "gatsby";
import {
  faSpotify,
  faSoundcloud,
  faYoutube,
  faMixcloud
} from "@fortawesome/free-brands-svg-icons";
import React from "react";

import SEO from "../components/seo";
import styles from "../components/styles/landing.module.css";

const IndexPage = () => (
  <>
    <SEO title="Home" />

    <div className={styles.p1} style={{ height: "auto" }}>
      <div className={styles.p1Content}>
        <h1 className={styles.slogan}>All your music, in one place.</h1>
        {/* <h3 className={styles.landingBlurb}>
          Listen to your playlists from your favorite streaming services
        </h3> */}
        <Link to="/login" className="button nav-link">
          <div className="bottom" />

          <div className="top">
            <div className="label">Listen now</div>

            <div className="button-border button-border-left" />
            <div className="button-border button-border-top" />
            <div className="button-border button-border-right" />
            <div className="button-border button-border-bottom" />
          </div>
        </Link>
      </div>
    </div>
    <div className={styles.p2}>
      <h1>Already have playlists? No problem.</h1>
      <h3 className={styles.p2Blurb}>
        Connect your playlists from other major streaming platforms.
      </h3>
      <div className={styles.sectionContainer}>
        <div className={styles.sourceCard}>
          <FontAwesomeIcon icon={faSpotify} size="4x" />
          <h3>Spotify</h3>
        </div>
        <div className={styles.sourceCard}>
          <FontAwesomeIcon icon={faSoundcloud} size="4x" />
          <h3>Soundcloud</h3>
        </div>
        <div className={styles.sourceCard}>
          <FontAwesomeIcon icon={faYoutube} size="4x" />
          <h3>Coming soon!</h3>
        </div>
        <div className={styles.sourceCard}>
          <FontAwesomeIcon icon={faMixcloud} size="4x" />
          <h3>Coming soon!</h3>
        </div>
      </div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non soluta autem
      illum assumenda dignissimos quos vel doloribus officiis tenetur ipsa
      veniam consequuntur sed aspernatur qui amet voluptate maiores, omnis ab
      iste dolorem ullam, repellendus sequi dicta porro. Ex voluptates sunt,
      magnam, repellat cum adipisci perferendis ipsa unde molestias deleniti
      labore doloremque architecto numquam quis dignissimos est maxime totam
      amet ipsum repudiandae pariatur illum! Fugit in cupiditate eveniet nostrum
      eligendi. Nemo repellendus, dolores praesentium id soluta impedit enim
      eius dolor obcaecati ut itaque at aliquid! Officiis, suscipit. Repellendus
      consequuntur molestiae tempore itaque ad velit omnis animi adipisci
      quibusdam exercitationem possimus maxime nesciunt expedita nulla harum
      eum, cupiditate qui nihil similique reprehenderit asperiores nobis
      veritatis maiores! Doloribus iste facilis quibusdam voluptates sapiente
      qui ex dicta aliquam iure? Dolor natus nulla soluta, minima laudantium
      voluptate hic, doloremque aliquid temporibus enim voluptatum animi
      perspiciatis, aperiam assumenda. Animi quam odio obcaecati temporibus
      itaque! Ratione eaque accusamus, deserunt, praesentium in facilis dicta et
      dolorum ipsam nesciunt ab, nulla dolor perspiciatis aliquid quia expedita
      aspernatur magni dolore culpa. Ex totam commodi dolor voluptates iure,
      provident iste veritatis necessitatibus error ducimus dolorem quasi, est
      officiis aspernatur, at eius, eligendi porro quos. Pariatur deleniti sequi
      aliquid error autem veritatis molestias. Mollitia nemo minus voluptate
      nesciunt consequatur consectetur molestias possimus praesentium asperiores
      fuga. Corporis unde voluptas reiciendis odio non expedita quas ipsum
      accusamus necessitatibus quae magnam quis itaque dolorem distinctio
      repellat tempore, alias voluptatum error architecto velit reprehenderit?
      Sunt tempore maxime temporibus libero, voluptatum ipsa error animi laborum
      quam? Tenetur quas accusantium rem cumque ipsam aspernatur, in omnis, quod
      atque ipsa facere consequatur magnam earum vel suscipit nisi. Voluptatum
      laudantium delectus quis sapiente, odio hic dolorum tempora, reiciendis
      quo rerum laboriosam, repellat quia recusandae quae. Nesciunt deleniti ad
      incidunt magni consequatur dolorum maxime ratione, atque, quis alias,
      pariatur et amet. Lorem ipsum dolor sit amet, consectetur adipisicing
      elit. Id repellendus illum, dolore blanditiis ex debitis in, ut rerum
      dolor quo ipsa nemo neque mollitia eveniet voluptates, aliquid nesciunt.
      Id facilis explicabo excepturi animi quaerat aut quisquam quasi alias
      accusamus. Ad, quidem esse numquam et, aut temporibus. Nam ab quam ullam
      magni odio iusto voluptatibus deserunt soluta ipsum placeat officiis,
      tenetur! Facilis accusantium quam, ab odio sunt quis aliquam! Ea illo nam
      earum, iste beatae dolorum et, ipsam quibusdam veniam laudantium ratione
      quos. Labore aspernatur laudantium beatae, libero cupiditate animi
      assumenda dicta nemo commodi sunt, fuga quasi iusto ipsum consequuntur
      eaque modi debitis, blanditiis perferendis fugiat. Quam asperiores, ipsam,
      est enim tempora obcaecati rem recusandae, numquam harum placeat tenetur
      facere dignissimos similique voluptatum laboriosam earum vero ratione
      temporibus. A eum, maxime molestiae fugiat culpa nostrum temporibus
      voluptate ea facilis hic! A esse nihil nesciunt ut minus error nobis
      ducimus. Consequuntur rerum iure, adipisci? Accusantium veritatis,
      assumenda nemo voluptatibus magnam voluptas exercitationem, ipsa
      voluptates odio sint voluptatem. Harum quia, libero eligendi laboriosam
      quidem mollitia incidunt architecto id magni dicta nobis quis cupiditate
      explicabo pariatur voluptate eaque autem, necessitatibus dignissimos illo
      veritatis delectus placeat. Voluptatum in a at natus, ducimus blanditiis
      eum quaerat maiores harum, deserunt placeat tempora numquam non laborum
      fugit voluptatibus explicabo eligendi sequi eos omnis facilis perspiciatis
      soluta illum. Nemo cumque fuga vitae culpa voluptate voluptas non magnam
      distinctio nisi neque eius debitis ratione, error saepe repellendus,
      accusantium reiciendis sunt. Adipisci assumenda, molestiae similique at
      dolores ea rerum ab accusantium in, vel sunt repudiandae ratione, maiores
      ipsam excepturi sapiente architecto totam soluta perspiciatis voluptate
      autem consequuntur suscipit! Esse, earum. Quo enim cumque accusamus alias
      amet nisi distinctio, architecto error ut, iure totam illum ipsum dolor
      recusandae quis nesciunt esse tempore explicabo minus, laborum nemo harum.
      Tempore explicabo officia et magnam! Lorem ipsum dolor sit amet,
      consectetur adipisicing elit. Vel tempore facere ex voluptatum adipisci
      omnis magni, id esse numquam soluta odio magnam accusamus recusandae!
      Cupiditate ducimus delectus explicabo accusamus aliquam autem natus
      reiciendis, eligendi alias, deleniti itaque architecto, neque officiis
      molestias ipsa asperiores iste minima sapiente? Rem enim modi ullam, ipsam
      commodi, et quia quaerat nam dolorem possimus fuga animi dolore ad atque,
      blanditiis eligendi cupiditate accusantium! Quibusdam culpa dignissimos ad
      consectetur expedita consequuntur quo placeat dolorum nam tempore
      molestias, consequatur ipsam eveniet ullam hic nisi harum possimus ipsum
      labore, at numquam atque, deserunt recusandae officiis perspiciatis?
      Facere rem dolorem, est, quibusdam ex error voluptates, atque nisi sit
      corporis saepe fugiat minus. Ea quia reiciendis, nostrum placeat officiis
      velit porro? Delectus quo deserunt quia dicta esse nisi repellendus
      aliquam, atque sed placeat explicabo vitae voluptate aperiam,
      necessitatibus debitis iste nesciunt fugit a unde culpa? Voluptatibus
      provident, est, magnam, harum tenetur pariatur quod hic sequi doloribus
      iure dolores facilis facere fugiat sit deserunt. Sed, facere unde sapiente
      nam animi architecto vero, dolores, deserunt perspiciatis repellendus
      quos, nostrum. A corporis aliquam, sunt molestiae consequatur, voluptas
      omnis aut modi! Eos placeat minima nemo sed dolorum, sit dolore dolor id
      corporis soluta cum quas tempore. Minus distinctio ipsam odit in tempora
      ex est cum soluta facere amet? Deserunt et rerum autem ab obcaecati.
      Animi, possimus dignissimos iusto, enim incidunt optio iste. Corporis
      atque velit natus, earum laborum esse pariatur. Sunt doloremque quibusdam
      laborum ea vel, ipsam, voluptatibus iusto. Sit tempora maiores sed quo
      exercitationem porro fugiat nam, voluptate nisi blanditiis nemo. Soluta
      quasi ipsa est. Omnis obcaecati enim cupiditate iste est quasi quia
      ducimus, iusto nemo culpa eaque officiis tenetur. Quae eligendi adipisci
      modi totam officiis quibusdam, deserunt quas ipsa eveniet quam facilis
      nesciunt iure quasi nulla impedit, rem velit illum nobis, aliquid qui.
      ``Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
      praesentium voluptates autem nisi earum quis neque explicabo similique aut
      debitis, quam soluta quod impedit eius mollitia. Tempora voluptate odit
      repellat fuga, aliquid nobis. Ipsum cupiditate, sequi. Eius quibusdam,
      nisi nesciunt quos odio recusandae architecto ab, totam incidunt
      perferendis esse tenetur sint nemo magni amet temporibus iste minus!
      Recusandae ratione aliquam provident pariatur exercitationem error
      blanditiis quod accusantium architecto eum corporis quo molestiae impedit
      maiores quae, ex amet dolorem quidem. Distinctio doloribus nisi atque
      aliquid, aspernatur soluta facere laudantium! Error illum est natus harum
      eos molestias consequatur mollitia repellendus cum neque tempore quia,
      veritatis ipsum necessitatibus tempora perferendis porro sed quos numquam
      quaerat incidunt rerum nihil. Numquam, iste quia necessitatibus doloribus
      sit maiores. Molestiae ducimus ea veniam explicabo similique repellendus
      consequatur! Est pariatur quaerat soluta aspernatur officia illo odio
      placeat veniam ratione eius itaque sequi labore eaque dolorum earum sit
      blanditiis iste harum consectetur quo dolorem, aliquam minus? Perspiciatis
      mollitia, qui dolorum exercitationem sapiente velit, odit laboriosam,
      explicabo nesciunt dolor sed, non molestiae animi eaque. Expedita autem
      laudantium pariatur nesciunt nam maiores, adipisci incidunt rerum sit
      ipsa, quidem suscipit doloremque voluptatibus ullam. Voluptatibus,
      inventore deserunt voluptatem cum consequuntur minima expedita, aut nobis
      consequatur molestias quidem nam rerum eligendi vero voluptates aspernatur
      hic architecto incidunt enim sapiente saepe optio. Odio amet quo facilis
      commodi atque laboriosam, a nulla voluptates natus inventore eius. Nobis
      saepe, quibusdam iusto. Ut accusantium, velit officia ipsum soluta
      doloremque possimus excepturi cumque dolorum necessitatibus magnam
      dignissimos ratione, nihil, deleniti laboriosam nesciunt ipsam.
      Repudiandae vel molestias ipsam nisi tempora at esse possimus libero
      voluptatum perspiciatis. Culpa laudantium quam illo at vel aut dolor
      voluptatum, perferendis ex, reiciendis ea, ipsam sit repudiandae assumenda
      alias veniam rerum iure deserunt corrupti reprehenderit enim est facilis.
      Eos neque, alias, id voluptates atque enim saepe natus nam. Recusandae
      vero atque quos est nam provident. Nemo nihil porro ducimus exercitationem
      eligendi iure quidem recusandae sed quasi molestiae culpa, illo dolorem
      voluptate debitis cupiditate explicabo magni? Asperiores, cumque magni
      laboriosam quisquam consequatur deserunt perferendis magnam error culpa
      autem! Ratione magni, vitae laborum amet nisi. Dicta vero reiciendis,
      necessitatibus voluptates, ullam voluptatem animi facere labore temporibus
      quod soluta eum ducimus quaerat iste a alias commodi, sequi cum fugit sunt
      laudantium accusantium magni. Itaque vel, perspiciatis! Beatae cumque
      distinctio tempore tenetur saepe, nihil molestiae eveniet sunt ducimus
      quae cum dolores ea voluptatem totam itaque aliquid quod error ratione.
      Repudiandae illum delectus commodi tempora, vel tempore, beatae laboriosam
      facilis distinctio repellat, quia in temporibus velit expedita sit. Nulla
      voluptatum, doloremque aliquid necessitatibus vel nisi rem consectetur
      quas placeat hic, impedit illo numquam consequuntur fugiat tempore
      delectus similique laborum odio veritatis laudantium quia ea repellendus
      temporibus enim. Natus blanditiis illum pariatur deleniti architecto
      itaque, corrupti tempora voluptatum praesentium placeat explicabo veniam
      quibusdam perspiciatis sequi molestias, expedita est esse perferendis
      magni temporibus! Nisi dolorem fuga inventore, error voluptas similique
      mollitia enim, suscipit dolorum veniam saepe veritatis delectus
      dignissimos aut reiciendis quo amet laudantium? Temporibus neque dolores
      velit? Deserunt esse, natus aperiam?
    </div>
  </>
);

export default IndexPage;
