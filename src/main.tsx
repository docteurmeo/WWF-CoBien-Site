import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';
import './styles.css';

const A = '/assets/';

type Page = 'home' | 'co-bien' | 'o-dau';

function pageFromPath(): Page {
  const path = window.location.pathname;
  if (path.includes('co-bien')) return 'co-bien';
  if (path.includes('o-dau')) return 'o-dau';
  return 'home';
}

function go(page: Page) {
  const path = page === 'home' ? '/home' : page === 'co-bien' ? '/co-bien' : '/kham-pha/o-dau';
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function App() {
  const [page, setPage] = useState<Page>(pageFromPath());

  useEffect(() => {
    const onPop = () => setPage(pageFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14, rootMargin: '0px 0px -90px 0px' }
    );
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [page]);

  return (
    <>
      <Header page={page} />
      {page === 'home' && <HomePage />}
      {page === 'co-bien' && <CoBienPage />}
      {page === 'o-dau' && <ODauPage />}
      <Footer />
    </>
  );
}

function Header({ page }: { page: Page }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => go('home')} aria-label="Về trang chủ">
        <span>Theo Dấu</span>
        <b>CỎ BIỂN</b>
      </button>
      <nav>
        <button className={page === 'co-bien' ? 'active' : ''} onClick={() => go('co-bien')}>Cỏ Biển</button>
        <button onClick={() => go('home')}>Cù Lao Chàm</button>
        <button className={page === 'o-dau' ? 'active' : ''} onClick={() => go('o-dau')}>Khám Phá</button>
        <button onClick={() => go('co-bien')}>Hành Động</button>
      </nav>
      <button className="nav-cta" onClick={() => go('o-dau')}>Khám phá ngay <ArrowRight size={16} /></button>
    </header>
  );
}

function Label({ children, color = 'teal' }: { children: React.ReactNode; color?: 'teal' | 'orange' | 'green' }) {
  return <div className={`label label-${color}`}>{children}</div>;
}

function Photo({ src, caption, className = '' }: { src: string; caption?: string; className?: string }) {
  return (
    <figure className={`photo ${className}`}>
      <img src={`${A}${src}`} alt="" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function SeaGrass({ variant = '' }: { variant?: string }) {
  return <div className={`seagrass ${variant}`} aria-hidden="true">{Array.from({ length: 56 }).map((_, i) => <i key={i} />)}</div>;
}

function Bubbles({ count = 9 }: { count?: number }) {
  return <div className="bubbles" aria-hidden="true">{Array.from({ length: count }).map((_, i) => <span key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>;
}

function Wave({ tone = 'cream' }: { tone?: 'cream' | 'mint' | 'dark' }) {
  return <div className={`wave wave-${tone}`} aria-hidden="true" />;
}

function HomePage() {
  return (
    <main>
      <section className="hero home-hero">
        <Bubbles />
        <div className="hero-copy" data-reveal>
          <Label>Cẩm nang du lịch Cù Lao Chàm</Label>
          <h1>Theo dấu<br />Cỏ biển</h1>
          <p className="lead">Khám phá Cù Lao Chàm, từ Nhà của biển.</p>
          <button className="primary" onClick={() => document.getElementById('island-map')?.scrollIntoView({ behavior: 'smooth' })}>Khám phá hòn đảo <ArrowDown size={18} /></button>
        </div>
        <div className="hero-collage" data-reveal>
          <Photo src="bay-aerial.webp" caption="Bãi Hương · Cù Lao Chàm · Hội An · Quảng Nam" className="big tilt-left" />
          <Photo src="boats.jpg" caption="Ra khơi · Bình minh" className="small tilt-right" />
          <img className="animal fish fish-a" src={`${A}fish.png`} alt="" />
        </div>
        <img className="animal turtle" src={`${A}turtle.png`} alt="" />
        <SeaGrass />
        <Wave />
      </section>

      <section id="island-map" className="section split mint">
        <div data-reveal>
          <Label color="orange">Đảo nhỏ · nhiều lớp sống</Label>
          <h2>Cù Lao Chàm không chỉ là một điểm đến trong ngày.</h2>
          <p>Ở đây, biển đi vào bữa ăn, giấc ngủ, chuyến ghe sáng sớm và cả cách người dân chọn gìn giữ những điều đang nuôi sống mình.</p>
        </div>
        <InteractiveMap />
      </section>

      <section className="section intro-grid">
        <div data-reveal>
          <Label>Cỏ biển · Seagrass</Label>
          <h2>Tôi là cỏ biển. Không phải rong.</h2>
          <p>Nhiều người lần đầu nhìn thấy thường nghĩ tôi là rong. Nhưng tôi có rễ, có thân ngầm, có lá. Và tôi ra hoa. Và tôi đang làm rất nhiều việc mà bạn không hay biết.</p>
          <div className="stat-grid compact">
            <Stat value="35×" text="hấp thụ CO₂ nhanh hơn rừng trên cạn" />
            <Stat value="80%" text="loài hải sản thương mại phụ thuộc vào cỏ biển" />
            <Stat value="800T" text="carbon lưu giữ trên mỗi hecta" />
            <Stat value="17 ha" text="còn lại tại Cù Lao Chàm — đang thu hẹp" />
          </div>
          <button className="primary" onClick={() => go('co-bien')}>Câu chuyện của tôi <ArrowRight size={18} /></button>
        </div>
        <Photo src="underwater-seagrass.jpg" caption="Độ sâu 3–5m · Bãi Hương" className="tall" />
      </section>

      <section className="section cards-band">
        <Label color="green">Ăn · Ở · Đi</Label>
        <h2>Ở lại lâu hơn một ngày, bạn sẽ thấy đảo khác đi.</h2>
        <div className="cards three">
          <Card img="morning.png" label="Ở đâu" title="Người mở cửa là chính chủ nhà." onClick={() => go('o-dau')} />
          <Card img="seagrass-split.jpg" label="Ăn gì" title="Từ chuyến ghe sáng sớm đến bàn ăn." />
          <Card img="island-drone.jpg" label="Đi đâu" title="Không cần lịch trình. Cứ đi bộ quanh đảo." />
        </div>
      </section>

      <section className="section dark community">
        <div data-reveal>
          <Label color="orange">Con người Cù Lao Chàm</Label>
          <h2>Những người sống cùng biển.</h2>
          <p>Ở Cù Lao Chàm, biển không đứng ngoài đời sống. Nó đi vào nhịp ngày của con người một cách tự nhiên.</p>
        </div>
        <div className="quote">"Từ khi có bảo tồn là nhận thức cũng như thu nhập của người dân cao lên. Dân với bảo tồn rất là khăng khít với nhau."</div>
      </section>

      <DualCta />
    </main>
  );
}

function InteractiveMap() {
  const places = useMemo(() => [
    ['Bãi Làng', 'Tàu cập bến, chợ cá sáng sớm, chùa Hải Tạng, giếng cổ Chăm Pa.', 34, 48],
    ['Bãi Hương', 'Làng chài 400 năm tuổi, nhịp sống chậm hơn và yên tĩnh hơn.', 66, 62],
    ['Bãi Bắc', 'Khu phục hồi nhạy cảm, nơi câu chuyện bảo tồn hiện rõ nhất.', 52, 28],
    ['Rạn san hô', 'Làn nước trong, sự sống nhỏ và những giới hạn cần được tôn trọng.', 74, 38],
  ], []);
  const [active, setActive] = useState(0);
  return (
    <div className="map-card" data-reveal>
      <img src={`${A}island-drone.jpg`} alt="" />
      {places.map((p, i) => (
        <button key={p[0]} className={`map-pin ${active === i ? 'active' : ''}`} style={{ left: `${p[2]}%`, top: `${p[3]}%` }} onClick={() => setActive(i)} aria-label={`${p[0]}`}>
          <MapPin size={22} />
        </button>
      ))}
      <div className="map-tip">
        <strong>{places[active][0]}</strong>
        <span>{places[active][1]}</span>
      </div>
    </div>
  );
}

function CoBienPage() {
  return (
    <main>
      <section className="hero seagrass-hero">
        <Bubbles count={12} />
        <div className="center-hero" data-reveal>
          <h1>Câu chuyện bắt đầu từ nơi bạn chưa bao giờ nhìn thấy.</h1>
          <p className="lead">Tôi là cỏ biển. Tôi ở ngay dưới làn nước bạn đang bơi — nhưng ít ai biết tôi là ai.</p>
          <button className="primary">Cuộn xuống để gặp tôi <ArrowDown size={18} /></button>
        </div>
        <SeaGrass variant="huge" />
        <Wave />
      </section>

      <section className="section image-text">
        <div data-reveal>
          <Label>VAI TRÒ · TÔI LÀ AI?</Label>
          <h2>Tôi là cỏ biển</h2>
          <p>Ở những vùng nước nông — nơi dòng chảy không quá mạnh và ánh sáng mặt trời còn chạm tới đáy — tôi lớn thành những thảm cỏ trải dài theo nền cát. Tôi là cỏ biển. Một loài thực vật có hoa, sống hoàn toàn dưới nước mặn.</p>
          <div className="callout">CỎ BIỂN ≠ RONG BIỂN<br /><span>Rong biển không có rễ, không có mạch dẫn nhựa, không ra hoa. Cỏ biển là thực vật có hoa thật sự.</span></div>
        </div>
        <Photo src="underwater-seagrass.jpg" caption="Độ sâu 3–5m · Bãi Hương" />
      </section>

      <section className="section carbon">
        <Label color="green">Một kho carbon xanh</Label>
        <h2>Tôi nhỏ, nhưng tôi giữ lại rất nhiều thứ lớn hơn mình.</h2>
        <div className="carbon-stage">
          <div className="hex-pulse">35×</div>
          <p>hấp thụ CO₂ nhanh hơn rừng trên cạn</p>
          <div className="ripples"><i /><i /><i /></div>
        </div>
        <div className="stat-grid">
          <Stat value="80%" text="loài hải sản thương mại phụ thuộc vào cỏ biển" />
          <Stat value="800T" text="carbon lưu giữ trên mỗi hecta" />
          <Stat value="17 ha" text="còn lại tại Cù Lao Chàm — đang thu hẹp" />
        </div>
      </section>

      <section className="section stress">
        <Label color="orange">Hiện trạng</Label>
        <h2>Từ khoảng 50 ha, nay chỉ còn khoảng 17 ha.</h2>
        <AreaLoss />
        <p className="quote-line">"Hơn hai phần ba đã mất. Và quá trình đó vẫn đang tiếp tục."</p>
      </section>

      <section className="section threats dark">
        <Label color="orange">Nguyên nhân</Label>
        <h2>Những gì khiến tôi biến mất?</h2>
        <p>Cỏ biển không biến mất trong ngày một ngày hai. Chân vịt công suất lớn khuấy động nền cát, mỏ neo cày xới đáy biển, rác nhựa, dầu máy, nước thải và thời tiết cực đoan đều tích lũy thành áp lực.</p>
        <div className="cards three">
          <Info label="MỨC CAO" title="Tàu, ca nô, mỏ neo" text="Chân vịt khuấy trầm tích. Mỏ neo cày xới đáy. Bùn mịn phủ lên lá." />
          <Info label="MỨC CAO" title="Thời tiết cực đoan" text="Bão lớn, dòng chảy mạnh. Biến động ngày càng khó lường." />
          <Info label="MỨC TRUNG BÌNH" title="Rác nhựa, dầu máy, nước thải" text="Tác động chậm nhưng tích lũy. Khó nhìn thấy ngay." />
        </div>
      </section>

      <section className="section conservation">
        <Label>BẢO TỒN · CÙ LAO CHÀM</Label>
        <h2>Bảo tồn không phải là công việc của riêng ai.</h2>
        <div className="two-col">
          <p>Khi dành thời gian ở lại Cù Lao Chàm, bạn sẽ dần nhận ra rằng mặt biển vẫn trong xanh và nhịp sống vẫn chậm rãi, bình yên. Điều đó không phải điều tự nhiên mà có.</p>
          <p>Ở nhiều nơi, bảo tồn thường được hình dung như công việc của các nhà khoa học hay những chương trình lớn. Nhưng ở Cù Lao Chàm, nó trước hết đến từ những người sống cùng biển.</p>
        </div>
      </section>
      <DualCta />
    </main>
  );
}

function AreaLoss() {
  return (
    <div className="area-loss" data-reveal>
      <div>
        <strong>~50 ha</strong>
        <span>diện tích cỏ biển từng ghi nhận</span>
        <div className="tile-grid many">{Array.from({ length: 50 }).map((_, i) => <i key={i} />)}</div>
      </div>
      <ArrowRight size={42} />
      <div>
        <strong>~17 ha</strong>
        <span>diện tích cỏ biển còn lại hiện nay</span>
        <div className="tile-grid few">{Array.from({ length: 25 }).map((_, i) => <i key={i} className={i > 16 ? 'lost' : ''} />)}</div>
      </div>
    </div>
  );
}

function ODauPage() {
  return (
    <main>
      <section className="hero stay-hero">
        <Bubbles />
        <div className="hero-copy" data-reveal>
          <Label color="orange">HOMESTAY · CÙ LAO CHÀM</Label>
          <h1>Người mở cửa đón bạn không phải lễ tân. Mà là chính chủ nhà.</h1>
          <p className="lead">Ở Cù Lao Chàm, chỗ ở không phải điểm kết thúc của một ngày.<br />Đó là nơi câu chuyện thật về hòn đảo bắt đầu.</p>
          <button className="primary">Khám phá cách ở lại <ArrowDown size={18} /></button>
        </div>
        <Photo src="homestay-hero.png" className="hero-photo tilt-left" />
      </section>

      <section className="section split">
        <div data-reveal>
          <Label>KHÔNG GIỐNG KHÁCH SẠN</Label>
          <h2>Ở Cù Lao Chàm, bạn không thấy nhiều khách sạn lớn.</h2>
          <p>Thay vào đó là những ngôi nhà nhỏ xinh xắn, nằm dọc theo Bãi Làng, Bãi Hương.</p>
          <p className="accent">Họ có thể là ngư dân. Có thể là người lái tàu. Có thể sáng đi biển, chiều về đón khách.</p>
          <p>Bạn ở lại trong chính không gian sống của họ. Ăn cùng họ. Trò chuyện với họ. Và đôi khi, đó là lúc bạn hiểu nơi này rõ nhất.</p>
        </div>
        <Photo src="homestay-room.png" />
      </section>

      <section className="section cards-band">
        <h2>Hai vùng để ở. Bạn chọn đâu?</h2>
        <div className="cards two">
          <Card img="bai-lang.png" label="BÃI LÀNG" title="Nơi mọi thứ bắt đầu." text="Bãi Làng là nơi tàu cập bến. Nhưng cũng là nơi cuộc sống đảo diễn ra rõ nhất." />
          <Card img="bai-huong.png" label="BÃI HƯƠNG" title="Làng chài 400 năm tuổi." text="Bãi Hương nằm ở phía Nam đảo — xa hơn, chậm hơn, và yên tĩnh hơn." />
        </div>
      </section>

      <section className="section timeline">
        <h2>Một ngày ở lại trông không giống một ngày tour.</h2>
        <div className="timeline-list">
          {[
            ['5:30', 'Rời bến', 'Nếu bạn dậy đúng lúc, ngày mới bắt đầu từ tiếng ghe nổ máy và mùi nước biển.'],
            ['7:00', 'Bữa sáng', 'Bữa sáng không cần cầu kỳ, nhưng có vị của đảo.'],
            ['15:00', 'Bơi nhẹ', 'Buổi chiều, mặt nước dịu hơn. Không cần vội vàng.'],
            ['18:00', 'Bữa tối', 'Ăn cùng chủ nhà, nghe chuyện đi biển và mùa gió.'],
            ['Sáng hôm sau', 'Không cần vội', 'Bạn rời đảo với cảm giác mình vừa ở lại, không chỉ ghé qua.'],
          ].map(([time, title, text], i) => <TimelineItem key={title} time={time} title={title} text={text} index={i} />)}
        </div>
      </section>

      <section className="section mint meaning">
        <Label>Ý NGHĨA · BẢO TỒN GẮN SINH KẾ</Label>
        <h2>Mỗi đêm bạn ở lại không chỉ là một đêm ngủ.</h2>
        <p>Bữa ăn tối bạn đặt tại nhà chủ là thu nhập của một gia đình ngư dân — người sáng đánh cá, chiều đón khách, tối nấu cơm.</p>
        <div className="stat-ripple"><strong>5–10%</strong><span>khách ở lại qua đêm nhưng tạo phần lớn sinh kế bền vững</span></div>
      </section>

      <section className="section practical">
        <Label>CHUẨN BỊ · THỰC DỤNG</Label>
        <h2>Một vài điều nên biết trước khi đặt chỗ.</h2>
        <div className="cards four">
          <Info label="MÙA & THỜI ĐIỂM" title="Tháng 2 – tháng 9" text="Biển calmer, tàu chạy đều, homestay đầy nhanh trong mùa hè." />
          <Info label="CÁCH ĐI" title="8h40 sáng" text="Chỉ có 1 chuyến tàu gỗ ra đảo buổi sáng. Gợi ý: đặt homestay trước rồi hỏi chủ nhà về lịch tàu hiện tại." />
          <Info label="CHUẨN BỊ" title="Không có ATM" text="Mang tiền mặt. Đảo đã nói không với túi nilon từ 2009." />
          <Info label="LỄ HỘI ĐÁNG THAM GIA" title="Mùng 9–10/3 ÂL" text="Giỗ Tổ nghề Yến sào tại Miếu Tổ nghề Yến, Bãi Hương." />
        </div>
      </section>

      <section className="section cards-band">
        <Label color="green">LANG THANG · QUANH ĐÂY</Label>
        <h2>Không cần lịch trình. Nhưng nếu muốn đi bộ ra đây, cũng không xa.</h2>
        <div className="cards three">
          <Card img="well.png" label="GIẾNG CỔ CHĂM PA" title="Nước ngọt giữa biển" text="Một chiếc giếng cổ người Chăm nằm giữa những con đường nhỏ ở Bãi Làng." />
          <Card img="temple.png" label="CHÙA HẢI TẠNG" title="200 năm tuổi" text="Chùa Hải Tạng đã ngự trên đảo hơn 200 năm. Không lớn, không cầu kỳ." />
          <Card img="market.png" label="CHỢ TÂN HIỆP" title="Mùi của đảo" text="Chợ nhỏ, nhưng thứ gì cũng có. Cá vừa đi biển về, cua đá buộc dây trong rổ." />
        </div>
      </section>

      <DualCta />
    </main>
  );
}

function Stat({ value, text }: { value: string; text: string }) {
  return <div className="stat" data-reveal><strong>{value}</strong><span>{text}</span></div>;
}

function Card({ img, label, title, text, onClick }: { img: string; label: string; title: string; text?: string; onClick?: () => void }) {
  return (
    <article className="card" data-reveal onClick={onClick}>
      <img src={`${A}${img}`} alt="" />
      <Label color={label.includes('BÃI') ? 'teal' : 'orange'}>{label}</Label>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
    </article>
  );
}

function Info({ label, title, text }: { label: string; title: string; text: string }) {
  return <article className="info" data-reveal><Label color="orange">{label}</Label><h3>{title}</h3><p>{text}</p></article>;
}

function TimelineItem({ time, title, text, index }: { time: string; title: string; text: string; index: number }) {
  return <div className="timeline-item" data-reveal style={{ '--d': `${index * 80}ms` } as React.CSSProperties}><b>{time}</b><div><h3>{title}</h3><p>{text}</p></div></div>;
}

function DualCta() {
  return (
    <section className="dual-cta">
      <div>
        <Label color="orange">TIẾP THEO · ĂN GÌ</Label>
        <h2>Từ chuyến ghe sáng sớm đến bàn ăn — chỉ cách vài giờ.</h2>
        <button className="primary ghost">Khám phá ăn gì <ArrowRight size={18} /></button>
      </div>
      <div>
        <Label>VÌ SAO · ĐẰNG SAU</Label>
        <h2>Tại sao nơi này vẫn còn nguyên vẹn.</h2>
        <button className="primary" onClick={() => go('co-bien')}>Về Cỏ biển <ArrowRight size={18} /></button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div>
        <strong>Theo Dấu<br /><span>CỎ BIỂN</span></strong>
        <small>theosaudacobien.vn</small>
      </div>
      <nav>
        <button onClick={() => go('co-bien')}>Cỏ Biển</button>
        <button onClick={() => go('home')}>Cù Lao Chàm</button>
        <button onClick={() => go('o-dau')}>Ở Đâu</button>
        <button onClick={() => go('co-bien')}>Hành Động</button>
      </nav>
      <p>Dự án thuộc chương trình bảo tồn cỏ biển tại Cù Lao Chàm · Phối hợp giữa WWF Việt Nam và Ban Quản lý Khu Bảo Tồn Thiên Nhiên Cù Lao Chàm</p>
    </footer>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
