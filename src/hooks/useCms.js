import { useContext } from 'react';
import { CmsContext } from '../context/CmsContext';

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
