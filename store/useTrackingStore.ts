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

const useTrackingStore = create<TrackingState>((set) => ({
  slideIndex: 0,
  setSlideIndex: (index) => set({ slideIndex: index }),
  totalSlides: 0,
  setTotalSlides: (total) => set({ totalSlides: total }),
  currentProgress: 0,
  setCurrentProgress: (progress) => set({ currentProgress: progress }),
  isOnDivisor: false,
  setIsOnDivisor: (bool) => set({ isOnDivisor: bool }),
  userName: 'Sin usuario',
  setUserName: (name) => set({ userName: name }),
}));

export default useTrackingStore;
