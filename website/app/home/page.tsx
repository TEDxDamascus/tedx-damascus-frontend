'use client';
import { useEffect } from 'react';

export default function HomeRedirect() {
  useEffect(() => {
    window.location.replace('/en/home');
  }, []);
  return null;
}
