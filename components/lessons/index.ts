import Lesson1Slides from './Lesson1'

export const lessonsMap: Record<number, React.ReactNode[]> = {
  1: Lesson1Slides,
  // 2: Lesson2Slides,
}

export function getLessonSlides(id: number) {
  return lessonsMap[id] || null
}

export function getTotalCourseSlides() {
  return Object.values(lessonsMap).reduce((acc, slides) => acc + slides.length, 0);
}

export function getGlobalSlideIndex(lessonId: number, slideIndex: number) {
  let globalIndex = 0;
  const lessonIds = Object.keys(lessonsMap).map(Number).sort((a, b) => a - b);
  
  for (const id of lessonIds) {
    if (id < lessonId) {
      globalIndex += lessonsMap[id].length;
    } else if (id === lessonId) {
      globalIndex += slideIndex;
      break;
    }
  }
  return globalIndex;
}
