import { create } from 'zustand';

interface TrackingState {
  slideIndex: number;
  setSlideIndex: (index: number) => void;
  totalSlides: number;
  setTotalSlides: (total: number) => void;
  currentProgress: number;
  setCurrentProgress: (progress: number) => void;
  isOnDivisor: boolean;
  setIsOnDivisor: (bool: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const useTrackingStore = create<TrackingState>((set) => {
  // Try to initialize from window.COURSE_DATA if available (client-side only)
  let initialUserName = 'Sin usuario';
  let initialProgress = 0;
  
  if (typeof window !== 'undefined') {
    const courseData = (window as any).COURSE_DATA;
    if (courseData?.user) {
      initialUserName = courseData.user;
    } else {
      const savedName = localStorage.getItem('FULLNAME');
      if (savedName) initialUserName = savedName;
    }
    
    if (courseData?.progress) {
      initialProgress = parseInt(courseData.progress);
    } else {
      const savedProgress = localStorage.getItem('COURSE_PROGRESS');
      if (savedProgress) initialProgress = parseInt(savedProgress);
    }
  }

  return {
    slideIndex: 0,
    setSlideIndex: (index) => set({ slideIndex: index }),
    totalSlides: 0,
    setTotalSlides: (total) => set({ totalSlides: total }),
    currentProgress: initialProgress,
    setCurrentProgress: (progress) => set({ currentProgress: progress }),
    isOnDivisor: false,
    setIsOnDivisor: (bool) => set({ isOnDivisor: bool }),
    userName: initialUserName,
    setUserName: (name) => set({ userName: name }),
  };
});

export default useTrackingStore;
