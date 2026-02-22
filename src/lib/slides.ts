import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface SlideData {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  classification: string;
  slideType: string;
  foto?: string;
  content: string;
}

export interface ActorData {
  slug: string;
  title: string;
  classification: string;
  group?: string;
  foto?: string;
  content: string;
}

const materiDir = path.join(process.cwd(), 'materi');
const aktorDir = path.join(materiDir, 'aktor');

function collectMdFiles(dir: string, prefix: string = '', excludeDirs: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  // First, collect .md files in this directory
  const mdFiles = entries
    .filter(e => e.isFile() && e.name.endsWith('.md'))
    .map(e => path.join(prefix, e.name))
    .sort();
  files.push(...mdFiles);

  // Then, collect from subdirectories (excluding specified)
  const subdirs = entries
    .filter(e => e.isDirectory() && !excludeDirs.includes(e.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const subdir of subdirs) {
    const subFiles = collectMdFiles(
      path.join(dir, subdir.name),
      path.join(prefix, subdir.name)
    );
    files.push(...subFiles);
  }

  return files;
}

// Get all slides EXCLUDING actor profiles (those are shown in the clickable list)
export function getAllSlides(): SlideData[] {
  // Exclude 'aktor' directory — actors are loaded separately
  const files = collectMdFiles(materiDir, '', ['aktor']);

  const slides: SlideData[] = [];
  let slideIndex = 0;

  for (const relPath of files) {
    const filePath = path.join(materiDir, relPath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    slides.push({
      id: slideIndex,
      slug: relPath.replace(/\.md$/, '').replace(/\//g, '-'),
      title: data.title || 'Untitled',
      subtitle: data.subtitle,
      classification: data.classification || 'RAHASIA',
      slideType: data.slideType || 'content',
      foto: data.foto,
      content,
    });

    // If this slide is the "actor-list" type, insert the actor list slide right after
    if (data.slideType === 'actor-list') {
      // The actor list slide will be handled specially in the page
    }

    slideIndex++;
  }

  // Add the actor list as the last slide before analysis slides
  // Find the position after regular content and before analysis
  const actorListSlide: SlideData = {
    id: slideIndex,
    slug: 'daftar-profil-aktor',
    title: 'Daftar Profil Aktor',
    classification: 'SANGAT RAHASIA',
    slideType: 'actor-list',
    content: '', // Content is rendered by the ActorListSlide component
  };

  // Insert the actor list slide after the regular content
  // Find where the analysis slides start (10-analisis-gmni.md etc.)
  const analysisIndex = slides.findIndex(s => s.slug.startsWith('10-'));
  if (analysisIndex >= 0) {
    slides.splice(analysisIndex, 0, actorListSlide);
    // Re-index all slides
    slides.forEach((s, i) => s.id = i);
  } else {
    slides.push(actorListSlide);
  }

  return slides;
}

// Get all actor profiles for the clickable list
export function getAllActors(): ActorData[] {
  if (!fs.existsSync(aktorDir)) return [];

  const files = fs.readdirSync(aktorDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  return files.map(filename => {
    const filePath = path.join(aktorDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug: filename.replace(/\.md$/, ''),
      title: data.title || 'Untitled',
      classification: data.classification || 'RAHASIA',
      group: data.group || 'Lainnya',
      foto: data.foto,
      content,
    };
  });
}

export function getSlideById(id: number): SlideData | null {
  const slides = getAllSlides();
  return slides[id] || null;
}

export function getTotalSlides(): number {
  return getAllSlides().length;
}
