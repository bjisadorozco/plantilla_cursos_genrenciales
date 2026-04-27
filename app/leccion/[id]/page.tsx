import { getAllLessonIds } from '@/components/lessons'
import LessonContent from './LessonContent'
import { use } from 'react'

export function generateStaticParams() {
  const ids = getAllLessonIds();
  return ids.map((id) => ({
    id: id.toString(),
  }));
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = parseInt(resolvedParams.id);

  return <LessonContent lessonId={lessonId} />;
}
