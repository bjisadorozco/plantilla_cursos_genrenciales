import { useCallback } from 'react';
import axios from 'axios';
import useTrackingStore from '@/store/useTrackingStore';
import { getTotalCourseSlides } from '@/components/lessons';

export const useTracking = () => {
  const { 
    slideIndex, 
    setSlideIndex, 
    totalSlides, 
    setTotalSlides, 
    setCurrentProgress,
    setIsOnDivisor,
    setUserName
  } = useTrackingStore();

  const syncProgressWithServer = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    
    // Intentar obtener parámetros de la URL o del localStorage (inyectados por PHP)
    const course_code = params.get('course_code') || localStorage.getItem('COURSE_CODE');
    const uid = params.get('uid') || localStorage.getItem('COURSE_ID');
    const mid = params.get('mid') || localStorage.getItem('MODULE_ID');
    const php_user_id = localStorage.getItem('USER_ID');
    const php_fullname = localStorage.getItem('FULLNAME');

    // Si el nombre viene de PHP, lo actualizamos de inmediato
    if (php_fullname) {
      setUserName(php_fullname);
    }

    if (!course_code || !uid || !mid) {
      return;
    }

    try {
      let userId = php_user_id;

      // Si no tenemos el userId de PHP, lo buscamos en el servidor
      if (!userId) {
        const userResponse = await axios.get('../../../data_user.php', {
          params: { course_code, uid, mid }
        });

        const userData = userResponse.data;
        if (userData?.data?.user_id) {
          userId = userData.data.user_id;
          
          // Actualizar nombre si no venía de PHP
          const name = userData.data.first_name || userData.data.name || userData.data.user_name;
          if (name && !php_fullname) {
            setUserName(name);
          }
        }
      }

      if (!userId) {
        console.error('User ID not found');
        return;
      }

      // 2. Actualización de progreso
      await axios.post('../../../react_update_progress.php', {
        progress: localStorage.getItem('porcentaje'),
        module_id: mid,
        unique_course_id: uid,
        asistencia_id: userId,
        react_progress_object: localStorage.getItem('arrayValidacion')
      });
    } catch (error) {
      console.error('Error syncing tracking progress:', error);
    }
  }, [setUserName]);

  const updateProgress = useCallback((globalIndex: number) => {
    if (typeof window === 'undefined') return;

    const total = getTotalCourseSlides();
    setTotalSlides(total);
    setSlideIndex(globalIndex);
    
    if (total > 0) {
      // Lógica de arrayValidacion (usamos el índice global + 1 para que coincida con la lógica antigua)
      const slideNumber = globalIndex + 1;
      const storedArrayStr = localStorage.getItem('arrayValidacion');
      const storedArray: number[] = storedArrayStr ? JSON.parse(storedArrayStr) : [];
      
      if (!storedArray.includes(slideNumber)) {
        const updatedArray = [...storedArray, slideNumber];
        localStorage.setItem('arrayValidacion', JSON.stringify(updatedArray));
      }

      // Calcular porcentaje basado en diapositivas únicas visitadas
      const finalArrayStr = localStorage.getItem('arrayValidacion');
      const finalArray: number[] = finalArrayStr ? JSON.parse(finalArrayStr) : [];
      const visitedCount = finalArray.length;
      
      const percentage = Math.round((visitedCount / total) * 100);
      localStorage.setItem('porcentaje', percentage.toString());
      
      // Actualizar progreso en el store
      setCurrentProgress(percentage);

      // Sincronizar con servidor
      syncProgressWithServer();
    }
  }, [setSlideIndex, setTotalSlides, setCurrentProgress, syncProgressWithServer]);

  const initTracking = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const total = getTotalCourseSlides();
    setTotalSlides(total);
    
    const storedArrayStr = localStorage.getItem('arrayValidacion');
    const storedArray: number[] = storedArrayStr ? JSON.parse(storedArrayStr) : [];
    
    if (storedArray.length === 0 && total > 0) {
      // Si es la primera vez, marcamos la primera diapositiva
      const initialArray = [1];
      localStorage.setItem('arrayValidacion', JSON.stringify(initialArray));
      localStorage.setItem('porcentaje', Math.round((1 / total) * 100).toString());
    }

    const currentPercentage = parseInt(localStorage.getItem('porcentaje') || '0');
    setCurrentProgress(currentPercentage);

    // Sincronizar con servidor al iniciar para obtener datos del usuario (como el nombre)
    syncProgressWithServer();
  }, [setTotalSlides, setCurrentProgress, syncProgressWithServer]);

  return {
    slideIndex,
    totalSlides,
    updateProgress,
    initTracking,
    setIsOnDivisor
  };
};
