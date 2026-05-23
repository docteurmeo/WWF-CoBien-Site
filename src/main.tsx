import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import './styles.css';

const BASE_PREFIX = location.pathname.startsWith('/WWF-CoBien-Site') ? '/WWF-CoBien-Site' : '';
const A = `${BASE_PREFIX}/assets/`;
type Page = 'home' | 'co-bien' | 'o-dau';

const routeFor = (page: Page) => `${BASE_PREFIX}${page === 'home' ? '/home' : page === 'co-bien' ? '/co-bien' : '/kham-pha/o-dau'}`;
const pageFromPath = (): Page => location.pathname.includes('co-bien') ? 'co-bien' : location.pathname.includes('o-dau') ? 'o-dau' : 'home';

function navigate(page: Page) {
  history.pushState({}, '', routeFor(page));
  window.dispatchEvent(new PopStateEvent('popstate'));
  scrollTo({ top: 0, behavior: 'smooth' });
}

function App() {
  const [page, setPage] = useState<Page>(pageFromPath());
  useEffect(() => {
    const onPop = () => setPage(pageFromPath());
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible'));
    }, { threshold: .12, rootMargin: '0px 0px -80px 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [page]);

  return (
    <>
      <Header page={page} />
      {page === 'home' && <Home />}
      {page === 'co-bien' && <CoBien />}
      {page === 'o-dau' && <ODau />}
      <Footer />
    </>
  );
}

function Header({ page }: { page: Page }) {
  return (
    <header className="nav">
      <button className="nav-logo nav-logo-image" onClick={() => navigate('home')} aria-label="Theo Dấu Cỏ Biển">
        <span>Theo Dấu</span><b>CỎ BIỂN</b>
      </button>
      <nav>
        <button className={page === 'co-bien' ? 'active' : ''} onClick={() => navigate('co-bien')}>Cỏ Biển</button>
        <button onClick={() => navigate('home')}>Cù Lao Chàm</button>
        <button className={page === 'o-dau' ? 'active' : ''} onClick={() => navigate('o-dau')}>Khám Phá <ChevronDown size={16} /></button>
        <button onClick={() => navigate('co-bien')}>Hành Động</button>
      </nav>
      <button className="btn nav-btn" onClick={() => navigate('o-dau')}>Khám phá ngay <ArrowRight size={16} /></button>
    </header>
  );
}

function Label({ children, tone = 'teal' }: { children: React.ReactNode; tone?: 'teal' | 'orange' | 'green' | 'sand' }) {
  return <span className={`torn label-${tone}`}>{children}</span>;
}

function Photo({ src, caption, className = '' }: { src: string; caption?: string; className?: string }) {
  return <figure className={`photo ${className}`}><img src={A + src} alt="" />{caption && <figcaption>{caption}</figcaption>}</figure>;
}

function Bubbles({ className = '' }: { className?: string }) {
  return <div className={`bubbles ${className}`}>{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>;
}

function Grass({ dense = false }: { dense?: boolean }) {
  return <div className={`grass ${dense ? 'dense' : ''}`}>{Array.from({ length: dense ? 90 : 58 }, (_, i) => <i key={i} />)}</div>;
}

function Wave({ color = 'cream' }: { color?: 'cream' | 'paper' | 'mint' | 'deep' }) {
  return <div className={`wave wave-${color}`} />;
}

function Home() {
  return (
    <main>
      <section className="home-hero page-hero">
        <Bubbles />
        <div className="hero-copy" data-reveal>
          <Label>Cẩm nang du lịch Cù Lao Chàm</Label>
          <h1>Theo dấu<br />Cỏ biển</h1>
          <p className="hero-sub">Khám phá Cù Lao Chàm, từ Nhà của biển.</p>
          <button className="btn" onClick={() => document.getElementById('home-map')?.scrollIntoView({ behavior: 'smooth' })}>Khám phá hòn đảo <ArrowDown size={18} /></button>
        </div>
        <div className="hero-photos" data-reveal>
          <Photo src="bay-aerial.webp" caption="Bãi Hương · Cù Lao Chàm · Hội An · Quảng Nam" className="hero-photo-large tilt-left" />
          <Photo src="boats.jpg" caption="Ra khơi · Bình minh" className="hero-photo-small tilt-right" />
          <img className="animal fish-a" src={A + 'fish.png'} alt="" />
        </div>
        <img className="animal turtle-a" src={A + 'turtle.png'} alt="" />
        <Grass />
        <Wave color="mint" />
      </section>

      <section id="home-map" className="home-map section paper">
        <div className="map-copy" data-reveal>
          <Label tone="orange">Cù Lao Chàm · UNESCO</Label>
          <h2>Một hòn đảo nhỏ. Nhưng có rất nhiều cách để đi chậm lại.</h2>
          <p>Ở đây, biển không chỉ nằm ngoài khung ảnh. Nó đi vào bữa ăn, giấc ngủ, chuyến ghe sáng sớm và cách người dân chọn giữ lại những điều đang nuôi sống mình.</p>
        </div>
        <IslandMap />
      </section>

      <section className="home-trails section cream">
        <Label tone="green">Đến đây rồi, bắt đầu từ đâu?</Label>
        <h2>Ba lối đi vào câu chuyện Cù Lao Chàm.</h2>
        <div className="field-cards three">
          <StoryCard img="underwater-seagrass.jpg" label="Cỏ biển" title="Tôi là cỏ biển. Không phải rong." onClick={() => navigate('co-bien')} />
          <StoryCard img="homestay-hero.jpg" label="Ở đâu" title="Người mở cửa là chính chủ nhà." onClick={() => navigate('o-dau')} />
          <StoryCard img="seagrass-split.jpg" label="Ăn gì" title="Từ chuyến ghe sáng sớm đến bàn ăn." />
        </div>
      </section>

      <section className="home-seagrass section mint split">
        <Photo src="underwater-seagrass.jpg" caption="Độ sâu 3–5m · Bãi Hương" className="vertical-photo" />
        <div data-reveal>
          <Label>Cỏ biển · Seagrass</Label>
          <h2>Tôi là cỏ biển. Không phải rong.</h2>
          <p>Nhiều người lần đầu nhìn thấy thường nghĩ tôi là rong. Nhưng tôi có rễ, có thân ngầm, có lá. Và tôi ra hoa. Và tôi đang làm rất nhiều việc mà bạn không hay biết.</p>
          <div className="mini-stats">
            <Stat value="35×" text="hấp thụ CO₂ nhanh hơn rừng trên cạn" />
            <Stat value="80%" text="loài hải sản thương mại phụ thuộc vào cỏ biển" />
            <Stat value="800T" text="carbon lưu giữ trên mỗi hecta" />
            <Stat value="17 ha" text="còn lại tại Cù Lao Chàm — đang thu hẹp" />
          </div>
          <button className="btn" onClick={() => navigate('co-bien')}>Câu chuyện của tôi <ArrowRight size={18} /></button>
        </div>
      </section>

      <section className="community-band section deep">
        <div data-reveal>
          <Label tone="sand">Con người Cù Lao Chàm</Label>
          <h2>Những người sống cùng biển.</h2>
          <p>Ở Cù Lao Chàm, biển không đứng ngoài đời sống. Nó đi vào nhịp ngày của con người một cách tự nhiên, đến mức nhiều khi rất khó phân biệt đâu là công việc, đâu là lối sống.</p>
        </div>
        <div className="portrait-row">
          <QuoteCard role="Ngư dân" text="Biển mà không còn cỏ, thì tôm cá cũng không còn chỗ lớn." />
          <QuoteCard role="Chủ nhà" text="Khách ở lại qua đêm hiểu đảo hơn nhiều. Họ trân trọng hơn." />
          <QuoteCard role="Người giữ biển" text="17 ha cỏ biển — đó là con số chúng tôi phải bảo vệ từng ngày." />
        </div>
      </section>

      <DualCTA />
    </main>
  );
}

function IslandMap() {
  const pins = [
    ['Bãi Làng', 'Tàu cập bến, chợ cá sáng sớm, chùa Hải Tạng, giếng cổ Chăm Pa.', 38, 60],
    ['Bãi Hương', 'Làng chài 400 năm tuổi, xa hơn, chậm hơn, và yên tĩnh hơn.', 67, 70],
    ['Bãi Bắc', 'Khu vực phục hồi, nơi câu chuyện bảo tồn hiện rõ nhất.', 54, 35],
    ['Rạn san hô', 'Đi qua bằng sự tò mò, nhưng giữ lại bằng sự tôn trọng.', 74, 45],
  ] as const;
  const [active, setActive] = useState(0);
  return (
    <div className="island-map" data-reveal>
      <img src={A + 'island-drone.jpg'} alt="" />
      {pins.map((pin, i) => <button key={pin[0]} className={`pin ${active === i ? 'active' : ''}`} style={{ left: `${pin[2]}%`, top: `${pin[3]}%` }} onClick={() => setActive(i)}><MapPin size={22} /></button>)}
      <div className="map-info"><b>{pins[active][0]}</b><span>{pins[active][1]}</span></div>
    </div>
  );
}

function CoBien() {
  return (
    <main>
      <section className="cobien-hero page-hero">
        <Bubbles />
        <div className="center-hero" data-reveal>
          <h1>Câu chuyện bắt đầu từ nơi bạn chưa bao giờ nhìn thấy.</h1>
          <p className="hero-sub">Tôi là cỏ biển. Tôi ở ngay dưới làn nước bạn đang bơi — nhưng ít ai biết tôi là ai.</p>
          <button className="btn">Cuộn xuống để gặp tôi <ArrowDown size={18} /></button>
        </div>
        <Grass dense />
        <Wave color="cream" />
      </section>

      <section className="section image-cover">
        <img src={A + 'underwater-seagrass.jpg'} alt="" />
        <div className="overlay-text" data-reveal>
          <Label>VAI TRÒ · TÔI LÀ AI?</Label>
          <h2>Tôi là cỏ biển</h2>
          <p>Ở những vùng nước nông — nơi dòng chảy không quá mạnh và ánh sáng mặt trời còn chạm tới đáy — tôi lớn thành những thảm cỏ trải dài theo nền cát. Tôi là cỏ biển. Một loài thực vật có hoa, sống hoàn toàn dưới nước mặn.</p>
          <div className="note"><b>CỎ BIỂN ≠ RONG BIỂN</b><span>Rong biển không có rễ, không có mạch dẫn nhựa, không ra hoa.</span></div>
        </div>
      </section>

      <section className="section cream split">
        <div data-reveal>
          <Label tone="green">Một kho carbon xanh</Label>
          <h2>Tôi nhỏ, nhưng tôi giữ lại rất nhiều thứ lớn hơn mình.</h2>
          <p>Một hecta cỏ biển khỏe mạnh có thể lưu giữ lượng carbon rất lớn trong trầm tích, đồng thời là nơi trú ẩn và lớn lên của nhiều loài hải sản thương mại.</p>
        </div>
        <div className="carbon-widget" data-reveal>
          <div className="hex">35×</div>
          <i /><i /><i />
          <strong>hấp thụ CO₂ nhanh hơn rừng trên cạn</strong>
        </div>
      </section>

      <section className="section stress-section">
        <Label tone="orange">Hiện trạng</Label>
        <h2>Từ khoảng 50 ha, nay chỉ còn khoảng 17 ha.</h2>
        <AreaLoss />
        <p className="pull">"Hơn hai phần ba đã mất. Và quá trình đó vẫn đang tiếp tục."</p>
      </section>

      <section className="section deep threats">
        <Label tone="orange">Nguyên nhân</Label>
        <h2>Những gì khiến tôi biến mất?</h2>
        <div className="threat-layout">
          <p>Cỏ biển không biến mất trong ngày một ngày hai. Trong những năm du lịch phát triển nhanh, lượng tàu thuyền ra vào đảo tăng mạnh. Chân vịt khuấy động nền cát, mỏ neo cày xới đáy biển, bùn mịn phủ lên lá cỏ.</p>
          <div className="threat-stack">
            <Info label="MỨC CAO" title="Tàu, ca nô, mỏ neo" text="Chân vịt khuấy trầm tích. Mỏ neo cày xới đáy. Bùn mịn phủ lên lá." />
            <Info label="MỨC CAO" title="Thời tiết cực đoan" text="Bão lớn, dòng chảy mạnh. Biến động ngày càng khó lường." />
            <Info label="MỨC TRUNG BÌNH" title="Rác nhựa, dầu máy, nước thải" text="Tác động chậm nhưng tích lũy. Khó nhìn thấy ngay." />
          </div>
        </div>
      </section>

      <section className="section conservation-section">
        <Label>BẢO TỒN · CÙ LAO CHÀM</Label>
        <h2>Bảo tồn không phải là công việc của riêng ai.</h2>
        <div className="two-copy">
          <p>Khi dành thời gian ở lại Cù Lao Chàm, bạn sẽ dần nhận ra rằng mặt biển vẫn trong xanh và nhịp sống vẫn chậm rãi, bình yên. Điều đó không phải điều tự nhiên mà có.</p>
          <p>Ở nhiều nơi, bảo tồn thường được hình dung như công việc của các nhà khoa học hay những chương trình lớn. Nhưng ở Cù Lao Chàm, nó trước hết đến từ những người sống cùng biển.</p>
        </div>
      </section>

      <section className="section closing-sea">
        <div>
          <Label>KẾT · TỪ TÔI ĐẾN BẠN</Label>
          <p>Rồi sẽ đến lúc bạn quay lại bến cảng. Tàu rời đảo khi mặt trời đã lên cao. Tôi vẫn tiếp tục nuôi những sự sống rất nhỏ dưới mặt nước.</p>
          <h2>Những điều ấy không tự nhiên mà còn lại. Trong đó có cả bạn.</h2>
        </div>
      </section>

      <DualCTA />
    </main>
  );
}

function AreaLoss() {
  return (
    <div className="area-loss" data-reveal>
      <div><span>TRƯỚC ĐÂY</span><b>~50 ha</b><p>diện tích cỏ biển từng ghi nhận</p><TileGrid count={50} /></div>
      <ArrowRight size={44} />
      <div><span>HIỆN NAY</span><b>~17 ha</b><p>diện tích cỏ biển còn lại hiện nay</p><TileGrid count={25} lostFrom={17} /></div>
    </div>
  );
}

function TileGrid({ count, lostFrom = 999 }: { count: number; lostFrom?: number }) {
  return <div className="tiles">{Array.from({ length: count }, (_, i) => <i key={i} className={i >= lostFrom ? 'lost' : ''} />)}</div>;
}

function ODau() {
  const timeline = [
    ['5:30 – 7:00', 'BUỔI SÁNG SỚM', 'Khi bạn còn đang say giấc, cuộc sống trên đảo đã bắt đầu. Hãy dậy sớm, ra cầu cảng Bãi Làng.'],
    ['7:00 – 9:00', 'BUỔI SÁNG', 'Buổi sáng, bạn có thể bắt đầu bằng một tô mỳ, một ổ bánh mì, hay đơn giản là ly cà phê nhìn ra biển.'],
    ['9:00 – 17:00', 'BAN NGÀY', 'Biển, rừng, hoặc chỉ đơn giản là đi bộ dọc đảo. Không có lịch cứng.'],
    ['17:00 – 19:00', 'BUỔI CHIỀU', 'Khi chiều xuống, đảo chậm lại. Khách ngoài bãi thưa dần. Mặt nước đổi màu từ xanh sang gam trầm hơn.'],
    ['19:00 – 21:00', 'BỮA TỐI', 'Bữa tối ở đây không cần đặt bàn. Chủ nhà sẽ hỏi buổi sáng: “Tối ni ăn gì?”'],
    ['21:00+', 'ĐÊM — TÙY CHỌN', 'Nếu may mắn, bạn còn có thể theo thuyền của ngư dân ra biển câu mực đêm.'],
    ['NGÀY HÔM SAU', 'SÁNG HÔM SAU', 'Sáng hôm sau, bạn nhìn mặt biển bằng một ánh mắt khác.'],
  ];
  return (
    <main>
      <section className="odau-hero page-hero">
        <Bubbles />
        <div className="odau-hero-copy" data-reveal>
          <Label tone="orange">HOMESTAY · CÙ LAO CHÀM</Label>
          <h1>Người mở cửa đón bạn không phải lễ tân. Mà là chính chủ nhà.</h1>
          <p className="hero-sub">Ở Cù Lao Chàm, chỗ ở không phải điểm kết thúc của một ngày. Đó là nơi câu chuyện thật về hòn đảo bắt đầu.</p>
          <button className="btn">Khám phá cách ở lại <ArrowDown size={18} /></button>
        </div>
        <Photo src="homestay-hero.jpg" className="odau-hero-photo tilt-left" />
      </section>

      <section className="section odau-intro split">
        <div data-reveal>
          <Label>KHÔNG GIỐNG KHÁCH SẠN</Label>
          <h2>Ở Cù Lao Chàm, bạn không thấy nhiều khách sạn lớn.</h2>
          <p>Thay vào đó là những ngôi nhà nhỏ xinh xắn, nằm dọc theo Bãi Làng, Bãi Hương.</p>
          <p className="script">Họ có thể là ngư dân. Có thể là người lái tàu. Có thể sáng đi biển, chiều về đón khách.</p>
          <p>Bạn ở lại trong chính không gian sống của họ. Ăn cùng họ. Trò chuyện với họ. Và đôi khi, đó là lúc bạn hiểu nơi này rõ nhất.</p>
        </div>
        <div>
          <Photo src="homestay-room.png" className="tilt-right" />
          <div className="fact-card"><span>KHÁCH QUA ĐÊM</span><b>5–10%</b><p>Phần lớn đến và về trong ngày. Nhưng những người ở lại thường là người hiểu đảo nhất.</p></div>
        </div>
      </section>

      <section className="section cream">
        <Label>Lựa chọn điểm đến</Label>
        <h2>Hai vùng để ở. Bạn chọn đâu?</h2>
        <div className="field-cards two stagger">
          <StoryCard img="bai-lang.png" label="BÃI LÀNG" title="Nơi mọi thứ bắt đầu." text="Bãi Làng là nơi tàu cập bến. Nhưng cũng là nơi cuộc sống đảo diễn ra rõ nhất." />
          <StoryCard img="bai-huong.png" label="BÃI HƯƠNG" title="Làng chài 400 năm tuổi." text="Bãi Hương nằm ở phía Nam đảo — xa hơn, chậm hơn, và yên tĩnh hơn." />
        </div>
      </section>

      <section className="section timeline-section">
        <Label tone="orange">MỘT NGÀY KHI Ở LẠI</Label>
        <h2>Một ngày ở lại trông không giống một ngày tour.</h2>
        <div className="timeline">
          {timeline.map((item, index) => <Timeline key={item[1]} item={item} index={index} />)}
        </div>
      </section>

      <section className="section review-section">
        <Label tone="sand">review</Label>
        <h2>Những người đã ở lại nói gì.</h2>
        <div className="review-row">
          <QuoteCard role="— KHÁCH LƯU TRÚ" text="Trải nghiệm tuyệt vời đến nỗi chúng tôi quyết định thay đổi kế hoạch và ở lại thêm một đêm nữa." />
          <QuoteCard role="— KHÁCH LƯU TRÚ" text="Điều làm nên sự đặc biệt và đáng yêu của nơi này chính là chủ nhà, người hết lòng quan tâm và chăm sóc mọi thứ." />
          <QuoteCard role="— KHÁCH LƯU TRÚ" text="Một chốn bình yên đích thực. Tôi đã hoàn toàn hòa mình vào cuộc sống địa phương." />
        </div>
      </section>

      <section className="section mint meaning-section">
        <Bubbles />
        <div className="center-copy" data-reveal>
          <Label>Ý NGHĨA · BẢO TỒN GẮN SINH KẾ</Label>
          <h2>Mỗi đêm bạn ở lại không chỉ là một đêm ngủ.</h2>
          <p>Bữa ăn tối bạn đặt tại nhà chủ là thu nhập của một gia đình ngư dân — người sáng đánh cá, chiều đón khách, tối nấu cơm. Chuyến đi biển đêm bạn tham gia là sinh kế trực tiếp của người lái thuyền.</p>
          <p>Và khi người dân sống được từ những điều ấy, họ có lý do để tiếp tục giữ biển.</p>
        </div>
        <div className="livelihood-row">
          <Photo src="morning.jpg" caption="Bữa ăn = Sinh kế" />
          <Photo src="boats.jpg" caption="Chuyến đi biển = Sinh kế" />
          <Photo src="bai-huong.png" caption="Chuyến thuyền = Sinh kế" />
        </div>
      </section>

      <section className="section practical-section">
        <Label>CHUẨN BỊ · THỰC DỤNG</Label>
        <h2>Một vài điều nên biết trước khi đặt chỗ.</h2>
        <div className="info-grid">
          <Info label="MÙA & THỜI ĐIỂM" title="Tháng 2 – tháng 9" text="Biển calmer, tàu chạy đều, homestay đầy nhanh trong mùa hè. T10–T1: mùa gió bấc — tàu có thể hoãn." />
          <Info label="CÁCH ĐI" title="8h40 sáng" text="Chỉ có 1 chuyến tàu gỗ ra đảo buổi sáng. Gợi ý: đặt homestay trước rồi hỏi chủ nhà về lịch tàu hiện tại." />
          <Info label="CHUẨN BỊ" title="Không có ATM" text="Sóng điện thoại — không mạnh ở mọi nơi. Đảo đã nói không với túi nilon từ 2009." />
          <Info label="LỄ HỘI ĐÁNG THAM GIA" title="Mùng 9–10/3 ÂL" text="Tại Miếu Tổ nghề Yến, Bãi Hương. Lễ tế, rước kiệu dọc bờ biển." />
        </div>
      </section>

      <section className="section cream">
        <Label tone="green">LANG THANG · QUANH ĐÂY</Label>
        <h2>Không cần lịch trình. Nhưng nếu muốn đi bộ ra đây, cũng không xa.</h2>
        <div className="field-cards three">
          <StoryCard img="well.png" label="GIẾNG CỔ CHĂM PA" title="Nước ngọt giữa biển" text="Một chiếc giếng cổ người Chăm nằm giữa những con đường nhỏ ở Bãi Làng." />
          <StoryCard img="temple.png" label="CHÙA HẢI TẠNG" title="200 năm tuổi" text="Chùa Hải Tạng đã ngự trên đảo hơn 200 năm. Không lớn, không cầu kỳ." />
          <StoryCard img="market.png" label="CHỢ TÂN HIỆP" title="Mùi của đảo" text="Chợ nhỏ, nhưng thứ gì cũng có. Cá vừa đi biển về, cua đá buộc dây trong rổ." />
        </div>
      </section>

      <DualCTA />
    </main>
  );
}

function Timeline({ item, index }: { item: string[]; index: number }) {
  const [time, title, text] = item;
  return (
    <article className={`timeline-item ${index % 2 ? 'right' : 'left'}`} data-reveal>
      <span>{time}</span>
      <div>
        <Photo src={['morning-small.jpg', 'morning.jpg', 'bai-lang.png', 'afternoon.jpg', 'sunset.jpg', 'night.png', 'next-morning.jpg'][index]} />
        <b>{title}</b>
        <p>{text}</p>
      </div>
    </article>
  );
}

function StoryCard({ img, label, title, text, onClick }: { img: string; label: string; title: string; text?: string; onClick?: () => void }) {
  return <article className="story-card" data-reveal onClick={onClick}><img src={A + img} alt="" /><Label tone="orange">{label}</Label><h3>{title}</h3>{text && <p>{text}</p>}</article>;
}

function Info({ label, title, text }: { label: string; title: string; text: string }) {
  return <article className="info-card" data-reveal><Label tone="orange">{label}</Label><h3>{title}</h3><p>{text}</p></article>;
}

function QuoteCard({ role, text }: { role: string; text: string }) {
  return <article className="quote-card" data-reveal><i>"</i><p>"{text}"</p><span>{role}</span></article>;
}

function Stat({ value, text }: { value: string; text: string }) {
  return <div className="stat"><b>{value}</b><span>{text}</span></div>;
}

function DualCTA() {
  return (
    <section className="dual-cta">
      <div><Label tone="orange">TIẾP THEO · ĂN GÌ</Label><h2>Từ chuyến ghe sáng sớm đến bàn ăn — chỉ cách vài giờ.</h2><p>Mùa nào thức nấy. Hỏi chủ nhà ăn gì trước — rồi cứ thế biển sẽ trả lời.</p><button className="btn">Khám phá ăn gì <ArrowRight size={18} /></button></div>
      <div><Label>VÌ SAO · ĐẰNG SAU</Label><h2>Tại sao nơi này vẫn còn nguyên vẹn.</h2><p>Câu chuyện về thứ đang giữ cho bữa ăn và mặt nước này tiếp tục tồn tại.</p><button className="btn" onClick={() => navigate('co-bien')}>Về Cỏ biển <ArrowRight size={18} /></button></div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-top"><div><strong>Theo Dấu</strong><b>CỎ BIỂN</b><small>theosaudacobien.vn</small></div><div><span>THỰC HIỆN BỞI</span><strong>WWF Việt Nam</strong><p>× BQL KBTTN Cù Lao Chàm</p></div></div>
      <nav><button onClick={() => navigate('co-bien')}>Cỏ Biển</button><button onClick={() => navigate('home')}>Cù Lao Chàm</button><button onClick={() => navigate('o-dau')}>Ở Đâu</button><button>Ăn Gì</button><button>Hành Động</button><button>Tài Nguyên</button></nav>
      <p>Dự án thuộc chương trình bảo tồn cỏ biển tại Cù Lao Chàm · Phối hợp giữa WWF Việt Nam và Ban Quản lý Khu Bảo Tồn Thiên Nhiên Cù Lao Chàm</p>
    </footer>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
