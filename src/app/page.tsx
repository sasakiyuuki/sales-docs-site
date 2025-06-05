import { getMarkdownContent, getMarkdownFiles } from '../lib/markdown';
import SectionCard from '../components/SectionCard';

export default async function Home() {
  // Markdownファイルの取得（優先順位: caster_biz_presentation > caster_biz_content）
  const files = getMarkdownFiles();
  const fileId = files.includes('caster_biz_presentation') 
    ? 'caster_biz_presentation' 
    : files.includes('caster_biz_content') 
      ? 'caster_biz_content' 
      : files[0];

  if (!fileId) {
    return <div className="container mx-auto px-4 py-8">コンテンツが見つかりませんでした</div>;
  }

  // Markdownコンテンツの取得
  const markdownContent = await getMarkdownContent(fileId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">
            CASTER BIZ assistant - 営業資料
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {markdownContent.sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto text-center">
          <p className="text-base font-normal">© {new Date().getFullYear()} 株式会社キャスター</p>
        </div>
      </footer>
    </div>
  );
}
