import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MarkdownContent {
  id: string;
  contentHtml: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
}

export function getMarkdownFiles(): string[] {
  return fs.readdirSync(contentDirectory)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

export async function getMarkdownContent(id: string): Promise<MarkdownContent> {
  const fullPath = path.join(contentDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // マークダウンを解析
  const matterResult = matter(fileContents);
  
  // remark を使用してマークダウンを HTML に変換
  const processedContent = await remark()
    .use(html, { sanitize: false }) // HTMLタグを許可
    .use(remarkGfm)
    .process(matterResult.content);
  
  const contentHtml = processedContent.toString();
  
  // セクション分割（マークダウンの見出し ## で区切る）
  const sections = await extractSections(matterResult.content);
  
  return {
    id,
    contentHtml,
    sections
  };
}

async function extractSections(markdownContent: string): Promise<Section[]> {
  // ## で始まる行でセクション分割
  const sections: Section[] = [];
  const lines = markdownContent.split('\n');
  
  let currentSection: Section | null = null;
  let currentContent: string[] = [];
  
  // セクションIDの重複を管理するためのマップ
  const idCounts: Record<string, number> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // セクションの開始を検出
    if (line.startsWith('## ')) {
      // 前のセクションがあれば保存
      if (currentSection) {
        const content = currentContent.join('\n');
        // HTMLに変換
        const processedContent = await remark()
          .use(html, { sanitize: false })
          .use(remarkGfm)
          .process(content);
        
        currentSection.content = processedContent.toString();
        sections.push(currentSection);
      }
      
      // 新しいセクションを作成
      const title = line.replace(/^## /, '').trim();
      let id = title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      // 空のIDの場合はデフォルト値を設定
      if (!id) id = 'section';
      
      // IDの重複をチェックして一意のIDを生成
      if (idCounts[id]) {
        idCounts[id]++;
        id = `${id}-${idCounts[id]}`;
      } else {
        idCounts[id] = 1;
      }
      
      currentSection = {
        id,
        title,
        content: ''
      };
      
      currentContent = [];
    } else if (line.startsWith('# ') && !currentSection) {
      // タイトルセクションとして扱う
      const title = line.replace(/^# /, '').trim();
      const id = 'title';
      
      currentSection = {
        id,
        title,
        content: ''
      };
      
      currentContent = [];
    } else if (line.startsWith('---') && currentSection) {
      // セクションの区切り線は現在のセクションのコンテンツに含める
      currentContent.push(line);
    } else if (currentSection) {
      // 現在のセクションに内容を追加
      currentContent.push(line);
    }
  }
  
  // 最後のセクションを保存
  if (currentSection) {
    const content = currentContent.join('\n');
    // HTMLに変換
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .use(remarkGfm)
      .process(content);
    
    currentSection.content = processedContent.toString();
    sections.push(currentSection);
  }
  
  return sections;
} 